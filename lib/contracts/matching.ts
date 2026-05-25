import type { ContractOpportunity } from "@/lib/products/types";

const aiServiceTerms = [
  "ai",
  "artificial intelligence",
  "automation",
  "workflow",
  "web",
  "website",
  "application",
  "software",
  "data",
  "analytics",
  "content",
  "creative",
  "media",
  "video",
  "audio",
  "training",
  "technical"
];

function termMatches(text: string, term: string) {
  if (term === "ai") {
    return /\bai\b/.test(text);
  }

  return text.includes(term);
}

export function scoreContractFit(input: {
  title: string;
  agency?: string;
  notes?: string | null;
  tags?: string[];
}) {
  const text = [
    input.title,
    input.agency,
    input.notes,
    ...(input.tags ?? [])
  ]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();
  const matchedTerms = aiServiceTerms.filter((term) => termMatches(text, term));
  const fitScore = Math.min(100, 45 + matchedTerms.length * 9);

  return {
    fitScore,
    matchedTerms,
    priority: fitScore >= 82 ? "high" : fitScore >= 64 ? "medium" : "low"
  } as const;
}

export function getContractUrgency(contract: ContractOpportunity) {
  const deadline = contract.deadline_at ?? contract.due_at;

  if (!deadline) {
    return "No deadline";
  }

  const days = Math.ceil(
    (new Date(deadline).getTime() - Date.now()) / (1000 * 60 * 60 * 24)
  );

  if (days < 0) {
    return "Past due";
  }

  if (days <= 7) {
    return `${days} days left`;
  }

  return `${days} days`;
}
