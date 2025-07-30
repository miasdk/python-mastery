// Comprehensive problems array based on curriculum structure
export const comprehensiveProblems = [
  // Foundation Concepts - Python Syntax & Fundamentals (Lesson 1)
  {
    id: 1,
    lessonId: 1,
    title: "Built-in Functions Master",
    description: `Practice essential Python built-in functions through data analysis tasks.

**Learning Focus**: Master len(), sum(), min(), max(), range(), enumerate(), and zip()

**Your Task**: Create a function called \\`analyze_sales_data()\\` that processes a list of daily sales amounts.

**Requirements**:
- Calculate total sales using sum()
- Find the best and worst sales days using max() and min()
- Count total days using len()
- Return results as a dictionary

**Example**: analyze_sales_data([100, 150, 200, 75, 300]) should return analysis results`,
    difficulty: "easy",
    orderIndex: 1,
    starterCode: `def analyze_sales_data(sales):
    # Use built-in functions to analyze the data
    total_sales = 0  # Use sum()
    best_day = 0     # Use max()
    worst_day = 0    # Use min()
    total_days = 0   # Use len()
    
    # Return analysis as dictionary
    return {}`,
    solution: `def analyze_sales_data(sales):
    total_sales = sum(sales)
    best_day = max(sales)
    worst_day = min(sales)
    total_days = len(sales)
    
    return {
        "total_sales": total_sales,
        "best_day": best_day,
        "worst_day": worst_day,
        "total_days": total_days,
        "average_sales": total_sales / total_days if total_days > 0 else 0
    }`,
    testCases: [
      {
        input: [[100, 150, 200, 75, 300]],
        expected: {"total_sales": 825, "best_day": 300, "worst_day": 75, "total_days": 5, "average_sales": 165.0},
        description: "Should correctly analyze sales data"
      }
    ],
    hints: [
      "Use sum() to add all values in the list",
      "max() and min() work directly on lists",
      "len() returns the number of items",
      "Calculate average by dividing total by count"
    ],
    xpReward: 50,
    researchTopics: ["Python built-in functions", "List operations", "Dictionary creation"],
    learningObjectives: ["Master essential built-in functions", "Process numerical data", "Return structured results"],
    professionalContext: "Data analysis is fundamental in business intelligence and reporting systems.",
    businessCategory: "data-analysis"
  },

  {
    id: 2,
    lessonId: 1,
    title: "Control Flow Logic",
    description: `Build conditional logic for a grading system.

**Learning Focus**: if/elif/else statements, comparison operators, and boolean logic

**Your Task**: Create a function called \\`calculate_grade()\\` that assigns letter grades based on scores.

**Requirements**:
- A: 90-100
- B: 80-89
- C: 70-79
- D: 60-69
- F: Below 60
- Handle invalid scores (negative or > 100)

**Example**: calculate_grade(85) should return "B"`,
    difficulty: "easy",
    orderIndex: 2,
    starterCode: `def calculate_grade(score):
    # Add input validation
    
    # Use if/elif/else for grading logic
    
    return "F"  # Default return`,
    solution: `def calculate_grade(score):
    # Input validation
    if score < 0 or score > 100:
        return "Invalid Score"
    
    # Grading logic
    if score >= 90:
        return "A"
    elif score >= 80:
        return "B"
    elif score >= 70:
        return "C"
    elif score >= 60:
        return "D"
    else:
        return "F"`,
    testCases: [
      {
        input: [95],
        expected: "A",
        description: "Score of 95 should return A"
      },
      {
        input: [85],
        expected: "B",
        description: "Score of 85 should return B"
      },
      {
        input: [55],
        expected: "F",
        description: "Score of 55 should return F"
      },
      {
        input: [105],
        expected: "Invalid Score",
        description: "Invalid score should be handled"
      }
    ],
    hints: [
      "Check for invalid inputs first",
      "Use elif for multiple conditions",
      "Order conditions from highest to lowest",
      "Consider edge cases like exactly 90, 80, etc."
    ],
    xpReward: 75,
    researchTopics: ["Conditional statements", "Boolean logic", "Input validation"],
    learningObjectives: ["Implement branching logic", "Handle edge cases", "Validate user input"],
    professionalContext: "Conditional logic is essential for business rules, validation, and decision-making systems.",
    businessCategory: "education-tech"
  },

  // Foundation Concepts - Object-Oriented Programming (Lesson 2)
  {
    id: 3,
    lessonId: 2,
    title: "Employee Management System",
    description: `Create a class-based employee management system.

**Learning Focus**: Classes, objects, properties, methods, and inheritance

**Your Task**: Create an \`Employee\` class and a \`Manager\` subclass.

**Requirements**:
- Employee class with name, id, salary properties
- Methods: get_info(), give_raise(amount)
- Manager subclass that inherits from Employee
- Manager has additional team_size property and manage_team() method

**Example**: Create employees and managers, test inheritance`,
    difficulty: "medium",
    orderIndex: 1,
    starterCode: `class Employee:
    def __init__(self, name, emp_id, salary):
        # Initialize employee properties
        pass
    
    def get_info(self):
        # Return employee information
        pass
    
    def give_raise(self, amount):
        # Increase salary by amount
        pass

class Manager(Employee):
    def __init__(self, name, emp_id, salary, team_size):
        # Initialize manager (inherit from Employee)
        pass
    
    def manage_team(self):
        # Return management info
        pass`,
    solution: `class Employee:
    def __init__(self, name, emp_id, salary):
        self.name = name
        self.emp_id = emp_id
        self.salary = salary
    
    def get_info(self):
        return f"Employee {self.name} (ID: {self.emp_id}) - Salary: ${self.salary}"
    
    def give_raise(self, amount):
        self.salary += amount
        return self.salary

class Manager(Employee):
    def __init__(self, name, emp_id, salary, team_size):
        super().__init__(name, emp_id, salary)
        self.team_size = team_size
    
    def manage_team(self):
        return f"Manager {self.name} manages {self.team_size} team members"`,
    testCases: [
      {
        input: ["John", 101, 50000],
        expected: "Employee John (ID: 101) - Salary: $50000",
        description: "Employee class should work correctly"
      }
    ],
    hints: [
      "Use __init__ method for initialization",
      "Use super() to call parent class methods",
      "Properties are accessed with self.property_name",
      "Methods should use self as first parameter"
    ],
    xpReward: 125,
    researchTopics: ["Python classes", "Inheritance", "Method overriding", "super() function"],
    learningObjectives: ["Create classes and objects", "Implement inheritance", "Use encapsulation principles"],
    professionalContext: "OOP is fundamental for building scalable, maintainable business applications.",
    businessCategory: "hr-systems"
  },

  // Data Structures - Linked Lists (Lesson 4)
  {
    id: 4,
    lessonId: 4,
    title: "Linked List Implementation",
    description: `Build a basic linked list data structure.

**Learning Focus**: Node structure, linked list operations, and traversal

**Your Task**: Implement a LinkedList class with basic operations.

**Requirements**:
- Node class with data and next pointer
- LinkedList class with insert, delete, find methods
- Implement traversal to display all elements
- Handle edge cases (empty list, single element)

**Example**: Create list, insert elements, traverse and display`,
    difficulty: "medium",
    orderIndex: 1,
    starterCode: `class ListNode:
    def __init__(self, data):
        # Initialize node with data and next pointer
        pass

class LinkedList:
    def __init__(self):
        # Initialize empty linked list
        pass
    
    def insert(self, data):
        # Insert new node at beginning
        pass
    
    def display(self):
        # Return list of all elements
        pass
    
    def find(self, data):
        # Find and return True if data exists
        pass`,
    solution: `class ListNode:
    def __init__(self, data):
        self.data = data
        self.next = None

class LinkedList:
    def __init__(self):
        self.head = None
    
    def insert(self, data):
        new_node = ListNode(data)
        new_node.next = self.head
        self.head = new_node
    
    def display(self):
        elements = []
        current = self.head
        while current:
            elements.append(current.data)
            current = current.next
        return elements
    
    def find(self, data):
        current = self.head
        while current:
            if current.data == data:
                return True
            current = current.next
        return False`,
    testCases: [
      {
        input: [1, 2, 3],
        expected: [3, 2, 1],
        description: "Should insert and display elements correctly"
      }
    ],
    hints: [
      "Use None to represent empty next pointer",
      "Keep track of head node",
      "Use while loop for traversal",
      "Handle empty list case"
    ],
    xpReward: 150,
    researchTopics: ["Linked lists", "Node structures", "Pointer manipulation", "Memory management"],
    learningObjectives: ["Implement basic data structures", "Understand pointer concepts", "Handle dynamic memory"],
    professionalContext: "Linked lists are used in databases, file systems, and memory management.",
    businessCategory: "system-design"
  },

  // Algorithms - Recursion (Lesson 7)
  {
    id: 5,
    lessonId: 7,
    title: "Recursive Fibonacci",
    description: `Implement Fibonacci sequence using recursion with optimization.

**Learning Focus**: Base cases, recursive cases, memoization, and call stack

**Your Task**: Create a recursive Fibonacci function with memoization.

**Requirements**:
- Basic recursive fibonacci(n) function
- Optimized version with memoization
- Compare time complexity between versions
- Handle edge cases (n <= 0)

**Example**: fibonacci(10) should return 55`,
    difficulty: "medium",
    orderIndex: 1,
    starterCode: `def fibonacci_basic(n):
    # Basic recursive implementation
    # Base cases: f(0) = 0, f(1) = 1
    # Recursive case: f(n) = f(n-1) + f(n-2)
    pass

def fibonacci_memo(n, memo={}):
    # Optimized version with memoization
    pass`,
    solution: `def fibonacci_basic(n):
    if n <= 0:
        return 0
    elif n == 1:
        return 1
    else:
        return fibonacci_basic(n-1) + fibonacci_basic(n-2)

def fibonacci_memo(n, memo={}):
    if n <= 0:
        return 0
    elif n == 1:
        return 1
    elif n in memo:
        return memo[n]
    else:
        memo[n] = fibonacci_memo(n-1, memo) + fibonacci_memo(n-2, memo)
        return memo[n]`,
    testCases: [
      {
        input: [10],
        expected: 55,
        description: "10th Fibonacci number should be 55"
      },
      {
        input: [0],
        expected: 0,
        description: "Fibonacci of 0 should be 0"
      },
      {
        input: [1],
        expected: 1,
        description: "Fibonacci of 1 should be 1"
      }
    ],
    hints: [
      "Define clear base cases first",
      "Use dictionary for memoization",
      "Check if result already computed",
      "Handle negative numbers appropriately"
    ],
    xpReward: 175,
    researchTopics: ["Recursion", "Memoization", "Time complexity", "Dynamic programming basics"],
    learningObjectives: ["Understand recursive thinking", "Implement optimization techniques", "Analyze algorithm efficiency"],
    professionalContext: "Recursive algorithms are used in tree structures, parsing, and mathematical computations.",
    businessCategory: "algorithms"
  },

  // Two-Pointer Technique (Lesson 9)
  {
    id: 6,
    lessonId: 9,
    title: "Two Sum Problem",
    description: `Solve the classic Two Sum problem using two-pointer technique.

**Learning Focus**: Two-pointer patterns, array manipulation, and optimization

**Your Task**: Find two numbers in a sorted array that sum to a target.

**Requirements**:
- Use two pointers (left and right)
- Array is sorted in ascending order
- Return indices of the two numbers
- Handle cases where no solution exists

**Example**: two_sum([2, 7, 11, 15], 9) should return [0, 1]`,
    difficulty: "easy",
    orderIndex: 1,
    starterCode: `def two_sum(nums, target):
    # Initialize left and right pointers
    left = 0
    right = len(nums) - 1
    
    # Use two-pointer technique
    while left < right:
        # Calculate current sum
        # Move pointers based on comparison with target
        pass
    
    # Return [-1, -1] if no solution found
    return [-1, -1]`,
    solution: `def two_sum(nums, target):
    left = 0
    right = len(nums) - 1
    
    while left < right:
        current_sum = nums[left] + nums[right]
        
        if current_sum == target:
            return [left, right]
        elif current_sum < target:
            left += 1
        else:
            right -= 1
    
    return [-1, -1]`,
    testCases: [
      {
        input: [[2, 7, 11, 15], 9],
        expected: [0, 1],
        description: "Should find indices of numbers that sum to target"
      },
      {
        input: [[1, 2, 3, 4], 8],
        expected: [-1, -1],
        description: "Should return [-1, -1] when no solution exists"
      }
    ],
    hints: [
      "Start with pointers at opposite ends",
      "Move left pointer right if sum is too small",
      "Move right pointer left if sum is too large",
      "Stop when pointers meet"
    ],
    xpReward: 100,
    researchTopics: ["Two-pointer technique", "Array traversal", "Optimization strategies"],
    learningObjectives: ["Master two-pointer patterns", "Optimize array operations", "Solve classic problems"],
    professionalContext: "Two-pointer technique optimizes many array and string problems in system design.",
    businessCategory: "algorithms"
  }
];`