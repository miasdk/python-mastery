import { spawn } from 'child_process';
import { writeFileSync, unlinkSync, existsSync } from 'fs';
import { join } from 'path';
import { randomBytes } from 'crypto';

export interface PythonExecutionResult {
  success: boolean;
  output: string;
  error: string | null;
  executionTime: number;
  stdout: string;
  stderr: string;
}

export interface TestCaseResult {
  test_case: number;
  passed: boolean;
  input: any;
  expected: any;
  actual: any;
  error: string | null;
}

export class PythonExecutor {
  private static readonly TIMEOUT_MS = 5000; // 5 second timeout
  private static readonly TEMP_DIR = '/tmp';

  /**
   * Execute Python code directly without safety wrapper (for test runner)
   */
  static async executeCodeDirectly(code: string): Promise<PythonExecutionResult> {
    const startTime = Date.now();
    let tempFile: string | null = null;

    try {
      // Create temporary file with random name
      const filename = `python_exec_${randomBytes(8).toString('hex')}.py`;
      tempFile = join(this.TEMP_DIR, filename);

      // Write code directly without safety wrapper
      writeFileSync(tempFile, code, 'utf8');

      // Execute Python with restrictions
      const result = await this.runPythonFile(tempFile);
      const executionTime = Date.now() - startTime;

      return {
        success: result.exitCode === 0,
        output: result.stdout,
        error: result.exitCode === 0 ? null : result.stderr,
        executionTime,
        stdout: result.stdout,
        stderr: result.stderr
      };

    } catch (error) {
      return {
        success: false,
        output: '',
        error: error instanceof Error ? error.message : 'Unknown execution error',
        executionTime: Date.now() - startTime,
        stdout: '',
        stderr: error instanceof Error ? error.message : 'Unknown error'
      };
    } finally {
      // Clean up temporary file
      if (tempFile && existsSync(tempFile)) {
        try {
          unlinkSync(tempFile);
        } catch (cleanupError) {
          console.warn('Failed to cleanup temp file:', cleanupError);
        }
      }
    }
  }

  /**
   * Execute Python code safely with timeout and sandboxing
   */
  static async executeCode(code: string): Promise<PythonExecutionResult> {
    const startTime = Date.now();
    let tempFile: string | null = null;

    try {
      // Create temporary file with random name
      const filename = `python_exec_${randomBytes(8).toString('hex')}.py`;
      tempFile = join(this.TEMP_DIR, filename);

      // Add basic safety wrapper to user code  
      const safeCode = this.wrapCodeForSafety(code);
      writeFileSync(tempFile, safeCode, 'utf8');

      // Execute Python with restrictions
      const result = await this.runPythonFile(tempFile);
      const executionTime = Date.now() - startTime;

      return {
        success: result.exitCode === 0,
        output: result.stdout,
        error: result.exitCode === 0 ? null : result.stderr,
        executionTime,
        stdout: result.stdout,
        stderr: result.stderr
      };

    } catch (error) {
      return {
        success: false,
        output: '',
        error: error instanceof Error ? error.message : 'Unknown execution error',
        executionTime: Date.now() - startTime,
        stdout: '',
        stderr: error instanceof Error ? error.message : 'Unknown error'
      };
    } finally {
      // Clean up temporary file
      if (tempFile && existsSync(tempFile)) {
        try {
          unlinkSync(tempFile);
        } catch (cleanupError) {
          console.warn('Failed to cleanup temp file:', cleanupError);
        }
      }
    }
  }

