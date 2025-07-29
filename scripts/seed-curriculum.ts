import dotenv from 'dotenv';
dotenv.config();

import { db } from '../server/db';
import { sections, lessons, problems } from '../shared/schema';
import { eq } from 'drizzle-orm';

// Sample curriculum data with business-focused problems
const curriculumData = {
  sections: [
    {
      id: 1,
      title: "Python Foundations",
      description: "Master variables, data types, and basic operations through real business scenarios",
      orderIndex: 1,
      isLocked: false
    }
  ],
  lessons: [
    {
      id: 1,
      sectionId: 1,
      title: "Variables & Business Data",
      description: "Learn to store and manipulate business information using Python variables",
      orderIndex: 1,
      isLocked: false
    },
    {
      id: 2,
      sectionId: 1,
      title: "Functions & Business Logic",
      description: "Create reusable business functions for common tasks",
      orderIndex: 2,
      isLocked: false
    }
  ],
  problems: [
    {
      id: 1,
      lessonId: 1,
      title: "Digital Business Card Creator",
      description: `Create a function that generates a professional digital business card. 

**Business Context**: In today's digital world, professionals need virtual business cards for networking events, email signatures, and social media profiles.

**Your Task**: Create a function called \`create_business_card()\` that stores personal information and returns it as a formatted tuple.

**Requirements**:
- Store your name as a string variable
- Store your professional title as a string  
- Store your company name as a string
- Store your email address as a string
- Return all information as a tuple: (name, title, company, email)

**Example Output**: ('John Smith', 'Software Engineer', 'TechCorp', 'john@techcorp.com')`,
      difficulty: "easy",
      orderIndex: 1,
      starterCode: `def create_business_card():
    # Store your professional information
    name = "Your Name"
    title = "Your Title" 
    company = "Your Company"
    email = "your.email@company.com"
    
    # Return the business card information
    return (name, title, company, email)`,
      solution: `def create_business_card():
    name = "Sarah Johnson"
    title = "Product Manager"
    company = "InnovateTech"
    email = "sarah.johnson@innovatetech.com"
    
    return (name, title, company, email)`,
      testCases: [
        {
          input: [],
          expected: ["Sarah Johnson", "Product Manager", "InnovateTech", "sarah.johnson@innovatetech.com"],
          description: "Should return properly formatted business card tuple"
        }
      ],
      hints: [
        "Start by creating four variables: name, title, company, and email",
        "Assign string values to each variable using quotes",
        "Return all variables together in a tuple using parentheses: (var1, var2, var3, var4)"
      ],
      xpReward: 75,
      researchTopics: [
        "Python variables and assignment",
        "String data types",
        "Tuple creation and structure",
        "Function return statements"
      ],
      learningObjectives: [
        "Understand variable assignment in Python",
        "Work with string data types",
        "Create and return tuples",
        "Apply programming to real business scenarios"
      ],
      professionalContext: "Digital business cards are essential for modern networking. This skill applies to contact management systems, CRM databases, and professional profile creation.",
      businessCategory: "professional-networking"
    },
    {
      id: 2,
      lessonId: 1,
      title: "E-commerce Product Validator",
      description: `Create a function that validates product information for an online store.

**Business Context**: E-commerce platforms need to validate product data before listing items to ensure quality and prevent errors that could harm sales.

**Your Task**: Create a function called \`validate_product()\` that checks if product information meets business requirements.

**Requirements**:
- Product name must be a non-empty string
- Price must be a positive number (greater than 0)
- Stock quantity must be a non-negative integer (0 or more)
- Category must be one of: "electronics", "clothing", "books", "home"
- Return True if all validations pass, False otherwise

**Example**: validate_product("iPhone 15", 999.99, 50, "electronics") should return True`,
      difficulty: "easy",
      orderIndex: 2,
      starterCode: `def validate_product(name, price, stock, category):
    # Check if product name is valid
    
    # Check if price is valid
    
    # Check if stock is valid
    
    # Check if category is valid
    valid_categories = ["electronics", "clothing", "books", "home"]
    
    # Return True if all checks pass
    return False`,
      solution: `def validate_product(name, price, stock, category):
    # Check if product name is valid
    if not isinstance(name, str) or len(name.strip()) == 0:
        return False
        
    # Check if price is valid
    if not isinstance(price, (int, float)) or price <= 0:
        return False
        
    # Check if stock is valid
    if not isinstance(stock, int) or stock < 0:
        return False
        
    # Check if category is valid
    valid_categories = ["electronics", "clothing", "books", "home"]
    if category not in valid_categories:
        return False
        
    return True`,
      testCases: [
        {
          input: ["iPhone 15", 999.99, 50, "electronics"],
          expected: true,
          description: "Valid product should return True"
        },
        {
          input: ["", 999.99, 50, "electronics"],
          expected: false,
          description: "Empty name should return False"
        },
        {
          input: ["iPhone 15", -100, 50, "electronics"],
          expected: false,
          description: "Negative price should return False"
        },
        {
          input: ["iPhone 15", 999.99, -5, "electronics"],
          expected: false,
          description: "Negative stock should return False"
        }
      ],
      hints: [
        "Use isinstance() to check data types",
        "Check string length with len() after stripping whitespace",
        "Use comparison operators for numeric validations",
        "Use 'in' operator to check if category is in the valid list"
      ],
      xpReward: 100,
      researchTopics: [
        "Python type checking with isinstance()",
        "String validation and strip() method",
        "Boolean logic and conditional statements",
        "List membership testing with 'in'"
      ],
      learningObjectives: [
        "Implement data validation logic",
        "Use conditional statements effectively",
        "Understand type checking in Python",
        "Apply business rules through code"
      ],
      professionalContext: "Data validation is crucial in e-commerce systems to prevent bad data from entering databases and causing customer issues or financial losses.",
      businessCategory: "e-commerce"
    },
    {
      id: 3,
      lessonId: 2,
      title: "Customer Loyalty Calculator",
      description: `Build a function that calculates customer loyalty rewards based on purchase history.

**Business Context**: Retail businesses use loyalty programs to encourage repeat customers and increase customer lifetime value.

**Your Task**: Create a function called \`calculate_loyalty_points()\` that determines points based on purchase amount and customer tier.

**Requirements**:
- Base points: 1 point per $1 spent
- Bronze tier (default): 1x multiplier  
- Silver tier: 1.5x multiplier
- Gold tier: 2x multiplier
- Bonus: +50 points if purchase is $100 or more
- Return total points as an integer

**Example**: calculate_loyalty_points(150.00, "gold") should return 350 points (150 × 2 + 50 bonus)`,
      difficulty: "medium",
      orderIndex: 1,
      starterCode: `def calculate_loyalty_points(purchase_amount, customer_tier="bronze"):
    # Calculate base points (1 point per dollar)
    
    # Apply tier multiplier
    
    # Add bonus for large purchases
    
    # Return total points as integer
    return 0`,
      solution: `def calculate_loyalty_points(purchase_amount, customer_tier="bronze"):
    # Calculate base points (1 point per dollar)
    base_points = purchase_amount
    
    # Apply tier multiplier
    if customer_tier == "bronze":
        multiplier = 1.0
    elif customer_tier == "silver":
        multiplier = 1.5
    elif customer_tier == "gold":
        multiplier = 2.0
    else:
        multiplier = 1.0  # Default to bronze
        
    points = base_points * multiplier
    
    # Add bonus for large purchases
    if purchase_amount >= 100:
        points += 50
        
    return int(points)`,
      testCases: [
        {
          input: [150.00, "gold"],
          expected: 350,
          description: "Gold tier with large purchase: 150*2 + 50 = 350"
        },
        {
          input: [75.50, "silver"],
          expected: 113,
          description: "Silver tier, no bonus: 75.5*1.5 = 113"
        },
        {
          input: [200.00, "bronze"],
          expected: 250,
          description: "Bronze tier with bonus: 200*1 + 50 = 250"
        },
        {
          input: [50.00],
          expected: 50,
          description: "Default bronze tier, no bonus: 50*1 = 50"
        }
      ],
      hints: [
        "Use if/elif/else statements to handle different tiers",
        "Store multiplier values for each tier",
        "Check if purchase amount qualifies for bonus",
        "Use int() to convert final result to integer"
      ],
      xpReward: 125,
      researchTopics: [
        "Python conditional statements (if/elif/else)",
        "Function parameters with default values",
        "Arithmetic operations and multipliers",
        "Type conversion with int()"
      ],
      learningObjectives: [
        "Implement business logic with conditionals",
        "Use default parameter values",
        "Perform mathematical calculations",
        "Handle different customer tiers programmatically"
      ],
      professionalContext: "Loyalty programs are fundamental to customer retention strategies in retail, hospitality, and subscription businesses.",
      businessCategory: "retail"
    },
    {
      id: 4,
      lessonId: 2,
      title: "Meeting Time Zone Scheduler",
      description: `Create a function that schedules international business meetings across time zones.

**Business Context**: Global companies need to schedule meetings that work for team members in different time zones while respecting business hours.

**Your Task**: Create a function called \`schedule_meeting()\` that finds optimal meeting times.

**Requirements**:
- Convert times between time zones (simplified: just hour differences)
- Check if meeting time falls within business hours (9 AM - 6 PM)
- Account for different UTC offsets
- Return a dictionary with meeting details for each location

**Example**: schedule_meeting(14, "UTC", ["EST", "PST"]) returns meeting times for each zone`,
      difficulty: "medium",
      orderIndex: 2,
      starterCode: `def schedule_meeting(utc_hour, base_timezone, target_timezones):
    # Time zone offsets from UTC (simplified)
    timezone_offsets = {
        "UTC": 0,
        "EST": -5,
        "PST": -8,
        "CET": 1,
        "JST": 9
    }
    
    # Business hours: 9 AM to 6 PM
    business_start = 9
    business_end = 18
    
    # Calculate times for each timezone
    meeting_schedule = {}
    
    # Add your logic here
    
    return meeting_schedule`,
      solution: `def schedule_meeting(utc_hour, base_timezone, target_timezones):
    timezone_offsets = {
        "UTC": 0,
        "EST": -5,
        "PST": -8, 
        "CET": 1,
        "JST": 9
    }
    
    business_start = 9
    business_end = 18
    
    meeting_schedule = {}
    
    # Calculate base UTC time
    base_offset = timezone_offsets.get(base_timezone, 0)
    utc_time = (utc_hour - base_offset) % 24
    
    # Calculate time for each target timezone
    for tz in target_timezones:
        offset = timezone_offsets.get(tz, 0)
        local_time = (utc_time + offset) % 24
        
        # Check if within business hours
        is_business_hours = business_start <= local_time < business_end
        
        meeting_schedule[tz] = {
            "local_time": local_time,
            "is_business_hours": is_business_hours,
            "time_string": f"{local_time:02d}:00"
        }
    
    return meeting_schedule`,
      testCases: [
        {
          input: [14, "UTC", ["EST", "PST"]],
          expected: {
            "EST": {"local_time": 9, "is_business_hours": true, "time_string": "09:00"},
            "PST": {"local_time": 6, "is_business_hours": false, "time_string": "06:00"}
          },
          description: "2 PM UTC should convert correctly to EST and PST"
        }
      ],
      hints: [
        "Use the modulo operator (%) to handle 24-hour time wraparound",
        "Store timezone offsets in a dictionary for easy lookup",
        "Use dictionary comprehension or loops to process multiple timezones",
        "Compare local times with business hour ranges"
      ],
      xpReward: 150,
      researchTopics: [
        "Python dictionaries and key-value pairs",
        "Modulo arithmetic for time calculations",
        "Dictionary comprehensions",
        "Boolean expressions in data structures"
      ],
      learningObjectives: [
        "Work with dictionaries and nested data",
        "Perform time zone calculations",
        "Use modulo arithmetic effectively",
        "Handle multiple data inputs systematically"
      ],
      professionalContext: "Time zone management is essential for global teams, project management tools, and international business coordination.",
      businessCategory: "enterprise-tools"
    },
    {
      id: 5,
      lessonId: 2,
      title: "Sales Commission Calculator",
      description: `Build a function that calculates sales representative commissions based on performance tiers.

**Business Context**: Sales organizations use tiered commission structures to motivate representatives and reward top performers.

**Your Task**: Create a function called \`calculate_commission()\` that computes commission based on sales amount and tier rates.

**Requirements**:
- First $10,000: 5% commission
- Next $15,000 ($10,001-$25,000): 7% commission  
- Next $25,000 ($25,001-$50,000): 10% commission
- Above $50,000: 15% commission
- Return total commission as a float rounded to 2 decimal places

**Example**: calculate_commission(30000) should return $2,850.00`,
      difficulty: "medium",
      orderIndex: 3,
      starterCode: `def calculate_commission(sales_amount):
    # Commission tiers
    tier1_limit = 10000
    tier2_limit = 25000  
    tier3_limit = 50000
    
    tier1_rate = 0.05  # 5%
    tier2_rate = 0.07  # 7%
    tier3_rate = 0.10  # 10%
    tier4_rate = 0.15  # 15%
    
    total_commission = 0.0
    
    # Calculate commission for each tier
    
    return round(total_commission, 2)`,
      solution: `def calculate_commission(sales_amount):
    tier1_limit = 10000
    tier2_limit = 25000
    tier3_limit = 50000
    
    tier1_rate = 0.05
    tier2_rate = 0.07
    tier3_rate = 0.10
    tier4_rate = 0.15
    
    total_commission = 0.0
    remaining_sales = sales_amount
    
    # Tier 1: First $10,000 at 5%
    if remaining_sales > 0:
        tier1_sales = min(remaining_sales, tier1_limit)
        total_commission += tier1_sales * tier1_rate
        remaining_sales -= tier1_sales
    
    # Tier 2: Next $15,000 at 7%  
    if remaining_sales > 0:
        tier2_sales = min(remaining_sales, tier2_limit - tier1_limit)
        total_commission += tier2_sales * tier2_rate
        remaining_sales -= tier2_sales
    
    # Tier 3: Next $25,000 at 10%
    if remaining_sales > 0:
        tier3_sales = min(remaining_sales, tier3_limit - tier2_limit)
        total_commission += tier3_sales * tier3_rate
        remaining_sales -= tier3_sales
    
    # Tier 4: Everything above $50,000 at 15%
    if remaining_sales > 0:
        total_commission += remaining_sales * tier4_rate
    
    return round(total_commission, 2)`,
      testCases: [
        {
          input: [30000],
          expected: 2850.00,
          description: "Tier 1: $500, Tier 2: $1050, Tier 3: $1300 = $2850"
        },
        {
          input: [8000],
          expected: 400.00,
          description: "Only tier 1: $8000 * 0.05 = $400"
        },
        {
          input: [60000],
          expected: 5350.00,
          description: "All tiers: $500 + $1050 + $2500 + $1300 = $5350"
        }
      ],
      hints: [
        "Use min() to calculate how much sales fall into each tier",
        "Track remaining sales amount as you process each tier",
        "Apply each commission rate only to the sales in that tier",
        "Use round() to format the final result to 2 decimal places"
      ],
      xpReward: 175,
      researchTopics: [
        "Progressive calculation algorithms",
        "Python min() and max() functions",
        "Float arithmetic and rounding",
        "Conditional logic with multiple tiers"
      ],
      learningObjectives: [
        "Implement progressive/tiered calculations",
        "Use mathematical functions effectively",
        "Handle financial calculations with precision",
        "Break down complex business rules into code"
      ],
      professionalContext: "Tiered commission structures are common in sales, real estate, financial services, and affiliate marketing programs.",
      businessCategory: "sales"
    }
  ]
};

