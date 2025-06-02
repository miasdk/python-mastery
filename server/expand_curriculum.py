#!/usr/bin/env python3
"""
Curriculum Expansion Script
Adds 26 more problems to reach exactly 60 problems total
"""

from database import get_db
from models import Section, Lesson, Problem
from sqlalchemy.orm import Session

def add_new_problems():
    db = next(get_db())
    
    # Get existing lessons
    conditionals_lesson = db.query(Lesson).filter(Lesson.title == "Conditional Statements").first()
    loops_lesson = db.query(Lesson).filter(Lesson.title == "Loops & Iteration").first()
    advanced_control_lesson = db.query(Lesson).filter(Lesson.title == "Advanced Control Flow").first()
    function_basics_lesson = db.query(Lesson).filter(Lesson.title == "Function Basics").first()
    parameters_lesson = db.query(Lesson).filter(Lesson.title == "Parameters & Arguments").first()
    lists_lesson = db.query(Lesson).filter(Lesson.title == "Lists").first()
    dictionaries_lesson = db.query(Lesson).filter(Lesson.title == "Dictionaries").first()
    strings_lesson = db.query(Lesson).filter(Lesson.title == "String Manipulation").first()
    
    new_problems = []
    
    # Loops & Iteration (7 more problems)
    loops_problems = [
        {
            "title": "Password Generator",
            "description": "**Password Generator**\n**Easy - String Building with Loops**\n\n**What You're Building:**\nCreate a secure password generator for a cybersecurity app.\n\n**Your Task:**\n- Generate password of specified length\n- Use characters from provided character set\n- Build password character by character using loop\n- Return generated password string\n\n**Skills Practiced:** For Loops • String Building • Character Selection\n\n**Example:**\n```python\npassword = generate_password(8, \"abcABC123\")\nprint(f\"Password: {password}\")  # Password: aB3c1A2b\n```",
            "difficulty": "easy",
            "starter_code": "def generate_password(length, characters):\n    import random\n    password = \"\"\n    for i in range(length):\n        # Select random character and add to password\n        char = random.choice(characters)\n        password += char\n    return password",
            "solution": "def generate_password(length, characters):\n    import random\n    password = \"\"\n    for i in range(length):\n        char = random.choice(characters)\n        password += char\n    return password",
            "test_cases": [{"function_name": "generate_password", "input": [5, "abc"], "expected": 5}],
            "hints": ["Use range(length) to loop the correct number of times", "Use random.choice() to select random character", "Build password by concatenating characters", "Return the completed password string"],
            "xp_reward": 35
        },
        {
            "title": "Sales Report Generator", 
            "description": "**Sales Report Generator**\n**Medium - Data Processing with Loops**\n\n**What You're Building:**\nCreate a sales analytics tool for a retail business.\n\n**Your Task:**\n- Calculate total sales across all days\n- Find the highest single-day sales\n- Count days with sales above target\n- Return summary statistics\n\n**Skills Practiced:** List Iteration • Accumulation • Conditional Counting\n\n**Example:**\n```python\ntotal, max_day, above_target = analyze_sales([100, 150, 200, 120], 130)\nprint(f\"Total: ${total}, Best: ${max_day}, Above target: {above_target}\")  # Total: $570, Best: $200, Above target: 2\n```",
            "difficulty": "medium",
            "starter_code": "def analyze_sales(daily_sales, target):\n    total = 0\n    max_sale = 0\n    days_above_target = 0\n    \n    for sale in daily_sales:\n        # Add to total\n        total += sale\n        # Check if it's the highest\n        if sale > max_sale:\n            max_sale = sale\n        # Count if above target\n        if sale > target:\n            days_above_target += 1\n    \n    return total, max_sale, days_above_target",
            "solution": "def analyze_sales(daily_sales, target):\n    total = 0\n    max_sale = 0\n    days_above_target = 0\n    \n    for sale in daily_sales:\n        total += sale\n        if sale > max_sale:\n            max_sale = sale\n        if sale > target:\n            days_above_target += 1\n    \n    return total, max_sale, days_above_target",
            "test_cases": [{"function_name": "analyze_sales", "input": [[100, 150, 200, 120], 130], "expected": (570, 200, 2)}],
            "hints": ["Initialize variables before the loop", "Use accumulation pattern for total", "Compare each sale to current max", "Count when sale exceeds target"],
            "xp_reward": 45
        },
        {
            "title": "Inventory Counter",
            "description": "**Inventory Counter**\n**Medium - Dictionary Building with Loops**\n\n**What You're Building:**\nCreate an inventory management system for a warehouse.\n\n**Your Task:**\n- Count occurrences of each item in inventory list\n- Build dictionary with item names as keys\n- Track quantities as values\n- Return complete inventory count\n\n**Skills Practiced:** Dictionary Building • Counting Patterns • Data Aggregation\n\n**Example:**\n```python\ninventory = count_inventory([\"apple\", \"banana\", \"apple\", \"orange\", \"banana\", \"apple\"])\nprint(inventory)  # {'apple': 3, 'banana': 2, 'orange': 1}\n```",
            "difficulty": "medium",
            "starter_code": "def count_inventory(items):\n    inventory = {}\n    \n    for item in items:\n        # Count each item occurrence\n        if item in inventory:\n            inventory[item] += 1\n        else:\n            inventory[item] = 1\n    \n    return inventory",
            "solution": "def count_inventory(items):\n    inventory = {}\n    \n    for item in items:\n        if item in inventory:\n            inventory[item] += 1\n        else:\n            inventory[item] = 1\n    \n    return inventory",
            "test_cases": [{"function_name": "count_inventory", "input": [["apple", "banana", "apple", "orange", "banana", "apple"]], "expected": {"apple": 3, "banana": 2, "orange": 1}}],
            "hints": ["Initialize empty dictionary before loop", "Check if item already exists in dictionary", "Increment count if exists, set to 1 if new", "Dictionary keys are item names, values are counts"],
            "xp_reward": 50
        },
        {
            "title": "Grade Book Calculator",
            "description": "**Grade Book Calculator**\n**Medium - Complex Loop Logic**\n\n**What You're Building:**\nCreate a student grade analysis system for teachers.\n\n**Your Task:**\n- Calculate average grade for all students\n- Count students passing (70+ average)\n- Find highest individual grade\n- Return class statistics\n\n**Skills Practiced:** Nested Lists • Statistical Calculations • Performance Analysis\n\n**Example:**\n```python\navg, passing, highest = analyze_grades([[85, 90, 78], [92, 88, 95], [65, 70, 68]])\nprint(f\"Class avg: {avg:.1f}, Passing: {passing}, Top grade: {highest}\")  # Class avg: 79.8, Passing: 2, Top grade: 95\n```",
            "difficulty": "medium",
            "starter_code": "def analyze_grades(student_grades):\n    all_grades = []\n    passing_students = 0\n    highest_grade = 0\n    \n    for grades in student_grades:\n        # Calculate student average\n        student_avg = sum(grades) / len(grades)\n        \n        # Add all grades to master list\n        all_grades.extend(grades)\n        \n        # Check if student is passing\n        if student_avg >= 70:\n            passing_students += 1\n        \n        # Find highest individual grade\n        for grade in grades:\n            if grade > highest_grade:\n                highest_grade = grade\n    \n    class_average = sum(all_grades) / len(all_grades)\n    return round(class_average, 1), passing_students, highest_grade",
            "solution": "def analyze_grades(student_grades):\n    all_grades = []\n    passing_students = 0\n    highest_grade = 0\n    \n    for grades in student_grades:\n        student_avg = sum(grades) / len(grades)\n        all_grades.extend(grades)\n        \n        if student_avg >= 70:\n            passing_students += 1\n        \n        for grade in grades:\n            if grade > highest_grade:\n                highest_grade = grade\n    \n    class_average = sum(all_grades) / len(all_grades)\n    return round(class_average, 1), passing_students, highest_grade",
            "test_cases": [{"function_name": "analyze_grades", "input": [[[85, 90, 78], [92, 88, 95], [65, 70, 68]]], "expected": (79.8, 2, 95)}],
            "hints": ["Use nested loops for lists within lists", "Calculate average with sum() / len()", "Use extend() to combine all grades", "Track highest grade across all students"],
            "xp_reward": 55
        },
        {
            "title": "Fibonacci Calculator",
            "description": "**Fibonacci Calculator**\n**Hard - Mathematical Sequences**\n\n**What You're Building:**\nCreate a mathematical sequence generator for a finance app calculating growth patterns.\n\n**Your Task:**\n- Generate first n numbers in Fibonacci sequence\n- Each number is sum of previous two (0, 1, 1, 2, 3, 5, 8...)\n- Start with 0 and 1\n- Return list of fibonacci numbers\n\n**Skills Practiced:** Mathematical Sequences • Loop Logic • Pattern Generation\n\n**Example:**\n```python\nfib_sequence = fibonacci(7)\nprint(f\"Fibonacci: {fib_sequence}\")  # Fibonacci: [0, 1, 1, 2, 3, 5, 8]\n```",
            "difficulty": "hard",
            "starter_code": "def fibonacci(n):\n    if n <= 0:\n        return []\n    elif n == 1:\n        return [0]\n    elif n == 2:\n        return [0, 1]\n    \n    sequence = [0, 1]\n    \n    for i in range(2, n):\n        # Calculate next fibonacci number\n        next_num = sequence[i-1] + sequence[i-2]\n        sequence.append(next_num)\n    \n    return sequence",
            "solution": "def fibonacci(n):\n    if n <= 0:\n        return []\n    elif n == 1:\n        return [0]\n    elif n == 2:\n        return [0, 1]\n    \n    sequence = [0, 1]\n    \n    for i in range(2, n):\n        next_num = sequence[i-1] + sequence[i-2]\n        sequence.append(next_num)\n    \n    return sequence",
            "test_cases": [{"function_name": "fibonacci", "input": [7], "expected": [0, 1, 1, 2, 3, 5, 8]}],
            "hints": ["Handle edge cases for n <= 2", "Start with [0, 1] for base sequence", "Each new number = sum of previous two", "Use indexing to access previous values"],
            "xp_reward": 60
        },
        {
            "title": "Prime Number Finder",
            "description": "**Prime Number Finder**\n**Hard - Algorithm Implementation**\n\n**What You're Building:**\nCreate a prime number detector for a cryptography application.\n\n**Your Task:**\n- Check if a number has exactly two factors (1 and itself)\n- Test divisibility from 2 to square root of number\n- Return True if prime, False if composite\n- Handle edge cases for numbers below 2\n\n**Skills Practiced:** Algorithm Logic • Mathematical Testing • Optimization\n\n**Example:**\n```python\nresult = is_prime(17)\nprint(f\"17 is prime: {result}\")  # 17 is prime: True\n```",
            "difficulty": "hard",
            "starter_code": "def is_prime(n):\n    if n < 2:\n        return False\n    \n    # Check for factors from 2 to sqrt(n)\n    for i in range(2, int(n ** 0.5) + 1):\n        if n % i == 0:\n            return False\n    \n    return True",
            "solution": "def is_prime(n):\n    if n < 2:\n        return False\n    \n    for i in range(2, int(n ** 0.5) + 1):\n        if n % i == 0:\n            return False\n    \n    return True",
            "test_cases": [{"function_name": "is_prime", "input": [17], "expected": True}, {"function_name": "is_prime", "input": [15], "expected": False}],
            "hints": ["Numbers less than 2 are not prime", "Only need to check up to square root", "If any number divides evenly, it's not prime", "Use modulo operator to check divisibility"],
            "xp_reward": 65
        },
        {
            "title": "Text Pattern Finder",
            "description": "**Text Pattern Finder**\n**Hard - String Processing**\n\n**What You're Building:**\nCreate a text analysis tool for a document search engine.\n\n**Your Task:**\n- Search for pattern occurrences in text\n- Count total matches found\n- Track position of each match\n- Return count and positions list\n\n**Skills Practiced:** String Searching • Position Tracking • Pattern Matching\n\n**Example:**\n```python\ncount, positions = find_pattern(\"hello world hello\", \"hello\")\nprint(f\"Found {count} matches at positions: {positions}\")  # Found 2 matches at positions: [0, 12]\n```",
            "difficulty": "hard",
            "starter_code": "def find_pattern(text, pattern):\n    count = 0\n    positions = []\n    \n    for i in range(len(text) - len(pattern) + 1):\n        # Check if pattern matches at position i\n        if text[i:i+len(pattern)] == pattern:\n            count += 1\n            positions.append(i)\n    \n    return count, positions",
            "solution": "def find_pattern(text, pattern):\n    count = 0\n    positions = []\n    \n    for i in range(len(text) - len(pattern) + 1):\n        if text[i:i+len(pattern)] == pattern:\n            count += 1\n            positions.append(i)\n    \n    return count, positions",
            "test_cases": [{"function_name": "find_pattern", "input": ["hello world hello", "hello"], "expected": (2, [0, 12])}],
            "hints": ["Loop through each possible starting position", "Use string slicing to extract substring", "Compare extracted substring to pattern", "Record position when match found"],
            "xp_reward": 70
        }
    ]
    
    # Add loops problems
    for i, problem_data in enumerate(loops_problems):
        new_problems.append(Problem(
            lesson_id=loops_lesson.id,
            title=problem_data["title"],
            description=problem_data["description"],
            difficulty=problem_data["difficulty"],
            order_index=i + 2,  # Start after existing problem
            starter_code=problem_data["starter_code"],
            solution=problem_data["solution"],
            test_cases=problem_data["test_cases"],
            hints=problem_data["hints"],
            xp_reward=problem_data["xp_reward"]
        ))
    
    # Advanced Control Flow (4 more problems)
    control_problems = [
        {
            "title": "Task Scheduler",
            "description": "**Task Scheduler**\n**Medium - Break and Continue**\n\n**What You're Building:**\nCreate a task processing system for a productivity app.\n\n**Your Task:**\n- Process tasks until maximum time reached\n- Skip tasks marked as 'skip'\n- Stop processing when hitting 'urgent' task\n- Return total time spent and tasks completed\n\n**Skills Practiced:** Break Statement • Continue Statement • Loop Control\n\n**Example:**\n```python\ntime, completed = process_tasks([('email', 10), ('skip', 5), ('urgent', 15)], 20)\nprint(f\"Time: {time}, Completed: {completed}\")  # Time: 10, Completed: 1\n```",
            "difficulty": "medium",
            "starter_code": "def process_tasks(tasks, max_time):\n    total_time = 0\n    completed = 0\n    \n    for task_name, duration in tasks:\n        if task_name == 'skip':\n            continue\n        \n        if task_name == 'urgent':\n            break\n        \n        if total_time + duration > max_time:\n            break\n        \n        total_time += duration\n        completed += 1\n    \n    return total_time, completed",
            "solution": "def process_tasks(tasks, max_time):\n    total_time = 0\n    completed = 0\n    \n    for task_name, duration in tasks:\n        if task_name == 'skip':\n            continue\n        \n        if task_name == 'urgent':\n            break\n        \n        if total_time + duration > max_time:\n            break\n        \n        total_time += duration\n        completed += 1\n    \n    return total_time, completed",
            "test_cases": [{"function_name": "process_tasks", "input": [[('email', 10), ('skip', 5), ('urgent', 15)], 20], "expected": (10, 1)}],
            "hints": ["Use continue to skip tasks", "Use break to stop on urgent tasks", "Check time limit before adding task", "Track completed tasks and total time"],
            "xp_reward": 50
        },
        {
            "title": "Number Grid Generator",
            "description": "**Number Grid Generator**\n**Medium - Nested Loops**\n\n**What You're Building:**\nCreate a grid pattern generator for a game development tool.\n\n**Your Task:**\n- Generate rows x cols grid of numbers\n- Fill with sequential numbers starting from 1\n- Each row should be a list of numbers\n- Return list of lists representing the grid\n\n**Skills Practiced:** Nested Loops • Grid Generation • Sequential Numbering\n\n**Example:**\n```python\ngrid = generate_grid(3, 3)\nprint(grid)  # [[1, 2, 3], [4, 5, 6], [7, 8, 9]]\n```",
            "difficulty": "medium",
            "starter_code": "def generate_grid(rows, cols):\n    grid = []\n    number = 1\n    \n    for row in range(rows):\n        current_row = []\n        for col in range(cols):\n            current_row.append(number)\n            number += 1\n        grid.append(current_row)\n    \n    return grid",
            "solution": "def generate_grid(rows, cols):\n    grid = []\n    number = 1\n    \n    for row in range(rows):\n        current_row = []\n        for col in range(cols):\n            current_row.append(number)\n            number += 1\n        grid.append(current_row)\n    \n    return grid",
            "test_cases": [{"function_name": "generate_grid", "input": [3, 3], "expected": [[1, 2, 3], [4, 5, 6], [7, 8, 9]]}],
            "hints": ["Use nested loops for rows and columns", "Keep track of current number", "Build each row as a list", "Append completed rows to grid"],
            "xp_reward": 45
        },
        {
            "title": "Data Validator",
            "description": "**Data Validator**\n**Hard - Complex Control Flow**\n\n**What You're Building:**\nCreate a data validation system for a form processing application.\n\n**Your Task:**\n- Validate list of user inputs\n- Skip empty strings\n- Stop validation on first invalid entry\n- Return validation status and error position\n\n**Skills Practiced:** Input Validation • Error Handling • Flow Control\n\n**Example:**\n```python\nvalid, error_pos = validate_data(['abc', '', '123', 'x'])\nprint(f\"Valid: {valid}, Error at: {error_pos}\")  # Valid: False, Error at: 3\n```",
            "difficulty": "hard",
            "starter_code": "def validate_data(data_list):\n    for i, item in enumerate(data_list):\n        if item == '':\n            continue\n        \n        # Invalid if length < 3\n        if len(item) < 3:\n            return False, i\n    \n    return True, -1",
            "solution": "def validate_data(data_list):\n    for i, item in enumerate(data_list):\n        if item == '':\n            continue\n        \n        if len(item) < 3:\n            return False, i\n    \n    return True, -1",
            "test_cases": [{"function_name": "validate_data", "input": [['abc', '', '123', 'x']], "expected": (False, 3)}],
            "hints": ["Use enumerate to track position", "Continue on empty strings", "Return immediately on first error", "Return True, -1 if all valid"],
            "xp_reward": 60
        },
        {
            "title": "Game Score Processor",
            "description": "**Game Score Processor**\n**Hard - Advanced Loop Control**\n\n**What You're Building:**\nCreate a score processing system for a gaming platform.\n\n**Your Task:**\n- Process player scores until game over\n- Skip negative scores (invalid)\n- Stop on score of 0 (game ended)\n- Double bonus scores (marked with 'bonus' prefix)\n- Return total score and valid moves\n\n**Skills Practiced:** Complex Conditions • String Processing • Game Logic\n\n**Example:**\n```python\ntotal, moves = process_game(['10', 'bonus_20', '-5', '0'])\nprint(f\"Total: {total}, Moves: {moves}\")  # Total: 50, Moves: 2\n```",
            "difficulty": "hard",
            "starter_code": "def process_game(score_list):\n    total_score = 0\n    valid_moves = 0\n    \n    for score_str in score_list:\n        if score_str.startswith('bonus_'):\n            score = int(score_str.replace('bonus_', '')) * 2\n        else:\n            score = int(score_str)\n        \n        if score < 0:\n            continue\n        \n        if score == 0:\n            break\n        \n        total_score += score\n        valid_moves += 1\n    \n    return total_score, valid_moves",
            "solution": "def process_game(score_list):\n    total_score = 0\n    valid_moves = 0\n    \n    for score_str in score_list:\n        if score_str.startswith('bonus_'):\n            score = int(score_str.replace('bonus_', '')) * 2\n        else:\n            score = int(score_str)\n        \n        if score < 0:\n            continue\n        \n        if score == 0:\n            break\n        \n        total_score += score\n        valid_moves += 1\n    \n    return total_score, valid_moves",
            "test_cases": [{"function_name": "process_game", "input": [['10', 'bonus_20', '-5', '0']], "expected": (50, 2)}],
            "hints": ["Handle bonus scores with string methods", "Skip negative scores with continue", "Break on zero score", "Track both total and move count"],
            "xp_reward": 65
        }
    ]
    
    # Add advanced control problems
    for i, problem_data in enumerate(control_problems):
        new_problems.append(Problem(
            lesson_id=advanced_control_lesson.id,
            title=problem_data["title"],
            description=problem_data["description"],
            difficulty=problem_data["difficulty"],
            order_index=i + 2,
            starter_code=problem_data["starter_code"],
            solution=problem_data["solution"],
            test_cases=problem_data["test_cases"],
            hints=problem_data["hints"],
            xp_reward=problem_data["xp_reward"]
        ))
    
    # Function Basics (4 more problems)
    function_problems = [
        {
            "title": "Temperature Converter",
            "description": "**Temperature Converter**\n**Easy - Basic Functions**\n\n**What You're Building:**\nCreate a temperature conversion tool for a weather app.\n\n**Your Task:**\n- Convert Celsius to Fahrenheit\n- Use formula: F = C * 9/5 + 32\n- Return converted temperature as float\n- Round result to 1 decimal place\n\n**Skills Practiced:** Function Definition • Mathematical Operations • Return Values\n\n**Example:**\n```python\ntemp = celsius_to_fahrenheit(25)\nprint(f\"25°C = {temp}°F\")  # 25°C = 77.0°F\n```",
            "difficulty": "easy",
            "starter_code": "def celsius_to_fahrenheit(celsius):\n    # Convert Celsius to Fahrenheit\n    fahrenheit = celsius * 9/5 + 32\n    return round(fahrenheit, 1)",
            "solution": "def celsius_to_fahrenheit(celsius):\n    fahrenheit = celsius * 9/5 + 32\n    return round(fahrenheit, 1)",
            "test_cases": [{"function_name": "celsius_to_fahrenheit", "input": [25], "expected": 77.0}],
            "hints": ["Use the conversion formula F = C * 9/5 + 32", "Return the calculated result", "Use round() for 1 decimal place", "Function should take one parameter"],
            "xp_reward": 30
        },
        {
            "title": "Circle Calculator",
            "description": "**Circle Calculator**\n**Easy - Math Functions**\n\n**What You're Building:**\nCreate a geometry calculator for an engineering application.\n\n**Your Task:**\n- Calculate circle area using radius\n- Use formula: area = π * radius²\n- Use 3.14159 for π value\n- Return area rounded to 2 decimal places\n\n**Skills Practiced:** Mathematical Functions • Constants • Precision\n\n**Example:**\n```python\narea = circle_area(5)\nprint(f\"Circle area: {area}\")  # Circle area: 78.54\n```",
            "difficulty": "easy",
            "starter_code": "def circle_area(radius):\n    # Calculate circle area\n    pi = 3.14159\n    area = pi * radius * radius\n    return round(area, 2)",
            "solution": "def circle_area(radius):\n    pi = 3.14159\n    area = pi * radius * radius\n    return round(area, 2)",
            "test_cases": [{"function_name": "circle_area", "input": [5], "expected": 78.54}],
            "hints": ["Define pi as 3.14159", "Area = pi * radius²", "Use round() for 2 decimal places", "Return the calculated area"],
            "xp_reward": 30
        },
        {
            "title": "BMI Calculator",
            "description": "**BMI Calculator**\n**Medium - Health Functions**\n\n**What You're Building:**\nCreate a health monitoring tool for a fitness application.\n\n**Your Task:**\n- Calculate Body Mass Index (BMI)\n- Use formula: BMI = weight / (height²)\n- Return BMI value and category string\n- Categories: <18.5 Underweight, 18.5-24.9 Normal, 25+ Overweight\n\n**Skills Practiced:** Function Logic • Conditional Returns • Health Calculations\n\n**Example:**\n```python\nbmi, category = calculate_bmi(70, 1.75)\nprint(f\"BMI: {bmi:.1f} ({category})\")  # BMI: 22.9 (Normal)\n```",
            "difficulty": "medium",
            "starter_code": "def calculate_bmi(weight, height):\n    # Calculate BMI and determine category\n    bmi = weight / (height * height)\n    \n    if bmi < 18.5:\n        category = \"Underweight\"\n    elif bmi < 25:\n        category = \"Normal\"\n    else:\n        category = \"Overweight\"\n    \n    return round(bmi, 1), category",
            "solution": "def calculate_bmi(weight, height):\n    bmi = weight / (height * height)\n    \n    if bmi < 18.5:\n        category = \"Underweight\"\n    elif bmi < 25:\n        category = \"Normal\"\n    else:\n        category = \"Overweight\"\n    \n    return round(bmi, 1), category",
            "test_cases": [{"function_name": "calculate_bmi", "input": [70, 1.75], "expected": (22.9, "Normal")}],
            "hints": ["BMI = weight / height²", "Use conditionals for categories", "Return both BMI and category", "Round BMI to 1 decimal place"],
            "xp_reward": 45
        },
        {
            "title": "Loan Payment Calculator",
            "description": "**Loan Payment Calculator**\n**Hard - Financial Functions**\n\n**What You're Building:**\nCreate a loan calculator for a banking application.\n\n**Your Task:**\n- Calculate monthly payment for a loan\n- Use loan amount, annual rate, and years\n- Convert annual rate to monthly and years to months\n- Return monthly payment rounded to 2 decimal places\n\n**Skills Practiced:** Complex Calculations • Financial Formulas • Multi-step Functions\n\n**Example:**\n```python\npayment = loan_payment(10000, 5.0, 3)\nprint(f\"Monthly payment: ${payment}\")  # Monthly payment: $299.71\n```",
            "difficulty": "hard",
            "starter_code": "def loan_payment(principal, annual_rate, years):\n    # Calculate monthly loan payment\n    monthly_rate = annual_rate / 100 / 12\n    months = years * 12\n    \n    if monthly_rate == 0:\n        return round(principal / months, 2)\n    \n    payment = principal * (monthly_rate * (1 + monthly_rate)**months) / ((1 + monthly_rate)**months - 1)\n    return round(payment, 2)",
            "solution": "def loan_payment(principal, annual_rate, years):\n    monthly_rate = annual_rate / 100 / 12\n    months = years * 12\n    \n    if monthly_rate == 0:\n        return round(principal / months, 2)\n    \n    payment = principal * (monthly_rate * (1 + monthly_rate)**months) / ((1 + monthly_rate)**months - 1)\n    return round(payment, 2)",
            "test_cases": [{"function_name": "loan_payment", "input": [10000, 5.0, 3], "expected": 299.71}],
            "hints": ["Convert annual rate to monthly (divide by 1200)", "Convert years to months (multiply by 12)", "Handle zero interest rate case", "Use loan payment formula"],
            "xp_reward": 60
        }
    ]
    
    # Add function problems
    for i, problem_data in enumerate(function_problems):
        new_problems.append(Problem(
            lesson_id=function_basics_lesson.id,
            title=problem_data["title"],
            description=problem_data["description"],
            difficulty=problem_data["difficulty"],
            order_index=i + 2,
            starter_code=problem_data["starter_code"],
            solution=problem_data["solution"],
            test_cases=problem_data["test_cases"],
            hints=problem_data["hints"],
            xp_reward=problem_data["xp_reward"]
        ))
    
    # Parameters & Arguments (4 more problems)
    params_problems = [
        {
            "title": "Order Calculator",
            "description": "**Order Calculator**\n**Easy - Multiple Parameters**\n\n**What You're Building:**\nCreate an order total calculator for a restaurant app.\n\n**Your Task:**\n- Calculate total cost with item price, quantity, and tax rate\n- Multiply price by quantity for subtotal\n- Add tax as percentage of subtotal\n- Return final total rounded to 2 decimal places\n\n**Skills Practiced:** Multiple Parameters • Order of Operations • Tax Calculations\n\n**Example:**\n```python\ntotal = calculate_order(15.99, 2, 8.5)\nprint(f\"Total: ${total}\")  # Total: $34.70\n```",
            "difficulty": "easy",
            "starter_code": "def calculate_order(price, quantity, tax_rate):\n    # Calculate order total with tax\n    subtotal = price * quantity\n    tax = subtotal * tax_rate / 100\n    total = subtotal + tax\n    return round(total, 2)",
            "solution": "def calculate_order(price, quantity, tax_rate):\n    subtotal = price * quantity\n    tax = subtotal * tax_rate / 100\n    total = subtotal + tax\n    return round(total, 2)",
            "test_cases": [{"function_name": "calculate_order", "input": [15.99, 2, 8.5], "expected": 34.70}],
            "hints": ["Subtotal = price × quantity", "Tax = subtotal × tax_rate / 100", "Total = subtotal + tax", "Round to 2 decimal places"],
            "xp_reward": 35
        },
        {
            "title": "Personal Greeting",
            "description": "**Personal Greeting**\n**Easy - String Parameters**\n\n**What You're Building:**\nCreate a personalized greeting system for a social media app.\n\n**Your Task:**\n- Generate greeting with first name, last name, and time of day\n- Format as \"Good [time], [first] [last]!\"\n- Handle different times: morning, afternoon, evening\n- Return formatted greeting string\n\n**Skills Practiced:** String Formatting • Multiple Parameters • Text Assembly\n\n**Example:**\n```python\ngreeting = create_greeting(\"John\", \"Smith\", \"morning\")\nprint(greeting)  # Good morning, John Smith!\n```",
            "difficulty": "easy",
            "starter_code": "def create_greeting(first_name, last_name, time_of_day):\n    # Create personalized greeting\n    full_name = first_name + \" \" + last_name\n    greeting = f\"Good {time_of_day}, {full_name}!\"\n    return greeting",
            "solution": "def create_greeting(first_name, last_name, time_of_day):\n    full_name = first_name + \" \" + last_name\n    greeting = f\"Good {time_of_day}, {full_name}!\"\n    return greeting",
            "test_cases": [{"function_name": "create_greeting", "input": ["John", "Smith", "morning"], "expected": "Good morning, John Smith!"}],
            "hints": ["Combine first and last name with space", "Use f-string for formatting", "Include 'Good' and exclamation mark", "Return the complete greeting"],
            "xp_reward": 30
        },
        {
            "title": "Shipping Calculator",
            "description": "**Shipping Calculator**\n**Medium - Default Parameters**\n\n**What You're Building:**\nCreate a shipping cost calculator for an e-commerce platform.\n\n**Your Task:**\n- Calculate shipping based on weight, distance, and speed\n- Use default values: distance=100, speed='standard'\n- Standard speed costs $1 per kg, express costs $2 per kg\n- Add distance surcharge: $0.10 per km over 100km\n- Return total shipping cost\n\n**Skills Practiced:** Default Parameters • Conditional Logic • Cost Calculations\n\n**Example:**\n```python\ncost = calculate_shipping(5, 150, 'express')\nprint(f\"Shipping: ${cost:.2f}\")  # Shipping: $15.00\n```",
            "difficulty": "medium",
            "starter_code": "def calculate_shipping(weight, distance=100, speed='standard'):\n    # Calculate shipping cost\n    if speed == 'express':\n        base_cost = weight * 2\n    else:\n        base_cost = weight * 1\n    \n    if distance > 100:\n        distance_cost = (distance - 100) * 0.10\n    else:\n        distance_cost = 0\n    \n    total = base_cost + distance_cost\n    return round(total, 2)",
            "solution": "def calculate_shipping(weight, distance=100, speed='standard'):\n    if speed == 'express':\n        base_cost = weight * 2\n    else:\n        base_cost = weight * 1\n    \n    if distance > 100:\n        distance_cost = (distance - 100) * 0.10\n    else:\n        distance_cost = 0\n    \n    total = base_cost + distance_cost\n    return round(total, 2)",
            "test_cases": [{"function_name": "calculate_shipping", "input": [5, 150, 'express'], "expected": 15.0}],
            "hints": ["Use default parameter syntax", "Different rates for express vs standard", "Add surcharge for distance > 100km", "Round final cost to 2 decimals"],
            "xp_reward": 50
        },
        {
            "title": "Investment Calculator",
            "description": "**Investment Calculator**\n**Hard - Complex Parameters**\n\n**What You're Building:**\nCreate an investment growth calculator for a financial planning app.\n\n**Your Task:**\n- Calculate future value with principal, rate, time, and compound frequency\n- Use compound interest formula: A = P(1 + r/n)^(nt)\n- Support different compounding: yearly=1, monthly=12, daily=365\n- Return final amount and total interest earned\n\n**Skills Practiced:** Complex Formulas • Multiple Parameters • Financial Math\n\n**Example:**\n```python\nfinal, interest = calculate_investment(1000, 5.0, 2, 12)\nprint(f\"Final: ${final:.2f}, Interest: ${interest:.2f}\")  # Final: $1104.89, Interest: $104.89\n```",
            "difficulty": "hard",
            "starter_code": "def calculate_investment(principal, annual_rate, years, compound_frequency=1):\n    # Calculate compound interest\n    rate = annual_rate / 100\n    final_amount = principal * (1 + rate/compound_frequency) ** (compound_frequency * years)\n    interest_earned = final_amount - principal\n    return round(final_amount, 2), round(interest_earned, 2)",
            "solution": "def calculate_investment(principal, annual_rate, years, compound_frequency=1):\n    rate = annual_rate / 100\n    final_amount = principal * (1 + rate/compound_frequency) ** (compound_frequency * years)\n    interest_earned = final_amount - principal\n    return round(final_amount, 2), round(interest_earned, 2)",
            "test_cases": [{"function_name": "calculate_investment", "input": [1000, 5.0, 2, 12], "expected": (1104.89, 104.89)}],
            "hints": ["Convert percentage to decimal", "Use compound interest formula", "Calculate interest as final - principal", "Return both final amount and interest"],
            "xp_reward": 65
        }
    ]
    
    # Add parameters problems
    for i, problem_data in enumerate(params_problems):
        new_problems.append(Problem(
            lesson_id=parameters_lesson.id,
            title=problem_data["title"],
            description=problem_data["description"],
            difficulty=problem_data["difficulty"],
            order_index=i + 2,
            starter_code=problem_data["starter_code"],
            solution=problem_data["solution"],
            test_cases=problem_data["test_cases"],
            hints=problem_data["hints"],
            xp_reward=problem_data["xp_reward"]
        ))
    
    # Lists (3 more problems)
    lists_problems = [
        {
            "title": "Shopping Cart Manager",
            "description": "**Shopping Cart Manager**\n**Medium - List Operations**\n\n**What You're Building:**\nCreate a shopping cart system for an e-commerce website.\n\n**Your Task:**\n- Add items to cart list\n- Remove specific items by name\n- Calculate total number of items\n- Return updated cart and item count\n\n**Skills Practiced:** List Manipulation • Item Management • Dynamic Updates\n\n**Example:**\n```python\ncart, count = manage_cart(['apple', 'banana'], 'add', 'orange')\nprint(f\"Cart: {cart}, Items: {count}\")  # Cart: ['apple', 'banana', 'orange'], Items: 3\n```",
            "difficulty": "medium",
            "starter_code": "def manage_cart(cart, action, item):\n    # Manage shopping cart operations\n    cart_copy = cart.copy()\n    \n    if action == 'add':\n        cart_copy.append(item)\n    elif action == 'remove' and item in cart_copy:\n        cart_copy.remove(item)\n    \n    return cart_copy, len(cart_copy)",
            "solution": "def manage_cart(cart, action, item):\n    cart_copy = cart.copy()\n    \n    if action == 'add':\n        cart_copy.append(item)\n    elif action == 'remove' and item in cart_copy:\n        cart_copy.remove(item)\n    \n    return cart_copy, len(cart_copy)",
            "test_cases": [{"function_name": "manage_cart", "input": [['apple', 'banana'], 'add', 'orange'], "expected": (['apple', 'banana', 'orange'], 3)}],
            "hints": ["Make a copy to avoid modifying original", "Use append() to add items", "Use remove() to delete items", "Return both cart and count"],
            "xp_reward": 45
        },
        {
            "title": "Grade Sorter",
            "description": "**Grade Sorter**\n**Medium - List Sorting**\n\n**What You're Building:**\nCreate a grade management system for teachers.\n\n**Your Task:**\n- Sort student grades in descending order\n- Find the median grade (middle value)\n- Count grades above class average\n- Return sorted list, median, and above-average count\n\n**Skills Practiced:** List Sorting • Statistical Analysis • Data Processing\n\n**Example:**\n```python\nsorted_grades, median, above_avg = analyze_grades([85, 92, 78, 96, 88])\nprint(f\"Sorted: {sorted_grades}, Median: {median}, Above avg: {above_avg}\")  # Sorted: [96, 92, 88, 85, 78], Median: 88, Above avg: 3\n```",
            "difficulty": "medium",
            "starter_code": "def analyze_grades(grades):\n    # Analyze and sort grades\n    sorted_grades = sorted(grades, reverse=True)\n    \n    # Find median\n    n = len(grades)\n    if n % 2 == 1:\n        median = sorted(grades)[n//2]\n    else:\n        mid1 = sorted(grades)[n//2 - 1]\n        mid2 = sorted(grades)[n//2]\n        median = (mid1 + mid2) / 2\n    \n    # Count above average\n    average = sum(grades) / len(grades)\n    above_average = sum(1 for grade in grades if grade > average)\n    \n    return sorted_grades, median, above_average",
            "solution": "def analyze_grades(grades):\n    sorted_grades = sorted(grades, reverse=True)\n    \n    n = len(grades)\n    if n % 2 == 1:\n        median = sorted(grades)[n//2]\n    else:\n        mid1 = sorted(grades)[n//2 - 1]\n        mid2 = sorted(grades)[n//2]\n        median = (mid1 + mid2) / 2\n    \n    average = sum(grades) / len(grades)\n    above_average = sum(1 for grade in grades if grade > average)\n    \n    return sorted_grades, median, above_average",
            "test_cases": [{"function_name": "analyze_grades", "input": [[85, 92, 78, 96, 88]], "expected": ([96, 92, 88, 85, 78], 88, 3)}],
            "hints": ["Use sorted() with reverse=True", "Handle odd/even length for median", "Calculate average then count above it", "Return all three values"],
            "xp_reward": 55
        },
        {
            "title": "Playlist Manager",
            "description": "**Playlist Manager**\n**Hard - Complex List Operations**\n\n**What You're Building:**\nCreate a music playlist management system for a streaming app.\n\n**Your Task:**\n- Merge two playlists without duplicates\n- Sort combined playlist alphabetically\n- Find songs that appear in both original playlists\n- Return merged playlist and common songs\n\n**Skills Practiced:** Set Operations • List Merging • Duplicate Handling\n\n**Example:**\n```python\nmerged, common = merge_playlists(['Song A', 'Song B'], ['Song B', 'Song C'])\nprint(f\"Merged: {merged}, Common: {common}\")  # Merged: ['Song A', 'Song B', 'Song C'], Common: ['Song B']\n```",
            "difficulty": "hard",
            "starter_code": "def merge_playlists(playlist1, playlist2):\n    # Merge playlists and find common songs\n    # Find common songs\n    common_songs = []\n    for song in playlist1:\n        if song in playlist2 and song not in common_songs:\n            common_songs.append(song)\n    \n    # Merge without duplicates\n    merged = []\n    for song in playlist1 + playlist2:\n        if song not in merged:\n            merged.append(song)\n    \n    # Sort alphabetically\n    merged.sort()\n    \n    return merged, common_songs",
            "solution": "def merge_playlists(playlist1, playlist2):\n    common_songs = []\n    for song in playlist1:\n        if song in playlist2 and song not in common_songs:\n            common_songs.append(song)\n    \n    merged = []\n    for song in playlist1 + playlist2:\n        if song not in merged:\n            merged.append(song)\n    \n    merged.sort()\n    \n    return merged, common_songs",
            "test_cases": [{"function_name": "merge_playlists", "input": [['Song A', 'Song B'], ['Song B', 'Song C']], "expected": (['Song A', 'Song B', 'Song C'], ['Song B'])}],
            "hints": ["Find common songs by checking membership", "Remove duplicates when merging", "Use sort() to alphabetize", "Return both merged list and common songs"],
            "xp_reward": 60
        }
    ]
    
    # Add lists problems
    for i, problem_data in enumerate(lists_problems):
        new_problems.append(Problem(
            lesson_id=lists_lesson.id,
            title=problem_data["title"],
            description=problem_data["description"],
            difficulty=problem_data["difficulty"],
            order_index=i + 2,
            starter_code=problem_data["starter_code"],
            solution=problem_data["solution"],
            test_cases=problem_data["test_cases"],
            hints=problem_data["hints"],
            xp_reward=problem_data["xp_reward"]
        ))
    
    # Dictionaries (4 more problems)
    dict_problems = [
        {
            "title": "Employee Database",
            "description": "**Employee Database**\n**Medium - Dictionary Management**\n\n**What You're Building:**\nCreate an employee information system for HR department.\n\n**Your Task:**\n- Store employee data in dictionary format\n- Add new employee records\n- Update existing employee information\n- Return updated database\n\n**Skills Practiced:** Dictionary Creation • Data Updates • Record Management\n\n**Example:**\n```python\ndb = update_employee({'john': {'age': 30}}, 'john', 'salary', 50000)\nprint(db)  # {'john': {'age': 30, 'salary': 50000}}\n```",
            "difficulty": "medium",
            "starter_code": "def update_employee(database, employee_id, field, value):\n    # Update employee database\n    if employee_id not in database:\n        database[employee_id] = {}\n    \n    database[employee_id][field] = value\n    return database",
            "solution": "def update_employee(database, employee_id, field, value):\n    if employee_id not in database:\n        database[employee_id] = {}\n    \n    database[employee_id][field] = value\n    return database",
            "test_cases": [{"function_name": "update_employee", "input": [{'john': {'age': 30}}, 'john', 'salary', 50000], "expected": {'john': {'age': 30, 'salary': 50000}}}],
            "hints": ["Check if employee exists first", "Create new record if needed", "Update the specific field", "Return the modified database"],
            "xp_reward": 45
        },
        {
            "title": "Product Inventory",
            "description": "**Product Inventory**\n**Medium - Inventory Tracking**\n\n**What You're Building:**\nCreate an inventory management system for a retail store.\n\n**Your Task:**\n- Track product quantities in dictionary\n- Update stock levels (add/remove items)\n- Calculate total inventory value\n- Return updated inventory and total value\n\n**Skills Practiced:** Dictionary Operations • Stock Management • Value Calculations\n\n**Example:**\n```python\ninventory, total = manage_inventory({'apple': 10}, {'apple': 3}, {'apple': 2.50})\nprint(f\"Stock: {inventory}, Value: ${total:.2f}\")  # Stock: {'apple': 13}, Value: $32.50\n```",
            "difficulty": "medium",
            "starter_code": "def manage_inventory(current_stock, stock_change, prices):\n    # Manage inventory levels\n    updated_stock = current_stock.copy()\n    \n    for item, change in stock_change.items():\n        if item in updated_stock:\n            updated_stock[item] += change\n        else:\n            updated_stock[item] = change\n    \n    # Calculate total value\n    total_value = 0\n    for item, quantity in updated_stock.items():\n        if item in prices:\n            total_value += quantity * prices[item]\n    \n    return updated_stock, round(total_value, 2)",
            "solution": "def manage_inventory(current_stock, stock_change, prices):\n    updated_stock = current_stock.copy()\n    \n    for item, change in stock_change.items():\n        if item in updated_stock:\n            updated_stock[item] += change\n        else:\n            updated_stock[item] = change\n    \n    total_value = 0\n    for item, quantity in updated_stock.items():\n        if item in prices:\n            total_value += quantity * prices[item]\n    \n    return updated_stock, round(total_value, 2)",
            "test_cases": [{"function_name": "manage_inventory", "input": [{'apple': 10}, {'apple': 3}, {'apple': 2.50}], "expected": ({'apple': 13}, 32.5)}],
            "hints": ["Copy dictionary to avoid modifying original", "Add stock changes to current levels", "Calculate value as quantity × price", "Return both stock and total value"],
            "xp_reward": 50
        },
        {
            "title": "Survey Results Analyzer",
            "description": "**Survey Results Analyzer**\n**Hard - Data Analysis**\n\n**What You're Building:**\nCreate a survey analysis tool for market research.\n\n**Your Task:**\n- Count response frequencies for each question\n- Calculate percentage for each response option\n- Find most popular response per question\n- Return analysis summary dictionary\n\n**Skills Practiced:** Data Aggregation • Statistical Analysis • Percentage Calculations\n\n**Example:**\n```python\nanalysis = analyze_survey({'Q1': ['A', 'B', 'A'], 'Q2': ['Yes', 'No', 'Yes']})\nprint(analysis['Q1'])  # {'A': 66.7, 'B': 33.3, 'most_popular': 'A'}\n```",
            "difficulty": "hard",
            "starter_code": "def analyze_survey(survey_data):\n    # Analyze survey responses\n    analysis = {}\n    \n    for question, responses in survey_data.items():\n        # Count each response\n        counts = {}\n        for response in responses:\n            counts[response] = counts.get(response, 0) + 1\n        \n        # Calculate percentages\n        total = len(responses)\n        percentages = {}\n        for response, count in counts.items():\n            percentages[response] = round(count / total * 100, 1)\n        \n        # Find most popular\n        most_popular = max(counts, key=counts.get)\n        percentages['most_popular'] = most_popular\n        \n        analysis[question] = percentages\n    \n    return analysis",
            "solution": "def analyze_survey(survey_data):\n    analysis = {}\n    \n    for question, responses in survey_data.items():\n        counts = {}\n        for response in responses:\n            counts[response] = counts.get(response, 0) + 1\n        \n        total = len(responses)\n        percentages = {}\n        for response, count in counts.items():\n            percentages[response] = round(count / total * 100, 1)\n        \n        most_popular = max(counts, key=counts.get)\n        percentages['most_popular'] = most_popular\n        \n        analysis[question] = percentages\n    \n    return analysis",
            "test_cases": [{"function_name": "analyze_survey", "input": [{'Q1': ['A', 'B', 'A'], 'Q2': ['Yes', 'No', 'Yes']}], "expected": {'Q1': {'A': 66.7, 'B': 33.3, 'most_popular': 'A'}, 'Q2': {'Yes': 66.7, 'No': 33.3, 'most_popular': 'Yes'}}}],
            "hints": ["Count responses using dictionary", "Calculate percentages as count/total×100", "Use max() with key parameter", "Store analysis for each question"],
            "xp_reward": 65
        },
        {
            "title": "Configuration Manager",
            "description": "**Configuration Manager**\n**Hard - Nested Dictionaries**\n\n**What You're Building:**\nCreate a configuration management system for application settings.\n\n**Your Task:**\n- Merge default and user configuration dictionaries\n- Handle nested dictionary structures\n- User settings override defaults\n- Return complete merged configuration\n\n**Skills Practiced:** Nested Dictionaries • Data Merging • Configuration Management\n\n**Example:**\n```python\nconfig = merge_config({'db': {'host': 'localhost'}}, {'db': {'port': 5432}})\nprint(config)  # {'db': {'host': 'localhost', 'port': 5432}}\n```",
            "difficulty": "hard",
            "starter_code": "def merge_config(defaults, user_config):\n    # Merge configuration dictionaries\n    result = defaults.copy()\n    \n    for key, value in user_config.items():\n        if key in result and isinstance(result[key], dict) and isinstance(value, dict):\n            # Recursively merge nested dictionaries\n            result[key] = merge_config(result[key], value)\n        else:\n            # Override or add new setting\n            result[key] = value\n    \n    return result",
            "solution": "def merge_config(defaults, user_config):\n    result = defaults.copy()\n    \n    for key, value in user_config.items():\n        if key in result and isinstance(result[key], dict) and isinstance(value, dict):\n            result[key] = merge_config(result[key], value)\n        else:\n            result[key] = value\n    \n    return result",
            "test_cases": [{"function_name": "merge_config", "input": [{'db': {'host': 'localhost'}}, {'db': {'port': 5432}}], "expected": {'db': {'host': 'localhost', 'port': 5432}}}],
            "hints": ["Use recursive approach for nested dicts", "Check if both values are dictionaries", "Copy defaults to avoid modification", "Override or add new values"],
            "xp_reward": 70
        }
    ]
    
    # Add dictionaries problems
    for i, problem_data in enumerate(dict_problems):
        new_problems.append(Problem(
            lesson_id=dictionaries_lesson.id,
            title=problem_data["title"],
            description=problem_data["description"],
            difficulty=problem_data["difficulty"],
            order_index=i + 2,
            starter_code=problem_data["starter_code"],
            solution=problem_data["solution"],
            test_cases=problem_data["test_cases"],
            hints=problem_data["hints"],
            xp_reward=problem_data["xp_reward"]
        ))
    
    # String Manipulation (4 more problems)
    string_problems = [
        {
            "title": "Email Validator",
            "description": "**Email Validator**\n**Easy - String Validation**\n\n**What You're Building:**\nCreate an email validation system for user registration.\n\n**Your Task:**\n- Check if email contains exactly one '@' symbol\n- Check if email has text before and after '@'\n- Check if domain part contains a dot\n- Return True if valid, False otherwise\n\n**Skills Practiced:** String Methods • Validation Logic • Boolean Returns\n\n**Example:**\n```python\nresult = validate_email(\"user@domain.com\")\nprint(result)  # True\n```",
            "difficulty": "easy",
            "starter_code": "def validate_email(email):\n    # Validate email format\n    if email.count('@') != 1:\n        return False\n    \n    parts = email.split('@')\n    username = parts[0]\n    domain = parts[1]\n    \n    # Check if username and domain are not empty\n    # Check if domain contains a dot\n    if len(username) == 0 or len(domain) == 0:\n        return False\n    \n    if '.' not in domain:\n        return False\n    \n    return True",
            "solution": "def validate_email(email):\n    if email.count('@') != 1:\n        return False\n    \n    parts = email.split('@')\n    username = parts[0]\n    domain = parts[1]\n    \n    if len(username) == 0 or len(domain) == 0:\n        return False\n    \n    if '.' not in domain:\n        return False\n    \n    return True",
            "test_cases": [{"function_name": "validate_email", "input": ["user@domain.com"], "expected": True}, {"function_name": "validate_email", "input": ["invalid.email"], "expected": False}],
            "hints": ["Use count() to check for exactly one '@'", "Use split('@') to separate username and domain", "Check if both parts have length > 0", "Use 'in' operator to check for dot in domain"],
            "xp_reward": 30
        },
        {
            "title": "Password Strength Checker",
            "description": "**Password Strength Checker**\n**Medium - String Analysis**\n\n**What You're Building:**\nCreate a password strength analyzer for a security system.\n\n**Your Task:**\n- Check if password has at least 8 characters\n- Check if password contains uppercase letter\n- Check if password contains lowercase letter\n- Check if password contains a digit\n- Return strength score (0-4)\n\n**Skills Practiced:** String Methods • Character Analysis • Conditionals\n\n**Example:**\n```python\nscore = check_password_strength(\"MyPass123\")\nprint(f\"Strength: {score}/4\")  # Strength: 4/4\n```",
            "difficulty": "medium",
            "starter_code": "def check_password_strength(password):\n    score = 0\n    \n    # Check length (at least 8 characters)\n    if len(password) >= 8:\n        score += 1\n    \n    # Check for uppercase letter\n    if any(c.isupper() for c in password):\n        score += 1\n        \n    # Check for lowercase letter\n    if any(c.islower() for c in password):\n        score += 1\n        \n    # Check for digit\n    if any(c.isdigit() for c in password):\n        score += 1\n    \n    return score",
            "solution": "def check_password_strength(password):\n    score = 0\n    \n    if len(password) >= 8:\n        score += 1\n    \n    if any(c.isupper() for c in password):\n        score += 1\n        \n    if any(c.islower() for c in password):\n        score += 1\n        \n    if any(c.isdigit() for c in password):\n        score += 1\n    \n    return score",
            "test_cases": [{"function_name": "check_password_strength", "input": ["MyPass123"], "expected": 4}, {"function_name": "check_password_strength", "input": ["weak"], "expected": 1}],
            "hints": ["Use len() to check password length", "Use any() with isupper() to check for uppercase", "Use any() with islower() to check for lowercase", "Use any() with isdigit() to check for numbers"],
            "xp_reward": 45
        },
        {
            "title": "Text Statistics",
            "description": "**Text Statistics**\n**Medium - String Analysis**\n\n**What You're Building:**\nCreate a text analysis tool for content writers.\n\n**Your Task:**\n- Count total characters (including spaces)\n- Count words (split by spaces)\n- Count sentences (split by periods)\n- Calculate average word length\n- Return statistics as dictionary\n\n**Skills Practiced:** String Methods • Dictionary Creation • Mathematical Calculations\n\n**Example:**\n```python\nstats = analyze_text(\"Hello world. This is fun.\")\nprint(stats[\"words\"])  # 5\n```",
            "difficulty": "medium",
            "starter_code": "def analyze_text(text):\n    # Calculate text statistics\n    char_count = len(text)\n    words = text.split()\n    sentences = [s.strip() for s in text.split('.') if s.strip()]\n    \n    word_count = len(words)\n    sentence_count = len(sentences)\n    avg_word_length = sum(len(word) for word in words) / word_count if word_count > 0 else 0\n    \n    return {\n        \"characters\": char_count,\n        \"words\": word_count,\n        \"sentences\": sentence_count,\n        \"avg_word_length\": round(avg_word_length, 1)\n    }",
            "solution": "def analyze_text(text):\n    char_count = len(text)\n    words = text.split()\n    sentences = [s.strip() for s in text.split('.') if s.strip()]\n    \n    word_count = len(words)\n    sentence_count = len(sentences)\n    avg_word_length = sum(len(word) for word in words) / word_count if word_count > 0 else 0\n    \n    return {\n        \"characters\": char_count,\n        \"words\": word_count,\n        \"sentences\": sentence_count,\n        \"avg_word_length\": round(avg_word_length, 1)\n    }",
            "test_cases": [{"function_name": "analyze_text", "input": ["Hello world. This is fun."], "expected": {"characters": 24, "words": 5, "sentences": 2, "avg_word_length": 3.8}}],
            "hints": ["Use len() to count characters", "Use split() to get words", "Split by '.' and filter empty strings for sentences", "Use sum() and len() to calculate average word length"],
            "xp_reward": 55
        },
        {
            "title": "URL Builder",
            "description": "**URL Builder**\n**Hard - String Construction**\n\n**What You're Building:**\nCreate a URL building system for a web application.\n\n**Your Task:**\n- Combine base URL with endpoint\n- Add query parameters from dictionary\n- URL-encode spaces as '%20'\n- Return complete URL string\n\n**Skills Practiced:** String Concatenation • Dictionary Iteration • URL Encoding\n\n**Example:**\n```python\nurl = build_url(\"https://api.example.com\", \"/search\", {\"q\": \"python tutorial\", \"page\": \"1\"})\nprint(url)  # https://api.example.com/search?q=python%20tutorial&page=1\n```",
            "difficulty": "hard",
            "starter_code": "def build_url(base_url, endpoint, params):\n    # Build complete URL with query parameters\n    url = base_url + endpoint\n    \n    if params:\n        url += \"?\"\n        param_list = []\n        for key, value in params.items():\n            encoded_value = str(value).replace(\" \", \"%20\")\n            param_list.append(f\"{key}={encoded_value}\")\n        url += \"&\".join(param_list)\n    \n    return url",
            "solution": "def build_url(base_url, endpoint, params):\n    url = base_url + endpoint\n    \n    if params:\n        url += \"?\"\n        param_list = []\n        for key, value in params.items():\n            encoded_value = str(value).replace(\" \", \"%20\")\n            param_list.append(f\"{key}={encoded_value}\")\n        url += \"&\".join(param_list)\n    \n    return url",
            "test_cases": [{"function_name": "build_url", "input": ["https://api.example.com", "/search", {"q": "python tutorial", "page": "1"}], "expected": "https://api.example.com/search?q=python%20tutorial&page=1"}],
            "hints": ["Start with base_url + endpoint", "Add '?' before first parameter", "Use items() to iterate over dictionary", "Join parameters with '&' separator"],
            "xp_reward": 60
        }
    ]
    
    # Add string problems
    for i, problem_data in enumerate(string_problems):
        new_problems.append(Problem(
            lesson_id=strings_lesson.id,
            title=problem_data["title"],
            description=problem_data["description"],
            difficulty=problem_data["difficulty"],
            order_index=i + 2,
            starter_code=problem_data["starter_code"],
            solution=problem_data["solution"],
            test_cases=problem_data["test_cases"],
            hints=problem_data["hints"],
            xp_reward=problem_data["xp_reward"]
        ))
    
    # Add all new problems to database
    for problem in new_problems:
        db.add(problem)
    
    db.commit()
    
    total_added = len(new_problems)
    print(f"Successfully added {total_added} new problems to the database!")
    return total_added

if __name__ == "__main__":
    add_new_problems()