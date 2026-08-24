import { JobDescription } from "@/types";

export const SAMPLE_JOBS: JobDescription[] = [
  {
    id: "job-fullstack",
    title: "Full Stack Developer",
    department: "Engineering",
    experienceLevel: "Mid-level",
    minYearsExperience: 3,
    requiredSkills: [
      "React",
      "TypeScript",
      "Node.js",
      "PostgreSQL",
      "RESTful APIs",
      "Git",
    ],
    preferredSkills: [
      "Docker",
      "AWS",
      "Tailwind CSS",
      "Redis",
    ],
    education: ["Bachelor's in Computer Science or equivalent practical experience"],
    responsibilities: [
      "Develop user-facing features with React and TypeScript.",
      "Build and maintain REST APIs with Node.js and PostgreSQL.",
      "Write automated tests and collaborate with team members on code reviews.",
    ],
    rawText: `Role: Full Stack Developer
Experience Required: 3+ years

Responsibilities:
- Build responsive frontend features in React and TypeScript.
- Implement backend API routes and business logic in Node.js.
- Work with PostgreSQL databases, write queries, and design tables.
- Use Git for version control and collaborate via pull requests.
- Experience with Docker, AWS, Redis, and Tailwind CSS is a plus.`,
  },
  {
    id: "job-frontend",
    title: "Frontend Developer",
    department: "Frontend Team",
    experienceLevel: "Mid-level",
    minYearsExperience: 2,
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
      "RESTful APIs",
      "Unit Testing",
    ],
    education: ["Degree in Computer Science, Design, or equivalent experience"],
    responsibilities: [
      "Implement UI components from Figma designs using React and Tailwind CSS.",
      "Write clean, type-safe code in TypeScript.",
      "Connect frontend interfaces to backend REST APIs.",
    ],
    rawText: `Role: Frontend Developer
Experience: 2+ years

Requirements:
- Strong working knowledge of React, JavaScript (ES6+), and TypeScript.
- Proficiency in HTML5, modern CSS3, and Tailwind CSS.
- Experience consuming RESTful APIs and managing client-side state.
- Familiarity with Git workflows.
- Knowledge of Next.js and testing tools like Jest is helpful.`,
  },
  {
    id: "job-backend",
    title: "Backend Developer",
    department: "Backend Team",
    experienceLevel: "Mid-level",
    minYearsExperience: 3,
    requiredSkills: [
      "Python",
      "FastAPI",
      "PostgreSQL",
      "RESTful APIs",
      "Git",
    ],
    preferredSkills: [
      "Docker",
      "Redis",
      "AWS",
      "Unit Testing",
    ],
    education: ["Bachelor's in Computer Science or related field"],
    responsibilities: [
      "Build and maintain backend services and REST APIs with Python.",
      "Design database schemas and optimize queries in PostgreSQL.",
      "Write automated tests and maintain deployment scripts.",
    ],
    rawText: `Role: Backend Developer
Experience: 3+ years

Requirements:
- Hands-on experience developing backend applications with Python (FastAPI or Django).
- Solid experience with relational databases, specifically PostgreSQL.
- Experience designing and documenting RESTful APIs.
- Familiarity with Git, Docker, and Redis caching.`,
  },
  {
    id: "job-devops",
    title: "DevOps Engineer",
    department: "Infrastructure",
    experienceLevel: "Mid-level",
    minYearsExperience: 3,
    requiredSkills: [
      "AWS",
      "Docker",
      "Kubernetes",
      "CI/CD",
      "Linux",
      "Git",
    ],
    preferredSkills: [
      "Terraform",
      "Python",
      "Monitoring",
    ],
    education: ["Bachelor's in CS/IT or equivalent experience"],
    responsibilities: [
      "Maintain and automate cloud infrastructure on AWS.",
      "Configure Docker containers and Kubernetes clusters.",
      "Maintain CI/CD deployment pipelines.",
    ],
    rawText: `Role: DevOps Engineer
Experience: 3+ years

Requirements:
- Experience managing cloud infrastructure on AWS.
- Hands-on experience with Docker and Kubernetes.
- Experience setting up and maintaining CI/CD pipelines (GitHub Actions, GitLab).
- Strong Linux administration skills.
- Familiarity with Terraform and Python scripting is a plus.`,
  },
  {
    id: "job-data-engineer",
    title: "Data Engineer",
    department: "Data Team",
    experienceLevel: "Mid-level",
    minYearsExperience: 3,
    requiredSkills: [
      "Python",
      "SQL",
      "PostgreSQL",
      "Pandas",
      "Git",
    ],
    preferredSkills: [
      "Apache Spark",
      "Docker",
      "AWS",
    ],
    education: ["Degree in Computer Science, Data Science, or related quantitative field"],
    responsibilities: [
      "Build data extraction, transformation, and ingestion pipelines.",
      "Write and optimize SQL queries against PostgreSQL databases.",
      "Pre-process datasets using Python and Pandas.",
    ],
    rawText: `Role: Data Engineer
Experience: 3+ years

Requirements:
- Strong programming skills in Python and data manipulation with Pandas.
- Strong SQL proficiency for querying and transforming data in PostgreSQL.
- Experience with ETL pipelines and data modeling.
- Familiarity with Git, Docker, and AWS cloud data tools.`,
  },
];
