import { spawn } from 'child_process';
import { writeFileSync, unlinkSync, existsSync } from 'fs';
import { join } from 'path';
import { randomBytes } from 'crypto';

export interface SimplePythonResult {
  success: boolean;
  output: string;
  error: string | null;
  executionTime: number;
}

export class SimplePythonExecutor {
  private static readonly TIMEOUT_MS = 5000;
  private static readonly TEMP_DIR = '/tmp';

  /**
   * Execute Python code directly and simply
   */
  static async executeCode(code: string): Promise<SimplePythonResult> {
    const startTime = Date.now();
    let tempFile: string | null = null;

    try {
      // Create temporary file
      const filename = `python_simple_${randomBytes(8).toString('hex')}.py`;
      tempFile = join(this.TEMP_DIR, filename);

      // Write code directly to file
      writeFileSync(tempFile, code, 'utf8');

      // Execute Python
      const result = await this.runPython(tempFile);
      const executionTime = Date.now() - startTime;

      return {
        success: result.exitCode === 0,
        output: result.stdout || result.stderr,
        error: result.exitCode === 0 ? null : result.stderr,
        executionTime
      };

    } catch (error) {
      return {
        success: false,
        output: '',
        error: error instanceof Error ? error.message : 'Execution failed',
        executionTime: Date.now() - startTime
      };
    } finally {
      // Cleanup
      if (tempFile && existsSync(tempFile)) {
        try {
          unlinkSync(tempFile);
        } catch (e) {
          console.warn('Cleanup failed:', e);
        }
      }
    }
  }

  /**
   * Execute with test cases
   */
  static async executeWithTests(code: string, testCases: any[]): Promise<{
    success: boolean;
    executionTime: number;
    testResults: any[];
    output: string;
    error: string | null;
  }> {
    // Extract function name
    const functionMatch = code.match(/def\s+([a-zA-Z_][a-zA-Z0-9_]*)\s*\(/);
    if (!functionMatch) {
      return {
        success: false,
        executionTime: 0,
        testResults: [],
        output: "No function definition found",
        error: "Missing function definition"
      };
    }

    const functionName = functionMatch[1];

    // Create test code
    const testCode = `
${code}

# Test execution
import json
results = []

# First test case - show output
try:
    result_0 = ${functionName}()
    expected_0 = ${JSON.stringify(testCases[0].expected)}
    passed_0 = list(result_0) == expected_0 if hasattr(result_0, '__iter__') and not isinstance(result_0, str) else result_0 == expected_0
    
    print(f">>> {functionName}()")
    print(result_0)
    
    results.append({
        "test_case": 1,
        "passed": passed_0,
        "input": ${JSON.stringify(testCases[0].input)},
        "expected": expected_0,
        "actual": list(result_0) if hasattr(result_0, '__iter__') and not isinstance(result_0, str) else result_0,
        "error": None
    })
    
except Exception as e:
    results.append({
        "test_case": 1,
        "passed": False,
        "input": ${JSON.stringify(testCases[0].input)},
        "expected": ${JSON.stringify(testCases[0].expected)},
        "actual": None,
        "error": str(e)
    })

${testCases.slice(1).map((tc, i) => `
# Test case ${i + 2}
try:
    result_${i + 1} = ${functionName}()
    expected_${i + 1} = ${JSON.stringify(tc.expected)}
    passed_${i + 1} = list(result_${i + 1}) == expected_${i + 1} if hasattr(result_${i + 1}, '__iter__') and not isinstance(result_${i + 1}, str) else result_${i + 1} == expected_${i + 1}
    
    results.append({
        "test_case": ${i + 2},
        "passed": passed_${i + 1},
        "input": ${JSON.stringify(tc.input)},
        "expected": expected_${i + 1},
        "actual": list(result_${i + 1}) if hasattr(result_${i + 1}, '__iter__') and not isinstance(result_${i + 1}, str) else result_${i + 1},
        "error": None
    })
except Exception as e:
    results.append({
        "test_case": ${i + 2},
        "passed": False,
        "input": ${JSON.stringify(tc.input)},
        "expected": ${JSON.stringify(tc.expected)},
        "actual": None,
        "error": str(e)
    })
`).join('\n')}

# Output results as JSON for parsing
print("\\n---TEST_RESULTS---")
print(json.dumps(results))
`;

    const result = await this.executeCode(testCode);
    
    // Parse test results
    if (result.success && result.output.includes('---TEST_RESULTS---')) {
      try {
        const outputParts = result.output.split('---TEST_RESULTS---');
        const displayOutput = outputParts[0].trim();
        const jsonPart = outputParts[1].trim();
        const testResults = JSON.parse(jsonPart);
        
        const allPassed = testResults.every((t: any) => t.passed);
        
        return {
          success: allPassed,
          executionTime: result.executionTime,
          testResults,
          output: displayOutput + (allPassed ? '\n\n✅ All test cases passed!' : '\n\n❌ Some test cases failed.'),
          error: allPassed ? null : 'Test cases failed'
        };
      } catch (parseError) {
        return {
          success: false,
          executionTime: result.executionTime,
          testResults: [],
          output: result.output,
          error: 'Failed to parse test results'
        };
      }
    }

    return {
      success: false,
      executionTime: result.executionTime,
      testResults: [],
      output: result.output,
      error: result.error
    };
  }

  /**
   * Run Python subprocess
   */
  private static runPython(filepath: string): Promise<{
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