  /**
   * Execute code with test cases
   */
  static async executeWithTestCases(code: string, testCases: any[]): Promise<{
    success: boolean;
    executionTime: number;
    testResults: TestCaseResult[];
    output: string;
    error: string | null;
  }> {
    const startTime = Date.now();
    
    // First, validate the code structure
    const basicValidation = this.validateCodeStructure(code);
    if (!basicValidation.valid) {
      return {
        success: false,
        executionTime: Date.now() - startTime,
        testResults: testCases.map((tc, i) => ({
          test_case: i + 1,
          passed: false,
          input: tc.input,
          expected: tc.expected,
          actual: null,
          error: basicValidation.error
        })),
        output: `Error: ${basicValidation.error}`,
        error: basicValidation.error
      };
    }

    // Extract function name from the code
    const functionMatch = code.match(/def\s+([a-zA-Z_][a-zA-Z0-9_]*)\s*\(/);
    if (!functionMatch) {
      return {
        success: false,
        executionTime: Date.now() - startTime,
        testResults: testCases.map((tc, i) => ({
          test_case: i + 1,
          passed: false,
          input: tc.input,
          expected: tc.expected,
          actual: null,
          error: "No function definition found"
        })),
        output: "Error: No function definition found",
        error: "No function definition found"
      };
    }

    const functionName = functionMatch[1];
    
    // Create test runner code without safety wrapper for test execution
    const testRunnerCode = this.createTestRunner(code, functionName, testCases);
    
    // Execute the test runner directly without safety wrapper
    const executionResult = await this.executeCodeDirectly(testRunnerCode);
    const executionTime = Date.now() - startTime;

    if (!executionResult.success) {
      return {
        success: false,
        executionTime,
        testResults: testCases.map((tc, i) => ({
          test_case: i + 1,
          passed: false,
          input: tc.input,
          expected: tc.expected,
          actual: null,
          error: executionResult.error
        })),
        output: executionResult.stderr || executionResult.error || "Execution failed",
        error: executionResult.error
      };
    }

    // Parse test results from output
    const testResults = this.parseTestResults(executionResult.output, testCases);
    const allPassed = testResults.every(result => result.passed);

    return {
      success: allPassed,
      executionTime,
      testResults,
      output: this.formatSuccessOutput(functionName, testResults, allPassed),
      error: allPassed ? null : "Some test cases failed"
    };
  }

  /**
   * Validate basic code structure without execution
   */
  private static validateCodeStructure(code: string): { valid: boolean; error: string | null } {
    // Check for dangerous imports/operations
    const dangerousPatterns = [
      /import\s+os/,
      /import\s+sys/,
      /import\s+subprocess/,
      /import\s+socket/,
      /open\s*\(/,
      /__import__/,
      /exec\s*\(/,
      /eval\s*\(/
    ];

    for (const pattern of dangerousPatterns) {
      if (pattern.test(code)) {
        return { valid: false, error: "Restricted operation detected" };
      }
    }

    // Check for function definition
    if (!/def\s+[a-zA-Z_][a-zA-Z0-9_]*\s*\(/.test(code)) {
      return { valid: false, error: "Function definition required" };
    }

    // Check for return statement
    if (!/return\s+/.test(code)) {
      return { valid: false, error: "Return statement required" };
    }

    return { valid: true, error: null };
  }

  /**
   * Wrap user code with safety restrictions
   */
  private static wrapCodeForSafety(code: string): string {
    return `
import sys
import signal

# Set up timeout handler
def timeout_handler(signum, frame):
    raise TimeoutError("Code execution timed out")

signal.signal(signal.SIGALRM, timeout_handler)
signal.alarm(5)  # 5 second timeout

try:
${code.split('\n').map(line => '    ' + line).join('\n')}
except TimeoutError as e:
    print(f"ERROR: {e}", file=sys.stderr)
    sys.exit(1)
except Exception as e:
    print(f"ERROR: {e}", file=sys.stderr)
    sys.exit(1)
finally:
    signal.alarm(0)  # Cancel the alarm
`;
  }

  /**
   * Create test runner code that executes function with test cases
   */
  private static createTestRunner(userCode: string, functionName: string, testCases: any[]): string {
    const testCaseCode = testCases.map((tc, index) => {
      const inputArgs = Array.isArray(tc.input) ? tc.input.map(arg => JSON.stringify(arg)).join(', ') : JSON.stringify(tc.input);
      const expectedJson = JSON.stringify(tc.expected);
      
      return `
# Test case ${index + 1}
try:
    if isinstance(${JSON.stringify(tc.input)}, list) and len(${JSON.stringify(tc.input)}) > 0:
        result_${index} = ${functionName}(${inputArgs})
    else:
        result_${index} = ${functionName}()
    
    expected_${index} = ${expectedJson}
    passed_${index} = result_${index} == expected_${index}
    
    print(f"TEST_RESULT_{index}:PASS:{passed_${index}}:INPUT:{${JSON.stringify(tc.input)}}:EXPECTED:{expected_${index}}:ACTUAL:{result_${index}}")
except Exception as e:
    print(f"TEST_RESULT_{index}:FAIL:False:INPUT:{${JSON.stringify(tc.input)}}:EXPECTED:{${JSON.stringify(tc.expected)}}:ACTUAL:None:ERROR:{str(e)}")
`;
    }).join('\n');

    return `
${userCode}

${testCaseCode}
`;
  }

  /**
   * Parse test results from Python execution output
   */
  private static parseTestResults(output: string, testCases: any[]): TestCaseResult[] {
    const results: TestCaseResult[] = [];
    const lines = output.split('\n');

    for (let i = 0; i < testCases.length; i++) {
      const resultLine = lines.find(line => line.startsWith(`TEST_RESULT_${i}:`));
      
      if (resultLine) {
        const parts = resultLine.split(':');
        const passed = parts[2] === 'True';
        const input = JSON.parse(parts[4]);
        const expected = JSON.parse(parts[6]);
        const actual = parts[8] !== 'None' ? JSON.parse(parts[8]) : null;
        const error = parts.length > 10 ? parts[10] : null;

        results.push({
          test_case: i + 1,
          passed,
          input,
          expected,
          actual,
          error
        });
      } else {
        // Fallback for missing test result
        results.push({
          test_case: i + 1,
          passed: false,
          input: testCases[i].input,
          expected: testCases[i].expected,
          actual: null,
          error: "Test execution failed"
        });
      }
    }

    return results;
  }

  /**
   * Format success output for display
   */
  private static formatSuccessOutput(functionName: string, testResults: TestCaseResult[], allPassed: boolean): string {
    if (allPassed) {
      const firstResult = testResults[0];
      const resultDisplay = typeof firstResult.actual === 'string' 
        ? `'${firstResult.actual}'` 
        : JSON.stringify(firstResult.actual);

      return `>>> ${functionName}()
${resultDisplay}

✅ All test cases passed!
Function completed successfully.`;
    } else {
      const failedTests = testResults.filter(r => !r.passed);
      return `❌ ${failedTests.length} test case(s) failed.

${failedTests.map(test => 
  `Test ${test.test_case}: Expected ${JSON.stringify(test.expected)}, got ${JSON.stringify(test.actual)}`
).join('\n')}`;
    }
  }

  /**
   * Run Python file as subprocess
   */
  private static runPythonFile(filepath: string): Promise<{
    stdout: string;
    stderr: string;
    exitCode: number;
  }> {
    return new Promise((resolve) => {
      const python = spawn('python3', [filepath], {
        timeout: this.TIMEOUT_MS,
        stdio: ['pipe', 'pipe', 'pipe']
      });

      let stdout = '';
      let stderr = '';

      python.stdout.on('data', (data) => {
        stdout += data.toString();
      });

      python.stderr.on('data', (data) => {
        stderr += data.toString();
      });

      python.on('close', (code) => {
        resolve({
          stdout: stdout.trim(),
          stderr: stderr.trim(), 
          exitCode: code || 0
        });
      });

      python.on('error', (error) => {
        resolve({
          stdout: '',
          stderr: error.message,
          exitCode: 1
        });
      });
    });
  }
}