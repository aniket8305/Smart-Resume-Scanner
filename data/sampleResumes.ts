import { CandidateResume } from "@/types";

export const SAMPLE_RESUMES: CandidateResume[] = [
  {
    id: "cand-demo-01",
    fileName: "Demo_Candidate_01_FullStack.pdf",
    candidateName: "Demo Candidate 01 (Full Stack)",
    email: "demo.candidate01@example.com",
    phone: "+1 (555) 010-1001",
    location: "Austin, TX",
    linkedin: "https://linkedin.com/in/demo-candidate-01",
    github: "https://github.com/demo-candidate-01",
    extractedSkills: [
      "React",
      "TypeScript",
      "Node.js",
      "PostgreSQL",
      "RESTful APIs",
      "Git",
      "Docker",
      "Tailwind CSS",
      "Redis",
      "Unit Testing",
    ],
    extractedExperienceYears: 4,
    extractedEducation: [
      "B.S. in Computer Science - State University (2020)",
    ],
    extractedRoles: [
      "Full Stack Developer at TechCo (2021 - Present)",
      "Junior Web Developer at Studio Alpha (2020 - 2021)",
    ],
    summary:
      "Full Stack developer with 4 years of experience building web applications using React, TypeScript, Node.js, and PostgreSQL.",
    rawText: `DEMO CANDIDATE 01 (FULL STACK)
Email: demo.candidate01@example.com | Phone: +1 (555) 010-1001 | Austin, TX
LinkedIn: linkedin.com/in/demo-candidate-01 | GitHub: github.com/demo-candidate-01

SUMMARY
Full Stack Developer with 4 years of experience building web applications in TypeScript, React, Node.js, and PostgreSQL. Familiar with Docker and Tailwind CSS.

EXPERIENCE
Full Stack Developer | TechCo | 2021 - Present
- Built web features in React and TypeScript with Tailwind CSS styling.
- Developed backend API endpoints in Node.js connected to a PostgreSQL database.
- Created Redis caching layer for frequently queried API endpoints.
- Maintained unit tests with Jest and participated in peer code reviews on GitHub.

Junior Web Developer | Studio Alpha | 2020 - 2021
- Worked on client-facing frontend sites using JavaScript, HTML5, and CSS3.
- Integrated third-party REST APIs and assisted in bug fixing.

EDUCATION
B.S. in Computer Science | State University | 2016 - 2020

SKILLS
React, TypeScript, Node.js, PostgreSQL, RESTful APIs, Git, Docker, Tailwind CSS, Redis, Unit Testing`,
  },
  {
    id: "cand-demo-02",
    fileName: "Demo_Candidate_02_Backend.pdf",
    candidateName: "Demo Candidate 02 (Backend)",
    email: "demo.candidate02@example.com",
    phone: "+1 (555) 010-1002",
    location: "Denver, CO",
    linkedin: "https://linkedin.com/in/demo-candidate-02",
    github: "https://github.com/demo-candidate-02",
    extractedSkills: [
      "Python",
      "FastAPI",
      "PostgreSQL",
      "RESTful APIs",
      "Git",
      "Docker",
      "Redis",
      "SQL",
      "Linux",
    ],
    extractedExperienceYears: 3,
    extractedEducation: [
      "B.S. in Software Engineering - Metro University (2021)",
    ],
    extractedRoles: [
      "Backend Developer at DataFlow Systems (2021 - Present)",
    ],
    summary:
      "Backend developer with 3 years of experience in Python, FastAPI, and PostgreSQL database design.",
    rawText: `DEMO CANDIDATE 02 (BACKEND)
Email: demo.candidate02@example.com | Phone: +1 (555) 010-1002 | Denver, CO
LinkedIn: linkedin.com/in/demo-candidate-02 | GitHub: github.com/demo-candidate-02

SUMMARY
Backend Developer with 3 years of experience writing Python services, FastAPI applications, and PostgreSQL database queries.

EXPERIENCE
Backend Developer | DataFlow Systems | 2021 - Present
- Designed and maintained REST APIs using Python and FastAPI.
- Wrote database migrations, schema designs, and indexing in PostgreSQL.
- Containerized local development environments with Docker.
- Used Git and Linux for daily development workflows.

EDUCATION
B.S. in Software Engineering | Metro University | 2017 - 2021

SKILLS
Python, FastAPI, PostgreSQL, RESTful APIs, Git, Docker, Redis, SQL, Linux`,
  },
  {
    id: "cand-demo-03",
    fileName: "Demo_Candidate_03_DevOps.pdf",
    candidateName: "Demo Candidate 03 (DevOps)",
    email: "demo.candidate03@example.com",
    phone: "+1 (555) 010-1003",
    location: "Seattle, WA",
    linkedin: "https://linkedin.com/in/demo-candidate-03",
    github: "https://github.com/demo-candidate-03",
    extractedSkills: [
      "AWS",
      "Docker",
      "Kubernetes",
      "CI/CD",
      "Linux",
      "Git",
      "Terraform",
      "Python",
      "Monitoring",
    ],
    extractedExperienceYears: 4,
    extractedEducation: [
      "B.S. in Information Technology - Pacific University (2020)",
    ],
    extractedRoles: [
      "DevOps Engineer at CloudBase (2021 - Present)",
      "Junior Systems Admin at NetOps (2020 - 2021)",
    ],
    summary:
      "DevOps engineer with 4 years of experience working with AWS, Docker, Kubernetes, and CI/CD pipelines.",
    rawText: `DEMO CANDIDATE 03 (DEVOPS)
Email: demo.candidate03@example.com | Phone: +1 (555) 010-1003 | Seattle, WA
LinkedIn: linkedin.com/in/demo-candidate-03 | GitHub: github.com/demo-candidate-03

SUMMARY
DevOps Engineer with 4 years of experience managing AWS cloud infrastructure, Kubernetes clusters, and automated deployment pipelines.

EXPERIENCE
DevOps Engineer | CloudBase | 2021 - Present
- Configured and deployed containerized services to Kubernetes on AWS.
- Created CI/CD workflows using GitHub Actions for build and release automation.
- Wrote Terraform configurations for managing cloud resources.
- Monitored Linux server performance and set up alert notifications.

Junior Systems Admin | NetOps | 2020 - 2021
- Maintained Linux instances and managed access permissions.
- Wrote basic Python and Bash scripts for routine tasks.

EDUCATION
B.S. in Information Technology | Pacific University | 2016 - 2020

SKILLS
AWS, Docker, Kubernetes, CI/CD, Linux, Git, Terraform, Python, Monitoring`,
  },
  {
    id: "cand-demo-04",
    fileName: "Demo_Candidate_04_Frontend.pdf",
    candidateName: "Demo Candidate 04 (Frontend)",
    email: "demo.candidate04@example.com",
    phone: "+1 (555) 010-1004",
    location: "Chicago, IL",
    linkedin: "https://linkedin.com/in/demo-candidate-04",
    github: "https://github.com/demo-candidate-04",
    extractedSkills: [
      "React",
      "TypeScript",
      "JavaScript",
      "HTML5",
      "CSS3",
      "Tailwind CSS",
      "Next.js",
      "Git",
      "RESTful APIs",
    ],
    extractedExperienceYears: 2,
    extractedEducation: [
      "B.A. in Digital Arts & CS - Midwest College (2022)",
    ],
    extractedRoles: [
      "Frontend Developer at WebCraft (2022 - Present)",
    ],
    summary:
      "Frontend developer with 2 years of experience building accessible interfaces with React, TypeScript, and Tailwind CSS.",
    rawText: `DEMO CANDIDATE 04 (FRONTEND)
Email: demo.candidate04@example.com | Phone: +1 (555) 010-1004 | Chicago, IL
LinkedIn: linkedin.com/in/demo-candidate-04 | GitHub: github.com/demo-candidate-04

SUMMARY
Frontend Developer with 2 years of experience creating responsive user interfaces with React, TypeScript, Tailwind CSS, and Next.js.

EXPERIENCE
Frontend Developer | WebCraft | 2022 - Present
- Built user interfaces based on Figma specifications in React and TypeScript.
- Styled components using Tailwind CSS and CSS3.
- Integrated REST APIs for dynamic content rendering.
- Used Git for team collaboration and code reviews.

EDUCATION
B.A. in Digital Arts & CS | Midwest College | 2018 - 2022

SKILLS
React, TypeScript, JavaScript, HTML5, CSS3, Tailwind CSS, Next.js, Git, RESTful APIs`,
  },
  {
    id: "cand-demo-05",
    fileName: "Demo_Candidate_05_Junior.pdf",
    candidateName: "Demo Candidate 05 (Junior)",
    email: "demo.candidate05@example.com",
    phone: "+1 (555) 010-1005",
    location: "Raleigh, NC",
    linkedin: "https://linkedin.com/in/demo-candidate-05",
    github: "https://github.com/demo-candidate-05",
    extractedSkills: [
      "JavaScript",
      "HTML5",
      "CSS3",
      "React",
      "Git",
    ],
    extractedExperienceYears: 1,
    extractedEducation: [
      "Full Stack Web Development Certificate - Tech Bootcamp (2023)",
      "B.S. in Biology - State University (2021)",
    ],
    extractedRoles: [
      "Junior Web Developer Intern at AppWorks (2023 - Present)",
    ],
    summary:
      "Junior developer with foundational experience in JavaScript, React, and Git from practical projects and bootcamp training.",
    rawText: `DEMO CANDIDATE 05 (JUNIOR)
Email: demo.candidate05@example.com | Phone: +1 (555) 010-1005 | Raleigh, NC
LinkedIn: linkedin.com/in/demo-candidate-05 | GitHub: github.com/demo-candidate-05

SUMMARY
Junior Developer seeking an associate development role. Proficient in JavaScript, HTML5, CSS3, and React.

EXPERIENCE
Junior Web Developer Intern | AppWorks | 2023 - Present
- Built basic UI components using React and JavaScript.
- Assisted senior developers with bug fixing and documentation.
- Participated in daily standups and used Git for version control.

EDUCATION
- Full Stack Web Development Certificate | Tech Bootcamp | 2023
- B.S. in Biology | State University | 2017 - 2021

SKILLS
JavaScript, HTML5, CSS3, React, Git`,
  },
];
