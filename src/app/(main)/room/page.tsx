import MCQRequst from "@/components/gen-ui/mcq/mcq-req";
import { MessageThreadCollapsible } from "@/components/ui/message-thread-collapsible";


export const MOCK_QUESTIONS = [
  {
    id: '1',
    question: 'Which programming language was developed by Microsoft in the 1990s for Windows applications?',
    options: [
      'Java',
      'C#',
      'Python',
      'C++'
    ],
    correctAnswer: 1,
    explanation: 'C# was developed by Microsoft in 2000 as part of its .NET initiative for Windows development.',
    topic: 'Programming Languages',
    difficulty: 'easy'
  },
  {
    id: '2',
    question: 'What does the "virtual" keyword signify in C++?',
    options: [
      'The function cannot be overridden',
      'The function can be overridden in derived classes',
      'The function is statically bound',
      'The function is inline'
    ],
    correctAnswer: 1,
    explanation: 'In C++, the virtual keyword enables dynamic polymorphism by allowing functions to be overridden in derived classes.',
    topic: 'Object-Oriented Programming',
    difficulty: 'medium'
  },
  {
    id: '3',
    question: 'Which algorithm achieves O(log n) time complexity for search operations?',
    options: [
      'Linear Search',
      'Bubble Sort',
      'Binary Search',
      'Depth-First Search'
    ],
    correctAnswer: 2,
    explanation: 'Binary Search operates on sorted arrays by repeatedly dividing the search interval in half, achieving O(log n) time complexity.',
    topic: 'Algorithms',
    difficulty: 'medium'
  },
  {
    id: '4',
    question: 'In React, what hook is used to perform side effects in function components?',
    options: [
      'useState',
      'useEffect',
      'useContext',
      'useReducer'
    ],
    correctAnswer: 1,
    explanation: 'The useEffect hook allows you to perform side effects such as data fetching, subscriptions, or DOM manipulations in React function components.',
    topic: 'React',
    difficulty: 'easy'
  },
  {
    id: '5',
    question: 'What is the time complexity of quicksort in the average case?',
    options: [
      'O(n²)',
      'O(n log n)',
      'O(n)',
      'O(log n)'
    ],
    correctAnswer: 1,
    explanation: 'Quicksort has an average-case time complexity of O(n log n), though its worst-case complexity is O(n²) when the pivot selection is poor.',
    topic: 'Data Structures',
    difficulty: 'hard'
  },
  {
    id: '6',
    question: 'Which CSS property controls the stacking order of positioned elements?',
    options: [
      'z-index',
      'position',
      'display',
      'float'
    ],
    correctAnswer: 0,
    explanation: 'The z-index property specifies the stack order of an element. Elements with higher z-index values appear in front of elements with lower values.',
    topic: 'CSS',
    difficulty: 'easy'
  },
  {
    id: '7',
    question: 'What does ACID stand for in database transactions?',
    options: [
      'Atomicity, Consistency, Isolation, Durability',
      'Accuracy, Consistency, Integrity, Durability',
      'Atomicity, Consistency, Integrity, Durability',
      'Accuracy, Completeness, Isolation, Durability'
    ],
    correctAnswer: 0,
    explanation: 'ACID stands for Atomicity, Consistency, Isolation, Durability - four key properties that ensure reliable database transactions.',
    topic: 'Databases',
    difficulty: 'medium'
  },
  {
    id: '8',
    question: 'Which protocol is used for secure communication over a computer network?',
    options: [
      'HTTP',
      'FTP',
      'HTTPS',
      'SMTP'
    ],
    correctAnswer: 2,
    explanation: 'HTTPS (HTTP Secure) uses TLS/SSL encryption to secure data transmission between a client and server.',
    topic: 'Networking',
    difficulty: 'easy'
  },
  {
    id: '9',
    question: 'What is the purpose of the "this" keyword in JavaScript?',
    options: [
      'Refers to the global object',
      'Refers to the current function',
      'Refers to the object that is executing the current function',
      'Refers to the parent object'
    ],
    correctAnswer: 2,
    explanation: 'In JavaScript, "this" refers to the object that is executing the current function, though its value depends on how the function is called.',
    topic: 'JavaScript',
    difficulty: 'medium'
  },
  {
    id: '10',
    question: 'Which design pattern ensures a class has only one instance?',
    options: [
      'Factory Pattern',
      'Observer Pattern',
      'Singleton Pattern',
      'Decorator Pattern'
    ],
    correctAnswer: 2,
    explanation: 'The Singleton pattern restricts instantiation of a class to a single object and provides global access to that instance.',
    topic: 'Design Patterns',
    difficulty: 'hard'
  }
];

export default function PageWithChat() {
  return (
    <div className="relative min-h-175 p-5">
      {/* <MCQRequst questionsLists={MOCK_QUESTIONS} difficulty="easy" numberOfQuestions={18} timer={60} topic="hello" key='sdfsd'  /> */}
      <MessageThreadCollapsible
        defaultOpen={false}
        className="fixed slide-out-to-bottom-1/2 right-4 bg-linear-to-b from-yellow-50/20 via-white to-orange-50/20 border-black"
      />
    </div>
  );
}