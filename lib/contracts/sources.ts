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

type PortalSource = {
  agency: string;
  source: string;
  url: string;
  tags: string[];
};

const sledPortalSources: PortalSource[] = [
  {
    agency: "Commonwealth of Pennsylvania",
    source: "PA eMarketplace",
    url: "https://www.emarketplace.state.pa.us/Search.aspx/Home.aspx",
    tags: ["sled", "state", "pennsylvania", "emarketplace"]
  },
  {
    agency: "Pennsylvania COSTARS",
    source: "COSTARS Electronic Bidding",
    url: "https://www.dgs.internet.state.pa.us/COSTARSElecBidd/",
    tags: ["sled", "state", "local", "costars", "cooperative-purchasing"]
  },
  {
    agency: "PennBid Agencies",
    source: "PennBid",
    url: "https://pennbid.net/",
    tags: ["sled", "local", "pennbid", "municipal", "subcontracting"]
  },
  {
    agency: "City of Pittsburgh",
    source: "Pittsburgh Beacon",
    url: "https://procurement.pittsburghpa.gov/opportunities/",
    tags: ["sled", "local", "pittsburgh", "beacon"]
  },
  {
    agency: "Allegheny County",
    source: "Allegheny County Bonfire",
    url: "https://alleghenycounty.bonfirehub.com/portal/?tab=openOpportunities",
    tags: ["sled", "county", "allegheny", "bonfire"]
  },
  {
    agency: "Allegheny County Department of Human Services",
    source: "Allegheny County DHS Solicitations",
    url: "https://solicitations.alleghenycounty.us/",
    tags: ["sled", "county", "human-services", "rfp"]
  },
  {
    agency: "Pittsburgh Public Schools",
    source: "Pittsburgh Public Schools",
    url: "https://www.pghschools.org/community/business-opportunities/rfps",
    tags: ["sled", "local", "schools", "education"]
  },
  {
    agency: "Pittsburgh Water",
    source: "Pittsburgh Water Bonfire",
    url: "https://pgh2o.bonfirehub.com/portal/?tab=openOpportunities",
    tags: ["sled", "local", "authority", "bonfire", "infrastructure"]
  }
];

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
  },
  {
    title: "Facilities maintenance subcontracting support",
    agency: "Regional School District",
    source: "PA eMarketplace",
    source_url: "https://www.emarketplace.state.pa.us/Search.aspx/Home.aspx",
    opportunity_number: "SLED-FAC-006",
    deadline_at: "2026-07-15T21:00:00.000Z",
    value_estimate: 90000,
    notes: "SLED subcontracting target for maintenance, vendor support, and facility service partners.",
    tags: ["sled", "subcontracting", "facilities", "maintenance", "services"]
  },
  {
    title: "Temporary staffing and administrative support",
    agency: "County Human Services",
    source: "PA eMarketplace",
    source_url: "https://www.emarketplace.state.pa.us/Search.aspx/Home.aspx",
    opportunity_number: "SLED-STAFF-007",
    deadline_at: "2026-07-18T21:00:00.000Z",
    value_estimate: 55000,
    notes: "State/local administrative services opportunity with subcontracting potential.",
    tags: ["sled", "subcontracting", "staffing", "admin", "services"]
  },
  {
    title: "Community event production and vendor services",
    agency: "Parks and Recreation Department",
    source: "Pittsburgh Procurement",
    source_url: "https://www.pittsburghpa.gov/Business-Development/Procurement",
    opportunity_number: "LOCAL-EVENT-008",
    deadline_at: "2026-07-22T21:00:00.000Z",
    value_estimate: 65000,
    notes: "Event services and production opportunity suitable for creative subcontracting.",
    tags: ["sled", "events", "production", "media", "subcontracting"]
  },
  {
    title: "Federal prime subcontractor support services",
    agency: "Federal Prime Contractor",
    source: "SAM.gov",
    source_url: "https://sam.gov/content/opportunities",
    opportunity_number: "FED-SUB-009",
    deadline_at: "2026-07-30T21:00:00.000Z",
    value_estimate: 150000,
    notes: "Federal subcontracting target for teaming, technical support, documentation, and admin operations.",
    tags: ["federal", "subcontracting", "technical", "admin", "services"]
  },
  {
    title: "Janitorial supplies, paper goods, and fulfillment services",
    agency: "Commonwealth of Pennsylvania",
    source: "PA eMarketplace",
    source_url: "https://www.emarketplace.state.pa.us/Search.aspx/Home.aspx",
    opportunity_number: "PA-SUPPLY-FULFILLMENT",
    deadline_at: "2026-07-19T21:00:00.000Z",
    value_estimate: 75000,
    notes: "SLED supply fulfillment target for recurring products, delivery, inventory, and vendor support.",
    tags: ["sled", "supply", "supplies", "fulfillment", "logistics", "delivery"]
  },
  {
    title: "Building renovation and construction trade services",
    agency: "Pittsburgh Regional Authority",
    source: "Local Procurement",
    source_url: "https://procurement.pittsburghpa.gov/opportunities/",
    opportunity_number: "LOCAL-CONSTRUCTION-010",
    deadline_at: "2026-07-26T21:00:00.000Z",
    value_estimate: 185000,
    notes: "SLED construction opportunity for renovation, trades, repair, and subcontracting support.",
    tags: ["sled", "construction", "trades", "renovation", "repair", "subcontracting"]
  }
];

