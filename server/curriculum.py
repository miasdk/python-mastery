from typing import List, Dict, Any

class CurriculumGenerator:
    def __init__(self):
        self.sections = [
            {
                "title": "Python Basics",
                "description": "Learn fundamental Python concepts",
                "lessons": [
                    {
                        "title": "Variables & Data Types",
                        "description": "Understanding variables, numbers, strings, and booleans",
                        "problems": self._get_variables_problems()
                    },
                    {
                        "title": "Basic Operations",
                        "description": "Arithmetic operations and string manipulation",
                        "problems": self._get_operations_problems()
                    },
                    {
                        "title": "String Manipulation",
                        "description": "Working with strings and string methods",
                        "problems": self._get_string_problems()
                    }
                ]
            },
            {
                "title": "Control Flow",
                "description": "Learn to control program flow with conditions and loops",
                "lessons": [
                    {
                        "title": "Conditional Statements",
                        "description": "If, elif, and else statements",
                        "problems": self._get_conditionals_problems()
                    },
                    {
                        "title": "Loops & Iteration",
                        "description": "For loops and while loops",
                        "problems": self._get_loops_problems()
                    },
                    {
                        "title": "Advanced Control Flow",
                        "description": "Break, continue, and nested loops",
                        "problems": self._get_advanced_control_problems()
                    }
                ]
            },
            {
                "title": "Functions & Modules",
                "description": "Create reusable code with functions",
                "lessons": [
                    {
                        "title": "Function Basics",
                        "description": "Defining and calling functions",
                        "problems": self._get_function_basics_problems()
                    },
                    {
                        "title": "Parameters & Arguments",
                        "description": "Function parameters and return values",
                        "problems": self._get_parameters_problems()
                    }
                ]
            },
            {
                "title": "Data Structures",
                "description": "Work with lists, dictionaries, and sets",
                "lessons": [
                    {
                        "title": "Lists",
                        "description": "Creating and manipulating lists",
                        "problems": self._get_lists_problems()
                    },
                    {
                        "title": "Dictionaries",
                        "description": "Key-value pairs and dictionary methods",
                        "problems": self._get_dictionaries_problems()
                    }
                ]
            }
        ]

    def _get_variables_problems(self) -> List[Dict[str, Any]]:
        return [
            {
                "title": "Variable Assignment",
                "description": "Create variables and assign values to them.",
                "difficulty": "easy",
                "starter_code": "# Create a variable called 'name' and assign your name to it\n# Create a variable called 'age' and assign your age to it\n\ndef get_variables():\n    # Your code here\n    return name, age",
                "solution": "def get_variables():\n    name = \"Alice\"\n    age = 25\n    return name, age",
                "test_cases": [
                    {
                        "function_name": "get_variables",
                        "input": [],
                        "expected": ("Alice", 25)
                    }
                ],
                "hints": [
                    "Use the assignment operator (=) to assign values to variables",
                    "Strings should be enclosed in quotes",
                    "Numbers don't need quotes"
                ],
                "xp_reward": 25
            },
            {
                "title": "Data Type Conversion",
                "description": "Convert between different data types.",
                "difficulty": "easy",
                "starter_code": "def convert_types(num_str):\n    # Convert the string to an integer and return it\n    # Your code here\n    pass",
                "solution": "def convert_types(num_str):\n    return int(num_str)",
                "test_cases": [
                    {
                        "function_name": "convert_types",
                        "input": "42",
                        "expected": 42
                    },
                    {
                        "function_name": "convert_types",
                        "input": "100",
                        "expected": 100
                    }
                ],
                "hints": [
                    "Use the int() function to convert strings to integers",
                    "Make sure to return the converted value"
                ],
                "xp_reward": 30
            }
        ]

    def _get_operations_problems(self) -> List[Dict[str, Any]]:
        return [
            {
                "title": "Basic Calculator",
                "description": "Perform basic arithmetic operations.",
                "difficulty": "easy",
                "starter_code": "def calculate(a, b, operation):\n    # Perform the operation (+, -, *, /) on a and b\n    # Your code here\n    pass",
                "solution": "def calculate(a, b, operation):\n    if operation == '+':\n        return a + b\n    elif operation == '-':\n        return a - b\n    elif operation == '*':\n        return a * b\n    elif operation == '/':\n        return a / b",
                "test_cases": [
                    {
                        "function_name": "calculate",
                        "input": [10, 5, "+"],
                        "expected": 15
                    },
                    {
                        "function_name": "calculate",
                        "input": [10, 5, "*"],
                        "expected": 50
                    }
                ],
                "hints": [
                    "Use if-elif statements to check the operation",
                    "Return the result of the arithmetic operation"
                ],
                "xp_reward": 40
            }
        ]

    def _get_string_problems(self) -> List[Dict[str, Any]]:
        return [
            {
                "title": "String Length",
                "description": "Find the length of a string.",
                "difficulty": "easy",
                "starter_code": "def string_length(text):\n    # Return the length of the string\n    # Your code here\n    pass",
                "solution": "def string_length(text):\n    return len(text)",
                "test_cases": [
                    {
                        "function_name": "string_length",
                        "input": "hello",
                        "expected": 5
                    },
                    {
                        "function_name": "string_length",
                        "input": "Python",
                        "expected": 6
                    }
                ],
                "hints": [
                    "Use the len() function to get the length of a string"
                ],
                "xp_reward": 25
            }
        ]

    def _get_conditionals_problems(self) -> List[Dict[str, Any]]:
        return [
            {
                "title": "Number Comparison",
                "description": "Compare two numbers and return the larger one.",
                "difficulty": "easy",
                "starter_code": "def max_number(a, b):\n    # Return the larger of the two numbers\n    # Your code here\n    pass",
                "solution": "def max_number(a, b):\n    if a > b:\n        return a\n    else:\n        return b",
                "test_cases": [
                    {
                        "function_name": "max_number",
                        "input": [10, 5],
                        "expected": 10
                    },
                    {
                        "function_name": "max_number",
                        "input": [3, 8],
                        "expected": 8
                    }
                ],
                "hints": [
                    "Use an if statement to compare the numbers",
                    "Return the appropriate number based on the comparison"
                ],
                "xp_reward": 35
            }
        ]

    def _get_loops_problems(self) -> List[Dict[str, Any]]:
        return [
            {
                "title": "Sum of Even Numbers",
                "description": "Calculate the sum of even numbers in a list.",
                "difficulty": "medium",
                "starter_code": "def sum_even_numbers(numbers):\n    # Use a for loop to find the sum of even numbers\n    # Your code here\n    pass",
                "solution": "def sum_even_numbers(numbers):\n    total = 0\n    for num in numbers:\n        if num % 2 == 0:\n            total += num\n    return total",
                "test_cases": [
                    {
                        "function_name": "sum_even_numbers",
                        "input": [1, 2, 3, 4, 5, 6],
                        "expected": 12
                    },
                    {
                        "function_name": "sum_even_numbers",
                        "input": [1, 3, 5],
                        "expected": 0
                    }
                ],
                "hints": [
                    "Use a for loop to iterate through the list",
                    "Use the modulo operator (%) to check if a number is even",
                    "Keep a running total of even numbers"
                ],
                "xp_reward": 50
            }
        ]

    def _get_advanced_control_problems(self) -> List[Dict[str, Any]]:
        return [
            {
                "title": "Number Pattern",
                "description": "Print numbers in a specific pattern using nested loops.",
                "difficulty": "medium",
                "starter_code": "def number_pattern(n):\n    # Create a pattern where each row has numbers from 1 to the row number\n    # Return a list of strings representing each row\n    # Your code here\n    pass",
                "solution": "def number_pattern(n):\n    result = []\n    for i in range(1, n + 1):\n        row = ''\n        for j in range(1, i + 1):\n            row += str(j) + ' '\n        result.append(row.strip())\n    return result",
                "test_cases": [
                    {
                        "function_name": "number_pattern",
                        "input": 3,
                        "expected": ["1", "1 2", "1 2 3"]
                    }
                ],
                "hints": [
                    "Use nested loops - outer loop for rows, inner loop for numbers",
                    "Build each row as a string and add it to the result list"
                ],
                "xp_reward": 60
            }
        ]

    def _get_function_basics_problems(self) -> List[Dict[str, Any]]:
        return [
            {
                "title": "Simple Function",
                "description": "Create a function that greets a person.",
                "difficulty": "easy",
                "starter_code": "# Define a function called 'greet' that takes a name parameter\n# and returns a greeting message\n\ndef greet(name):\n    # Your code here\n    pass",
                "solution": "def greet(name):\n    return f'Hello, {name}!'",
                "test_cases": [
                    {
                        "function_name": "greet",
                        "input": "Alice",
                        "expected": "Hello, Alice!"
                    },
                    {
                        "function_name": "greet",
                        "input": "Bob",
                        "expected": "Hello, Bob!"
                    }
                ],
                "hints": [
                    "Use the def keyword to define a function",
                    "Use string formatting or concatenation to create the greeting"
                ],
                "xp_reward": 30
            }
        ]

    def _get_parameters_problems(self) -> List[Dict[str, Any]]:
        return [
            {
                "title": "Function with Multiple Parameters",
                "description": "Create a function that calculates the area of a rectangle.",
                "difficulty": "easy",
                "starter_code": "def rectangle_area(length, width):\n    # Calculate and return the area of a rectangle\n    # Your code here\n    pass",
                "solution": "def rectangle_area(length, width):\n    return length * width",
                "test_cases": [
                    {
                        "function_name": "rectangle_area",
                        "input": [5, 3],
                        "expected": 15
                    },
                    {
                        "function_name": "rectangle_area",
                        "input": [10, 4],
                        "expected": 40
                    }
                ],
                "hints": [
                    "Multiply length and width to get the area",
                    "Make sure to return the result"
                ],
                "xp_reward": 35
            }
        ]

    def _get_lists_problems(self) -> List[Dict[str, Any]]:
        return [
            {
                "title": "List Operations",
                "description": "Perform basic operations on a list.",
                "difficulty": "medium",
                "starter_code": "def list_operations(numbers):\n    # Return a dictionary with list length, sum, and max value\n    # Your code here\n    pass",
                "solution": "def list_operations(numbers):\n    return {\n        'length': len(numbers),\n        'sum': sum(numbers),\n        'max': max(numbers)\n    }",
                "test_cases": [
                    {
                        "function_name": "list_operations",
                        "input": [1, 2, 3, 4, 5],
                        "expected": {'length': 5, 'sum': 15, 'max': 5}
                    }
                ],
                "hints": [
                    "Use built-in functions len(), sum(), and max()",
                    "Return a dictionary with the specified keys"
                ],
                "xp_reward": 45
            }
        ]

    def _get_dictionaries_problems(self) -> List[Dict[str, Any]]:
        return [
            {
                "title": "Student Grades",
                "description": "Work with a dictionary of student grades.",
                "difficulty": "medium",
                "starter_code": "def average_grade(grades):\n    # Calculate the average grade from a dictionary of student grades\n    # Your code here\n    pass",
                "solution": "def average_grade(grades):\n    if not grades:\n        return 0\n    return sum(grades.values()) / len(grades)",
                "test_cases": [
                    {
                        "function_name": "average_grade",
                        "input": {'Alice': 85, 'Bob': 92, 'Charlie': 78},
                        "expected": 85.0
                    }
                ],
                "hints": [
                    "Use grades.values() to get all grade values",
                    "Calculate sum and divide by the number of students"
                ],
                "xp_reward": 50
            }
        ]

    def get_curriculum_data(self) -> List[Dict[str, Any]]:
        """Get the complete curriculum data"""
        return self.sections
