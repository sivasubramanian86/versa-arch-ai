/* eslint-disable @typescript-eslint/no-explicit-any */
import { LearningState } from "@/types/learning-state";

export const MOCK_RESPONSES: Record<string, Partial<LearningState>> = {
    "Rust Borrow Checker": {
        personalized_path: {
            recommended_topic: "Rust Ownership & Borrowing",
            difficulty_level: 8,
            estimated_duration: 45,
            learning_sequence: ["Stack vs Heap", "Ownership Rules", "References & Borrowing", "Lifetimes"],
            personalization_rationale: "Given the complexity of Rust's memory model, we'll start with foundational stack/heap concepts before diving into the borrow checker rules."
        },
        diagram_json: {
            nodes: [
                { id: '1', position: { x: 100, y: 100 }, data: { label: 'Data Source' } },
                { id: '2', position: { x: 300, y: 100 }, data: { label: 'Borrow Checker' } },
                { id: '3', position: { x: 500, y: 50 }, data: { label: 'Immutable Ref' } },
                { id: '4', position: { x: 500, y: 150 }, data: { label: 'Mutable Ref' } }
            ],
            edges: [
                { id: 'e1-2', source: '1', target: '2' },
                { id: 'e2-3', source: '2', target: '3', label: 'Allow N' },
                { id: 'e2-4', source: '2', target: '4', label: 'Allow 1' }
            ]
        } as any,
        cheat_sheet: [
            "**Rule 1**: Each value in Rust has a variable that’s called its *owner*.",
            "**Rule 2**: There can only be one owner at a time.",
            "**Rule 3**: When the owner goes out of scope, the value will be dropped.",
            "**Borrowing**: You can have *either* one mutable reference OR any number of immutable references.",
            "**Lifetimes**: Ensure references are valid as long as they are used."
        ],
        analogy_content: {
            analogy: "The Borrow Checker is like a Strict Librarian",
            explanation: "The Librarian (Borrow Checker) controls access to books (Data). You can have many people reading a book at once (Immutable References), but if someone wants to write in it (Mutable Reference), they must be the ONLY one with the book, and no one else can read it until they return it."
        },
        flashcards: [
            { front: "What is Ownership in Rust?", back: "A set of rules that govern how a Rust program manages memory." },
            { front: "Can you have two mutable references to the same data?", back: "No, Rust prevents data races by allowing only one mutable reference at a time." },
            { front: "What happens when an owner goes out of scope?", back: "The value is dropped and the memory is freed." }
        ],
        retrieved_knowledge: [
            {
                concept: "Memory Safety",
                explanation: "Rust achieves memory safety without a garbage collector through its ownership system.",
                source: "doc.rust-lang.org",
                credibility: 1.0,
                last_updated: "2024-01-20"
            }
        ],
        external_resources: [
            {
                type: "course",
                title: "Learn Rust by Building Real-World Applications",
                url: "https://www.udemy.com/course/learn-rust-by-building-real-world-applications/",
                description: "The best way to learn Rust is by building projects.",
                provider: "Udemy"
            },
            {
                type: "video",
                title: "Rust Borrow Checker Explained",
                url: "https://www.youtube.com/watch?v=8M0QfLUDaaA",
                description: "Visual explanation of ownership and borrowing.",
                provider: "YouTube"
            },
            {
                type: "book",
                title: "The Rust Programming Language",
                url: "https://doc.rust-lang.org/book/",
                description: "The official guide to Rust programming.",
                provider: "doc.rust-lang.org"
            }
        ],
        competency_assessment: {
            current_score: 0,
            confidence_level: 0,
            mastery_indicators: [],
            gaps_detected: [],
            micro_quiz: [
                {
                    type: "mcq",
                    question: "What happens if you try to have a mutable reference while an immutable reference is active?",
                    options: ["It works fine", "Compiler Error", "Runtime Error"],
                    answer: "Compiler Error",
                    explanation: "Rust forbids aliasing (multiple pointers) combined with mutability to prevent data races."
                },
                {
                    type: "mcq",
                    question: "Where is static data stored in Rust?",
                    options: ["Stack", "Heap", "Binary Data Section"],
                    answer: "Binary Data Section",
                    explanation: "Static data is baked into the executable."
                }
            ]
        }
    },
    "React State Management": {
        personalized_path: {
            recommended_topic: "Advanced State Management",
            difficulty_level: 6,
            estimated_duration: 30,
            learning_sequence: ["Local State (useState)", "Context API", "Server State (TanStack)", "Global Stores (Zustand)"],
            personalization_rationale: "This path moves from built-in React hooks to modern external libraries."
        },
        diagram_json: {
            nodes: [
                { id: 'n1', position: { x: 250, y: 0 }, data: { label: 'Store (Zustand)' } },
                { id: 'n2', position: { x: 0, y: 150 }, data: { label: 'Component A' } },
                { id: 'n3', position: { x: 500, y: 150 }, data: { label: 'Component B' } }
            ],
            edges: [
                { id: 'e1', source: 'n1', target: 'n2', label: 'Subscribe' },
                { id: 'e2', source: 'n1', target: 'n3', label: 'Update' }
            ]
        } as any,
        cheat_sheet: [
            "**useState**: for simple, local component state.",
            "**useContext**: for avoiding prop-drilling global data (themes, user).",
            "**useReducer**: for complex state logic/transitions.",
            "**Zustand/Redux**: for global app state accessible anywhere.",
            "**TanStack Query**: for async server state (caching, fetching)."
        ],
        analogy_content: {
            analogy: "State Management is like a Water System",
            explanation: "Props are like buckets passed bucket-brigade style (Prop Drilling). Context is like a sprinkler system raining water down on everything. Zustand/Redux is like a central water tank with pipes directly to where it's needed."
        },
        flashcards: [
            { front: "What is 'Prop Drilling'?", back: "The process of passing data through multiple layers of components that don't need it." },
            { front: "When should you use useMemo?", back: "When you want to cache the result of a computationally expensive calculation." }
        ],
        retrieved_knowledge: [
            {
                concept: "State",
                explanation: "State represents the parts of the app that can change over time.",
                source: "react.dev",
                credibility: 1.0,
                last_updated: "2024-01-25"
            }
        ],
        external_resources: [
            {
                type: "course",
                title: "The Ultimate React Course 2024",
                url: "https://www.udemy.com/course/the-ultimate-react-course/",
                description: "Master React by building high-quality apps.",
                provider: "Udemy"
            },
            {
                type: "video",
                title: "React State Management in 2024",
                url: "https://www.youtube.com/watch?v=-HeZ7uK6YlY",
                description: "Comparison of Zustand, Redux, and Context.",
                provider: "YouTube"
            }
        ],
        competency_assessment: {
            current_score: 0,
            confidence_level: 0,
            mastery_indicators: [],
            gaps_detected: [],
            micro_quiz: [
                {
                    type: "mcq",
                    question: "Which hook is used for side effects in React?",
                    options: ["useState", "useContext", "useEffect"],
                    answer: "useEffect",
                    explanation: "useEffect is the standard hook for handling side effects like data fetching or DOM manipulation."
                }
            ]
        }
    },
    "GCP Architecture": {
        personalized_path: {
            recommended_topic: "Google Cloud Platform Fundamentals",
            difficulty_level: 5,
            estimated_duration: 40,
            learning_sequence: ["Compute (GCE, GKE)", "Storage (GCS, SQL)", "Networking (VPC)", "Serverless (Cloud Run)"],
            personalization_rationale: "Focusing on the core pillars of GCP infrastructure."
        },
        diagram_json: {
            nodes: [
                { id: 'g1', position: { x: 250, y: 0 }, data: { label: 'Load Balancer' } },
                { id: 'g2', position: { x: 0, y: 150 }, data: { label: 'Managed Instance Group' } },
                { id: 'g3', position: { x: 500, y: 150 }, data: { label: 'Cloud SQL' } }
            ],
            edges: [
                { id: 'eg1', source: 'g1', target: 'g2' },
                { id: 'eg2', source: 'g2', target: 'g3' }
            ]
        } as any,
        cheat_sheet: [
            "**Compute Engine**: Virtual Machines (IaaS).",
            "**GKE**: Managed Kubernetes.",
            "**Cloud Run**: Serverless Containers (PaaS).",
            "**Cloud Functions**: Event-driven snippets (FaaS).",
            "**BigQuery**: Serverless Data Warehouse."
        ],
        flashcards: [
            { front: "What is Cloud Run?", back: "A managed compute platform that enables you to run stateless containers that are automatable via HTTP requests." },
            { front: "Difference between Region and Zone?", back: "A region is a specific geographical location. A zone is an isolated location within a region." }
        ],
        retrieved_knowledge: [
            {
                concept: "Regions & Zones",
                explanation: "GCP divides its infrastructure into geographical regions, each with multiple zones for high availability.",
                source: "cloud.google.com",
                credibility: 1.0,
                last_updated: "2024-01-15"
            }
        ],
        external_resources: [
            {
                type: "course",
                title: "GCP Architecture Specialization",
                url: "https://www.coursera.org/specializations/gcp-architecture",
                description: "Prepare for the Professional Cloud Architect certification.",
                provider: "Coursera"
            },
            {
                type: "book",
                title: "Official Google Cloud Certified PCA Guide",
                url: "https://www.amazon.com/Google-Cloud-Certified-Professional-Architect/dp/1119602441",
                description: "Definitive study guide for GCP architects.",
                provider: "Amazon"
            }
        ],
        competency_assessment: {
            current_score: 0,
            confidence_level: 0,
            mastery_indicators: [],
            gaps_detected: [],
            micro_quiz: [
                {
                    type: "mcq",
                    question: "Which GCP service is best for running containerized apps without managing servers?",
                    options: ["Compute Engine", "Cloud Run", "BigQuery"],
                    answer: "Cloud Run",
                    explanation: "Cloud Run is a fully managed serverless platform for containers."
                }
            ]
        }
    },
    "YouTube: https://youtu.be/kOa_llowQ1E": {
        domain: "Kubernetes Deep Dive",
        detected_intent: "DISSECT",
        personalized_path: {
            recommended_topic: "Kubernetes Control Plane",
            difficulty_level: 7,
            estimated_duration: 12,
            learning_sequence: ["API Server", "Scheduler", "ETCD"],
        } as any,
        source_context: "[TRANSCRIPT START] Welcome to this deep dive into Kubernetes Architecture. Today we're talking about the Control Plane and Worker Nodes. The API Server is the front door. The Scheduler decides where pods go. ETCD stores the cluster state. This is the source of truth. [TRANSCRIPT END]",
        source_metadata: { type: "video", url: "https://youtu.be/kOa_llowQ1E", title: "Kubernetes Deep Dive" },
        cheat_sheet: [
            "**API Server**: The only component that talks to ETCD.",
            "**Scheduler**: Assigns work to nodes based on resource availability.",
            "**ETCD**: Key-value store for cluster state."
        ],
        diagram_json: {
            nodes: [
                { id: '1', position: { x: 250, y: 0 }, data: { label: 'API Server' } },
                { id: '2', position: { x: 100, y: 150 }, data: { label: 'Scheduler' } },
                { id: '3', position: { x: 400, y: 150 }, data: { label: 'ETCD' } }
            ],
            edges: [
                { id: 'e1', source: '2', target: '1', label: 'Informs' },
                { id: 'e2', source: '1', target: '3', label: 'Writes' }
            ]
        } as any
    },
    "Book: Clean Architecture": {
        domain: "Clean Architecture",
        detected_intent: "DISSECT",
        source_context: "[BOOK CONTENT: Clean Architecture] Chapter 1: The First Principles. In this chapter, we explore how systems thinking applies to software. Isolation of concerns is paramount. Scalability is a side effect of good design. Complexity is the enemy of reliability.",
        source_metadata: { type: "book", title: "Clean Architecture" },
        cheat_sheet: [
            "**Isolation of Concerns**: Keep business logic separate from delivery mechanisms.",
            "**Design for Scalability**: Good architecture makes scaling secondary.",
            "**Minimize Complexity**: Reliability decreases as complexity increases."
        ],
        personalized_path: {
            recommended_topic: "Architectural Boundaries",
            difficulty_level: 9,
            estimated_duration: 30,
            learning_sequence: ["Entities", "Use Cases", "Adapters"],
        } as any
    }
};
