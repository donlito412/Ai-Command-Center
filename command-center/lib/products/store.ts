import { supabaseServer } from "@/lib/supabase/server";
import {
  fallbackProductData
} from "./fallback-data";
import {
  productResources,
  type ActivityEvent,
  type ProductListResponse,
  type ProductMutationResponse,
  type ProductRecordMap,
  type ProductResource
} from "./types";

type ProductRecordInput<Resource extends ProductResource> =
  Partial<ProductRecordMap[Resource]> & {
    title?: string;
  };

const mutableFallbackData = structuredClone(fallbackProductData);

export function isProductResource(resource: string): resource is ProductResource {
  return productResources.includes(resource as ProductResource);
}

function createFallbackId(resource: ProductResource) {
  return `${resource}_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
}

function filterRecords<Resource extends ProductResource>(
  records: ProductRecordMap[Resource][],
  searchParams: URLSearchParams
) {
  const status = searchParams.get("status");
  const query = searchParams.get("q")?.toLowerCase();
  const limit = Number(searchParams.get("limit") ?? 100);

  return records
    .filter((record) => {
      const statusMatches = !status || ("status" in record && record.status === status);
      const queryMatches =
        !query ||
        JSON.stringify(record)
          .toLowerCase()
          .includes(query);

      return statusMatches && queryMatches;
    })
    .slice(0, Number.isFinite(limit) ? limit : 100);
}

function now() {
  return new Date().toISOString();
}

async function writeActivityEvent(
  resource: ProductResource,
  recordId: string | null,
  action: "created" | "updated" | "deleted",
  summary: string
) {
  const event: Omit<ActivityEvent, "id"> = {
    module: "dashboard",
    resource,
    record_id: recordId,
    action,
    summary,
    metadata: {},
    created_at: now()
  };

  if (supabaseServer) {
    await supabaseServer.from("activity_events").insert(event);
    return;
  }

  mutableFallbackData.activity_events.unshift({
    id: createFallbackId("activity_events"),
    ...event
  });
}

export async function listProductRecords<Resource extends ProductResource>(
  resource: Resource,
  searchParams = new URLSearchParams()
): Promise<ProductListResponse<Resource>> {
  if (supabaseServer) {
    const { data, error } = await supabaseServer
      .from(resource)
      .select("*")
      .order("updated_at", { ascending: false })
      .limit(Number(searchParams.get("limit") ?? 100));

    if (!error && data) {
      return {
        resource,
        source: "supabase",
        records: filterRecords(data as ProductRecordMap[Resource][], searchParams)
      };
    }
  }

  return {
    resource,
    source: "fallback",
    records: filterRecords(mutableFallbackData[resource], searchParams)
  };
}

export async function createProductRecord<Resource extends ProductResource>(
  resource: Resource,
  input: ProductRecordInput<Resource>
): Promise<ProductMutationResponse<Resource>> {
  const timestamp = now();
  const payload = {
    ...input,
    created_at: timestamp,
    updated_at: timestamp
  };

  if (supabaseServer) {
    const { data, error } = await supabaseServer
      .from(resource)
      .insert(payload)
      .select("*")
      .single();

    if (!error && data) {
      await writeActivityEvent(resource, data.id, "created", `Created ${resource} record.`);
      return {
        resource,
        source: "supabase",
        record: data as ProductRecordMap[Resource]
      };
    }
  }

  const record = {
    id: createFallbackId(resource),
    ...payload
  } as ProductRecordMap[Resource];

  mutableFallbackData[resource].unshift(record);
  await writeActivityEvent(resource, record.id, "created", `Created ${resource} record.`);

  return {
    resource,
    source: "fallback",
    record
  };
}

export async function updateProductRecord<Resource extends ProductResource>(
  resource: Resource,
  id: string,
  input: ProductRecordInput<Resource>
): Promise<ProductMutationResponse<Resource>> {
  const payload = {
    ...input,
    updated_at: now()
  };

  if (supabaseServer) {
    const { data, error } = await supabaseServer
      .from(resource)
      .update(payload)
      .eq("id", id)
      .select("*")
      .single();

    if (!error && data) {
      await writeActivityEvent(resource, id, "updated", `Updated ${resource} record.`);
      return {
        resource,
        source: "supabase",
        record: data as ProductRecordMap[Resource]
      };
    }
  }

  const records = mutableFallbackData[resource];
  const index = records.findIndex((record) => record.id === id);

  if (index < 0) {
    throw new Error("Record not found.");
  }

  const record = {
    ...records[index],
    ...payload
  } as ProductRecordMap[Resource];

  records[index] = record;
  await writeActivityEvent(resource, id, "updated", `Updated ${resource} record.`);

  return {
    resource,
    source: "fallback",
    record
  };
}

export async function deleteProductRecord(
  resource: ProductResource,
  id: string
) {
  if (supabaseServer) {
    const { error } = await supabaseServer.from(resource).delete().eq("id", id);

    if (!error) {
      await writeActivityEvent(resource, id, "deleted", `Deleted ${resource} record.`);
      return {
        resource,
        source: "supabase" as const,
        id
      };
    }
  }

  const records = mutableFallbackData[resource];
  const index = records.findIndex((record) => record.id === id);

  if (index < 0) {
    throw new Error("Record not found.");
  }

  records.splice(index, 1);
  await writeActivityEvent(resource, id, "deleted", `Deleted ${resource} record.`);

  return {
    resource,
    source: "fallback" as const,
    id
  };
}