async function seedCurriculum() {
  try {
    console.log('🌱 Starting curriculum seed...');

    // Clear existing data (optional - comment out if you want to preserve data)
    console.log('🗑️  Clearing existing curriculum data...');
    await db.delete(problems);
    await db.delete(lessons);
    await db.delete(sections);

    // Insert sections
    console.log('📚 Inserting sections...');
    for (const section of curriculumData.sections) {
      await db.insert(sections).values(section);
    }

    // Insert lessons
    console.log('📖 Inserting lessons...');
    for (const lesson of curriculumData.lessons) {
      await db.insert(lessons).values(lesson);
    }

    // Insert problems
    console.log('🧩 Inserting problems...');
    for (const problem of curriculumData.problems) {
      await db.insert(problems).values(problem);
    }

    console.log('✅ Curriculum seed completed successfully!');
    console.log(`📊 Seeded: ${curriculumData.sections.length} sections, ${curriculumData.lessons.length} lessons, ${curriculumData.problems.length} problems`);

    // Verify the data
    const sectionCount = await db.select().from(sections);
    const lessonCount = await db.select().from(lessons);
    const problemCount = await db.select().from(problems);

    console.log('🔍 Verification:');
    console.log(`   Sections in DB: ${sectionCount.length}`);
    console.log(`   Lessons in DB: ${lessonCount.length}`);
    console.log(`   Problems in DB: ${problemCount.length}`);

  } catch (error) {
    console.error('❌ Error seeding curriculum:', error);
    process.exit(1);
  }
}

// Run the seed function
seedCurriculum().then(() => {
  console.log('🎉 Seed script completed!');
  process.exit(0);
}).catch((error) => {
  console.error('💥 Seed script failed:', error);
  process.exit(1);
});