# Variables and Data Types - Answer Sheet

Quick solutions for testing problems 3-8:

## Problem 3: Personal Information Card
```python
def create_business_card():
    name = "John Smith"
    age = 28
    city = "New York"
    occupation = "Software Engineer"
    return name, age, city, occupation
```

## Problem 4: Temperature Converter Setup
```python
def setup_temperatures(celsius):
    fahrenheit = (celsius * 9/5) + 32
    return celsius, fahrenheit
```

## Problem 5: Shopping Item Details
```python
def create_product(name, price, stock):
    total_value = price * stock
    return name, price, stock, total_value
```

## Problem 6: Student Grade Calculator
```python
def calculate_grade(assignment, exam, project):
    final_grade = (assignment + exam + project) / 3
    status = "Pass" if final_grade >= 70 else "Fail"
    return final_grade, status
```

## Problem 7: Data Type Detective
```python
def process_user_data(age_str, salary_str):
    age_int = int(age_str)
    salary_float = float(salary_str)
    return age_int, salary_float
```

## Problem 8: Bank Account Balance
```python
def track_savings(balance, annual_rate):
    monthly_rate = annual_rate / 12
    monthly_interest = balance * monthly_rate
    return balance, monthly_interest
```

Copy and paste these solutions to quickly test each problem!