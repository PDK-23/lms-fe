import type { Practice } from "@/types";

export const PRACTICES: Practice[] = [
  {
    id: "p1",
    title: "Two Sum",
    slug: "two-sum",
    description:
      "Given an array of integers, return indices of the two numbers such that they add up to a specific target.",
    difficulty: "easy",
    defaultLanguage: "javascript",
    tags: ["array", "hash-map", "two-pointers"],
    templates: {
      javascript: "function twoSum(nums, target) {\n  // your code\n}",
      python: "def two_sum(nums, target):\n    # your code\n    pass",
      java: "class Solution {\n    public int[] twoSum(int[] nums, int target) {\n        // your code\n    }\n}",
      cpp: "class Solution {\npublic:\n    vector<int> twoSum(vector<int>& nums, int target) {\n        // your code\n    }\n};",
    },
    tests: [
      { input: "[2,7,11,15],9", output: "[0,1]" },
      { input: "[3,2,4],6", output: "[1,2]" },
    ],
  },
  {
    id: "p2",
    title: "Reverse String",
    slug: "reverse-string",
    description: "Reverse the input string in-place.",
    difficulty: "easy",
    defaultLanguage: "python",
    tags: ["string"],
    templates: {
      python: "def reverse_string(s):\n    # your code\n    pass",
      javascript: "function reverseString(s) {\n  // your code\n}",
      java: "class Solution {\n    public String reverseString(String s) {\n        // your code\n    }\n}",
      cpp: "class Solution {\npublic:\n    string reverseString(string s) {\n        // your code\n    }\n};",
    },
    tests: [{ input: "hello", output: "olleh" }],
  },
  {
    id: "p3",
    title: "Valid Parentheses",
    slug: "valid-parentheses",
    description:
      "Given a string containing only '(', ')', '{', '}', '[' and ']', determine if the input string is valid. An input is valid if open brackets are closed in the correct order.",
    difficulty: "easy",
    defaultLanguage: "javascript",
    tags: ["stack", "string"],
    templates: {
      javascript: "function isValid(s) {\n  // your code\n}",
      python: "def is_valid(s):\n    # your code\n    pass",
      java: "class Solution {\n    public boolean isValid(String s) {\n        // your code\n    }\n}",
      cpp: "class Solution {\npublic:\n    bool isValid(string s) {\n        // your code\n    }\n};",
    },
    tests: [
      { input: "()", output: "true" },
      { input: "()[]{}", output: "true" },
      { input: "(]", output: "false" },
    ],
  },
];

export default PRACTICES;
