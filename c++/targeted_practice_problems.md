# Targeted Practice Problems - Addressing Exam Gaps

## Priority 1: BST Operations Practice

### Problem 1: BST Insertion and Traversal
Given the following BST:
```
        50
       /  \
     30    70
    /  \   /  \
  20   40 60   80
```

**Tasks:**
1. Insert the values: 25, 35, 65, 75
2. Perform inorder, preorder, and postorder traversals
3. Find the height of the tree
4. Count the number of nodes

**Solutions:**
1. **After insertions:**
```
        50
       /  \
     30    70
    /  \   /  \
  20   40 60   80
    \   \   \   \
    25  35  65  75
```

2. **Traversals:**
- Inorder: 20, 25, 30, 35, 40, 50, 60, 65, 70, 75, 80
- Preorder: 50, 30, 20, 25, 40, 35, 70, 60, 65, 80, 75
- Postorder: 25, 20, 35, 40, 30, 65, 60, 75, 80, 70, 50

3. **Height:** 4
4. **Nodes:** 11

---

### Problem 2: BST Deletion Scenarios
Given the BST from Problem 1, perform these deletions:

**Tasks:**
1. Delete 20 (leaf node)
2. Delete 40 (node with one child)
3. Delete 50 (node with two children)
4. Delete 70 (node with two children)

**Solutions:**
1. **Delete 20:** Simply remove the leaf
2. **Delete 40:** Replace with its child (35)
3. **Delete 50:** Replace with inorder successor (60)
4. **Delete 70:** Replace with inorder successor (75)

**Final tree after all deletions:**
```
        60
       /  \
     30    75
    /  \     \
  25   35     80
    \
    25
```

---

## Priority 2: AVL Tree Complex Scenarios

### Problem 3: Multi-Step AVL Insertion
Start with an empty AVL tree and insert: 10, 20, 30, 40, 50, 25

**Step-by-step solution:**
1. **Insert 10:** Balanced
```
   10
```

2. **Insert 20:** Balanced
```
   10
    \
    20
```

3. **Insert 30:** RR rotation needed
```
Before:     After:
  10          20
   \         /  \
   20   =>  10   30
    \
    30
```

4. **Insert 40:** Balanced
```
    20
   /  \
 10    30
        \
        40
```

5. **Insert 50:** RR rotation at 30
```
Before:         After:
    20              20
   /  \            /  \
 10    30   =>   10    40
        \              /  \
        40            30   50
         \
         50
```

6. **Insert 25:** LR rotation at 20
```
Before:         After:
    20              30
   /  \            /  \
 10    40   =>   20    40
      /  \       /  \    \
    30    50    10  25    50
   /
 25
```

**Final balanced tree:**
```
    30
   /  \
 20    40
 /  \    \
10  25    50
```

---

### Problem 4: AVL Deletion with Rebalancing
Given the AVL tree from Problem 3, delete: 30, 20, 40

**Step-by-step solution:**
1. **Delete 30 (root with two children):**
   - Replace with inorder successor (40)
   - Tree becomes:
```
    40
   /  \
 20    50
 /  \
10  25
```

2. **Delete 20 (node with two children):**
   - Replace with inorder successor (25)
   - Tree becomes:
```
    40
   /  \
 25    50
 /
10
```

3. **Delete 40 (root with two children):**
   - Replace with inorder successor (50)
   - Tree becomes:
```
   50
  /
25
  \
  10
```
   - This creates imbalance, need RR rotation:
```
Before:     After:
  50          25
 /           /  \
25   =>     10   50
 \
 10
```

**Final balanced tree:**
```
   25
  /  \
10    50
```

---

## Priority 3: Balance Factor Calculations

### Problem 5: Calculate Balance Factors
For each node in the following AVL tree, calculate the balance factor:

```
        30
       /  \
     20    40
    /  \     \
  10  25     50
```

**Solution:**
- Node 10: BF = 0 - 0 = 0 (leaf)
- Node 25: BF = 0 - 0 = 0 (leaf)
- Node 50: BF = 0 - 0 = 0 (leaf)
- Node 20: BF = 1 - 1 = 0 (left height 1, right height 1)
- Node 40: BF = 0 - 1 = -1 (no left child, right height 1)
- Node 30: BF = 2 - 2 = 0 (left height 2, right height 2)

---

### Problem 6: Identify Rotation Needs
For each of these trees, identify if rotations are needed and what type:

**Tree A:**
```
   10
    \
    20
      \
      30
```
**Answer:** RR rotation needed (BF = -2)

**Tree B:**
```
   30
  /
20
/
10
```
**Answer:** LL rotation needed (BF = 2)

