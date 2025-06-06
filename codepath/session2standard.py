# ==========================
# Version 1 Standard Set
# ==========================

"""
Problem 1: Reverse Sentence

Write a function reverse_sentence() that takes in a string sentence and returns the sentence with the order of the words reversed. 
The sentence will contain only alphabetic characters and spaces to separate the words. 
If there is only one word in the sentence, the function should return the original string.

Example Usage:

sentence = "tubby little cubby all stuffed with fluff"
reverse_sentence(sentence)  # Output: "fluff with stuffed all cubby little tubby"

sentence = "Pooh"
reverse_sentence(sentence)  # Output: "Pooh"
"""

def reverse_sentence(sentence):
    """
    Reverse the words in a sentence.
    :param sentence: A string containing the sentence to reverse.
    :return: A string with the words in reverse order.
    """
    words = sentence.split() # Split the sentence into words
    reversed_words = words[::-1] # Reverse the list of words
    return ' '.join(reversed_words) # Join the reversed words into a single string

# Demo / Test cases
if __name__ == "__main__":
    sentence1 = "tubby little cubby all stuffed with fluff"
    print(reverse_sentence(sentence1))  # Output: "fluff with stuffed all cubby little tubby"

    sentence2 = "Pooh"
    print(reverse_sentence(sentence2))  # Output: "Pooh"

"""
Problem 2: Goldilocks Number

Write a function goldilocks_approved(nums) that takes a list of distinct positive integers and returns any number that is neither the minimum nor the maximum in the list. If no such number exists, return -1.

Example Usage:

nums = [3, 2, 1, 4]
goldilocks_approved(nums)  # Output: 3 or 2

nums = [1, 2]
goldilocks_approved(nums)  # Output: -1

nums = [2, 1, 3]
goldilocks_approved(nums)  # Output: 2
"""

def goldilocks_approved(nums):
    for num in nums:
        if num != min(nums) and num != max(nums):
            return num
    return -1  # If no such number exists, return -1
    pass

# Demo / Test cases
if __name__ == "__main__":
    nums1 = [3, 2, 1, 4]
    print(goldilocks_approved(nums1))  # Output: 3 or 2

    nums2 = [1, 2]
    print(goldilocks_approved(nums2))  # Output: -1

    nums3 = [2, 1, 3]
    print(goldilocks_approved(nums3))  # Output: 2

"""
Problem 3: Delete Minimum

Pooh is eating all of his hunny jars in order of smallest to largest. 
Given a list of integers hunny_jar_sizes, write a function delete_minimum_elements() 
that continuously removes the minimum element until the list is empty. 
Return a new list of the elements of hunny_jar_sizes in the order in which they were removed.

Example Usage:

hunny_jar_sizes = [5, 3, 2, 4, 1]
delete_minimum_elements(hunny_jar_sizes)  # Output: [1, 2, 3, 4, 5]

hunny_jar_sizes = [5, 2, 1, 8, 2]
delete_minimum_elements(hunny_jar_sizes)  # Output: [1, 2, 2, 5, 8]
"""

def delete_minimum_elements(hunny_jar_sizes):
    removed_elements = []
    while hunny_jar_sizes:
        min_element = min(hunny_jar_sizes)  # Find the minimum element
        removed_elements.append(min_element)  # Add it to the result list
        hunny_jar_sizes.remove(min_element)  # Remove it from the original list
    return removed_elements  # Return the list of removed elements

# Demo / Test cases
if __name__ == "__main__":
    hunny_jar_sizes1 = [5, 3, 2, 4, 1]
    print(delete_minimum_elements(hunny_jar_sizes1))  # Output: [1, 2, 3, 4, 5]
    hunny_jar_sizes2 = [5, 2, 1, 8, 2]
    print(delete_minimum_elements(hunny_jar_sizes2))  # Output: [1, 2, 2, 5, 8]

"""
Problem 4: Sum of Digits

Write a function sum_of_digits() that accepts an integer num and returns the sum of num's digits.

Example Usage:

num = 423
sum_of_digits(num)  # Output: 9

num = 4
sum_of_digits(num)  # Output: 4
"""

def sum_of_digits(num):
    """
    Calculate the sum of the digits of a number.
    :param num: An integer whose digits are to be summed.
    :return: The sum of the digits of num.
    """
    return sum(int(digit) for digit in str(num))  # Convert num to string, iterate over each character, convert back to int and sum

# Demo / Test cases
if __name__ == "__main__":
    num1 = 423
    print(sum_of_digits(num1))  # Output: 9
    num2 = 4
    print(sum_of_digits(num2))  # Output: 4
    
