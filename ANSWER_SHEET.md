# Python Learning Platform - Answer Sheet

## Problem 1: Welcome Message
```python
def welcome_message():
    name = "Alice"
    age = 25
    return name, age
```

## Problem 2: Store Information
```python
def store_info():
    store_name = "Tech Galaxy"
    is_open = True
    employee_count = 12
    return store_name, is_open, employee_count
```

## Problem 3: Personal Information Card
```python
def personal_info():
    name = "John Smith"
    age = 30
    city = "New York"
    profession = "Engineer"
    return name, age, city, profession
```

## Problem 4: Data Type Detective
```python
def convert_user_input(age_str, height_str, is_student_str):
    age = int(age_str)
    height = float(height_str)
    is_student = is_student_str.lower() == "true"
    return age, height, is_student
```

## Problem 5: Product Information
```python
def product_info():
    product_name = "Wireless Headphones"
    price = 89.99
    in_stock = True
    quantity = 15
    return product_name, price, in_stock, quantity
```

## Problem 6: Student Grade Calculator
```python
def calculate_final_grade(midterm, final_exam, homework):
    final_grade = midterm * 0.3 + final_exam * 0.5 + homework * 0.2
    passed = final_grade >= 60
    return final_grade, passed
```

## Problem 7: Temperature Converter Setup
```python
def temperature_data():
    celsius = 25
    fahrenheit = 77
    location = "Miami"
    season = "Summer"
    return celsius, fahrenheit, location, season
```

## Problem 8: Shopping Cart Calculator
```python
def calculate_total(item_price, quantity, tax_rate):
    subtotal = item_price * quantity
    tax_amount = subtotal * tax_rate
    total = subtotal + tax_amount
    return subtotal, tax_amount, total
```

## Problem 9: Bank Account Balance
```python
def account_summary(initial_balance, monthly_deposit, interest_rate, months):
    total_deposits = monthly_deposit * months
    balance_before_interest = initial_balance + total_deposits
    interest_earned = balance_before_interest * interest_rate
    final_balance = balance_before_interest + interest_earned
    return total_deposits, interest_earned, final_balance
```

## Problem 10: Recipe Scaler
```python
def scale_recipe(original_servings, desired_servings, ingredient_amount):
    scale_factor = desired_servings / original_servings
    new_amount = ingredient_amount * scale_factor
    return scale_factor, new_amount
```

## Problem 11: Time Calculator
```python
def convert_minutes(total_minutes):
    hours = total_minutes // 60
    remaining_minutes = total_minutes % 60
    return hours, remaining_minutes
```

## Problem 12: Distance Converter
```python
def convert_distance(miles):
    kilometers = miles * 1.60934
    meters = kilometers * 1000
    return kilometers, meters
```

## Problem 13: Text Processor
```python
def text_info(text):
    length = len(text)
    upper_text = text.upper()
    lower_text = text.lower()
    return length, upper_text, lower_text
```

## Problem 14: Name Formatter
```python
def format_name(first_name, last_name):
    full_name = first_name + " " + last_name
    initials = first_name[0] + last_name[0]
    return full_name, initials
```

## Problem 15: Email Validator
```python
def validate_email(email):
    has_at = "@" in email
    has_dot = "." in email
    is_valid = has_at and has_dot
    return has_at, has_dot, is_valid
```

## Problem 16: Password Strength
```python
def check_password_strength(password):
    length = len(password)
    has_upper = any(c.isupper() for c in password)
    has_number = any(c.isdigit() for c in password)
    return length, has_upper, has_number
```

## Problem 17: URL Builder
```python
def build_url(domain, path, secure):
    protocol = "https" if secure else "http"
    url = protocol + "://" + domain + "/" + path
    return protocol, url
```

## Problem 18: Message Formatter
```python
def format_message(username, message_count):
    greeting = "Hello, " + username + "!"
    notification = "You have " + str(message_count) + " new messages."
    return greeting, notification
```

## Quick Copy-Paste Solutions (Problems 1-6):

**Problem 1:**
```python
def welcome_message():
    name = "Alice"
    age = 25
    return name, age
```

**Problem 2:**
```python
def store_info():
    store_name = "Tech Galaxy"
    is_open = True
    employee_count = 12
    return store_name, is_open, employee_count
```

**Problem 3:**
```python
def personal_info():
    name = "John Smith"
    age = 30
    city = "New York"
    profession = "Engineer"
    return name, age, city, profession
```

**Problem 4:**
```python
def convert_user_input(age_str, height_str, is_student_str):
    age = int(age_str)
    height = float(height_str)
    is_student = is_student_str.lower() == "true"
    return age, height, is_student
```

**Problem 5:**
```python
def product_info():
    product_name = "Wireless Headphones"
    price = 89.99
    in_stock = True
    quantity = 15
    return product_name, price, in_stock, quantity
```

**Problem 6:**
```python
def calculate_final_grade(midterm, final_exam, homework):
    final_grade = midterm * 0.3 + final_exam * 0.5 + homework * 0.2
    passed = final_grade >= 60
    return final_grade, passed
```