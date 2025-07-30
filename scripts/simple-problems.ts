// Simplified comprehensive problems to avoid string escaping issues
export const comprehensiveProblems = [
  // Foundation Concepts - Python Syntax & Fundamentals (Lesson 1)
  {
    id: 1,
    lessonId: 1,
    title: "Built-in Functions Master",
    description: "Practice essential Python built-in functions through data analysis tasks. Create a function called analyze_sales_data() that processes a list of daily sales amounts using sum(), max(), min(), and len().",
    difficulty: "easy",
    orderIndex: 1,
    starterCode: "def analyze_sales_data(sales):\n    # Use built-in functions to analyze the data\n    total_sales = 0  # Use sum()\n    best_day = 0     # Use max()\n    worst_day = 0    # Use min()\n    total_days = 0   # Use len()\n    \n    # Return analysis as dictionary\n    return {}",
    solution: "def analyze_sales_data(sales):\n    total_sales = sum(sales)\n    best_day = max(sales)\n    worst_day = min(sales)\n    total_days = len(sales)\n    \n    return {\n        \"total_sales\": total_sales,\n        \"best_day\": best_day,\n        \"worst_day\": worst_day,\n        \"total_days\": total_days,\n        \"average_sales\": total_sales / total_days if total_days > 0 else 0\n    }",
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
    description: "Build conditional logic for a grading system. Create a function called calculate_grade() that assigns letter grades based on scores: A(90-100), B(80-89), C(70-79), D(60-69), F(below 60).",
    difficulty: "easy",
    orderIndex: 2,
    starterCode: "def calculate_grade(score):\n    # Add input validation\n    \n    # Use if/elif/else for grading logic\n    \n    return \"F\"  # Default return",
    solution: "def calculate_grade(score):\n    # Input validation\n    if score < 0 or score > 100:\n        return \"Invalid Score\"\n    \n    # Grading logic\n    if score >= 90:\n        return \"A\"\n    elif score >= 80:\n        return \"B\"\n    elif score >= 70:\n        return \"C\"\n    elif score >= 60:\n        return \"D\"\n    else:\n        return \"F\"",
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
      }
    ],
    hints: [
      "Check for invalid inputs first",
      "Use elif for multiple conditions",
      "Order conditions from highest to lowest"
    ],
    xpReward: 75,
    researchTopics: ["Conditional statements", "Boolean logic", "Input validation"],
    learningObjectives: ["Implement branching logic", "Handle edge cases", "Validate user input"],
    professionalContext: "Conditional logic is essential for business rules and decision-making systems.",
    businessCategory: "education-tech"
  },

  // Foundation Concepts - Object-Oriented Programming (Lesson 2)
  {
    id: 3,
    lessonId: 2,
    title: "Employee Management System",
    description: "Create a class-based employee management system. Build an Employee class with name, id, salary properties and methods like get_info() and give_raise(). Then create a Manager subclass that inherits from Employee.",
    difficulty: "medium",
    orderIndex: 1,
    starterCode: "class Employee:\n    def __init__(self, name, emp_id, salary):\n        # Initialize employee properties\n        pass\n    \n    def get_info(self):\n        # Return employee information\n        pass\n    \n    def give_raise(self, amount):\n        # Increase salary by amount\n        pass\n\nclass Manager(Employee):\n    def __init__(self, name, emp_id, salary, team_size):\n        # Initialize manager (inherit from Employee)\n        pass\n    \n    def manage_team(self):\n        # Return management info\n        pass",
    solution: "class Employee:\n    def __init__(self, name, emp_id, salary):\n        self.name = name\n        self.emp_id = emp_id\n        self.salary = salary\n    \n    def get_info(self):\n        return f\"Employee {self.name} (ID: {self.emp_id}) - Salary: ${self.salary}\"\n    \n    def give_raise(self, amount):\n        self.salary += amount\n        return self.salary\n\nclass Manager(Employee):\n    def __init__(self, name, emp_id, salary, team_size):\n        super().__init__(name, emp_id, salary)\n        self.team_size = team_size\n    \n    def manage_team(self):\n        return f\"Manager {self.name} manages {self.team_size} team members\"",
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
      "Properties are accessed with self.property_name"
    ],
    xpReward: 125,
    researchTopics: ["Python classes", "Inheritance", "Method overriding", "super() function"],
    learningObjectives: ["Create classes and objects", "Implement inheritance", "Use encapsulation principles"],
    professionalContext: "OOP is fundamental for building scalable, maintainable business applications.",
    businessCategory: "hr-systems"
  },

  // Foundation Concepts - Collections & Data Manipulation (Lesson 3)
  {
    id: 4,
    lessonId: 3,
    title: "Inventory Management",
    description: "Build an inventory management system using lists and dictionaries. Create functions to add items, update quantities, and generate reports using Python collections.",
    difficulty: "easy",
    orderIndex: 1,
    starterCode: "def manage_inventory():\n    # Create inventory dictionary\n    inventory = {}\n    \n    # Add functions to manage inventory\n    def add_item(name, quantity, price):\n        pass\n    \n    def update_quantity(name, new_quantity):\n        pass\n    \n    def get_total_value():\n        pass\n    \n    return inventory",
    solution: "def manage_inventory():\n    inventory = {}\n    \n    def add_item(name, quantity, price):\n        inventory[name] = {'quantity': quantity, 'price': price}\n        return inventory\n    \n    def update_quantity(name, new_quantity):\n        if name in inventory:\n            inventory[name]['quantity'] = new_quantity\n        return inventory\n    \n    def get_total_value():\n        total = 0\n        for item in inventory.values():\n            total += item['quantity'] * item['price']\n        return total\n    \n    return {'add_item': add_item, 'update_quantity': update_quantity, 'get_total_value': get_total_value}",
    testCases: [
      {
        input: [],
        expected: {},
        description: "Should create empty inventory initially"
      }
    ],
    hints: [
      "Use dictionaries to store item information",
      "Nested dictionaries can store multiple properties",
      "Use loops to calculate totals"
    ],
    xpReward: 100,
    researchTopics: ["Python dictionaries", "Nested data structures", "List operations"],
    learningObjectives: ["Work with complex data structures", "Implement CRUD operations", "Process collections efficiently"],
    professionalContext: "Inventory systems are crucial for retail, manufacturing, and e-commerce businesses.",
    businessCategory: "inventory-management"
  },

  // Data Structures - Linked Lists (Lesson 4)
  {
    id: 5,
    lessonId: 4,
    title: "Linked List Implementation",
    description: "Build a basic linked list data structure with Node class and LinkedList class. Implement insert, delete, find, and display methods.",
    difficulty: "medium",
    orderIndex: 1,
    starterCode: "class ListNode:\n    def __init__(self, data):\n        # Initialize node with data and next pointer\n        pass\n\nclass LinkedList:\n    def __init__(self):\n        # Initialize empty linked list\n        pass\n    \n    def insert(self, data):\n        # Insert new node at beginning\n        pass\n    \n    def display(self):\n        # Return list of all elements\n        pass\n    \n    def find(self, data):\n        # Find and return True if data exists\n        pass",
    solution: "class ListNode:\n    def __init__(self, data):\n        self.data = data\n        self.next = None\n\nclass LinkedList:\n    def __init__(self):\n        self.head = None\n    \n    def insert(self, data):\n        new_node = ListNode(data)\n        new_node.next = self.head\n        self.head = new_node\n    \n    def display(self):\n        elements = []\n        current = self.head\n        while current:\n            elements.append(current.data)\n            current = current.next\n        return elements\n    \n    def find(self, data):\n        current = self.head\n        while current:\n            if current.data == data:\n                return True\n            current = current.next\n        return False",
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
      "Use while loop for traversal"
    ],
    xpReward: 150,
    researchTopics: ["Linked lists", "Node structures", "Pointer manipulation"],
    learningObjectives: ["Implement basic data structures", "Understand pointer concepts", "Handle dynamic memory"],
    professionalContext: "Linked lists are used in databases, file systems, and memory management.",
    businessCategory: "system-design"
  },

  // Algorithms - Recursion (Lesson 7)
  {
    id: 6,
    lessonId: 7,
    title: "Recursive Fibonacci",
    description: "Implement Fibonacci sequence using recursion with optimization. Create both basic recursive and memoized versions to understand performance differences.",
    difficulty: "medium",
    orderIndex: 1,
    starterCode: "def fibonacci_basic(n):\n    # Basic recursive implementation\n    # Base cases: f(0) = 0, f(1) = 1\n    # Recursive case: f(n) = f(n-1) + f(n-2)\n    pass\n\ndef fibonacci_memo(n, memo={}):\n    # Optimized version with memoization\n    pass",
    solution: "def fibonacci_basic(n):\n    if n <= 0:\n        return 0\n    elif n == 1:\n        return 1\n    else:\n        return fibonacci_basic(n-1) + fibonacci_basic(n-2)\n\ndef fibonacci_memo(n, memo={}):\n    if n <= 0:\n        return 0\n    elif n == 1:\n        return 1\n    elif n in memo:\n        return memo[n]\n    else:\n        memo[n] = fibonacci_memo(n-1, memo) + fibonacci_memo(n-2, memo)\n        return memo[n]",
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
      }
    ],
    hints: [
      "Define clear base cases first",
      "Use dictionary for memoization",
      "Check if result already computed"
    ],
    xpReward: 175,
    researchTopics: ["Recursion", "Memoization", "Time complexity", "Dynamic programming basics"],
    learningObjectives: ["Understand recursive thinking", "Implement optimization techniques", "Analyze algorithm efficiency"],
    professionalContext: "Recursive algorithms are used in tree structures, parsing, and mathematical computations.",
    businessCategory: "algorithms"
  },

  // Two-Pointer Technique (Lesson 9)
  {
    id: 7,
    lessonId: 9,
    title: "Two Sum Problem",
    description: "Solve the classic Two Sum problem using two-pointer technique. Find two numbers in a sorted array that sum to a target value.",
    difficulty: "easy",
    orderIndex: 1,
    starterCode: "def two_sum(nums, target):\n    # Initialize left and right pointers\n    left = 0\n    right = len(nums) - 1\n    \n    # Use two-pointer technique\n    while left < right:\n        # Calculate current sum\n        # Move pointers based on comparison with target\n        pass\n    \n    # Return [-1, -1] if no solution found\n    return [-1, -1]",
    solution: "def two_sum(nums, target):\n    left = 0\n    right = len(nums) - 1\n    \n    while left < right:\n        current_sum = nums[left] + nums[right]\n        \n        if current_sum == target:\n            return [left, right]\n        elif current_sum < target:\n            left += 1\n        else:\n            right -= 1\n    \n    return [-1, -1]",
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
      "Move right pointer left if sum is too large"
    ],
    xpReward: 100,
    researchTopics: ["Two-pointer technique", "Array traversal", "Optimization strategies"],
    learningObjectives: ["Master two-pointer patterns", "Optimize array operations", "Solve classic problems"],
    professionalContext: "Two-pointer technique optimizes many array and string problems in system design.",
    businessCategory: "algorithms"
  }
];