"""
Problem 5: Bouncy, Flouncy, Trouncy, Pouncy

Tigger has developed a new programming language Tiger with only four operations and one variable tigger.

bouncy and flouncy both increment the value of the variable tigger by 1.
trouncy and pouncy both decrement the value of the variable tigger by 1.
Initially, the value of tigger is 1 because he's the only tigger around! Given a list of strings operations containing a list of operations, return the final value of tigger after performing all the operations.

Example Usage:

operations = ["trouncy", "flouncy", "flouncy"]
final_value_after_operations(operations)  # Output: 2

operations = ["bouncy", "bouncy", "flouncy"]
final_value_after_operations(operations)  # Output: 4
"""

def final_value_after_operations(operations):
    sum = 1 # Initial value of tigger is 1
    for operation in operations:
        if operation == "bouncy" or operation == "flouncy":
            sum += 1
        elif operation == "trouncy" or operation == "pouncy":
            sum -= 1
    return sum  # Return the final value of tigger after all operations are performed
    pass

# Demo / Test cases

if __name__ == "__main__":
    operations1 = ["trouncy", "flouncy", "flouncy"]
    print(final_value_after_operations(operations1))  # Output: 2

    operations2 = ["bouncy", "bouncy", "flouncy"]
    print(final_value_after_operations(operations2))  # Output: 4

"""
Problem 6: Acronym

Given an array of strings words and a string s, implement a function is_acronym() that returns True if s is an acronym of words and returns False otherwise.

The string s is considered an acronym of words if it can be formed by concatenating the first character of each string in words in order. For example, "pb" can be formed from ["pooh", "bear"], but it can't be formed from ["bear", "pooh"].

Example Usage:

words = ["christopher", "robin", "milne"]
s = "crm"
is_acronym(words, s)  # Output: True
"""

def is_acronym(words, s):
    concatenated = ''.join(word[0] for word in words)  # Concatenate the first characters of each word
    return concatenated == s  # Check if the concatenated string matches s

    pass

"""
Problem 7: Good Things Come in Threes

Write a function make_divisible_by_3() that accepts an integer array nums. In one operation, you can add or subtract 1 from any element of nums. Return the minimum number of operations to make all elements of nums divisible by 3.

Example Usage:

nums = [1, 2, 3, 4]
make_divisible_by_3(nums)  # Output: 3

nums = [3, 6, 9]
make_divisible_by_3(nums)  # Output: 0
"""

def make_divisible_by_3(nums):
   def make_divisible_by_3(nums):
    min_operations = 0
    for num in nums:
        remainder = num % 3
        if remainder == 0:
            continue
        else:
            min_operations += 1  # For remainder 1 or 2, only 1 operation is needed
    return min_operations  # Return the total minimum operations needed to make all elements divisible by 3
    pass

"""
Problem 8: Exclusive Elements

Given two lists lst1 and lst2, write a function exclusive_elemts() that returns a new list that contains the elements which are in lst1 but not in lst2 and the elements that are in lst2 but not in lst1.

Example Usage:

lst1 = ["pooh", "roo", "piglet"]
lst2 = ["piglet", "eeyore", "owl"]
exclusive_elemts(lst1, lst2)  # Output: ["pooh", "roo", "eeyore", "owl"]

lst1 = ["pooh", "roo"]
lst2 = ["piglet", "eeyore", "owl", "kanga"]
exclusive_elemts(lst1, lst2)  # Output: ["pooh", "roo", "piglet", "eeyore", "owl", "kanga"]

lst1 = ["pooh", "roo", "piglet"]
lst2 = ["pooh", "roo", "piglet"]
exclusive_elemts(lst1, lst2)  # Output: []
"""

def exclusive_elemts(lst1, lst2):
    exclusive = []
    for item in lst1: 
        if item not in lst2: 
            exclusive.append(item)
    for item in lst2:
        if item not in lst1:
            exclusive.append(item)
    return exclusive  # Return the list of exclusive elements from both lists   
    pass

# Demo / Test cases
if __name__ == "__main__":
    lst1 = ["pooh", "roo", "piglet"]
    lst2 = ["piglet", "eeyore", "owl"]
    print(exclusive_elemts(lst1, lst2))  # Output: ["pooh", "roo", "eeyore", "owl"]

    lst1 = ["pooh", "roo"]
    lst2 = ["piglet", "eeyore", "owl", "kanga"]
    print(exclusive_elemts(lst1, lst2))  # Output: ["pooh", "roo", "piglet", "eeyore", "owl", "kanga"]

    lst1 = ["pooh", "roo", "piglet"]
    lst2 = ["pooh", "roo", "piglet"]
    print(exclusive_elemts(lst1, lst2))  # Output: []

