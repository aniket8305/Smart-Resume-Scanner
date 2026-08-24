export interface SkillCategory {
  category: string;
  skills: {
    canonical: string;
    aliases: string[];
  }[];
}

export const SKILLS_TAXONOMY: SkillCategory[] = [
  {
    category: "Frontend Development",
    skills: [
      { canonical: "React", aliases: ["react.js", "reactjs", "react-native", "react native"] },
      { canonical: "Next.js", aliases: ["nextjs", "next.js 13", "next.js 14", "next js"] },
      { canonical: "TypeScript", aliases: ["ts", "typescript"] },
      { canonical: "JavaScript", aliases: ["js", "es6", "es6+", "ecmascript", "javascript"] },
      { canonical: "Vue.js", aliases: ["vue", "vuejs", "vue 3", "nuxt", "nuxtjs"] },
      { canonical: "Angular", aliases: ["angularjs", "angular 2+", "angular 14", "angular 16"] },
      { canonical: "HTML5", aliases: ["html", "html5", "semantic html"] },
      { canonical: "CSS3", aliases: ["css", "css3", "sass", "scss", "less"] },
      { canonical: "Tailwind CSS", aliases: ["tailwindcss", "tailwind", "tailwind-css"] },
      { canonical: "Redux", aliases: ["redux toolkit", "rtk", "redux-saga", "zustand", "mobx"] },
      { canonical: "GraphQL", aliases: ["graphql", "apollo client", "relay"] },
      { canonical: "WebAssembly", aliases: ["wasm", "webassembly"] },
      { canonical: "Svelte", aliases: ["sveltejs", "sveltekit"] },
    ],
  },
  {
    category: "Backend & Systems",
    skills: [
      { canonical: "Node.js", aliases: ["nodejs", "node.js", "node"] },
      { canonical: "Express.js", aliases: ["express", "expressjs"] },
      { canonical: "Python", aliases: ["python3", "py"] },
      { canonical: "Django", aliases: ["django rest framework", "drf"] },
      { canonical: "FastAPI", aliases: ["fast api", "fastapi"] },
      { canonical: "Flask", aliases: ["flask"] },
      { canonical: "Java", aliases: ["core java", "java 8", "java 11", "java 17", "java 21"] },
      { canonical: "Spring Boot", aliases: ["springboot", "spring-boot", "spring framework", "spring"] },
      { canonical: "Golang", aliases: ["go", "golang"] },
      { canonical: "C++", aliases: ["cpp", "c/c++"] },
      { canonical: "C#", aliases: ["c-sharp", "csharp", ".net", ".net core", "asp.net", "dotnet"] },
      { canonical: "Rust", aliases: ["rust-lang", "rust"] },
      { canonical: "Ruby on Rails", aliases: ["rails", "ruby", "ror"] },
      { canonical: "PHP", aliases: ["php8", "laravel", "symfony"] },
      { canonical: "RESTful APIs", aliases: ["rest api", "restful api", "rest apis", "rest web services", "api design"] },
      { canonical: "Microservices", aliases: ["microservices architecture", "micro-services", "service-oriented architecture", "soa"] },
      { canonical: "gRPC", aliases: ["grpc", "protobuf", "protocol buffers"] },
    ],
  },
  {
    category: "Databases & Storage",
    skills: [
      { canonical: "PostgreSQL", aliases: ["postgres", "postgresql", "psql"] },
      { canonical: "MySQL", aliases: ["mysql", "mariadb"] },
      { canonical: "MongoDB", aliases: ["mongo", "mongodb", "nosql"] },
      { canonical: "Redis", aliases: ["redis cache", "redis cluster"] },
      { canonical: "Elasticsearch", aliases: ["elastic search", "opensearch", "elk stack"] },
      { canonical: "Supabase", aliases: ["supabase"] },
      { canonical: "Firebase", aliases: ["firestore", "firebase realtime database"] },
      { canonical: "SQLite", aliases: ["sqlite3"] },
      { canonical: "DynamoDB", aliases: ["amazon dynamodb", "dynamodb"] },
      { canonical: "Cassandra", aliases: ["apache cassandra"] },
      { canonical: "Snowflake", aliases: ["snowflake db", "snowflake data warehouse"] },
      { canonical: "BigQuery", aliases: ["google bigquery", "big query"] },
      { canonical: "SQL", aliases: ["structured query language", "tsql", "plsql", "sql queries"] },
    ],
  },
  {
    category: "Cloud & DevOps",
    skills: [
      { canonical: "AWS", aliases: ["amazon web services", "ec2", "s3", "lambda", "cloudformation", "iam"] },
      { canonical: "Google Cloud", aliases: ["gcp", "google cloud platform", "cloud run", "gke"] },
      { canonical: "Microsoft Azure", aliases: ["azure", "azure devops", "aks"] },
      { canonical: "Docker", aliases: ["containerization", "docker-compose", "containers"] },
      { canonical: "Kubernetes", aliases: ["k8s", "helm", "kubectl"] },
      { canonical: "CI/CD", aliases: ["github actions", "gitlab ci", "jenkins", "circleci", "continuous integration", "continuous deployment"] },
      { canonical: "Terraform", aliases: ["iac", "infrastructure as code", "terraform"] },
      { canonical: "Linux", aliases: ["ubuntu", "debian", "centos", "bash", "shell scripting"] },
      { canonical: "Nginx", aliases: ["nginx reverse proxy", "apache http"] },
      { canonical: "Monitoring", aliases: ["prometheus", "grafana", "datadog", "new relic", "cloudwatch"] },
    ],
  },
  {
    category: "AI, Machine Learning & Data",
    skills: [
      { canonical: "Machine Learning", aliases: ["ml", "scikit-learn", "sklearn", "supervised learning", "unsupervised learning"] },
      { canonical: "Deep Learning", aliases: ["neural networks", "dl", "cnn", "rnn", "lstm"] },
      { canonical: "PyTorch", aliases: ["pytorch", "torch"] },
      { canonical: "TensorFlow", aliases: ["tensorflow", "tf", "keras"] },
      { canonical: "Natural Language Processing", aliases: ["nlp", "transformers", "huggingface", "hugging face", "spacy", "nltk", "bert", "gpt", "llm", "large language models"] },
      { canonical: "Computer Vision", aliases: ["cv", "opencv", "yolo", "image segmentation"] },
      { canonical: "Pandas", aliases: ["pandas", "numpy", "scipy"] },
      { canonical: "Generative AI", aliases: ["genai", "prompt engineering", "langchain", "llamaindex", "rag", "retrieval augmented generation", "vector databases", "pinecone", "chromadb", "weaviate"] },
      { canonical: "Apache Spark", aliases: ["pyspark", "spark", "hadoop", "databricks"] },
      { canonical: "Data Analysis", aliases: ["data analytics", "tableau", "power bi", "matplotlib", "seaborn"] },
    ],
  },
  {
    category: "Software Engineering & Tools",
    skills: [
      { canonical: "Git", aliases: ["github", "gitlab", "version control", "bitbucket"] },
      { canonical: "Unit Testing", aliases: ["jest", "pytest", "mocha", "chai", "cypress", "playwright", "vitest", "tdd", "test driven development"] },
      { canonical: "Agile / Scrum", aliases: ["agile", "scrum", "kanban", "sprints", "jira", "confluence"] },
      { canonical: "System Design", aliases: ["high level design", "low level design", "distributed systems", "scalability", "load balancing"] },
      { canonical: "Security", aliases: ["oauth2", "jwt", "owasp", "encryption", "web security", "authentication", "authorization"] },
      { canonical: "Design Patterns", aliases: ["oop", "object oriented programming", "solid principles", "clean code", "dry"] },
    ],
  },
  {
    category: "Soft Skills & Management",
    skills: [
      { canonical: "Problem Solving", aliases: ["critical thinking", "analytical thinking", "troubleshooting", "debugging"] },
      { canonical: "Communication", aliases: ["written communication", "verbal communication", "cross-functional collaboration", "stakeholder management"] },
      { canonical: "Team Leadership", aliases: ["mentorship", "code reviews", "engineering management", "technical lead", "leadership"] },
      { canonical: "Product Thinking", aliases: ["user-centric", "roadmap planning", "a/b testing", "mvp development", "product management"] },
      { canonical: "Adaptability", aliases: ["fast learner", "quick learner", "self-motivated", "continuous learning"] },
    ]
  }
];

// Flattened lookup map for fast O(1) matching
export const SKILL_LOOKUP_MAP: Map<string, string> = new Map();

SKILLS_TAXONOMY.forEach((category) => {
  category.skills.forEach((skill) => {
    // Map canonical lowercase
    SKILL_LOOKUP_MAP.set(skill.canonical.toLowerCase(), skill.canonical);
    // Map all aliases lowercase
    skill.aliases.forEach((alias) => {
      SKILL_LOOKUP_MAP.set(alias.toLowerCase(), skill.canonical);
    });
  });
});
