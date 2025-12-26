export interface LessonResource {
  id: string;
  title: string;
  type: string;
  icon: string;
  bgColor: string;
  iconColor: string;
}

export interface CommentReply {
  id: string;
  author: string;
  authorInitials: string;
  avatarColor: string;
  timestamp: string;
  content: string;
  likes: number;
}

export interface LessonComment {
  id: string;
  author: string;
  authorInitials: string;
  avatarColor: string;
  timestamp: string;
  content: string;
  likes: number;
  replies?: CommentReply[];
}

export interface LessonData {
  description: string;
  additionalInfo: string;
  comments: LessonComment[];
}

export const LESSON_RESOURCES: LessonResource[] = [
  {
    id: "r1",
    title: "Lesson Notes",
    type: "PDF Document",
    icon: "📄",
    bgColor: "bg-indigo-100",
    iconColor: "text-indigo-600",
  },
  {
    id: "r2",
    title: "Related Articles",
    type: "3 external resources",
    icon: "🔗",
    bgColor: "bg-blue-100",
    iconColor: "text-blue-600",
  },
  {
    id: "r3",
    title: "Code Examples",
    type: "GitHub Repository",
    icon: "💾",
    bgColor: "bg-green-100",
    iconColor: "text-green-600",
  },
];

export const LESSON_COMMENTS: LessonComment[] = [
  {
    id: "c1",
    author: "John Doe",
    authorInitials: "JD",
    avatarColor: "bg-indigo-100 text-indigo-600",
    timestamp: "2 hours ago",
    content:
      "Great lesson! The explanations were clear and the examples really helped me understand the concepts better.",
    likes: 12,
    replies: [
      {
        id: "r1-1",
        author: "Instructor",
        authorInitials: "IN",
        avatarColor: "bg-purple-100 text-purple-600",
        timestamp: "1 hour ago",
        content: "Thank you! I'm glad the examples were helpful.",
        likes: 3,
      },
      {
        id: "r1-2",
        author: "Sarah Wilson",
        authorInitials: "SW",
        avatarColor: "bg-pink-100 text-pink-600",
        timestamp: "45 minutes ago",
        content: "I agree! The step-by-step approach made it much easier.",
        likes: 5,
      },
    ],
  },
  {
    id: "c2",
    author: "Alice Smith",
    authorInitials: "AS",
    avatarColor: "bg-green-100 text-green-600",
    timestamp: "1 day ago",
    content:
      "I had a question about the third example. Could you elaborate more on that part?",
    likes: 5,
    replies: [
      {
        id: "r2-1",
        author: "Instructor",
        authorInitials: "IN",
        avatarColor: "bg-purple-100 text-purple-600",
        timestamp: "23 hours ago",
        content:
          "Sure! The third example demonstrates how to handle edge cases. I'll post a detailed explanation in the resources section.",
        likes: 8,
      },
    ],
  },
  {
    id: "c3",
    author: "Mike Brown",
    authorInitials: "MB",
    avatarColor: "bg-blue-100 text-blue-600",
    timestamp: "2 days ago",
    content: "Excellent content! Looking forward to the next lesson.",
    likes: 8,
    replies: [
      {
        id: "r3-1",
        author: "Emily Chen",
        authorInitials: "EC",
        avatarColor: "bg-yellow-100 text-yellow-600",
        timestamp: "2 days ago",
        content: "Same here! This course has been amazing so far.",
        likes: 4,
      },
      {
        id: "r3-2",
        author: "David Lee",
        authorInitials: "DL",
        avatarColor: "bg-red-100 text-red-600",
        timestamp: "1 day ago",
        content: "Couldn't agree more. Best course I've taken this year!",
        likes: 6,
      },
    ],
  },
];

