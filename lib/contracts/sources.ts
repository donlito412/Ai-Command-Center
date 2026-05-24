import {
  createProductRecord,
  listProductRecords
} from "@/lib/products/store";
import type { ContractOpportunity } from "@/lib/products/types";
import { scoreContractFit } from "./matching";

type SourceOpportunity = {
  title: string;
  agency: string;
  source: string;
  source_url: string | null;
  opportunity_number: string | null;
  deadline_at: string | null;
  value_estimate: number | null;
  notes: string;
  tags: string[];
};

const fallbackSourceOpportunities: SourceOpportunity[] = [
  {
    title: "AI workflow automation and technical support services",
    agency: "City of Pittsburgh",
    source: "Pittsburgh Procurement",
    source_url: "https://www.pittsburghpa.gov/Business-Development/Procurement",
    opportunity_number: "PGH-AI-WORKFLOW",
    deadline_at: "2026-06-18T21:00:00.000Z",
    value_estimate: 30000,
    notes: "Target local technical services opportunity for workflow automation, websites, and AI support.",
    tags: ["pittsburgh", "ai", "automation", "technical-services"]
  },
  {
    title: "Digital content, media production, and outreach campaign support",
    agency: "Commonwealth of Pennsylvania",
    source: "PA eMarketplace",
    source_url: "https://www.emarketplace.state.pa.us/Search.aspx/Home.aspx",
    opportunity_number: "PA-MEDIA-OUTREACH",
    deadline_at: "2026-06-24T21:00:00.000Z",
    value_estimate: 45000,
    notes: "State-level source target for creative, video, content, and outreach services.",
    tags: ["pennsylvania", "content", "media", "creative"]
  },
  {
    title: "Federal software development and data modernization support",
    agency: "Federal Agency",
    source: "SAM.gov",
    source_url: "https://sam.gov/content/opportunities",
    opportunity_number: "SAM-SOFTWARE-DATA",
    deadline_at: "2026-07-02T21:00:00.000Z",
    value_estimate: 125000,
    notes: "Federal source target for software, data, web applications, and technical implementation.",
    tags: ["federal", "software", "data", "web"]
  },
  {
    title: "Website redesign and web application support",
    agency: "Allegheny County",
    source: "Local Procurement",
    source_url: "https://www.emarketplace.state.pa.us/Search.aspx/Home.aspx",
    opportunity_number: "LOCAL-WEB-002",
    deadline_at: "2026-06-21T21:00:00.000Z",
    value_estimate: 60000,
    notes: "Website, portal, and app support opportunity.",
    tags: ["web", "website", "application", "software"]
  },
  {
    title: "Video production and digital media campaign",
    agency: "Public Outreach Office",
    source: "Local Procurement",
    source_url: "https://www.pittsburghpa.gov/Business-Development/Procurement",
    opportunity_number: "LOCAL-MEDIA-003",
    deadline_at: "2026-06-27T21:00:00.000Z",
    value_estimate: 40000,
    notes: "Creative media, production, editing, and outreach support.",
    tags: ["media", "video", "content", "creative"]
  },
  {
    title: "AI tools training and staff enablement",
    agency: "Workforce Development Department",
    source: "Local Procurement",
    source_url: "https://www.emarketplace.state.pa.us/Search.aspx/Home.aspx",
    opportunity_number: "LOCAL-TRAIN-004",
    deadline_at: "2026-07-01T21:00:00.000Z",
    value_estimate: 35000,
    notes: "Training, AI tool onboarding, documentation, and staff workflow support.",
    tags: ["ai", "training", "technical", "documentation"]
  },
  {
    title: "Data dashboard and reporting modernization",
    agency: "Public Data Office",
    source: "Local Procurement",
    source_url: "https://sam.gov/content/opportunities",
    opportunity_number: "LOCAL-DATA-005",
    deadline_at: "2026-07-09T21:00:00.000Z",
    value_estimate: 80000,
    notes: "Dashboard, reporting, analytics, and operational visibility opportunity.",
    tags: ["data", "analytics", "dashboard", "software"]
  },
  {
    title: "Mobile app maintenance and citizen services portal support",
    agency: "Municipal Digital Services",
    source: "Local Procurement",
    source_url: "https://www.pittsburghpa.gov/Business-Development/Procurement",
    opportunity_number: "LOCAL-APP-006",
    deadline_at: "2026-07-12T21:00:00.000Z",
    value_estimate: 70000,
    notes: "Mobile, app, portal, and citizen service workflow support.",
    tags: ["app", "application", "software", "web"]
  }
];

