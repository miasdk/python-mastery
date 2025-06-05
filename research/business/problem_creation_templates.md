# Problem Creation Templates & Examples
*Ready-to-implement templates for rapid curriculum expansion*

## 🎯 Problem Template System

### Template Categories

Each category follows a proven structure that maintains quality while enabling rapid creation:

**Financial Calculators** → Variable manipulation + math operations
**Data Processors** → String operations + formatting
**Business Validators** → Conditional logic + input validation
**Workflow Systems** → Loop structures + decision trees

## 💰 Financial Calculator Template

### Example: ROI Calculator
```python
def calculate_roi(initial_investment, final_value, investment_period):
    """
    Calculate Return on Investment (ROI) for business investments.
    
    Args:
        initial_investment (float): Initial amount invested
        final_value (float): Final value of investment
        investment_period (int): Investment period in years
    
    Returns:
        dict: ROI percentage and annualized return
    """
    # Your code here
    pass
```

**Business Context**: "You're building a financial dashboard for a startup accelerator. Create a function that calculates ROI for investment portfolios to help VCs make data-driven decisions."

**Test Cases**:
```python
# Test 1: Basic ROI calculation
assert calculate_roi(10000, 15000, 2) == {'roi_percentage': 50.0, 'annualized_return': 22.47}

# Test 2: Loss scenario
assert calculate_roi(20000, 18000, 1) == {'roi_percentage': -10.0, 'annualized_return': -10.0}

# Test 3: High growth scenario
assert calculate_roi(5000, 50000, 5) == {'roi_percentage': 900.0, 'annualized_return': 58.49}
```

**Variations for Section 1**:
- Loan Payment Calculator
- Break-even Analysis Tool
- Tax Calculator with Brackets
- Currency Converter with Rates
- Compound Interest Calculator
- Profit Margin Calculator
- Invoice Total Calculator

## 📊 Data Processor Template

### Example: Customer Data Formatter
```python
def format_customer_data(raw_data):
    """
    Format customer data for CRM system integration.
    
    Args:
        raw_data (str): Comma-separated customer info
                       Format: "name,email,phone,company"
    
    Returns:
        dict: Formatted customer record
    """
    # Your code here
    pass
```

**Business Context**: "You're integrating customer data from multiple sources into a unified CRM system. Create a function that standardizes customer information from CSV imports."

**Test Cases**:
```python
# Test 1: Standard format
input_data = "John Doe,john@example.com,555-123-4567,Tech Corp"
expected = {
    'name': 'John Doe',
    'email': 'john@example.com',
    'phone': '555-123-4567',
    'company': 'Tech Corp'
}
assert format_customer_data(input_data) == expected

# Test 2: Missing company
input_data = "Jane Smith,jane@example.com,555-987-6543,"
expected = {
    'name': 'Jane Smith',
    'email': 'jane@example.com',
    'phone': '555-987-6543',
    'company': 'N/A'
}
assert format_customer_data(input_data) == expected
```

**Variations for Section 1**:
- Email Validator
- Phone Number Formatter
- Address Standardizer
- Product Catalog Parser
- Configuration File Parser
- CSV Header Generator

## ✅ Business Validator Template

### Example: Password Strength Checker
```python
def check_password_strength(password):
    """
    Validate password strength for enterprise security standards.
    
    Args:
        password (str): Password to validate
    
    Returns:
        dict: Strength score and recommendations
    """
    # Your code here
    pass
```

**Business Context**: "You're implementing security standards for a fintech application. Create a password validator that meets enterprise security requirements and provides user feedback."

**Test Cases**:
```python
# Test 1: Strong password
assert check_password_strength("SecurePass123!") == {
    'strength': 'Strong',
    'score': 4,
    'recommendations': []
}

# Test 2: Weak password
assert check_password_strength("password") == {
    'strength': 'Weak',
    'score': 1,
    'recommendations': ['Add numbers', 'Add special characters', 'Add uppercase letters']
}
```

## 🔄 Decision System Template (Section 2)