function decodeHtml(value: string) {
  return value
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, "\"")
    .replace(/&#39;/g, "'")
    .replace(/&nbsp;/g, " ")
    .replace(/<[^>]*>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function createAbsoluteUrl(href: string, baseUrl: string) {
  try {
    return new URL(href, baseUrl).toString();
  } catch {
    return baseUrl;
  }
}

function isLikelyOpportunity(source: PortalSource, title: string, href: string) {
  const text = `${title} ${href}`.toLowerCase();
  const blockedTitles = [
    "solicitation #",
    "solicitation title",
    "solicitation start date",
    "solicitation due date",
    "bid opening date",
    "skip to content",
    "request demo",
    "request overview",
    "support.bonfire@eunasolutions.com",
    "open public opportunities",
    "past public opportunities",
    "public contracts",
    "view auction",
    "rfp archive",
    "facilities bid results archive",
    "minority/women business department"
  ];

  if (
    href.startsWith("javascript:") ||
    href.startsWith("mailto:") ||
    href.includes("%20") ||
    blockedTitles.includes(title.toLowerCase())
  ) {
    return false;
  }

  if (source.source === "PA eMarketplace") {
    return href.includes("emarketplace.state.pa.us/Solicitations.aspx?SID=");
  }

  if (source.source.includes("Bonfire")) {
    return href.includes(".bonfirehub.com/opportunities/") && !href.includes("/auctions/");
  }

  if (source.source === "PennBid") {
    return href.includes("pennbidprocureware.com") || href.includes("/bid/");
  }

  if (source.source === "Pittsburgh Beacon") {
    return href.includes("procurement.pittsburghpa.gov/opportunities/") && href !== source.url;
  }

  if (source.source === "Pittsburgh Public Schools") {
    return (
      (text.includes("rfp") || text.includes("bid") || text.includes("proposal")) &&
      !text.includes("archive") &&
      !text.includes("policy")
    );
  }

  return [
    "bid",
    "rfp",
    "rfq",
    "rfi",
    "solicitation",
    "opportunit",
    "proposal",
    "contract",
    "invitation"
  ].some((term) => text.includes(term));
}

function parsePaMarketplaceHtml(source: PortalSource, html: string): SourceOpportunity[] {
  const rows = [...html.matchAll(/<tr\b[^>]*>([\s\S]*?)<\/tr>/gi)];
  const opportunities: SourceOpportunity[] = [];
  const seen = new Set<string>();

  for (const row of rows) {
    const rowHtml = row[1];
    const link = rowHtml.match(/href=["']([^"']*Solicitations\.aspx\?SID=([^"']+))["']/i);

    if (!link) {
      continue;
    }

    const sourceUrl = createAbsoluteUrl(decodeHtml(link[1]), source.url);
    const sid = decodeHtml(link[2]);
    const cells = [...rowHtml.matchAll(/<td\b[^>]*>([\s\S]*?)<\/td>/gi)]
      .map((cell) => decodeHtml(cell[1]))
      .filter(Boolean);
    const title =
      cells.find((cell) =>
        cell !== sid &&
        !/^\d{1,2}\/\d{1,2}\/\d{4}/.test(cell) &&
        !/^open$/i.test(cell) &&
        cell.length > 12
      ) ?? sid;

    if (seen.has(sid)) {
      continue;
    }

    seen.add(sid);
    opportunities.push({
      title,
      agency: source.agency,
      source: source.source,
      source_url: sourceUrl,
      opportunity_number: sid,
      deadline_at: null,
      value_estimate: null,
      notes: `Imported from ${source.source}. Open source link for current bid details, documents, deadline, and submission requirements.`,
      tags: source.tags
    });

    if (opportunities.length >= 12) {
      break;
    }
  }

  return opportunities;
}

function parsePortalHtml(source: PortalSource, html: string): SourceOpportunity[] {
  if (source.source === "PA eMarketplace") {
    return parsePaMarketplaceHtml(source, html);
  }

  const matches = [...html.matchAll(/<a\b[^>]*href=["']([^"']+)["'][^>]*>([\s\S]*?)<\/a>/gi)];
  const seen = new Set<string>();
  const opportunities: SourceOpportunity[] = [];

  for (const match of matches) {
    const title = decodeHtml(match[2]);
    const sourceUrl = createAbsoluteUrl(decodeHtml(match[1]), source.url);

    if (title.length < 8 || !isLikelyOpportunity(source, title, sourceUrl)) {
      continue;
    }

    const key = `${title}:${sourceUrl}`;

    if (seen.has(key)) {
      continue;
    }

    seen.add(key);

    opportunities.push({
      title,
      agency: source.agency,
      source: source.source,
      source_url: sourceUrl,
      opportunity_number: `${source.source}:${title}`.slice(0, 120),
      deadline_at: null,
      value_estimate: null,
      notes: `Imported from ${source.source}. Open source link for current bid details, documents, deadline, and submission requirements.`,
      tags: source.tags
    });

    if (opportunities.length >= 12) {
      break;
    }
  }

  return opportunities;
}

function inferContractTags(source: SourceOpportunity) {
  const text = [
    source.title,
    source.agency,
    source.source,
    source.notes,
    source.tags.join(" ")
  ].join(" ").toLowerCase();
  const tags: string[] = [];
  const keywordGroups: Array<[string, string[]]> = [
    ["supply", ["supply", "supplies", "material", "materials", "equipment", "goods", "product"]],
    ["fulfillment", ["fulfillment", "warehouse", "inventory", "delivery", "logistics", "distribution", "courier"]],
    ["construction", ["construction", "renovation", "paving", "concrete", "roof", "roofing", "demolition", "build"]],
    ["trades", ["electrical", "plumbing", "hvac", "carpentry", "trade", "trades", "repair"]],
    ["facilities", ["facility", "facilities", "maintenance", "janitorial", "grounds"]],
    ["staffing", ["staffing", "temporary staff", "personnel", "administrative"]],
    ["subcontracting", ["subcontract", "subcontracting", "prime", "teaming"]]
  ];

  for (const [tag, keywords] of keywordGroups) {
    if (keywords.some((keyword) => text.includes(keyword))) {
      tags.push(tag);
    }
  }

  return tags;
}

async function fetchPortalOpportunities(source: PortalSource): Promise<SourceOpportunity[]> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 8000);

  try {
    const response = await fetch(source.url, {
      headers: {
        "user-agent": "Ai Command Center contract source monitor"
      },
      next: { revalidate: 3600 },
      signal: controller.signal
    });

    if (!response.ok) {
      return [];
    }

    const html = await response.text();

    return parsePortalHtml(source, html);
  } catch {
    return [];
  } finally {
    clearTimeout(timeout);
  }
}

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
    tags: [...new Set([...source.tags, ...inferContractTags(source), ...score.matchedTerms])],
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
  url.searchParams.set("limit", "25");
  url.searchParams.set("title", "services supplies construction staffing facility media training data");

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 8000);
  const response = await fetch(url, {
    next: { revalidate: 3600 },
    signal: controller.signal
  })
    .catch(() => null)
    .finally(() => clearTimeout(timeout));

  if (!response?.ok) {
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
    ...(await Promise.all(sledPortalSources.map(fetchPortalOpportunities))).flat(),
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