**Tree C:**
```
   20
  /
10
  \
  15
```
**Answer:** LR rotation needed (BF = 2, but right child has BF = -1)

---

## Priority 4: Complex Rotation Scenarios

### Problem 7: Double Rotation
Insert 35 into this AVL tree:
```
    30
   /  \
 10    40
        \
        50
```

**Solution:**
1. **Insert 35:** Goes in left subtree of 40
```
    30
   /  \
 10    40
      /  \
    35    50
```

2. **Check balance factors:**
- Node 35: BF = 0 (leaf)
- Node 50: BF = 0 (leaf)
- Node 40: BF = 1 - 1 = 0
- Node 10: BF = 0 (leaf)
- Node 30: BF = 1 - 2 = -1 (imbalanced!)

3. **Identify rotation type:** RL rotation needed
   - Root has BF = -1 (right heavy)
   - Right child has BF = 1 (left heavy)

4. **Perform RL rotation:**
   - First, right rotation at 40:
```
    30
   /  \
 10    35
        \
        40
          \
          50
```
   - Then, left rotation at 30:
```
    35
   /  \
 30    40
 /       \
10       50
```

**Final balanced tree:**
```
    35
   /  \
 30    40
 /       \
10       50
```

---

## Priority 5: Time Complexity Analysis

### Problem 8: Analyze These Functions

**Function A:**
```cpp
bool findElement(const vector<int>& arr, int target) {
    for (int i = 0; i < arr.size(); i++) {
        if (arr[i] == target) return true;
    }
    return false;
}
```

**Analysis:**
- Best case: O(1) - target found at first position
- Worst case: O(n) - target not found or at last position
- Average case: O(n) - assuming uniform distribution

**Function B:**
```cpp
void bubbleSort(vector<int>& arr) {
    int n = arr.size();
    for (int i = 0; i < n-1; i++) {
        for (int j = 0; j < n-i-1; j++) {
            if (arr[j] > arr[j+1]) {
                swap(arr[j], arr[j+1]);
            }
        }
    }
}
```

**Analysis:**
- Best case: O(n) - array already sorted
- Worst case: O(n²) - array in reverse order
- Average case: O(n²) - random array

**Function C:**
```cpp
int binarySearch(const vector<int>& arr, int target) {
    int left = 0, right = arr.size() - 1;
    while (left <= right) {
        int mid = left + (right - left) / 2;
        if (arr[mid] == target) return mid;
        if (arr[mid] < target) left = mid + 1;
        else right = mid - 1;
    }
    return -1;
}
```

**Analysis:**
- Best case: O(1) - target at middle
- Worst case: O(log n) - target not found
- Average case: O(log n) - uniform distribution

---

## Practice Exam Simulation

### Mini-Exam (30 minutes)
**Instructions:** Complete these problems under timed conditions to simulate exam pressure.

**Problem 1 (10 points):**
Calculate the sum: ∑(i=1 to 20) (3i + 2)

**Problem 2 (10 points):**
Given this BST, delete node 25 and show the resulting tree:
```
    20
   /  \
 10    30
        \
        35
```

**Problem 3 (10 points):**
Insert 15 into this AVL tree and show all necessary rotations:
```
   20
  /
10
  \
  12
```

**Solutions:**
1. **Series sum:** 3∑(i=1 to 20) i + ∑(i=1 to 20) 2 = 3×210 + 40 = 670
2. **Delete 25:** Replace with inorder successor (30), result:
```
    20
   /  \
 10    30
        \
        35
```
3. **Insert 15:** LR rotation needed, final tree:
```
   12
  /  \
10    20
       \
       15
```

---

## Study Checklist

### ✅ Complete These Before Exam:
- [ ] Practice drawing BSTs and performing insertions/deletions
- [ ] Master all 4 AVL rotation types (LL, RR, LR, RL)
- [ ] Practice balance factor calculations
- [ ] Work through complex multi-step scenarios
- [ ] Time yourself on practice problems
- [ ] Review mathematical formulas
- [ ] Practice C++ implementation problems

### 🔄 Daily Practice Routine:
1. **Morning (30 min):** Tree operations practice
2. **Afternoon (30 min):** Complexity analysis problems
3. **Evening (30 min):** C++ coding practice

### 📊 Progress Tracking:
- **Week 1 Goal:** Comfortable with basic BST/AVL operations
- **Week 2 Goal:** Master complex scenarios and rotations
- **Week 3 Goal:** Exam-ready with timed practice

Remember: The key to success is **hands-on practice** with tree operations and **visual problem-solving** skills! 