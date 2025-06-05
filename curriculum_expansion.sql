-- PythonMastery Curriculum Expansion
-- Add new problems to existing database structure
-- Run after your existing database_migration.sql

-- First, let's add the new enhanced problems to Lesson 1 (Variables and Data Types)

-- Problem 6: Employee Payroll Calculator
INSERT INTO problems (id, lesson_id, title, description, difficulty, order_index, starter_code, solution, test_cases, hints, xp_reward, research_topics, learning_objectives, professional_context, business_category) VALUES 
(6, 1, 'Employee Payroll Calculator', 'Build a payroll calculation system for a startup HR department. Calculate regular pay, overtime pay, and total compensation with proper business rules for accurate employee payment processing.', 'easy', 5,
'# Employee Payroll Calculator
def calculate_payroll(hourly_rate, hours_worked, overtime_threshold=40):
    """
    Calculate employee payroll including overtime for HR system.
    
    Business Context: Startup HR needs automated payroll calculation
    for accurate employee compensation processing.
    
    Research Topics:
    - Variable assignment and arithmetic operations
    - Conditional logic for overtime calculations
    - Function parameters and default values
    - Professional code documentation with docstrings
    
    Args:
        hourly_rate (float): Employee hourly wage
        hours_worked (float): Total hours worked this period
        overtime_threshold (float): Hours before overtime kicks in
    
    Returns:
        dict: Payroll breakdown with regular pay, overtime pay, and total
    """
    # Calculate regular hours (up to threshold)
    # Calculate overtime hours (above threshold)
    # Calculate regular pay
    # Calculate overtime pay (1.5x rate)
    # Calculate total pay
    # Return detailed breakdown
    pass

# Test your function
result = calculate_payroll(25.00, 45, 40)
print(result)',
'def calculate_payroll(hourly_rate, hours_worked, overtime_threshold=40):
    """Calculate employee payroll including overtime for HR system."""
    
    # Calculate regular and overtime hours
    regular_hours = min(hours_worked, overtime_threshold)
    overtime_hours = max(0, hours_worked - overtime_threshold)
    
    # Calculate pay components
    regular_pay = regular_hours * hourly_rate
    overtime_rate = hourly_rate * 1.5
    overtime_pay = overtime_hours * overtime_rate
    total_pay = regular_pay + overtime_pay
    
    # Return detailed breakdown
    payroll_data = {
        "employee_hours": {
            "regular_hours": regular_hours,
            "overtime_hours": overtime_hours,
            "total_hours": hours_worked
        },
        "pay_breakdown": {
            "hourly_rate": hourly_rate,
            "overtime_rate": overtime_rate,
            "regular_pay": round(regular_pay, 2),
            "overtime_pay": round(overtime_pay, 2),
            "total_pay": round(total_pay, 2)
        },
        "pay_period_summary": f"Total compensation: ${round(total_pay, 2)} for {hours_worked} hours"
    }
    
    return payroll_data',
'[
    {
        "input": {"hourly_rate": 20.0, "hours_worked": 40, "overtime_threshold": 40}, 
        "expected_output": {"total_pay": 800.0, "overtime_hours": 0}
    },
    {
        "input": {"hourly_rate": 25.0, "hours_worked": 45, "overtime_threshold": 40}, 
        "expected_output": {"total_pay": 1187.5, "overtime_hours": 5}
    },
    {
        "input": {"hourly_rate": 15.0, "hours_worked": 35, "overtime_threshold": 40}, 
        "expected_output": {"total_pay": 525.0, "overtime_hours": 0}
    }
]',
'["Calculate regular hours as minimum of hours_worked and threshold", "Overtime hours = hours above threshold (use max to avoid negative)", "Overtime rate = regular rate × 1.5", "Use round() to format currency to 2 decimal places", "Return structured data in dictionary format"]',
100,
'["Variable assignment and arithmetic operations", "Conditional logic for overtime calculations", "Function parameters and default values", "Professional code documentation with docstrings", "Financial calculations and precision"]',
'["Master payroll calculation algorithms", "Implement labor law compliance in code", "Build HR system components", "Handle financial precision in calculations"]',
'Essential for any company with employees. Used by ADP, Workday, BambooHR, and every payroll system for accurate compensation calculation.',
'hr-payroll'),

