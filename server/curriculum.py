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
                        "description": "Arithmetic operations and mathematical calculations",
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
                "title": "Personal Information Card",
                "description": "**Personal Information Card**\n**Easy - Variables & Data Types**\n\n**What You're Building:**\nCreate a digital business card system for a networking app. Store essential contact information that appears on your professional profile.\n\n**Your Task:**\n- Store your name: \"John Smith\"\n- Store your age: 30\n- Store your city: \"New York\"\n- Store your profession: \"Engineer\"\n- Return all values as a tuple\n\n**Skills Practiced:** Variable Assignment • String Values • Number Values\n\n**Example:**\n```python\nname, age, city, job = personal_info()\nprint(f\"{name}, {age} - {job} in {city}\")  # John Smith, 30 - Engineer in New York\n```",
                "difficulty": "easy",
                "starter_code": "def create_business_card():\n    # Create variables for your personal information\n    name = # Your name here\n    age = # Your age here\n    city = # Your city here\n    profession = # Your profession here\n    return name, age, city, profession",
                "solution": "def create_business_card():\n    name = \"Alice Johnson\"\n    age = 28\n    city = \"San Francisco\"\n    profession = \"Software Developer\"\n    return name, age, city, profession",
                "test_cases": [
                    {
                        "function_name": "create_business_card",
                        "input": [],
                        "expected": ("Alice Johnson", 28, "San Francisco", "Software Developer")
                    }
                ],
                "hints": [
                    "Use the assignment operator (=) to assign values to variables",
                    "Strings should be enclosed in quotes",
                    "Numbers don't need quotes",
                    "Return all variables in the specified order"
                ],
                "xp_reward": 25
            },
            {
                "title": "Temperature Converter Setup",
                "description": "**Temperature Converter Setup**\n**Easy - Variables & Data Types**\n\n**What You're Building:**\nCreate a weather app component that stores temperature data. Prepare the foundation for a temperature conversion system.\n\n**Your Task:**\n- Store celsius temperature: 25\n- Store fahrenheit temperature: 77\n- Store location: \"Miami\"\n- Store season: \"Summer\"\n- Return all values as a tuple\n\n**Skills Practiced:** Variable Assignment • Number Values • String Values\n\n**Example:**\n```python\nc, f, location, season = temperature_data()\nprint(f\"{location}: {c}°C ({f}°F) in {season}\")  # Miami: 25°C (77°F) in Summer\n```",
                "difficulty": "easy",
                "starter_code": "def temperature_data():\n    # Store temperature values\n    celsius = 25.0\n    # Calculate Fahrenheit (F = C * 9/5 + 32)\n    fahrenheit = # Your calculation here\n    is_freezing = # True if celsius is below 0\n    return celsius, fahrenheit, is_freezing",
                "solution": "def temperature_data():\n    celsius = 25.0\n    fahrenheit = celsius * 9/5 + 32\n    is_freezing = celsius < 0\n    return celsius, fahrenheit, is_freezing",
                "test_cases": [
                    {
                        "function_name": "temperature_data",
                        "input": [],
                        "expected": (25.0, 77.0, False)
                    }
                ],
                "hints": [
                    "Use the formula F = C * 9/5 + 32 for Fahrenheit conversion",
                    "Boolean values are True or False (no quotes)",
                    "Use comparison operators like < for boolean expressions"
                ],
                "xp_reward": 30
            },
            {
                "title": "Shopping Item Details",
                "description": "**Shopping Item Details**\n**Easy - Variables & Data Types**\n\n**What You're Building:**\nCreate a product data system for an online electronics store. Store essential product information that customers need to make purchasing decisions.\n\n**Your Task:**\n- Store product name: \"Wireless Headphones\"\n- Store price: 89.99\n- Store stock status: True\n- Store quantity: 15\n- Return all values as a tuple\n\n**Skills Practiced:** Variable Assignment • Data Types • Tuple Returns\n\n**Example:**\n```python\nname, price, stock, qty = product_info()\nprint(f\"{name}: ${price}\")  # Wireless Headphones: $89.99\n```",
                "difficulty": "easy",
                "starter_code": "def product_info():\n    # Store product details\n    product_name = \"Wireless Headphones\"\n    price = # Price as float\n    in_stock = # Boolean value\n    quantity = # Integer value\n    return product_name, price, in_stock, quantity",
                "solution": "def product_info():\n    product_name = \"Wireless Headphones\"\n    price = 89.99\n    in_stock = True\n    quantity = 15\n    return product_name, price, in_stock, quantity",
                "test_cases": [
                    {
                        "function_name": "product_info",
                        "input": [],
                        "expected": ("Wireless Headphones", 89.99, True, 15)
                    }
                ],
                "hints": [
                    "Prices should be float values (with decimal points)",
                    "Boolean values are True or False",
                    "Quantity should be an integer",
                    "Make sure to return all values in order"
                ],
                "xp_reward": 25
            },
            {
                "title": "Student Grade Calculator",
                "description": "**Student Grade Calculator**\n**Medium - Arithmetic Operations**\n\n**What You're Building:**\nCreate a grade calculation system for a university portal. Calculate weighted final grades to determine if students pass their courses.\n\n**Your Task:**\n- Calculate weighted average: midterm 30%, final 50%, homework 20%\n- Determine if grade >= 60 (passing)\n- Return final grade and pass status\n\n**Skills Practiced:** Arithmetic Operations • Weighted Calculations • Boolean Logic\n\n**Example:**\n```python\ngrade, passed = calculate_final_grade(85, 78, 92)\nprint(f\"Final grade: {grade}% - {'PASS' if passed else 'FAIL'}\")  # Final grade: 82.1% - PASS\n```",
                "difficulty": "medium",
                "starter_code": "def calculate_final_grade(midterm, final_exam, homework):\n    # Calculate weighted average: midterm 30%, final 50%, homework 20%\n    final_grade = # Your calculation here\n    passed = # True if grade >= 60\n    return final_grade, passed",
                "solution": "def calculate_final_grade(midterm, final_exam, homework):\n    final_grade = midterm * 0.3 + final_exam * 0.5 + homework * 0.2\n    passed = final_grade >= 60\n    return final_grade, passed",
                "test_cases": [
                    {
                        "function_name": "calculate_final_grade",
                        "input": [85, 78, 92],
                        "expected": (82.1, True)
                    },
                    {
                        "function_name": "calculate_final_grade",
                        "input": [45, 55, 70],
                        "expected": (55.0, False)
                    }
                ],
                "hints": [
                    "Multiply each score by its weight (30% = 0.3, etc.)",
                    "Add all weighted scores together",
                    "Use >= for the passing condition",
                    "Round to one decimal place if needed"
                ],
                "xp_reward": 40
            },
            {
                "title": "Data Type Detective",
                "description": "**Data Type Detective**\n**Easy - Type Conversion**\n\n**What You're Building:**\nCreate a user registration system that processes form input. Convert text inputs from web forms into the correct data types for database storage.\n\n**Your Task:**\n- Convert age string to integer\n- Convert height string to float\n- Convert student status string to boolean (\"true\" -> True)\n- Return converted values as tuple\n\n**Skills Practiced:** Type Conversion • String Methods • Boolean Logic\n\n**Example:**\n```python\nage, height, student = convert_user_input(\"25\", \"5.8\", \"true\")\nprint(f\"Age: {age}, Height: {height}ft, Student: {student}\")  # Age: 25, Height: 5.8ft, Student: True\n```",
                "difficulty": "easy",
                "starter_code": "def convert_user_input(age_str, height_str, is_student_str):\n    # Convert strings to appropriate types\n    age = # Convert to integer\n    height = # Convert to float\n    is_student = # Convert to boolean (\"true\" -> True, \"false\" -> False)\n    return age, height, is_student",
                "solution": "def convert_user_input(age_str, height_str, is_student_str):\n    age = int(age_str)\n    height = float(height_str)\n    is_student = is_student_str.lower() == \"true\"\n    return age, height, is_student",
                "test_cases": [
                    {
                        "function_name": "convert_user_input",
                        "input": ["25", "5.8", "true"],
                        "expected": (25, 5.8, True)
                    },
                    {
                        "function_name": "convert_user_input",
                        "input": ["30", "6.1", "false"],
                        "expected": (30, 6.1, False)
                    }
                ],
                "hints": [
                    "Use int() to convert strings to integers",
                    "Use float() to convert strings to floating-point numbers",
                    "Compare string with \"true\" to get boolean value",
                    "Use .lower() to handle case variations"
                ],
                "xp_reward": 35
            },
            {
                "title": "Bank Account Balance",
                "description": "**Bank Account Balance**\n**Medium - Financial Calculations**\n\n**What You're Building:**\nCreate a savings account tracker for a banking app. Calculate how much money grows over time with regular deposits and interest.\n\n**Your Task:**\n- Calculate total deposits over time period\n- Add deposits to initial balance\n- Calculate interest earned on final balance\n- Return deposits, interest, and final balance\n\n**Skills Practiced:** Arithmetic Operations • Financial Math • Multi-step Calculations\n\n**Example:**\n```python\ndeposits, interest, final = account_summary(1000, 200, 0.05, 12)\nprint(f\"Final balance: ${final} (earned ${interest} interest)\")  # Final balance: $3570.0 (earned $170.0 interest)\n```",
                "difficulty": "medium",
                "starter_code": "def account_summary(initial_balance, monthly_deposit, interest_rate, months):\n    # Calculate final balance after deposits and interest\n    total_deposits = # Calculate total deposits\n    balance_before_interest = # Add deposits to initial balance\n    interest_earned = # Calculate interest on final balance\n    final_balance = # Add interest to balance\n    return total_deposits, interest_earned, final_balance",
                "solution": "def account_summary(initial_balance, monthly_deposit, interest_rate, months):\n    total_deposits = monthly_deposit * months\n    balance_before_interest = initial_balance + total_deposits\n    interest_earned = balance_before_interest * interest_rate\n    final_balance = balance_before_interest + interest_earned\n    return total_deposits, interest_earned, final_balance",
                "test_cases": [
                    {
                        "function_name": "account_summary",
                        "input": [1000, 200, 0.05, 12],
                        "expected": (2400, 170.0, 3570.0)
                    }
                ],
                "hints": [
                    "Multiply monthly deposit by number of months",
                    "Add total deposits to initial balance",
                    "Multiply balance by interest rate for interest earned",
                    "Add interest to balance for final amount"
                ],
                "xp_reward": 45
            },
            {
                "title": "Recipe Scaler",
                "description": "**Recipe Scaler**\n**Medium - Proportional Calculations**\n\n**What You're Building:**\nCreate a recipe scaling feature for a cooking app. Help users adjust ingredient quantities when cooking for different numbers of people.\n\n**Your Task:**\n- Calculate scaling factor (desired/original servings)\n- Scale ingredient amount by the factor\n- Return scale factor and new amount\n\n**Skills Practiced:** Division • Multiplication • Proportional Math\n\n**Example:**\n```python\nfactor, new_amount = scale_recipe(4, 6, 2.0)\nprint(f\"Scale by {factor}x: {new_amount} cups\")  # Scale by 1.5x: 3.0 cups\n```",
                "difficulty": "medium",
                "starter_code": "def scale_recipe(original_servings, desired_servings, flour_cups, sugar_cups, eggs):\n    # Calculate scaling factor and new ingredient amounts\n    scale_factor = # Calculate how much to scale\n    new_flour = # Scale flour amount\n    new_sugar = # Scale sugar amount\n    new_eggs = # Scale eggs (round to nearest whole number)\n    return scale_factor, new_flour, new_sugar, new_eggs",
                "solution": "def scale_recipe(original_servings, desired_servings, flour_cups, sugar_cups, eggs):\n    scale_factor = desired_servings / original_servings\n    new_flour = flour_cups * scale_factor\n    new_sugar = sugar_cups * scale_factor\n    new_eggs = round(eggs * scale_factor)\n    return scale_factor, new_flour, new_sugar, new_eggs",
                "test_cases": [
                    {
                        "function_name": "scale_recipe",
                        "input": [4, 6, 2.0, 1.5, 2],
                        "expected": (1.5, 3.0, 2.25, 3)
                    }
                ],
                "hints": [
                    "Divide desired servings by original servings for scale factor",
                    "Multiply each ingredient by the scale factor",
                    "Use round() function for eggs since you can't use partial eggs",
                    "Return values in the specified order"
                ],
                "xp_reward": 40
            },
            {
                "title": "Time Zone Converter",
                "description": "Convert time between different time zones for international meetings.",
                "difficulty": "hard",
                "starter_code": "def convert_time_zones(hour_24, minute, timezone_offset_from, timezone_offset_to):\n    # Convert time from one timezone to another\n    # timezone_offset is hours from UTC (e.g., EST = -5, PST = -8)\n    total_minutes = # Convert to total minutes\n    utc_minutes = # Convert to UTC minutes\n    target_minutes = # Convert to target timezone minutes\n    new_hour = # Extract hour (handle 24-hour wrap)\n    new_minute = # Extract minute\n    return new_hour, new_minute",
                "solution": "def convert_time_zones(hour_24, minute, timezone_offset_from, timezone_offset_to):\n    total_minutes = hour_24 * 60 + minute\n    utc_minutes = total_minutes - (timezone_offset_from * 60)\n    target_minutes = utc_minutes + (timezone_offset_to * 60)\n    new_hour = (target_minutes // 60) % 24\n    new_minute = target_minutes % 60\n    return new_hour, new_minute",
                "test_cases": [
                    {
                        "function_name": "convert_time_zones",
                        "input": [14, 30, -5, -8],
                        "expected": (11, 30)
                    },
                    {
                        "function_name": "convert_time_zones",
                        "input": [9, 0, -8, 1],
                        "expected": (18, 0)
                    }
                ],
                "hints": [
                    "Convert time to total minutes for easier calculation",
                    "Subtract source timezone offset to get UTC",
                    "Add target timezone offset to get target time",
                    "Use modulo (%) to handle day boundaries"
                ],
                "xp_reward": 60
            },
            {
                "title": "Investment Portfolio",
                "description": "Calculate portfolio value and returns for different investment types.",
                "difficulty": "hard",
                "starter_code": "def portfolio_analysis(stocks_value, bonds_value, crypto_value, stocks_return, bonds_return, crypto_return):\n    # Calculate portfolio metrics\n    total_value = # Sum all investments\n    stocks_new_value = # Apply return to stocks\n    bonds_new_value = # Apply return to bonds\n    crypto_new_value = # Apply return to crypto\n    new_total_value = # Sum new values\n    total_return_percent = # Calculate percentage gain/loss\n    return total_value, new_total_value, total_return_percent",
                "solution": "def portfolio_analysis(stocks_value, bonds_value, crypto_value, stocks_return, bonds_return, crypto_return):\n    total_value = stocks_value + bonds_value + crypto_value\n    stocks_new_value = stocks_value * (1 + stocks_return)\n    bonds_new_value = bonds_value * (1 + bonds_return)\n    crypto_new_value = crypto_value * (1 + crypto_return)\n    new_total_value = stocks_new_value + bonds_new_value + crypto_new_value\n    total_return_percent = ((new_total_value - total_value) / total_value) * 100\n    return total_value, new_total_value, total_return_percent",
                "test_cases": [
                    {
                        "function_name": "portfolio_analysis",
                        "input": [10000, 5000, 2000, 0.08, 0.03, -0.15],
                        "expected": (17000, 16950.0, -0.29411764705882354)
                    }
                ],
                "hints": [
                    "Returns are decimals (8% = 0.08)",
                    "New value = original_value * (1 + return_rate)",
                    "Percentage return = (new - old) / old * 100",
                    "Handle negative returns (losses) correctly"
                ],
                "xp_reward": 65
            },
            {
                "title": "Health Metrics Calculator",
                "description": "Calculate BMI and determine health category based on height and weight.",
                "difficulty": "medium",
                "starter_code": "def health_metrics(weight_kg, height_cm):\n    # Calculate BMI and health status\n    height_m = # Convert cm to meters\n    bmi = # Calculate BMI (weight / height^2)\n    # Determine category: < 18.5 underweight, 18.5-24.9 normal, 25-29.9 overweight, >= 30 obese\n    if bmi < 18.5:\n        category = \"underweight\"\n    # Complete the conditions\n    return bmi, category",
                "solution": "def health_metrics(weight_kg, height_cm):\n    height_m = height_cm / 100\n    bmi = weight_kg / (height_m ** 2)\n    if bmi < 18.5:\n        category = \"underweight\"\n    elif bmi < 25:\n        category = \"normal\"\n    elif bmi < 30:\n        category = \"overweight\"\n    else:\n        category = \"obese\"\n    return round(bmi, 1), category",
                "test_cases": [
                    {
                        "function_name": "health_metrics",
                        "input": [70, 175],
                        "expected": (22.9, "normal")
                    },
                    {
                        "function_name": "health_metrics",
                        "input": [85, 180],
                        "expected": (26.2, "overweight")
                    }
                ],
                "hints": [
                    "Divide height in cm by 100 to get meters",
                    "BMI = weight / (height in meters)^2",
                    "Use elif for multiple conditions",
                    "Round BMI to 1 decimal place"
                ],
                "xp_reward": 50
            }
        ]

    def _get_operations_problems(self) -> List[Dict[str, Any]]:
        return [
            {
                "title": "Smart Calculator",
                "description": "**Smart Calculator**\n**Easy - Arithmetic Operations**\n\n**What You're Building:**\nCreate a calculator component for a mobile app. Handle basic math operations with error protection for invalid calculations.\n\n**Your Task:**\n- Calculate subtotal: item price × quantity\n- Calculate tax amount: subtotal × tax rate\n- Calculate total: subtotal + tax amount\n- Return subtotal, tax amount, and total\n\n**Skills Practiced:** Arithmetic Operations • Multiplication • Addition\n\n**Example:**\n```python\nsubtotal, tax, total = calculate_total(25.99, 2, 0.08)\nprint(f\"Total: ${total:.2f}\")  # Total: $56.13\n```",
                "difficulty": "easy",
                "starter_code": "def calculate_total(item_price, quantity, tax_rate):\n    # Calculate shopping cart total with tax\n    subtotal = # Price times quantity\n    tax_amount = # Subtotal times tax rate\n    total = # Subtotal plus tax\n    return subtotal, tax_amount, total",
                "solution": "def calculate_total(item_price, quantity, tax_rate):\n    subtotal = item_price * quantity\n    tax_amount = subtotal * tax_rate\n    total = subtotal + tax_amount\n    return subtotal, tax_amount, total",
                "test_cases": [
                    {
                        "function_name": "calculate_total",
                        "input": [25.99, 2, 0.08],
                        "expected": (51.98, 4.1584, 56.1384)
                    }
                ],
                "hints": [
                    "Multiply price by quantity for subtotal",
                    "Multiply subtotal by tax rate for tax amount",
                    "Add subtotal and tax for final total",
                    "Use parentheses to control calculation order"
                ],
                "xp_reward": 30
            },
            {
                "title": "Tip Calculator",
                "description": "**Tip Calculator**\n**Easy - Percentage Calculations**\n\n**What You're Building:**\nCreate a bill splitting feature for a restaurant app. Calculate tips and split costs among friends dining together.\n\n**Your Task:**\n- Calculate tip amount from bill and percentage\n- Calculate total bill including tip\n- Calculate amount per person\n- Return tip, total, and per-person amounts\n\n**Skills Practiced:** Percentage Math • Division • Rounding\n\n**Example:**\n```python\ntip, total, each = calculate_tip(100.00, 18, 4)\nprint(f\"Each person pays: ${each}\")  # Each person pays: $29.5\n```",
                "difficulty": "easy",
                "starter_code": "def calculate_tip(bill_amount, tip_percentage, num_people):\n    # Calculate tip amount and total per person\n    tip_amount = # Calculate tip\n    total_bill = # Add tip to bill\n    per_person = # Divide by number of people\n    return tip_amount, total_bill, per_person",
                "solution": "def calculate_tip(bill_amount, tip_percentage, num_people):\n    tip_amount = bill_amount * (tip_percentage / 100)\n    total_bill = bill_amount + tip_amount\n    per_person = total_bill / num_people\n    return round(tip_amount, 2), round(total_bill, 2), round(per_person, 2)",
                "test_cases": [
                    {
                        "function_name": "calculate_tip",
                        "input": [100.00, 18, 4],
                        "expected": (18.0, 118.0, 29.5)
                    },
                    {
                        "function_name": "calculate_tip",
                        "input": [75.50, 20, 2],
                        "expected": (15.1, 90.6, 45.3)
                    }
                ],
                "hints": [
                    "Convert percentage to decimal by dividing by 100",
                    "Add tip amount to original bill for total",
                    "Divide total by number of people",
                    "Round to 2 decimal places for currency"
                ],
                "xp_reward": 35
            },
            {
                "title": "Compound Interest Calculator",
                "description": "**Compound Interest Calculator**\n**Medium - Advanced Math Operations**\n\n**What You're Building:**\nCreate an investment tracking feature for a banking app. Calculate how savings grow over time with compound interest.\n\n**Your Task:**\n- Apply compound interest formula: A = P(1 + r/n)^(nt)\n- Calculate final amount after compound growth\n- Calculate total interest earned\n- Return final amount and interest earned\n\n**Skills Practiced:** Exponentiation • Financial Formulas • Complex Calculations\n\n**Example:**\n```python\namount, interest = compound_interest(1000, 0.05, 4, 10)\nprint(f\"${amount} total (${interest} earned)\")  # $1643.62 total ($643.62 earned)\n```",
                "difficulty": "medium",
                "starter_code": "def compound_interest(principal, annual_rate, times_compounded, years):\n    # A = P(1 + r/n)^(nt)\n    # A = final amount, P = principal, r = annual rate, n = times compounded per year, t = years\n    amount = # Your calculation here\n    interest_earned = # Amount - principal\n    return amount, interest_earned",
                "solution": "def compound_interest(principal, annual_rate, times_compounded, years):\n    amount = principal * (1 + annual_rate / times_compounded) ** (times_compounded * years)\n    interest_earned = amount - principal\n    return round(amount, 2), round(interest_earned, 2)",
                "test_cases": [
                    {
                        "function_name": "compound_interest",
                        "input": [1000, 0.05, 4, 10],
                        "expected": (1643.62, 643.62)
                    },
                    {
                        "function_name": "compound_interest",
                        "input": [5000, 0.08, 12, 5],
                        "expected": (7449.23, 2449.23)
                    }
                ],
                "hints": [
                    "Use the compound interest formula A = P(1 + r/n)^(nt)",
                    "Use ** for exponentiation in Python",
                    "Interest earned is final amount minus principal",
                    "Round results to 2 decimal places"
                ],
                "xp_reward": 50
            },
            {
                "title": "Distance and Speed Calculator",
                "description": "**Distance and Speed Calculator**\n**Medium - Formula Applications**\n\n**What You're Building:**\nCreate a travel planning tool for a navigation app. Calculate missing values for trips using distance, speed, and time relationships.\n\n**Your Task:**\n- Apply distance = speed × time formula\n- Calculate missing value when given two others\n- Convert time to minutes using division\n- Return hours and remaining minutes\n\n**Skills Practiced:** Formula Application • Division • Modulo Operations\n\n**Example:**\n```python\nhours, minutes = convert_minutes(150)\nprint(f\"{hours} hours and {minutes} minutes\")  # 2 hours and 30 minutes\n```",
                "difficulty": "medium",
                "starter_code": "def convert_minutes(total_minutes):\n    # Convert total minutes to hours and remaining minutes\n    hours = # Divide by 60 to get whole hours\n    remaining_minutes = # Use modulo to get leftover minutes\n    return hours, remaining_minutes",
                "solution": "def convert_minutes(total_minutes):\n    hours = total_minutes // 60\n    remaining_minutes = total_minutes % 60\n    return hours, remaining_minutes",
                "test_cases": [
                    {
                        "function_name": "convert_minutes",
                        "input": [150],
                        "expected": (2, 30)
                    },
                    {
                        "function_name": "convert_minutes",
                        "input": [90],
                        "expected": (1, 30)
                    }
                ],
                "hints": [
                    "Use integer division (//) to get whole hours",
                    "Use modulo operator (%) to get remaining minutes",
                    "60 minutes = 1 hour",
                    "Return both values as a tuple"
                ],
                "xp_reward": 45
            },
            {
                "title": "Mortgage Payment Calculator",
                "description": "Calculate monthly mortgage payments using financial formulas.",
                "difficulty": "hard",
                "starter_code": "def mortgage_payment(loan_amount, annual_rate, loan_term_years):\n    # Monthly payment = P * [r(1+r)^n] / [(1+r)^n - 1]\n    # P = loan amount, r = monthly rate, n = number of payments\n    monthly_rate = # Convert annual rate to monthly\n    num_payments = # Convert years to months\n    if monthly_rate == 0:\n        return loan_amount / num_payments  # No interest case\n    \n    monthly_payment = # Calculate using formula\n    total_paid = # Total amount paid over loan term\n    total_interest = # Interest paid over loan term\n    return monthly_payment, total_paid, total_interest",
                "solution": "def mortgage_payment(loan_amount, annual_rate, loan_term_years):\n    monthly_rate = annual_rate / 12\n    num_payments = loan_term_years * 12\n    if monthly_rate == 0:\n        return loan_amount / num_payments\n    \n    monthly_payment = loan_amount * (monthly_rate * (1 + monthly_rate) ** num_payments) / ((1 + monthly_rate) ** num_payments - 1)\n    total_paid = monthly_payment * num_payments\n    total_interest = total_paid - loan_amount\n    return round(monthly_payment, 2), round(total_paid, 2), round(total_interest, 2)",
                "test_cases": [
                    {
                        "function_name": "mortgage_payment",
                        "input": [200000, 0.04, 30],
                        "expected": (954.83, 343739.01, 143739.01)
                    }
                ],
                "hints": [
                    "Convert annual rate to monthly by dividing by 12",
                    "Convert years to months by multiplying by 12",
                    "Use the mortgage payment formula exactly as given",
                    "Handle the zero interest rate case separately"
                ],
                "xp_reward": 65
            },
            {
                "title": "Unit Converter",
                "description": "Convert between different units of measurement.",
                "difficulty": "medium",
                "starter_code": "def convert_units(value, from_unit, to_unit):\n    # Convert between metric units\n    # meters, centimeters, millimeters, kilometers\n    conversions = {\n        'meters': 1,\n        'centimeters': 0.01,\n        'millimeters': 0.001,\n        'kilometers': 1000\n    }\n    \n    # Convert to meters first, then to target unit\n    meters = # Convert input to meters\n    result = # Convert meters to target unit\n    return result",
                "solution": "def convert_units(value, from_unit, to_unit):\n    conversions = {\n        'meters': 1,\n        'centimeters': 0.01,\n        'millimeters': 0.001,\n        'kilometers': 1000\n    }\n    \n    meters = value * conversions[from_unit]\n    result = meters / conversions[to_unit]\n    return result",
                "test_cases": [
                    {
                        "function_name": "convert_units",
                        "input": [1500, "centimeters", "meters"],
                        "expected": 15.0
                    },
                    {
                        "function_name": "convert_units",
                        "input": [2.5, "kilometers", "meters"],
                        "expected": 2500.0
                    }
                ],
                "hints": [
                    "Use the conversion factors to convert to meters first",
                    "Then convert from meters to the target unit",
                    "Multiply by the from_unit factor, divide by to_unit factor",
                    "Use dictionary lookup for conversion factors"
                ],
                "xp_reward": 40
            },
            {
                "title": "Fuel Efficiency Calculator",
                "description": "Calculate miles per gallon and fuel costs for road trips.",
                "difficulty": "medium",
                "starter_code": "def fuel_efficiency(miles_driven, gallons_used, price_per_gallon, trip_distance=None):\n    # Calculate MPG and optionally estimate trip costs\n    mpg = # Miles per gallon\n    cost_per_mile = # Cost per mile driven\n    \n    if trip_distance:\n        estimated_gallons = # Gallons needed for trip\n        estimated_cost = # Total cost for trip\n        return mpg, cost_per_mile, estimated_gallons, estimated_cost\n    else:\n        return mpg, cost_per_mile",
                "solution": "def fuel_efficiency(miles_driven, gallons_used, price_per_gallon, trip_distance=None):\n    mpg = miles_driven / gallons_used\n    cost_per_mile = price_per_gallon / mpg\n    \n    if trip_distance:\n        estimated_gallons = trip_distance / mpg\n        estimated_cost = estimated_gallons * price_per_gallon\n        return round(mpg, 2), round(cost_per_mile, 3), round(estimated_gallons, 2), round(estimated_cost, 2)\n    else:\n        return round(mpg, 2), round(cost_per_mile, 3)",
                "test_cases": [
                    {
                        "function_name": "fuel_efficiency",
                        "input": [300, 12, 3.50],
                        "expected": (25.0, 0.14)
                    },
                    {
                        "function_name": "fuel_efficiency",
                        "input": [400, 16, 3.25, 800],
                        "expected": (25.0, 0.13, 32.0, 104.0)
                    }
                ],
                "hints": [
                    "MPG = miles driven / gallons used",
                    "Cost per mile = price per gallon / MPG",
                    "For trip estimates, divide trip distance by MPG",
                    "Multiply estimated gallons by price for total cost"
                ],
                "xp_reward": 50
            },
            {
                "title": "Tax Calculator",
                "description": "Calculate income tax based on progressive tax brackets.",
                "difficulty": "hard",
                "starter_code": "def calculate_tax(income):\n    # Progressive tax brackets: 0-10k: 10%, 10k-40k: 20%, 40k+: 30%\n    if income <= 10000:\n        tax = # Calculate tax for lowest bracket\n    elif income <= 40000:\n        tax = # Tax on first 10k + tax on remainder\n    else:\n        tax = # Tax on first 10k + tax on next 30k + tax on remainder\n    \n    after_tax_income = income - tax\n    effective_rate = (tax / income) * 100\n    return tax, after_tax_income, effective_rate",
                "solution": "def calculate_tax(income):\n    if income <= 10000:\n        tax = income * 0.10\n    elif income <= 40000:\n        tax = 10000 * 0.10 + (income - 10000) * 0.20\n    else:\n        tax = 10000 * 0.10 + 30000 * 0.20 + (income - 40000) * 0.30\n    \n    after_tax_income = income - tax\n    effective_rate = (tax / income) * 100\n    return round(tax, 2), round(after_tax_income, 2), round(effective_rate, 2)",
                "test_cases": [
                    {
                        "function_name": "calculate_tax",
                        "input": [25000],
                        "expected": (4000.0, 21000.0, 16.0)
                    },
                    {
                        "function_name": "calculate_tax",
                        "input": [60000],
                        "expected": (13000.0, 47000.0, 21.67)
                    }
                ],
                "hints": [
                    "Calculate tax for each bracket separately",
                    "For higher brackets, add tax from all lower brackets",
                    "Effective rate = (total tax / income) * 100",
                    "Use conditional statements for different income levels"
                ],
                "xp_reward": 60
            }
        ]

    def _get_string_problems(self) -> List[Dict[str, Any]]:
        return [
            {
                "title": "Text Processor",
                "description": "**Text Processor**\n**Easy - String Methods**\n\n**What You're Building:**\nCreate a text analysis tool for a content management system. Process user input to display character counts and formatted versions.\n\n**Your Task:**\n- Calculate text length using len()\n- Convert to uppercase using .upper()\n- Convert to lowercase using .lower()\n- Return length, uppercase, and lowercase versions\n\n**Skills Practiced:** String Methods • Built-in Functions • Text Processing\n\n**Example:**\n```python\nlength, upper, lower = text_info(\"Hello World\")\nprint(f\"{length} chars: '{upper}' / '{lower}'\")  # 11 chars: 'HELLO WORLD' / 'hello world'\n```",
                "difficulty": "easy",
                "starter_code": "def text_info(text):\n    # Analyze text and return statistics\n    length = # Get text length\n    upper_text = # Convert to uppercase\n    lower_text = # Convert to lowercase\n    return length, upper_text, lower_text",
                "solution": "def text_info(text):\n    length = len(text)\n    upper_text = text.upper()\n    lower_text = text.lower()\n    return length, upper_text, lower_text",
                "test_cases": [
                    {
                        "function_name": "text_info",
                        "input": ["Hello World"],
                        "expected": (11, "HELLO WORLD", "hello world")
                    },
                    {
                        "function_name": "text_info",
                        "input": ["Python"],
                        "expected": (6, "PYTHON", "python")
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
