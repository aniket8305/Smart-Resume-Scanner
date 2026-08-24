import { CandidateResume } from "@/types";

export const SAMPLE_RESUMES: CandidateResume[] = [
  {
    id: "cand-alex-morgan",
    fileName: "Alex_Morgan_Senior_FullStack.pdf",
    candidateName: "Alex Morgan",
    email: "alex.morgan.dev@gmail.com",
    phone: "+1 (555) 234-8901",
    location: "San Francisco, CA (Remote)",
    linkedin: "https://linkedin.com/in/alexmorgan-dev",
    github: "https://github.com/alexm-stack",
    extractedSkills: [
      "React",
      "Next.js",
      "TypeScript",
      "Node.js",
      "PostgreSQL",
      "RESTful APIs",
      "Docker",
      "AWS",
      "Tailwind CSS",
      "Redis",
      "Git",
      "System Design",
      "CI/CD",
      "Unit Testing",
      "GraphQL",
      "Problem Solving",
      "Team Leadership",
    ],
    extractedExperienceYears: 6,
    extractedEducation: [
      "B.S. in Computer Science - University of California, Berkeley (2018)",
    ],
    extractedRoles: [
      "Senior Full Stack Engineer at FinTech Horizons (2021 - Present)",
      "Full Stack Developer at CloudNova Systems (2018 - 2021)",
    ],
    summary:
      "Results-driven Senior Full Stack Engineer with 6+ years of experience architecting high-traffic web applications with Next.js, React, Node.js, and PostgreSQL. Proven track record of reducing latency by 45% and leading cross-functional engineering squads.",
    rawText: `ALEX MORGAN
Email: alex.morgan.dev@gmail.com | Phone: +1 (555) 234-8901 | San Francisco, CA
LinkedIn: linkedin.com/in/alexmorgan-dev | GitHub: github.com/alexm-stack

PROFESSIONAL SUMMARY
Senior Full Stack Engineer with 6+ years of industry experience specializing in modern JavaScript/TypeScript ecosystems, Next.js, React, Node.js, and PostgreSQL. Experienced in distributed cloud systems (AWS, Docker), microservices, and leading high-velocity agile sprints.

EXPERIENCE
Senior Full Stack Engineer | FinTech Horizons | 2021 - Present
- Architected enterprise financial dashboard serving 500k+ active users using Next.js 14, TypeScript, Tailwind CSS, and Node.js.
- Designed distributed PostgreSQL schema and Redis caching layer, decreasing database query latency by 45%.
- Implemented robust CI/CD pipelines via GitHub Actions and containerized microservices using Docker and AWS ECS.
- Mentored 4 junior engineers and led quarterly system design architecture reviews.

Full Stack Software Engineer | CloudNova Systems | 2018 - 2021
- Developed RESTful APIs and GraphQL services in Express.js and TypeScript.
- Built reusable UI component libraries with React, Redux Toolkit, and styled components.
- Maintained 90%+ unit and integration test coverage using Jest and React Testing Library.

EDUCATION
B.S. in Computer Science | University of California, Berkeley | 2014 - 2018

TECHNICAL SKILLS
- Languages: TypeScript, JavaScript (ES6+), SQL, HTML5, CSS3, Python
- Frontend: React, Next.js, Tailwind CSS, Redux, GraphQL
- Backend: Node.js, Express.js, PostgreSQL, Redis, RESTful APIs, Microservices
- DevOps & Tools: Docker, AWS (S3, EC2, Lambda), Git, CI/CD, Jest, Vitest, System Design`,
  },
  {
    id: "cand-priya-sharma",
    fileName: "Priya_Sharma_AI_MLEngineer.pdf",
    candidateName: "Priya Sharma",
    email: "priya.sharma.ai@outlook.com",
    phone: "+1 (555) 345-6789",
    location: "New York, NY",
    linkedin: "https://linkedin.com/in/priyasharma-ai",
    github: "https://github.com/priyasharma-ml",
    extractedSkills: [
      "Python",
      "PyTorch",
      "Machine Learning",
      "Deep Learning",
      "Natural Language Processing",
      "Generative AI",
      "Pandas",
      "FastAPI",
      "Docker",
      "PostgreSQL",
      "AWS",
      "Git",
      "System Design",
      "Data Analysis",
      "Problem Solving",
    ],
    extractedExperienceYears: 5,
    extractedEducation: [
      "M.S. in Artificial Intelligence - Columbia University (2020)",
      "B.Tech in Computer Engineering - IIT Delhi (2018)",
    ],
    extractedRoles: [
      "Lead AI/ML Engineer at Cognitive Dynamics (2022 - Present)",
      "Machine Learning Scientist at DataCore Labs (2020 - 2022)",
    ],
    summary:
      "AI/ML Engineer with 5 years of experience building Generative AI pipelines, NLP models, and production inference systems. Expert in PyTorch, Python, Hugging Face Transformers, RAG architectures, and FastAPI.",
    rawText: `PRIYA SHARMA, M.S.
Email: priya.sharma.ai@outlook.com | Phone: +1 (555) 345-6789 | New York, NY
LinkedIn: linkedin.com/in/priyasharma-ai | GitHub: github.com/priyasharma-ml

SUMMARY
Senior AI/ML Engineer with 5+ years of experience designing and deploying scalable deep learning and NLP models. Deep expertise in Generative AI, Retrieval Augmented Generation (RAG), PyTorch, Python, vector databases, and high-throughput microservices.

PROFESSIONAL EXPERIENCE
Lead AI/ML Engineer | Cognitive Dynamics | 2022 - Present
- Built and deployed production RAG question-answering system using LangChain, ChromaDB, and fine-tuned LLMs, processing 2M+ monthly queries.
- Built low-latency asynchronous model inference APIs using FastAPI and Docker on AWS SageMaker.
- Optimized PyTorch model training pipelines with mixed precision, cutting GPU compute costs by 35%.

Machine Learning Scientist | DataCore Labs | 2020 - 2022
- Researched and implemented BERT-based NLP classification models for customer sentiment and intent recognition with 94.2% F1 score.
- Cleaned and processed multi-terabyte datasets using Pandas, NumPy, and Apache Spark.
- Collaborated with software engineers to integrate ML models into production PostgreSQL backend services.

EDUCATION
- M.S. in Artificial Intelligence | Columbia University | 2018 - 2020
- B.Tech in Computer Engineering | IIT Delhi | 2014 - 2018

TECHNICAL EXPERTISE
- AI / ML: PyTorch, TensorFlow, Hugging Face, Transformers, Scikit-Learn, Deep Learning, NLP, RAG, LLMs
- Engineering: Python, FastAPI, Docker, PostgreSQL, AWS, Git, Data Analysis, System Design`,
  },
  {
    id: "cand-marcus-vance",
    fileName: "Marcus_Vance_DevOps_SRE.pdf",
    candidateName: "Marcus Vance",
    email: "marcus.vance.cloud@gmail.com",
    phone: "+1 (555) 890-1234",
    location: "Austin, TX",
    linkedin: "https://linkedin.com/in/marcus-vance-devops",
    github: "https://github.com/marcusv-infra",
    extractedSkills: [
      "AWS",
      "Docker",
      "Kubernetes",
      "Terraform",
      "CI/CD",
      "Linux",
      "Python",
      "Git",
      "Monitoring",
      "Nginx",
      "Security",
      "Problem Solving",
    ],
    extractedExperienceYears: 4,
    extractedEducation: [
      "B.S. in Information Systems - University of Texas at Austin (2019)",
    ],
    extractedRoles: [
      "Cloud & DevOps Engineer at ScaleGrid Inc. (2021 - Present)",
      "Systems Administrator at Austin Tech Solutions (2019 - 2021)",
    ],
    summary:
      "DevOps and Cloud Infrastructure Engineer with 4 years of experience managing Kubernetes clusters, Terraform IaC, AWS infrastructure, and automated zero-downtime CI/CD deployment pipelines.",
    rawText: `MARCUS VANCE
Email: marcus.vance.cloud@gmail.com | Phone: +1 (555) 890-1234 | Austin, TX
LinkedIn: linkedin.com/in/marcus-vance-devops | GitHub: github.com/marcusv-infra

PROFILE
DevOps & Cloud Engineer with 4 years of experience architecting resilient AWS infrastructure, Kubernetes orchestration, and automated CI/CD pipelines.

EXPERIENCE
Cloud & DevOps Engineer | ScaleGrid Inc. | 2021 - Present
- Automated multi-region AWS cloud infrastructure deployment using Terraform and CloudFormation.
- Managed and scaled 15+ production Kubernetes (EKS) clusters supporting 200+ containerized microservices.
- Created robust CI/CD workflows using GitHub Actions and ArgoCD, reducing release cycle time from 2 hours to 8 minutes.
- Configured Prometheus, Grafana, and Datadog monitoring and alert policies, maintaining 99.98% service uptime.

Systems Administrator | Austin Tech Solutions | 2019 - 2021
- Managed Linux server fleets (Ubuntu/RHEL), DNS, SSL certificates, and Nginx reverse proxies.
- Developed Python and Bash automation scripts for server provisioning and backups.

EDUCATION
B.S. in Information Systems | University of Texas at Austin | 2015 - 2019

CORE SKILLS
AWS, Docker, Kubernetes, Terraform, CI/CD, Linux, Python, Git, Monitoring, Nginx, Security, Bash Scripting`,
  },
  {
    id: "cand-emily-chen",
    fileName: "Emily_Chen_Frontend_Developer.pdf",
    candidateName: "Emily Chen",
    email: "emily.chen.ui@gmail.com",
    phone: "+1 (555) 456-7890",
    location: "Seattle, WA",
    linkedin: "https://linkedin.com/in/emilychen-frontend",
    github: "https://github.com/emilychen-design",
    extractedSkills: [
      "React",
      "TypeScript",
      "JavaScript",
      "HTML5",
      "CSS3",
      "Tailwind CSS",
      "Next.js",
      "Redux",
      "Git",
      "Unit Testing",
      "RESTful APIs",
      "Problem Solving",
      "Communication",
    ],
    extractedExperienceYears: 3,
    extractedEducation: [
      "B.S. in Human-Computer Interaction & CS - University of Washington (2021)",
    ],
    extractedRoles: [
      "Frontend Developer at PixelCraft Studio (2021 - Present)",
    ],
    summary:
      "Passionate Frontend Developer with 3 years of experience building accessible, responsive, and high-performance web applications using React, TypeScript, Tailwind CSS, and Next.js.",
    rawText: `EMILY CHEN
Email: emily.chen.ui@gmail.com | Phone: +1 (555) 456-7890 | Seattle, WA
LinkedIn: linkedin.com/in/emilychen-frontend | GitHub: github.com/emilychen-design

SUMMARY
Frontend Developer with 3 years of hands-on experience crafting modern responsive web applications using React, TypeScript, Next.js, and Tailwind CSS. Obsessed with web accessibility (WCAG), performance optimization, and pixel-perfect design translation.

EXPERIENCE
Frontend Developer | PixelCraft Studio | 2021 - Present
- Developed 10+ client web applications and SaaS dashboards using React, TypeScript, and Next.js.
- Implemented design systems and reusable component kits with Tailwind CSS, Framer Motion, and Storybook.
- Integrated RESTful APIs with React Query and Redux Toolkit for seamless asynchronous state management.
- Improved Google Lighthouse Performance scores from 62 to 98 across core web pages.
- Authored unit and component tests using Vitest and React Testing Library.

EDUCATION
B.S. in Human-Computer Interaction & Computer Science | University of Washington | 2017 - 2021

SKILLS
React, TypeScript, JavaScript, HTML5, CSS3, Tailwind CSS, Next.js, Redux, RESTful APIs, Git, Unit Testing, Responsive Design`,
  },
  {
    id: "cand-david-miller",
    fileName: "David_Miller_Junior_Developer.pdf",
    candidateName: "David Miller",
    email: "david.miller.junior@gmail.com",
    phone: "+1 (555) 678-9012",
    location: "Chicago, IL",
    linkedin: "https://linkedin.com/in/davidmiller-qa",
    github: "https://github.com/dmiller-code",
    extractedSkills: [
      "JavaScript",
      "HTML5",
      "CSS3",
      "React",
      "Git",
      "Unit Testing",
      "Problem Solving",
      "Adaptability",
    ],
    extractedExperienceYears: 1,
    extractedEducation: [
      "Certificate in Full Stack Web Development - Coding Bootcamp (2023)",
      "B.A. in Business Administration - DePaul University (2020)",
    ],
    extractedRoles: [
      "QA Tester & Junior Web Developer at Apex Tech (2023 - Present)",
    ],
    summary:
      "Motivated Junior Developer transitioning from Quality Assurance. Proficient in JavaScript, React, HTML5, CSS, and automated testing with a high eagerness to learn full-stack development.",
    rawText: `DAVID MILLER
Email: david.miller.junior@gmail.com | Phone: +1 (555) 678-9012 | Chicago, IL
LinkedIn: linkedin.com/in/davidmiller-qa | GitHub: github.com/dmiller-code

OBJECTIVE
Energetic and motivated Junior Developer with 1 year of experience in QA testing and front-end development, seeking an associate developer role to expand skills in TypeScript, React, and backend technologies.

EXPERIENCE
QA Tester & Junior Web Developer | Apex Tech | 2023 - Present
- Conducted manual and automated regression tests on customer portals using Cypress and Jest.
- Assisted engineering team with bug fixes and UI component updates in JavaScript and HTML/CSS.
- Participated in daily Agile standups and sprint planning.

EDUCATION
- Certificate in Full Stack Web Development | FullStack Academy | 2023
- B.A. in Business Administration | DePaul University | 2016 - 2020

SKILLS
JavaScript, HTML5, CSS3, React, Git, Unit Testing, Cypress, Problem Solving, Adaptability`,
  },
];