-- Problem 7: Customer Subscription Tracker  
(7, 1, 'Customer Subscription Tracker', 'Build a SaaS subscription tracking system that monitors customer plans, payment status, and calculates key metrics for product management dashboards and revenue analysis.', 'easy', 6,
'# Customer Subscription Tracker
import datetime

def track_subscription_status(customer_id, signup_date, plan_type, monthly_fee, payment_status, last_login_days_ago):
    """
    Track SaaS subscription metrics for product dashboard.
    
    Business Context: Product manager needs real-time subscription
    analytics for growth and churn analysis.
    
    Research Topics:
    - DateTime module for date calculations
    - String comparison and validation
    - Boolean logic for status determination
    - Dictionary creation for structured data
    - Conditional logic for business rules
    
    Args:
        customer_id (str): Unique customer identifier
        signup_date (str): Date customer signed up (YYYY-MM-DD)
        plan_type (str): Subscription plan (Basic, Pro, Enterprise)
        monthly_fee (float): Monthly subscription cost
        payment_status (str): Current payment status (paid, overdue, failed)
        last_login_days_ago (int): Days since last login
    
    Returns:
        dict: Complete subscription analysis with metrics and status
    """
    # Calculate subscription age in days
    # Determine customer engagement level
    # Calculate annual revenue value
    # Assess churn risk
    # Generate subscription summary
    pass

# Test your function
result = track_subscription_status("CUST001", "2024-01-15", "Pro", 49.99, "paid", 3)
print(result)',
'import datetime

def track_subscription_status(customer_id, signup_date, plan_type, monthly_fee, payment_status, last_login_days_ago):
    """Track SaaS subscription metrics for product dashboard."""
    
    # Parse signup date and calculate subscription age
    signup = datetime.datetime.strptime(signup_date, "%Y-%m-%d")
    today = datetime.datetime.now()
    subscription_age_days = (today - signup).days
    
    # Calculate revenue metrics
    annual_revenue_value = monthly_fee * 12
    
    # Determine engagement level
    if last_login_days_ago <= 7:
        engagement_level = "Active"
    elif last_login_days_ago <= 30:
        engagement_level = "Moderate"
    else:
        engagement_level = "At Risk"
    
    # Assess churn risk based on payment and engagement
    churn_risk_factors = 0
    if payment_status != "paid":
        churn_risk_factors += 2
    if last_login_days_ago > 30:
        churn_risk_factors += 2
    if last_login_days_ago > 7:
        churn_risk_factors += 1
        
    if churn_risk_factors >= 3:
        churn_risk = "High"
    elif churn_risk_factors >= 1:
        churn_risk = "Medium" 
    else:
        churn_risk = "Low"
    
    # Generate comprehensive subscription analysis
    subscription_data = {
        "customer_info": {
            "customer_id": customer_id,
            "plan_type": plan_type,
            "subscription_age_days": subscription_age_days,
            "monthly_fee": monthly_fee
        },
        "engagement_metrics": {
            "last_login_days_ago": last_login_days_ago,
            "engagement_level": engagement_level,
            "payment_status": payment_status
        },
        "business_metrics": {
            "annual_revenue_value": round(annual_revenue_value, 2),
            "churn_risk": churn_risk,
            "customer_lifetime_estimate": f"${round(annual_revenue_value * 2.5, 2)} (30 months avg)"
        },
        "action_required": churn_risk != "Low"
    }
    
    return subscription_data',
'[
    {
        "input": {"customer_id": "TEST001", "signup_date": "2024-01-01", "plan_type": "Basic", "monthly_fee": 29.99, "payment_status": "paid", "last_login_days_ago": 2}, 
        "expected_output": {"engagement_level": "Active", "churn_risk": "Low"}
    },
    {
        "input": {"customer_id": "TEST002", "signup_date": "2023-06-15", "plan_type": "Pro", "monthly_fee": 49.99, "payment_status": "overdue", "last_login_days_ago": 45}, 
        "expected_output": {"engagement_level": "At Risk", "churn_risk": "High"}
    },
    {
        "input": {"customer_id": "TEST003", "signup_date": "2024-03-01", "plan_type": "Enterprise", "monthly_fee": 99.99, "payment_status": "paid", "last_login_days_ago": 15}, 
        "expected_output": {"engagement_level": "Moderate", "churn_risk": "Medium"}
    }
]',
'["Use datetime.strptime() to parse date strings", "Calculate date differences with (date1 - date2).days", "Use conditional statements to categorize engagement levels", "Multiply monthly fee by 12 for annual value", "Build complex logic by combining multiple conditions"]',
125,
'["DateTime module for date calculations", "String comparison and validation", "Boolean logic for status determination", "Dictionary creation for structured data", "Conditional logic for business rules"]',
'["Master SaaS metrics calculation", "Build customer analytics systems", "Implement churn risk assessment", "Handle subscription lifecycle management"]',
'Core functionality for SaaS platforms like Stripe, Recurly, ChargeBee, and subscription businesses for customer success and revenue tracking.',
'saas-analytics'),

