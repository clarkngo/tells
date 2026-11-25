// Vocabulary for the cloud-devops drill prompts and patterns page.
import type { Term } from '../../../lib/types';

export const glossary: Term[] = [
  { term: "deploy", aliases: ["deploys", "deployment"], def: "Putting a new version of software into an environment." },
  { term: "container", aliases: ["containers"], def: "A packaged app with everything it needs to run the same anywhere." },
  { term: "load balancer", def: "A component that spreads incoming requests across servers." },
  { term: "trace", aliases: ["traces", "tracing"], def: "A record of one request's path through several services, with timings." },
  { term: "SLO", aliases: ["SLOs"], def: "Service level objective: a target for reliability, like 99.9% of requests succeed." },
  { term: "Terraform", def: "A popular tool for describing infrastructure in code." },
];