### Example: Customer Tier Assignment
```python
def assign_customer_tier(annual_revenue, years_as_customer, support_tickets):
    """
    Assign customer tier based on business metrics for SaaS platform.
    
    Args:
        annual_revenue (float): Customer's annual revenue contribution
        years_as_customer (int): Years as active customer
        support_tickets (int): Number of support tickets in last year
    
    Returns:
        dict: Customer tier and benefits
    """
    # Your code here
    pass
```

**Business Context**: "You're building a customer success platform for a SaaS company. Create a system that automatically assigns customer tiers to optimize support resources and identify upsell opportunities."

**Test Cases**:
```python
# Test 1: Premium tier
assert assign_customer_tier(100000, 3, 2) == {
    'tier': 'Premium',
    'benefits': ['Priority support', 'Dedicated account manager', 'Beta access'],
    'discount': 15
}

# Test 2: Standard tier
assert assign_customer_tier(25000, 1, 5) == {
    'tier': 'Standard',
    'benefits': ['Standard support', 'Community access'],
    'discount': 5
}
```

## 🛠️ Automation Workflow Template (Section 2)

### Example: Order Processing Workflow
```python
def process_order(order_data, inventory_levels):
    """
    Process e-commerce order through validation and fulfillment workflow.
    
    Args:
        order_data (dict): Order details including items and quantities
        inventory_levels (dict): Current inventory levels
    
    Returns:
        dict: Processing status and next actions
    """
    # Your code here
    pass
```

**Business Context**: "You're building an e-commerce automation system. Create a workflow that validates orders, checks inventory, and determines fulfillment actions."

## 📈 Rapid Content Creation System

### 1. Problem Generation Workflow

**Step 1: Choose Template Category**
- Financial Calculator (math-heavy)
- Data Processor (string manipulation)
- Business Validator (conditional logic)
- Workflow System (loops + decisions)

**Step 2: Select Business Context**
- Industry: Fintech, E-commerce, SaaS, Healthcare, etc.
- Role: Developer, Analyst, Manager, etc.
- Use Case: Automation, Analysis, Validation, etc.

**Step 3: Define Technical Requirements**
- Input parameters and types
- Expected output format
- Error handling requirements
- Performance considerations

**Step 4: Create Test Cases**
- Happy path (normal operation)
- Edge cases (boundary conditions)
- Error cases (invalid inputs)
- Business logic validation

### 2. Quality Assurance Checklist

**Business Relevance**
- ✅ Real-world scenario
- ✅ Professional context
- ✅ Industry applicability
- ✅ Career advancement value

**Technical Quality**
- ✅ Clear requirements
- ✅ Appropriate difficulty
- ✅ Comprehensive testing
- ✅ Progressive hints

**User Experience**
- ✅ Engaging narrative
- ✅ Clear instructions
- ✅ Helpful feedback
- ✅ Appropriate XP reward

### 3. Batch Creation Strategy

**Week 1 Focus: Section 1 (Python Foundations)**
- **Day 1**: Create 8 financial calculator problems
- **Day 2**: Create 8 data processor problems  
- **Day 3**: Create 7 business validator problems
- **Day 4**: Quality review and testing
- **Day 5**: User feedback integration

**Week 2 Focus: Section 2 (Control Flow)**
- **Day 1**: Create 9 decision system problems
- **Day 2**: Create 9 automation workflow problems
- **Day 3**: Create 8 business logic problems
- **Day 4**: Integration testing
- **Day 5**: Difficulty calibration

## 🎯 Implementation Priorities

### Immediate Actions (This Week)
1. **Create 5 financial calculator problems** using the ROI template
2. **Test with current users** to validate difficulty and engagement
3. **Refine template system** based on feedback
4. **Prepare batch creation workflow** for next week

### Success Metrics
- **Creation Speed**: 3-4 problems per day
- **Quality Maintenance**: 4.5+ user ratings
- **Completion Rates**: 80%+ for each problem
- **Business Relevance**: Professional applicability

This template system enables rapid creation while maintaining your high-quality standards. Focus on business contexts that resonate with your target audience of career switchers and professional developers.