"""
Problem 9: Merge Strings Alternately

Write a function merge_alternately() that accepts two strings word1 and word2. Merge the strings by adding letters in alternating order, starting with word1. If a string is longer than the other, append the additional letters onto the end of the merged string.

Return the merged string.

Example Usage:

word1 = "wol"
word2 = "oze"
merge_alternately(word1, word2)  # Output: "woozle"

word1 = "hfa"
word2 = "eflump"
merge_alternately(word1, word2)  # Output: "heffalump"

word1 = "eyre"
word2 = "eo"
merge_alternately(word1, word2)  # Output: "eeyore"
"""

def merge_alternately(word1, word2):
    """
    Merge two strings by alternating their characters. If one string is longer,
    append the remaining characters at the end.

    This approach uses slicing and list appending for readability and efficiency.
    Instead of using a nested for loop (like you might in C++), we:
      - Loop through both strings up to the length of the shorter one, appending one character from each at a time.
      - Then, append any remaining characters from the longer string using slicing:
        merged.append(word1[min_length:])  # Adds leftover characters from word1, if any
        merged.append(word2[min_length:])  # Adds leftover characters from word2, if any
    This is much cleaner and more Pythonic than a nested loop.

    Example:
        word1 = "hfa"
        word2 = "eflump"
        # After the loop: merged = ['h', 'e', 'f', 'f', 'a', 'l']
        # word1[3:] is '', word2[3:] is 'ump'
        # Final merged: ['h', 'e', 'f', 'f', 'a', 'l', '', 'ump'] -> "heffalump"
    """
    merged = []
    min_length = min(len(word1), len(word2))

    for i in range(min_length):
        merged.append(word1[i])
        merged.append(word2[i])
    merged.append(word1[min_length:])  # Append remaining characters from word1 if any
    merged.append(word2[min_length:])  # Append remaining characters from word2 if any
    return ''.join(merged)  # Join the list into a string and return it
    pass

"""
Problem 10: Eeyore's House

Eeyore has collected two piles of sticks to rebuild his house and needs to choose pairs of sticks whose lengths are the right proportion. Write a function good_pairs() that accepts two integer arrays pile1 and pile2 where each integer represents the length of a stick. The function also accepts a positive integer k. The function should return the number of good pairs.

A pair (i, j) is called good if pile1[i] is divisible by pile2[j] * k. Assume 0 <= i <= len(pile1) - 1 and 0 <= j <= len(pile2) - 1

Example Usage:

pile1 = [1, 3, 4]
pile2 = [1, 3, 4]
k = 1
good_pairs(pile1, pile2, k)  # Output: 5

pile1 = [1, 2, 4, 12]
pile2 = [2, 4]
k = 3
good_pairs(pile1, pile2, k)  # Output: 2
"""

def good_pairs(pile1, pile2, k):
    count = 0
    for i in range(len(pile1)):
        for j in range(len(pile2)):
            if pile1[i] % (pile2[j] * k) == 0:  # Check if pile1[i] is divisible by pile2[j] * k
                count += 1  # Increment count for each good pair found
    return count  # Return the total count of good pairs found
    pass

# ==========================
# Version 2 Standard Set
# ==========================
"""
Problem 1: String Array Equivalency

Given two string arrays word1 and word2, return True if the two arrays represent the same string, and False otherwise.

A string is represented by an array if the array elements concatenated in order forms the string.

Example Usage:

word1 = ["bat", "man"]
word2 = ["b", "atman"]
are_equivalent(word1, word2)  # Output: True

word1 = ["alfred", "pennyworth"]
word2 = ["alfredpenny", "word"]
are_equivalent(word1, word2)  # Output: False

word1  = ["cat", "wom", "an"]
word2 = ["catwoman"]
are_equivalent(word1, word2)  # Output: True

💡Hint: String Methods
"""

def are_equivalent(word1, word2):
    pass

"""
Problem 2: Count Even Strings

Implement a function count_evens() that accepts a list of strings lst as a parameter. The function should return the number of strings with an even length in the list.

Example Usage:

lst = ["na", "nana", "nanana", "batman", "!"]
count_evens(lst)  # Output: 4

lst = ["the", "joker", "robin"]
count_evens(lst)  # Output: 0

lst = ["you", "either", "die", "a", "hero", "or", "you", "live", "long", "enough", "to", "see", "yourself", "become", "the", "villain"]
count_evens(lst)  # Output: 9

💡 Remainders with Modulus Division
"""

def count_evens(lst):
    pass

"""
Problem 3: Secret Identity

Write a function remove_name() to keep Batman's secret identity hidden. The function accepts a list of names people and a string secret_identity and should return the list with any instances of secret_identity removed. The list must be modified in place; you may not create any new lists as part of your solution. Relative order of the remaining elements must be maintained.

Example Usage:

people = ['Batman', 'Superman', 'Bruce Wayne', 'The Riddler', 'Bruce Wayne']
secret_identity = 'Bruce Wayne'
remove_name(people, secret_identity)  # Output: ['Batman', 'Superman', 'The Riddler']

💡Hint: While Loops
"""

