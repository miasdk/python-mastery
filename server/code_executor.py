import sys
import io
import time
import traceback
from typing import Dict, Any, List
from RestrictedPython import compile_restricted
from RestrictedPython.Guards import safe_builtins

class SecureCodeExecutor:
    def __init__(self):
        self.safe_globals = {
            '__builtins__': {
                **safe_builtins,
                'range': range,
                'len': len,
                'str': str,
                'int': int,
                'float': float,
                'bool': bool,
                'list': list,
                'dict': dict,
                'tuple': tuple,
                'set': set,
                'sum': sum,
                'max': max,
                'min': min,
                'abs': abs,
                'round': round,
                'sorted': sorted,
                'reversed': reversed,
                'enumerate': enumerate,
                'zip': zip,
                'map': map,
                'filter': filter,
                'any': any,
                'all': all,
                'print': print,
            }
        }

    def execute_code(self, code: str, test_cases: List[Dict[str, Any]]) -> Dict[str, Any]:
        """Execute Python code securely and run test cases"""
        try:
            # Compile the restricted code
            compiled_code = compile_restricted(code, '<user_code>', 'exec')
            if compiled_code is None:
                return {
                    'success': False,
                    'error': 'Code compilation failed - invalid syntax or restricted operations',
                    'test_results': []
                }

            # Create execution environment
            local_vars = {}
            global_vars = self.safe_globals.copy()

            # Execute the code
            start_time = time.time()
            exec(compiled_code, global_vars, local_vars)
            execution_time = int((time.time() - start_time) * 1000)

            # Run test cases
            test_results = []
            all_passed = True

            for i, test_case in enumerate(test_cases):
                try:
                    # Get the function from local variables
                    function_name = test_case.get('function_name')
                    if function_name not in local_vars:
                        test_results.append({
                            'test_case': i + 1,
                            'passed': False,
                            'input': test_case.get('input'),
                            'expected': test_case.get('expected'),
                            'actual': None,
                            'error': f'Function {function_name} not found'
                        })
                        all_passed = False
                        continue

                    func = local_vars[function_name]
                    
                    # Capture output
                    old_stdout = sys.stdout
                    sys.stdout = captured_output = io.StringIO()
                    
                    try:
                        # Call function with test input
                        if isinstance(test_case['input'], list):
                            result = func(*test_case['input'])
                        else:
                            result = func(test_case['input'])
                        
                        # Check if result matches expected
                        passed = result == test_case['expected']
                        test_results.append({
                            'test_case': i + 1,
                            'passed': passed,
                            'input': test_case['input'],
                            'expected': test_case['expected'],
                            'actual': result,
                            'error': None
                        })
                        
                        if not passed:
                            all_passed = False
                            
                    finally:
                        sys.stdout = old_stdout
                        output = captured_output.getvalue()
                        
                except Exception as e:
                    test_results.append({
                        'test_case': i + 1,
                        'passed': False,
                        'input': test_case.get('input'),
                        'expected': test_case.get('expected'),
                        'actual': None,
                        'error': str(e)
                    })
                    all_passed = False

            return {
                'success': all_passed,
                'execution_time': execution_time,
                'test_results': test_results,
                'output': output if 'output' in locals() else '',
                'error': None
            }

        except Exception as e:
            return {
                'success': False,
                'error': f'Execution error: {str(e)}',
                'execution_time': 0,
                'test_results': [],
                'output': ''
            }

    def validate_syntax(self, code: str) -> Dict[str, Any]:
        """Validate Python code syntax"""
        try:
            compile_restricted(code, '<user_code>', 'exec')
            return {'valid': True, 'error': None}
        except SyntaxError as e:
            return {'valid': False, 'error': f'Syntax Error: {str(e)}'}
        except Exception as e:
            return {'valid': False, 'error': f'Compilation Error: {str(e)}'}