function toContractRecord(source: SourceOpportunity) {
  const score = scoreContractFit({
    title: source.title,
    agency: source.agency,
    notes: source.notes,
    tags: source.tags
  });

  return {
    title: source.title,
    module: "contracts" as const,
    status: "active" as const,
    priority: score.priority,
    owner: "Murphree Enterprises LLC",
    due_at: source.deadline_at,
    tags: [...new Set([...source.tags, ...score.matchedTerms])],
    notes: source.notes,
    metadata: {
      match_terms: score.matchedTerms,
      imported_from: source.source
    },
    agency: source.agency,
    source: source.source,
    source_url: source.source_url,
    opportunity_number: source.opportunity_number,
    value_estimate: source.value_estimate,
    fit_score: score.fitScore,
    deadline_at: source.deadline_at
  };
}

async function fetchSamOpportunities(): Promise<SourceOpportunity[]> {
  const apiKey = process.env.SAM_GOV_API_KEY;

  if (!apiKey) {
    return [];
  }

  const postedTo = new Date();
  const postedFrom = new Date(Date.now() - 1000 * 60 * 60 * 24 * 30);
  const formatDate = (date: Date) =>
    `${String(date.getMonth() + 1).padStart(2, "0")}/${String(date.getDate()).padStart(2, "0")}/${date.getFullYear()}`;
  const url = new URL("https://api.sam.gov/opportunities/v2/search");

  url.searchParams.set("api_key", apiKey);
  url.searchParams.set("postedFrom", formatDate(postedFrom));
  url.searchParams.set("postedTo", formatDate(postedTo));
  url.searchParams.set("limit", "10");
  url.searchParams.set("title", "software automation artificial intelligence web data");

  const response = await fetch(url, { next: { revalidate: 3600 } });

  if (!response.ok) {
    return [];
  }

  const body = (await response.json()) as {
    opportunitiesData?: Array<{
      title?: string;
      fullParentPathName?: string;
      organizationName?: string;
      noticeId?: string;
      uiLink?: string;
      responseDeadLine?: string;
      type?: string;
    }>;
  };

  return (body.opportunitiesData ?? []).map((item) => ({
    title: item.title ?? "SAM.gov opportunity",
    agency: item.organizationName ?? item.fullParentPathName ?? "Federal Agency",
    source: "SAM.gov",
    source_url: item.uiLink ?? "https://sam.gov/content/opportunities",
    opportunity_number: item.noticeId ?? null,
    deadline_at: item.responseDeadLine ? new Date(item.responseDeadLine).toISOString() : null,
    value_estimate: null,
    notes: item.type ? `SAM.gov notice type: ${item.type}` : "Imported from SAM.gov.",
    tags: ["federal", "sam.gov"]
  }));
}

export async function refreshContractSources() {
  const existing = await listProductRecords("contract_opportunities");
  const existingKeys = new Set(
    existing.records.map((record) => record.opportunity_number ?? record.title)
  );
  const sourceOpportunities = [
    ...(await fetchSamOpportunities()),
    ...fallbackSourceOpportunities
  ];
  const imported: ContractOpportunity[] = [];

  for (const source of sourceOpportunities) {
    const key = source.opportunity_number ?? source.title;

    if (existingKeys.has(key)) {
      continue;
    }

    const result = await createProductRecord(
      "contract_opportunities",
      toContractRecord(source)
    );

    imported.push(result.record);
    existingKeys.add(key);
  }

  return {
    sourceCount: sourceOpportunities.length,
    importedCount: imported.length,
    imported
  };
}