def remove_name(people, secret_identity):
    pass

"""
Problem 4: Count Digits

Given a non-negative integer n, write a function count_digits() that returns the number of digits in n. You may not cast n to a string.

Example Usage:

n = 964
count_digits(n)  # Output: 3

n = 0
count_digits(n)  # Output: 1

💡 Hint: Floor Division
"""

def count_digits(n):
    pass

"""
Problem 5: Move Zeroes

Write a function move_zeroes that accepts an integer array nums and returns a new list with all 0s moved to the end of list. The relative order of the non-zero elements in the original list should be maintained.

Example Usage:

lst = [1, 0, 2, 0, 3, 0]
move_zeroes(lst)  # Output: [1, 2, 3, 0, 0, 0]
"""

def move_zeroes(lst):
    pass

"""
Problem 6: Reverse Vowels of a String

Given a string s, reverse only all the vowels in the string and return it.

The vowels are 'a', 'e', 'i', 'o', and 'u', and they can appear in both lower and upper cases and more than once.

Example Usage:

s = "robin"
reverse_vowels(s)  # Output: "ribon"

s = "BATgirl"
reverse_vowels(s)  # Output: "BiTgArl"

s = "batman"
reverse_vowels(s)  # Output: "batman"
"""

def reverse_vowels(s):
    pass

"""
Problem 7: Vantage Point

Batman is going on a scouting trip, surveying an area where he thinks Harley Quinn might commit her next crime spree. The area has many hills with different heights and Batman wants to find the tallest one to get the best vantage point. His scout trip consists of n + 1 points at different altitudes. Batman starts his trip at point 0 with altitude 0.

Write a function highest_altitude() that accepts an integer array gain of length n where gain[i] is the net gain in altitude between points i​​​​​​ and i + 1 for all (0 <= i < n). Return the highest altitude of a point.

Example Usage:

gain = [-5, 1, 5, 0, -7]
highest_altitude(gain)  # Output: 1

gain = [-4, -3, -2, -1, 4, 3, 2]
highest_altitude(gain)  # Output: 0
"""

def highest_altitude(gain):
    pass

"""
Problem 8: Left and Right Sum Differences

Given a 0-indexed integer array nums, write a function left_right_difference that returns a 0-indexed integer array answer where:

len(answer) == len(nums)
answer[i] = left_sum[i] - right_sum[i]

Where:
left_sum[i] is the sum of elements to the left of the index i in the array nums. If there is no such element, left_sum[i] = 0
right_sum[i] is the sum of elements to the right of the index i in the array nums. If there is no such element, right_sum[i] = 0

Example Usage:

nums = [10, 4, 8, 3]
left_right_difference(nums)  # Output: [-15, -1, 11, 22]

nums = [1]
left_right_difference(nums)  # Output: [0]
"""

def left_right_difference(nums):
    pass

"""
Problem 9: Common Cause

Write a function common_elements() that takes in two lists lst1 and lst2 and returns a list of the elements that are common to both lists.

Example Usage:

lst1 = ["super strength", "super speed", "x-ray vision"]
lst2 = ["super speed", "time travel", "dimensional travel"]
common_elements(lst1, lst2)  # Output: ["super speed"]

lst1 = ["super strength", "super speed", "x-ray vision"]
lst2 = ["martial arts", "stealth", "master detective"]
common_elements(lst1, lst2)  # Output: []

✨ AI Hint: Nested Loops
"""

def common_elements(lst1, lst2):
    pass

"""
Problem 10: Exposing Superman

Metropolis has a population n, with each citizen assigned an integer id from 1 to n. There's a rumor that Superman is an ordinary citizen among this group.

If Superman is an ordinary citizen, then:
Superman trusts nobody.
Everybody (except for Superman) trusts Superman.
There is exactly one citizen that satisfies properties 1 and 2.

Write a function expose_superman() that accepts a 2D array trust where trust[i] = [ai, bi] representing that the person labeled ai trusts the person labeled bi. If a trust relationship does not exist in trust array, then such a trust relationship does not exist.

Return the label of Superman if he is hiding amongst the population and can be identified, or return -1 otherwise.

Example Usage:

n = 2
trust = [[1, 2]]
expose_superman(trust, n)  # Output: 2

n = 3
trust = [[1, 3], [2, 3]]
expose_superman(trust, n)  # Output: 3

n = 3
trust = [[1, 3], [2, 3], [3, 1]]
expose_superman(trust, n)  # Output: -1
"""

def expose_superman(trust, n):
    pass