-- Problem 8: Product Inventory Validator
(8, 1, 'Product Inventory Validator', 'Build an e-commerce inventory validation system that ensures accurate stock levels, prevents overselling, and provides real-time inventory status for online stores and marketplaces.', 'easy', 7,
'# Product Inventory Validator  
def validate_inventory_data(product_id, product_name, stock_quantity, reserved_quantity, minimum_stock_level, max_order_quantity):
    """
    Validate e-commerce inventory for accurate stock management.
    
    Business Context: E-commerce platform prevents overselling
    through real-time inventory validation and stock alerts.
    
    Research Topics:
    - Type checking with isinstance()
    - Range validation with comparison operators
    - Mathematical calculations for available stock
    - Error handling and validation messages
    - Business rule implementation
    
    Args:
        product_id (str): Unique product identifier
        product_name (str): Product display name
        stock_quantity (int): Total units in warehouse
        reserved_quantity (int): Units reserved for pending orders
        minimum_stock_level (int): Reorder threshold
        max_order_quantity (int): Maximum units per order
    
    Returns:
        dict: Inventory validation results with availability and alerts
    """
    # Validate input data types and ranges
    # Calculate available stock (total - reserved)
    # Determine stock status and reorder needs
    # Check order quantity limits
    # Generate inventory report
    pass

# Test your function
result = validate_inventory_data("SKU123", "Wireless Headphones", 150, 25, 20, 5)
print(result)',
'def validate_inventory_data(product_id, product_name, stock_quantity, reserved_quantity, minimum_stock_level, max_order_quantity):
    """Validate e-commerce inventory for accurate stock management."""
    
    # Input validation
    validation_errors = []
    
    if not isinstance(product_id, str) or len(product_id) < 3:
        validation_errors.append("Product ID must be a string with at least 3 characters")
    
    if not isinstance(product_name, str) or len(product_name) < 1:
        validation_errors.append("Product name is required")
        
    if not isinstance(stock_quantity, int) or stock_quantity < 0:
        validation_errors.append("Stock quantity must be a non-negative integer")
        
    if not isinstance(reserved_quantity, int) or reserved_quantity < 0:
        validation_errors.append("Reserved quantity must be a non-negative integer")
    
    if validation_errors:
        return {
            "status": "validation_failed",
            "errors": validation_errors
        }
    
    # Calculate availability
    available_stock = stock_quantity - reserved_quantity
    
    # Determine stock status
    if available_stock <= 0:
        stock_status = "OUT_OF_STOCK"
        can_sell = False
    elif available_stock <= minimum_stock_level:
        stock_status = "LOW_STOCK"
        can_sell = True
    else:
        stock_status = "IN_STOCK"
        can_sell = True
    
    # Check reorder requirements
    needs_reorder = available_stock <= minimum_stock_level
    suggested_reorder_quantity = max(0, (minimum_stock_level * 3) - stock_quantity) if needs_reorder else 0
    
    # Generate inventory report
    inventory_report = {
        "product_info": {
            "product_id": product_id,
            "product_name": product_name
        },
        "stock_analysis": {
            "total_stock": stock_quantity,
            "reserved_stock": reserved_quantity,
            "available_stock": available_stock,
            "stock_status": stock_status
        },
        "business_rules": {
            "can_sell": can_sell,
            "max_order_quantity": min(max_order_quantity, available_stock) if can_sell else 0,
            "needs_reorder": needs_reorder,
            "suggested_reorder_qty": suggested_reorder_quantity
        },
        "alerts": {
            "low_stock_alert": stock_status == "LOW_STOCK",
            "out_of_stock_alert": stock_status == "OUT_OF_STOCK",
            "reorder_alert": needs_reorder
        }
    }
    
    return inventory_report',
'[
    {
        "input": {"product_id": "TEST001", "product_name": "Test Product", "stock_quantity": 100, "reserved_quantity": 10, "minimum_stock_level": 20, "max_order_quantity": 5}, 
        "expected_output": {"available_stock": 90, "stock_status": "IN_STOCK", "can_sell": true}
    },
    {
        "input": {"product_id": "TEST002", "product_name": "Low Stock Item", "stock_quantity": 15, "reserved_quantity": 5, "minimum_stock_level": 20, "max_order_quantity": 3}, 
        "expected_output": {"available_stock": 10, "stock_status": "LOW_STOCK", "needs_reorder": true}
    },
    {
        "input": {"product_id": "TEST003", "product_name": "Sold Out", "stock_quantity": 5, "reserved_quantity": 5, "minimum_stock_level": 10, "max_order_quantity": 2}, 
        "expected_output": {"available_stock": 0, "stock_status": "OUT_OF_STOCK", "can_sell": false}
    }
]',
'["Use isinstance() to check data types before processing", "Calculate available stock by subtracting reserved from total", "Use comparison operators to determine stock status levels", "Implement business rules with conditional logic", "Structure complex data in nested dictionaries for clarity"]',
110,
'["Type checking with isinstance()", "Range validation with comparison operators", "Mathematical calculations for available stock", "Error handling and validation messages", "Business rule implementation"]',
'["Build inventory management systems", "Implement data validation patterns", "Handle business logic validation", "Prevent overselling in e-commerce"]',
'Critical for e-commerce platforms like Amazon, Shopify, WooCommerce, and any online retailer to prevent overselling and manage stock levels.',
'e-commerce-inventory');

-- Update the sequence counter to continue from the new highest ID
SELECT setval('problems_id_seq', (SELECT MAX(id) FROM problems));

-- Verify the new problems were added successfully
SELECT 
    p.id,
    p.title,
    p.difficulty,
    p.xp_reward,
    l.title as lesson_title
FROM problems p
JOIN lessons l ON p.lesson_id = l.id 
WHERE p.id >= 6
ORDER BY p.id;