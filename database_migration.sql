-- Python Learning Platform Database Migration Script
-- Run this on your local PostgreSQL database to populate with curriculum data

-- First ensure tables exist (run npm run db:push first)

-- Clean existing data
TRUNCATE TABLE code_submissions, user_progress, achievements, problems, lessons, sections RESTART IDENTITY CASCADE;

-- Insert Sections
INSERT INTO sections (id, title, description, order_index, is_locked) VALUES 
(1, 'Python Foundations', 'Master Python core concepts through practical, project-based learning. Build real applications while learning variables, operators, and strings.', 1, false),
(2, 'Control Flow Mastery', 'Master decision-making and iteration through complex business logic and automation systems.', 2, true),
(3, 'Functions & Modularity', 'Create reusable, well-designed functions and build modular application components.', 3, true),
(4, 'Data Structures & Algorithms', 'Master Python data structures and implement efficient algorithms for real-world applications.', 4, true),
(5, 'File Operations & Data Persistence', 'Handle file I/O, data formats, and build systems that persist and retrieve data effectively.', 5, true),
(6, 'Error Handling & Debugging', 'Build robust applications with proper error management and systematic debugging approaches.', 6, true),
(7, 'Object-Oriented Programming', 'Design and implement sophisticated applications using OOP principles and design patterns.', 7, true),
(8, 'Real-World Applications', 'Build complete applications that integrate with web services, process real data, and automate business tasks.', 8, true);

-- Insert Lessons
INSERT INTO lessons (id, section_id, title, description, order_index, is_locked) VALUES 
(1, 1, 'Variables and Data Types', 'Learn to store and manipulate data using Python variables and fundamental data types.', 1, false),
(2, 1, 'Operations and Expressions', 'Master arithmetic, comparison, and logical operations to build dynamic applications.', 2, true),
(3, 1, 'Strings and Formatting', 'Handle text data professionally with string manipulation and formatting techniques.', 3, true),
(4, 2, 'Conditional Logic', 'Make intelligent decisions in code using if-elif-else statements and boolean logic.', 1, true),
(5, 2, 'Loops and Iteration', 'Automate repetitive tasks with for and while loops for efficient data processing.', 2, true),
(6, 2, 'Complex Logic Patterns', 'Combine conditional statements and loops to solve sophisticated business problems.', 3, true),
(7, 3, 'Function Fundamentals', 'Create reusable code blocks that accept parameters and return values.', 1, true),
(8, 3, 'Advanced Function Concepts', 'Master scope, lambda functions, and advanced parameter handling techniques.', 2, true),
(9, 4, 'Lists and Tuples', 'Organize and manipulate ordered collections of data efficiently.', 1, true),
(10, 4, 'Dictionaries and Sets', 'Master key-value relationships and unique collections for complex data management.', 2, true),
(11, 4, 'Algorithm Implementation', 'Apply algorithmic thinking to solve real-world computational problems.', 3, true),
(12, 5, 'File Input/Output', 'Read from and write to files to create persistent data storage solutions.', 1, true),
(13, 5, 'Data Formats and APIs', 'Work with JSON, CSV, and web APIs to integrate external data sources.', 2, true),
(14, 6, 'Exception Handling', 'Build robust applications that gracefully handle errors and edge cases.', 1, true),
(15, 6, 'Debugging Strategies', 'Develop systematic approaches to identify and fix code issues efficiently.', 2, true),
(16, 7, 'Classes and Objects', 'Design object-oriented solutions using classes, methods, and encapsulation.', 1, true),
(17, 7, 'Inheritance and Polymorphism', 'Create flexible, extensible code architectures using advanced OOP principles.', 2, true),
(18, 8, 'Web Integration', 'Connect your applications to web services and APIs for real-world functionality.', 1, true),
(19, 8, 'Data Processing', 'Build systems that analyze, transform, and visualize large datasets.', 2, true),
(20, 8, 'Automation Projects', 'Create complete automation solutions for business tasks and workflows.', 3, true);