// Lesson-specific data mapping
const LESSON_DATA_MAP: Record<string, LessonData> = {
  l1: {
    description:
      "Welcome to the course! This introductory lesson will give you an overview of what you'll learn.",
    additionalInfo:
      "In this introductory lesson, we'll cover the course structure, learning objectives, and what you can expect throughout this journey. We'll also discuss the prerequisites and tools you'll need.",
    comments: [
      {
        id: "c1-1",
        author: "Emily Johnson",
        authorInitials: "EJ",
        avatarColor: "bg-purple-100 text-purple-600",
        timestamp: "1 hour ago",
        content:
          "Excited to start this course! The introduction looks promising.",
        likes: 15,
        replies: [
          {
            id: "r1-1-1",
            author: "Instructor",
            authorInitials: "IN",
            avatarColor: "bg-indigo-100 text-indigo-600",
            timestamp: "30 minutes ago",
            content: "Welcome! Looking forward to having you in the course.",
            likes: 5,
          },
        ],
      },
    ],
  },
  l2: {
    description:
      "A detailed overview of the course structure and main topics we'll cover.",
    additionalInfo:
      "This lesson provides a comprehensive overview of all the topics we'll be exploring. You'll understand how each section builds upon the previous one and how everything ties together at the end.",
    comments: [
      {
        id: "c2-1",
        author: "Michael Chen",
        authorInitials: "MC",
        avatarColor: "bg-green-100 text-green-600",
        timestamp: "3 hours ago",
        content: "Great overview! I can see how everything connects now.",
        likes: 20,
        replies: [],
      },
      {
        id: "c2-2",
        author: "Sarah Williams",
        authorInitials: "SW",
        avatarColor: "bg-pink-100 text-pink-600",
        timestamp: "5 hours ago",
        content: "The roadmap is very helpful. Thanks for providing that!",
        likes: 12,
        replies: [
          {
            id: "r2-2-1",
            author: "Tom Brown",
            authorInitials: "TB",
            avatarColor: "bg-yellow-100 text-yellow-600",
            timestamp: "4 hours ago",
            content:
              "Agreed! It's nice to see the big picture before diving in.",
            likes: 7,
          },
        ],
      },
    ],
  },
  l3: {
    description:
      "Learn how to set up your development environment and install necessary tools.",
    additionalInfo:
      "In this lesson, we'll walk through the complete setup process for your development environment. You'll install all the necessary tools, configure your IDE, and verify everything is working correctly.",
    comments: [
      {
        id: "c3-1",
        author: "Alex Davis",
        authorInitials: "AD",
        avatarColor: "bg-blue-100 text-blue-600",
        timestamp: "2 days ago",
        content:
          "Had some issues with the setup but the troubleshooting guide helped!",
        likes: 18,
        replies: [
          {
            id: "r3-1-1",
            author: "Instructor",
            authorInitials: "IN",
            avatarColor: "bg-indigo-100 text-indigo-600",
            timestamp: "2 days ago",
            content:
              "Glad you got it working! Feel free to ask if you run into any other issues.",
            likes: 10,
          },
        ],
      },
    ],
  },
  l4: {
    description:
      "Dive deep into the fundamental principles that form the foundation of this subject.",
    additionalInfo:
      "This lesson covers the core principles and concepts you need to master. We'll explore each principle in detail with real-world examples and practical demonstrations. By the end, you'll have a solid understanding of the fundamentals.",
    comments: [
      {
        id: "c4-1",
        author: "Jessica Lee",
        authorInitials: "JL",
        avatarColor: "bg-pink-100 text-pink-600",
        timestamp: "1 day ago",
        content:
          "This lesson is exactly what I needed! The examples made everything clear.",
        likes: 25,
        replies: [
          {
            id: "r4-1-1",
            author: "Ryan Martinez",
            authorInitials: "RM",
            avatarColor: "bg-green-100 text-green-600",
            timestamp: "1 day ago",
            content:
              "Same here! The practice exercises are really well designed.",
            likes: 11,
          },
        ],
      },
    ],
  },
};

// Default data for lessons not in the map
const DEFAULT_LESSON_DATA: LessonData = {
  description: "This is a comprehensive lesson covering important concepts.",
  additionalInfo:
    "In this lesson, you'll learn key concepts and practical applications. We'll cover step-by-step examples and provide hands-on exercises to reinforce your understanding.",
  comments: LESSON_COMMENTS,
};

export const getLessonData = (lessonId?: string): LessonData => {
  if (!lessonId) {
    return DEFAULT_LESSON_DATA;
  }

  return LESSON_DATA_MAP[lessonId] || DEFAULT_LESSON_DATA;
};

export default {
  LESSON_RESOURCES,
  LESSON_COMMENTS,
  getLessonData,
};
