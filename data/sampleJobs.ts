import { JobDescription } from "@/types";

export const SAMPLE_JOBS: JobDescription[] = [
  {
    id: "job-fullstack-sr",
    title: "Senior Full Stack Engineer",
    department: "Engineering",
    experienceLevel: "Senior",
    minYearsExperience: 5,
    requiredSkills: [
      "React",
      "Next.js",
      "TypeScript",
      "Node.js",
      "PostgreSQL",
      "RESTful APIs",
      "Git",
      "System Design",
    ],
    preferredSkills: [
      "Docker",
      "AWS",
      "Tailwind CSS",
      "Redis",
      "GraphQL",
      "CI/CD",
      "Unit Testing",
    ],
    education: ["Bachelor's or Master's in Computer Science or related field"],
    responsibilities: [
      "Architect and scale end-to-end full stack web applications using React, Next.js, and Node.js.",
      "Design efficient relational schemas, write optimized SQL queries, and manage Postgres databases.",
      "Lead system design discussions, maintain high test coverage, and mentor junior engineers.",
      "Collaborate with product and design teams to deliver high-impact user experiences.",
    ],
    rawText: `Position: Senior Full Stack Engineer
Department: Engineering | Experience: 5+ Years | Senior Level

We are looking for a Senior Full Stack Engineer to lead the development of our high-scale cloud platforms.

Key Requirements:
- 5+ years of software development experience with modern full stack applications.
- Strong proficiency in React, Next.js, TypeScript, and modern JavaScript (ES6+).
- Solid experience building backend services in Node.js, Express, or similar frameworks.
- Deep expertise with relational databases (PostgreSQL, MySQL), query optimization, and schema design.
- Hands-on experience with RESTful APIs, Microservices, and System Design principles.
- Experience with Docker, AWS cloud services (S3, EC2, Lambda), and CI/CD pipelines is preferred.
- Familiarity with Tailwind CSS, Redis caching, GraphQL, and Unit Testing (Jest/Vitest).
- Bachelor's degree in Computer Science, Software Engineering, or equivalent practical experience.
- Strong problem-solving, communication, and technical leadership skills.`,
  },
  {
    id: "job-frontend-mid",
    title: "Frontend Engineer (React / TypeScript)",
    department: "Frontend Team",
    experienceLevel: "Mid-level",
    minYearsExperience: 3,
    requiredSkills: [
      "React",
      "TypeScript",
      "JavaScript",
      "HTML5",
      "CSS3",
      "Tailwind CSS",
      "Git",
    ],
    preferredSkills: [
      "Next.js",
      "Redux",
      "Unit Testing",
      "RESTful APIs",
      "Problem Solving",
      "Communication",
    ],
    education: ["Bachelor's in Computer Science, Design, or equivalent"],
    responsibilities: [
      "Build delightful, accessible, and responsive user interfaces using React and Tailwind CSS.",
      "Write clean, type-safe code using TypeScript.",
      "Optimize frontend performance, Core Web Vitals, and load times.",
      "Integrate RESTful and GraphQL APIs with robust state management.",
    ],
    rawText: `Position: Frontend Engineer (React / TypeScript)
Department: Frontend Team | Experience: 3+ Years | Mid-Level

We are seeking a creative Frontend Engineer to build world-class user interfaces.

Requirements:
- 3+ years of professional experience building modern web apps with React.
- Strong proficiency in TypeScript, JavaScript (ES6+), HTML5, and modern CSS3.
- Proven experience with Tailwind CSS, responsive design, and CSS animations.
- Familiarity with state management libraries (Redux, Zustand, Context API).
- Experience integrating RESTful APIs and asynchronous data fetching.
- Understanding of frontend testing with Jest, Vitest, or React Testing Library.
- Knowledge of Next.js and web performance optimization is a strong plus.`,
  },
  {
    id: "job-ai-ml-sr",
    title: "AI / Machine Learning Engineer",
    department: "Data & AI",
    experienceLevel: "Senior",
    minYearsExperience: 4,
    requiredSkills: [
      "Python",
      "Machine Learning",
      "Deep Learning",
      "PyTorch",
      "Natural Language Processing",
      "Pandas",
      "Generative AI",
    ],
    preferredSkills: [
      "FastAPI",
      "Docker",
      "AWS",
      "TensorFlow",
      "SQL",
      "PostgreSQL",
      "System Design",
    ],
    education: ["Bachelor's or Master's in Computer Science, Data Science, AI, or Mathematics"],
    responsibilities: [
      "Design, train, and deploy machine learning and GenAI models in production.",
      "Build NLP pipelines, RAG systems, and fine-tune large language models.",
      "Develop high-performance inference APIs using FastAPI and Python.",
      "Collaborate with data engineers to optimize feature pipelines and data ingestion.",
    ],
    rawText: `Position: AI / Machine Learning Engineer
Department: Data & AI | Experience: 4+ Years | Senior Level

We are hiring an AI/ML Engineer to develop intelligent AI features and foundation model integrations.

Requirements:
- 4+ years of hands-on experience in Machine Learning, Deep Learning, and NLP.
- Strong proficiency in Python, PyTorch (or TensorFlow), Scikit-Learn, and Pandas.
- Proven experience with Generative AI, Large Language Models (LLMs), Prompt Engineering, and RAG architectures.
- Experience with Vector Databases (Pinecone, ChromaDB, Weaviate) and embedding pipelines.
- Experience serving ML models with FastAPI, Flask, Docker, and Cloud platforms (AWS/GCP).
- Solid understanding of SQL and data preprocessing pipelines.
- Master's or Bachelor's in CS, AI, Data Science, or related quantitative field.`,
  },
  {
    id: "job-devops-cloud",
    title: "DevOps & Cloud Infrastructure Engineer",
    department: "Infrastructure",
    experienceLevel: "Mid-level",
    minYearsExperience: 3,
    requiredSkills: [
      "AWS",
      "Docker",
      "Kubernetes",
      "CI/CD",
      "Terraform",
      "Linux",
      "Git",
    ],
    preferredSkills: [
      "Python",
      "Golang",
      "Monitoring",
      "Security",
      "Nginx",
      "PostgreSQL",
    ],
    education: ["Bachelor's in Computer Science, IT, or equivalent experience"],
    responsibilities: [
      "Manage cloud infrastructure on AWS and automate provisioning with Terraform.",
      "Design, deploy, and maintain containerized workloads on Kubernetes.",
      "Build resilient CI/CD pipelines using GitHub Actions or GitLab CI.",
      "Monitor system health, alerts, and ensure 99.9% platform uptime.",
    ],
    rawText: `Position: DevOps & Cloud Infrastructure Engineer
Department: Infrastructure | Experience: 3+ Years | Mid-Level

We are seeking a DevOps Engineer to scale our cloud infrastructure and deployment automation.

Requirements:
- 3+ years in DevOps, Cloud Engineering, or SRE roles.
- Strong hands-on experience with AWS cloud services (EKS, EC2, S3, RDS, IAM, VPC).
- Deep experience with Docker containerization and Kubernetes orchestration.
- Proficiency in Infrastructure as Code (IaC) using Terraform.
- Building and maintaining automated CI/CD pipelines (GitHub Actions, Jenkins).
- Solid Linux system administration, shell scripting, and basic Python/Go scripting.
- Experience setting up monitoring tools (Prometheus, Grafana, Datadog).`,
  },
  {
    id: "job-backend-eng",
    title: "Backend Engineer (Python / Distributed Systems)",
    department: "Core Backend",
    experienceLevel: "Mid-level",
    minYearsExperience: 3,
    requiredSkills: [
      "Python",
      "FastAPI",
      "PostgreSQL",
      "Redis",
      "RESTful APIs",
      "Microservices",
      "Git",
    ],
    preferredSkills: [
      "Docker",
      "AWS",
      "Unit Testing",
      "System Design",
      "gRPC",
      "CI/CD",
    ],
    education: ["Bachelor's in Computer Science or related STEM field"],
    responsibilities: [
      "Build scalable, low-latency microservices using Python and FastAPI.",
      "Design database schemas, query optimizations, and caching strategies with Redis and PostgreSQL.",
      "Implement secure authentication, rate limiting, and API gateways.",
    ],
    rawText: `Position: Backend Engineer (Python / Distributed Systems)
Department: Core Backend | Experience: 3+ Years | Mid-Level

Seeking a Backend Engineer to build robust microservices and distributed APIs.

Requirements:
- 3+ years of backend development experience primarily in Python (FastAPI, Django, or Flask).
- Strong knowledge of relational databases (PostgreSQL) and caching layers (Redis).
- Experience designing RESTful APIs and event-driven microservices.
- Experience with Unit Testing (pytest), Git, and containerization with Docker.
- Understanding of distributed systems, concurrency, and API security (OAuth2, JWT).`,
  }
];