-- Insert Problems (Business-focused curriculum)
INSERT INTO problems (id, lesson_id, title, description, difficulty, order_index, starter_code, solution, test_cases, hints, xp_reward) VALUES 
(1, 1, 'Digital Business Card Creator', 'Build a system that takes personal information and formats it into a professional business card layout suitable for digital platforms like LinkedIn or business networking apps.', 'easy', 1, 
'# Digital Business Card Creator
def create_business_card(name, title, company, email, phone):
    # Your code here
    pass

# Test your function
result = create_business_card("Sarah Johnson", "Software Engineer", "TechCorp Solutions", "sarah.johnson@techcorp.com", "(555) 123-4567")
print(result)', 
'def create_business_card(name, title, company, email, phone):
    border = "=" * 32
    card = border + "\n"
    card += name + "\n"
    card += title + "\n" 
    card += company + "\n"
    card += border + "\n"
    card += f"Email: {email}\n"
    card += f"Phone: {phone}\n"
    card += border
    return card',
'[{"input": {"name": "John Doe", "title": "Manager", "company": "ABC Corp", "email": "john@abc.com", "phone": "123-456-7890"}, "expected_output": "formatted_business_card"}]',
'["Use string concatenation or f-strings to build the card", "Create a border using repeated = characters", "Add newline characters for proper formatting"]',
75),

(2, 1, 'Temperature Conversion Tool', 'Build a comprehensive temperature converter that can handle conversions between all three major temperature scales, useful for weather apps, scientific applications, and international business.', 'easy', 2,
'# Temperature Conversion Tool
def celsius_to_fahrenheit(celsius):
    # Formula: F = (C * 9/5) + 32
    pass

def fahrenheit_to_celsius(fahrenheit):
    # Formula: C = (F - 32) * 5/9
    pass

def celsius_to_kelvin(celsius):
    # Formula: K = C + 273.15
    pass

# Test your functions
celsius_temp = 25.0
print(f"{celsius_temp}°C = {celsius_to_fahrenheit(celsius_temp)}°F")',
'def celsius_to_fahrenheit(celsius):
    return round((celsius * 9/5) + 32, 2)

def fahrenheit_to_celsius(fahrenheit):
    return round((fahrenheit - 32) * 5/9, 2)

def celsius_to_kelvin(celsius):
    return round(celsius + 273.15, 2)',
'[{"input": {"celsius": 0}, "expected_output": 32.0}, {"input": {"celsius": 100}, "expected_output": 212.0}]',
'["Remember the conversion formulas: F = (C * 9/5) + 32", "Use the round() function to limit decimal places", "Test with known values like freezing and boiling points"]',
75),

(3, 1, 'User Registration Processor', 'Build a system that processes user registration data, validates inputs, and formats them appropriately for database storage. This simulates real user onboarding flows in applications like Slack, Notion, or any SaaS platform.', 'easy', 3,
'# User Registration Processor
import datetime

def process_registration(username, email, age, is_premium):
    # Validate username (string, 3-20 characters)
    # Validate email (string, contains @)
    # Validate age (integer, 13-120)
    # Process premium status (boolean)
    # Generate user data dictionary
    pass

# Test your function
result = process_registration("john_doe", "john@example.com", 28, True)
print(result)',
'import datetime

def process_registration(username, email, age, is_premium):
    if not isinstance(username, str) or len(username) < 3 or len(username) > 20:
        return {"error": "Username must be 3-20 characters"}
    
    if not isinstance(email, str) or "@" not in email:
        return {"error": "Invalid email format"}
    
    if not isinstance(age, int) or age < 13 or age > 120:
        return {"error": "Age must be between 13 and 120"}
    
    premium_status = bool(is_premium)
    
    user_data = {
        "user_id": f"user_{len(username)}_{age}",
        "username": username.lower(),
        "email": email.lower(),
        "age": age,
        "is_premium": premium_status,
        "registration_date": datetime.datetime.now().strftime("%Y-%m-%d"),
        "account_type": "Premium" if premium_status else "Free"
    }
    
    return user_data',
'[{"input": {"username": "john", "email": "john@test.com", "age": 25, "is_premium": true}, "expected_output": "valid_user_data"}]',
'["Check data types using isinstance()", "Validate string lengths and content", "Convert boolean values explicitly", "Use datetime for timestamps"]',
85),

