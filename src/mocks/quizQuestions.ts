export interface MockQuestion {
  id: string;
  text: string;
  choices: string[];
  correct: number; // index of the correct choice
}

// 50 mock multiple-choice questions covering CS and general knowledge
export const MOCK_QUIZ_QUESTIONS: MockQuestion[] = [
  {
    id: "q1",
    text: "What is the time complexity of binary search?",
    choices: ["O(n)", "O(log n)", "O(n log n)", "O(1)"],
    correct: 1,
  },
  {
    id: "q2",
    text: "Which data structure uses FIFO?",
    choices: ["Stack", "Queue", "Tree", "Graph"],
    correct: 1,
  },
  {
    id: "q3",
    text: "HTML stands for:",
    choices: [
      "HyperText Markup Language",
      "HighText Machine Language",
      "Hyperlinks and Text Markup Language",
      "Home Tool Markup Language",
    ],
    correct: 0,
  },
  {
    id: "q4",
    text: "Which protocol is used to transfer web pages?",
    choices: ["FTP", "HTTP", "SMTP", "SSH"],
    correct: 1,
  },
  {
    id: "q5",
    text: "Which language is primarily used for styling web pages?",
    choices: ["HTML", "Python", "CSS", "Java"],
    correct: 2,
  },
  {
    id: "q6",
    text: "Which sorting algorithm has average-case O(n log n)?",
    choices: ["Bubble Sort", "Insertion Sort", "Quick Sort", "Selection Sort"],
    correct: 2,
  },
  {
    id: "q7",
    text: "In git, which command creates a new branch?",
    choices: ["git merge", "git branch", "git push", "git init"],
    correct: 1,
  },
  {
    id: "q8",
    text: "Which keyword declares a constant in JavaScript?",
    choices: ["let", "const", "var", "static"],
    correct: 1,
  },
  {
    id: "q9",
    text: "Which of these is a NoSQL database?",
    choices: ["MySQL", "PostgreSQL", "MongoDB", "SQLite"],
    correct: 2,
  },
  {
    id: "q10",
    text: "What does API stand for?",
    choices: [
      "Application Programming Interface",
      "Application Performance Index",
      "Applied Programming Integration",
      "Advanced Programming Interface",
    ],
    correct: 0,
  },
  {
    id: "q11",
    text: "Which HTML element represents the main heading?",
    choices: ["<h1>", "<title>", "<header>", "<main>"],
    correct: 0,
  },
  {
    id: "q12",
    text: "What is a primary use of CSS Grid?",
    choices: [
      "Styling text color",
      "Laying out page components",
      "Running code on server",
      "Managing databases",
    ],
    correct: 1,
  },
  {
    id: "q13",
    text: "Which HTTP status code means 'Not Found'?",
    choices: ["200", "301", "404", "500"],
    correct: 2,
  },
  {
    id: "q14",
    text: "Which Python keyword defines a function?",
    choices: ["func", "def", "function", "lambda"],
    correct: 1,
  },
  {
    id: "q15",
    text: "What is the main purpose of unit tests?",
    choices: [
      "Design UI",
      "Test individual components",
      "Deploy application",
      "Optimize queries",
    ],
    correct: 1,
  },
  {
    id: "q16",
    text: "Which technology is used for containerization?",
    choices: ["Docker", "Kubernetes", "Vagrant", "VirtualBox"],
    correct: 0,
  },
  {
    id: "q17",
    text: "Which metric measures web page load performance?",
    choices: [
      "LCP (Largest Contentful Paint)",
      "DBR (Database Response)",
      "CPU Load Index",
      "CSS Weight",
    ],
    correct: 0,
  },
  {
    id: "q18",
    text: "Which operator is used for strict equality in JavaScript?",
    choices: ["=", "==", "===", "!=="],
    correct: 2,
  },
  {
    id: "q19",
    text: "Which of the following is not a primitive data type in JavaScript?",
    choices: ["Number", "String", "Object", "Boolean"],
    correct: 2,
  },
  {
    id: "q20",
    text: "Which command installs packages using npm?",
    choices: ["npm install", "npm create", "npm run", "npm init"],
    correct: 0,
  },
  {
    id: "q21",
    text: "What does SQL stand for?",
    choices: [
      "Structured Query Language",
      "Simple Query Language",
      "Sequential Query Language",
      "Secure Query Language",
    ],
    correct: 0,
  },
  {
    id: "q22",
    text: "Which design principle encourages separation of concerns?",
    choices: ["DRY", "KISS", "SOLID", "YAGNI"],
    correct: 2,
  },
  {
    id: "q23",
    text: "Which HTML attribute sets the image source?",
    choices: ["src", "href", "alt", "title"],
    correct: 0,
  },
  {
    id: "q24",
    text: "Which keyword in Java marks a class method as not returning anything?",
    choices: ["void", "null", "none", "empty"],
    correct: 0,
  },
  {
    id: "q25",
    text: "Which of the following is a frontend framework?",
    choices: ["Django", "React", "Spring", "Flask"],
    correct: 1,
  },
  {
    id: "q26",
    text: "What is the default port for HTTPS?",
    choices: ["80", "443", "21", "25"],
    correct: 1,
  },
  {
    id: "q27",
    text: "Which algorithm finds shortest paths in graphs?",
    choices: ["Kruskal", "Prim", "Dijkstra", "Floyd"],
    correct: 2,
  },
  {
    id: "q28",
    text: "Which of these is a package manager for Python?",
    choices: ["pip", "npm", "yarn", "composer"],
    correct: 0,
  },
  {
    id: "q29",
    text: "Which CSS property controls spacing between elements?",
    choices: ["padding", "color", "font-size", "display"],
    correct: 0,
  },
  {
    id: "q30",
    text: "In REST, which HTTP method is used to update a resource?",
    choices: ["GET", "POST", "PUT", "DELETE"],
    correct: 2,
  },
  {
    id: "q31",
    text: "Which cloud provider offers S3 object storage?",
    choices: ["Azure", "Google Cloud", "AWS", "Heroku"],
    correct: 2,
  },
  {
    id: "q32",
    text: "What is the term for deploying code to production quickly and frequently?",
    choices: [
      "Waterfall",
      "Manual Release",
      "Continuous Delivery",
      "Monolithic Delivery",
    ],
    correct: 2,
  },
  {
    id: "q33",
    text: "Which data structure is LIFO?",
    choices: ["Queue", "Stack", "Heap", "Graph"],
    correct: 1,
  },
  {
    id: "q34",
    text: "Which SQL clause filters rows?",
    choices: ["ORDER BY", "GROUP BY", "WHERE", "HAVING"],
    correct: 2,
  },
  {
    id: "q35",
    text: "Which JS method converts JSON string to object?",
    choices: ["JSON.stringify", "JSON.parse", "JSON.toObj", "JSON.decode"],
    correct: 1,
  },
  {
    id: "q36",
    text: "Which tool is commonly used for end-to-end testing?",
    choices: ["Jest", "Cypress", "ESLint", "Prettier"],
    correct: 1,
  },
  {
    id: "q37",
    text: "Which of these is a vector graphics format?",
    choices: ["PNG", "JPG", "SVG", "BMP"],
    correct: 2,
  },
  {
    id: "q38",
    text: "Which HTML element is used for lists?",
    choices: ["<ul>", "<div>", "<section>", "<article>"],
    correct: 0,
  },
  {
    id: "q39",
    text: "Which protocol secures data in transit for web traffic?",
    choices: ["FTP", "SFTP", "HTTP", "HTTPS"],
    correct: 3,
  },
  {
    id: "q40",
    text: "Which of the following is a functional programming language?",
    choices: ["Haskell", "PHP", "Perl", "Bash"],
    correct: 0,
  },
  {
    id: "q41",
    text: "Which term refers to making websites accessible to all users?",
    choices: ["SEO", "UX", "Accessibility", "Analytics"],
    correct: 2,
  },
  {
    id: "q42",
    text: "In CSS, which unit is relative to font size?",
    choices: ["px", "em", "%", "vh"],
    correct: 1,
  },
  {
    id: "q43",
    text: "Which HTML attribute provides alternative text for images?",
    choices: ["title", "alt", "caption", "label"],
    correct: 1,
  },
  {
    id: "q44",
    text: "Which is an example of a single-page application framework?",
    choices: ["Angular", "Rails", "Laravel", "Spring"],
    correct: 0,
  },
  {
    id: "q45",
    text: "Which command shows current git branch?",
    choices: ["git status", "git branch", "git show", "git log"],
    correct: 1,
  },
  {
    id: "q46",
    text: "Which HTML input type is used for email?",
    choices: ["text", "email", "tel", "url"],
    correct: 1,
  },
  {
    id: "q47",
    text: "What is the purpose of a CDN?",
    choices: [
      "Store user data",
      "Serve content closer to users",
      "Encrypt traffic",
      "Manage databases",
    ],
    correct: 1,
  },
  {
    id: "q48",
    text: "Which CSS property controls element visibility?",
    choices: ["opacity", "display", "visibility", "All of the above"],
    correct: 3,
  },
  {
    id: "q49",
    text: "Which algorithm is used for page ranking in search engines?",
    choices: ["Dijkstra", "PageRank", "K-means", "A*"],
    correct: 1,
  },
  {
    id: "q50",
    text: "Which HTML element defines a paragraph?",
    choices: ["<p>", "<span>", "<div>", "<section>"],
    correct: 0,
  },
];

export interface QuizMeta {
  id: string;
  lessonId?: string;
  title: string;
  duration: number; // minutes
  isGraded?: boolean;
  due?: string | null; // human-friendly due date
}

export const QUIZ_METADATA: QuizMeta[] = [
  {
    id: "meta-l1",
    lessonId: "l1",
    title: "Động lực và bối cảnh chuyển đổi số",
    duration: 30,
    isGraded: true,
    due: "Dec 21, 2:59 PM +07",
  },
  {
    id: "meta-default",
    title: "Quick Practice",
    duration: 15,
    isGraded: false,
    due: null,
  },
];

export function getQuizMeta(lessonId?: string) {
  if (!lessonId) return QUIZ_METADATA[1];
  return QUIZ_METADATA.find((m) => m.lessonId === lessonId) || QUIZ_METADATA[1];
}

export default MOCK_QUIZ_QUESTIONS;
