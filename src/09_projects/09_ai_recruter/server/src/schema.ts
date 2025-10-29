import { z } from "zod";

/* -------------------------------------------------------------------------- */
/*                            🔹 TechStack Enum 🔹                            */
/* -------------------------------------------------------------------------- */

export const TechStackEnum = z.enum([
  "Java",
  "Spring Boot",
  "Node.js",
  "React",
  "Next.js",
  "PostgreSQL",
  "MongoDB",
  "GraphQL",
  "gRPC",
  "Git",
  "Docker",
  "Kubernetes",
  "HTML5",
  "CSS3",
  "JavaScript",
  "TypeScript",
  "Redux",
  "Tailwind CSS",
  "JUnit5",
  "AssertJ",
  "Mockito",
  "Jest",
  "Cypress",
  "Playwright",
  "Gatling",
  "K6",
  "Elasticsearch",
  "Redis",
  "RabbitMQ",
  "Apache Kafka",
  "Linux",
  "AWS",
  "REST",
  "Micro Services",
  "Terraform",
  "GitHub Pipelines",
  "Electron.js",
  "Sequelize",
  "Prisma",
  "Express",
  "Azure",
  "Prometheus",
  "Grafana",
  "Loki",
  "Tempo",
  "Kibana",
] as const);

export type TechStack = z.infer<typeof TechStackEnum>;

/* -------------------------------------------------------------------------- */
/*                      🔹 SkillsGroupBy Category Enum 🔹                     */
/* -------------------------------------------------------------------------- */

export const SkillsGroupEnum = z.enum([
  "Backend Technologies",
  "Frontened Technologies",
  "DevOps",
  "Testing",
  "DBs & Others",
] as const);

export type SkillsGroup = z.infer<typeof SkillsGroupEnum>;

/* -------------------------------------------------------------------------- */
/*                           🔹 Subschemas (Nested) 🔹                        */
/* -------------------------------------------------------------------------- */

export const experienceSchema = z.object({
  role: z.string(),
  type: z.enum(["Full Time", "Part Time"]),
  company: z.string(),
  period: z.string(),
});

export const projectSchema = z.object({
  name: z.string(),
  company: z.string(),
  domain: z.enum(["Finance", "HR", "Education", "Healthcare"]),
  techStack: z.array(TechStackEnum),
  keyFeatures: z.array(z.string()),
});

export const educationSchema = z.object({
  course: z.string(),
  university: z.string(),
  duration: z.string(),
});

export const socialSchema = z.object({
  Icon: z.any(), // React Component
  url: z.url(),
});

/* -------------------------------------------------------------------------- */
/*                             🔹 Profile Schema 🔹                           */
/* -------------------------------------------------------------------------- */

export const profileSchema = z.object({
  img: z.any(),
  name: z.string(),
  subTitle: z.string(),
  tags: z.array(z.string()),
  cvLink: z.string().url(),
  location: z.string(),
  gitHubId: z.string(),

  social: z.array(socialSchema),
  about: z.array(z.string()),

  skills: z.array(TechStackEnum),
  experiences: z.array(experienceSchema),
  projects: z.array(projectSchema),

  skillsGroupBy: z.record(SkillsGroupEnum, z.array(TechStackEnum)),

  qualifications: z.array(educationSchema),
});

/* -------------------------------------------------------------------------- */
/*                             🔹 Export Types 🔹                             */
/* -------------------------------------------------------------------------- */

export type Profile = z.infer<typeof profileSchema>;