(4, 1, 'Product Inventory Tracker', 'Build a system that stores and processes product information for an online store, including inventory levels, pricing, and automatic reorder calculations.', 'easy', 4,
'# Product Inventory Tracker
def process_product_inventory(product_id, product_name, unit_price, quantity_in_stock, minimum_stock, category):
    # Calculate total value of this product in inventory
    # Determine if reorder is needed
    # Calculate how many units to reorder (if needed)
    # Create product summary
    pass

# Test your function
result = process_product_inventory("SKU001", "Wireless Headphones", 99.99, 45, 10, "Electronics")
print(result)',
'def process_product_inventory(product_id, product_name, unit_price, quantity_in_stock, minimum_stock, category):
    total_value = unit_price * quantity_in_stock
    needs_reorder = quantity_in_stock <= minimum_stock
    reorder_quantity = (minimum_stock * 3) - quantity_in_stock if needs_reorder else 0
    
    if quantity_in_stock == 0:
        stock_status = "OUT_OF_STOCK"
    elif needs_reorder:
        stock_status = "LOW_STOCK"
    else:
        stock_status = "IN_STOCK"
    
    product_summary = {
        "product_id": product_id,
        "name": product_name,
        "category": category,
        "unit_price": round(unit_price, 2),
        "quantity_available": quantity_in_stock,
        "total_inventory_value": round(total_value, 2),
        "stock_status": stock_status,
        "needs_reorder": needs_reorder,
        "suggested_reorder_qty": reorder_quantity
    }
    
    return product_summary',
'[{"input": {"product_id": "TEST001", "product_name": "Test Product", "unit_price": 50.0, "quantity_in_stock": 5, "minimum_stock": 10, "category": "Test"}, "expected_output": "low_stock_product"}]',
'["Multiply price by quantity for total value", "Compare current stock to minimum stock for reorder logic", "Use conditional statements to determine stock status", "Organize data in a dictionary for easy access"]',
90),

(5, 2, 'Shopping Cart Calculator', 'Build a comprehensive shopping cart system that calculates totals with multiple factors, similar to what you find on Amazon, eBay, or any major e-commerce platform.', 'medium', 1,
'# Shopping Cart Calculator
def calculate_cart_total(items, discount_percent=0, tax_rate=0, shipping_threshold=0, shipping_cost=9.99):
    # Calculate subtotal
    # Apply discount
    # Calculate tax
    # Determine shipping
    # Calculate final total
    pass

# Test with sample data
items = [
    {"name": "Laptop", "price": 999.99, "quantity": 1},
    {"name": "Mouse", "price": 29.99, "quantity": 2}
]

total = calculate_cart_total(items, discount_percent=10, tax_rate=8.5, shipping_threshold=50)
print(f"Total: ${total:.2f}")',
'def calculate_cart_total(items, discount_percent=0, tax_rate=0, shipping_threshold=0, shipping_cost=9.99):
    subtotal = sum(item["price"] * item["quantity"] for item in items)
    discount_amount = subtotal * (discount_percent / 100)
    discounted_subtotal = subtotal - discount_amount
    tax_amount = discounted_subtotal * (tax_rate / 100)
    shipping = 0 if discounted_subtotal >= shipping_threshold else shipping_cost
    total = discounted_subtotal + tax_amount + shipping
    return round(total, 2)',
'[{"input": {"items": [{"name": "Test", "price": 100, "quantity": 1}], "discount_percent": 10, "tax_rate": 5, "shipping_threshold": 50}, "expected_output": "calculated_total"}]',
'["Use sum() with list comprehension for subtotal", "Calculate percentage as decimal division", "Use conditional logic for free shipping", "Round final result to 2 decimal places"]',
100);

-- Reset sequence counters
SELECT setval('sections_id_seq', (SELECT MAX(id) FROM sections));
SELECT setval('lessons_id_seq', (SELECT MAX(id) FROM lessons));
SELECT setval('problems_id_seq', (SELECT MAX(id) FROM problems));

-- Verify data
SELECT 
    (SELECT COUNT(*) FROM sections) as sections_count,
    (SELECT COUNT(*) FROM lessons) as lessons_count,
    (SELECT COUNT(*) FROM problems) as problems_count;