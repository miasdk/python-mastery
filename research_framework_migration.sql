-- Database Migration: Add Research Framework to Problems Table
-- Run this BEFORE adding the new problems

-- Add research framework columns to problems table
ALTER TABLE problems 
ADD COLUMN IF NOT EXISTS research_topics JSONB,
ADD COLUMN IF NOT EXISTS learning_objectives JSONB,
ADD COLUMN IF NOT EXISTS professional_context TEXT,
ADD COLUMN IF NOT EXISTS business_category TEXT;

-- Update existing problems with research framework data
-- Problem 1: Digital Business Card Creator
UPDATE problems SET 
    research_topics = '["String concatenation and f-strings", "Multi-line string handling", "Professional code structure", "Variable naming conventions"]',
    learning_objectives = '["Master string formatting for professional output", "Understand business card data organization", "Learn professional code documentation"]',
    professional_context = 'Used in networking apps, CRM systems, and professional profile generators. Companies like LinkedIn, HubSpot, and Salesforce use similar data formatting.',
    business_category = 'networking'
WHERE id = 1;

-- Problem 2: Temperature Conversion Tool  
UPDATE problems SET
    research_topics = '["Mathematical operations and formulas", "Function parameters and return values", "Precision handling with round()", "Scientific calculations"]',
    learning_objectives = '["Implement mathematical formulas in code", "Handle precision in calculations", "Build reusable conversion functions"]',
    professional_context = 'Critical for IoT applications, weather services, scientific software, and international applications. Used by companies like Nest, Weather.com, and industrial monitoring systems.',
    business_category = 'scientific'
WHERE id = 2;

-- Problem 3: User Registration Processor
UPDATE problems SET
    research_topics = '["Type checking with isinstance()", "Input validation patterns", "Dictionary construction", "DateTime module usage", "Error handling strategies"]',
    learning_objectives = '["Master input validation for production systems", "Build secure user registration flows", "Handle data type validation professionally"]',
    professional_context = 'Foundation of every web application and SaaS platform. Used by Slack, Notion, Stripe, and every major software company for user onboarding.',
    business_category = 'saas'
WHERE id = 3;

-- Problem 4: Product Inventory Tracker
UPDATE problems SET
    research_topics = '["Business logic implementation", "Inventory management algorithms", "Status determination logic", "Financial calculations"]',
    learning_objectives = '["Build inventory management systems", "Implement business rules in code", "Calculate inventory metrics"]',
    professional_context = 'Core functionality for e-commerce platforms, retail systems, and supply chain management. Used by Amazon, Shopify, and major retailers.',
    business_category = 'e-commerce'
WHERE id = 4;

-- Problem 5: Shopping Cart Calculator  
UPDATE problems SET
    research_topics = '["List comprehension for data processing", "Percentage calculations", "Conditional logic for business rules", "Financial precision handling"]',
    learning_objectives = '["Master e-commerce calculation logic", "Handle complex pricing rules", "Build shopping cart functionality"]',
    professional_context = 'Essential for any e-commerce platform. Used by Amazon, eBay, Shopify, and all online retailers for order processing.',
    business_category = 'e-commerce'
WHERE id = 5;

-- Verify the updates
SELECT 
    id, 
    title, 
    business_category,
    CASE 
        WHEN research_topics IS NOT NULL THEN 'Updated'
        ELSE 'Missing'
    END as research_framework_status
FROM problems 
ORDER BY id;