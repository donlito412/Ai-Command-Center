import { NextResponse } from "next/server";
import {
  createProductRecord,
  deleteProductRecord,
  isProductResource,
  listProductRecords,
  updateProductRecord
} from "@/lib/products/store";

type RouteContext = {
  params: Promise<{
    resource: string;
  }>;
};

async function getResource(context: RouteContext) {
  const { resource } = await context.params;

  if (!isProductResource(resource)) {
    throw new Error("Unknown product resource.");
  }

  return resource;
}

export async function GET(request: Request, context: RouteContext) {
  try {
    const resource = await getResource(context);
    const url = new URL(request.url);
    const result = await listProductRecords(resource, url.searchParams);

    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Product list failed." },
      { status: 400 }
    );
  }
}

export async function POST(request: Request, context: RouteContext) {
  try {
    const resource = await getResource(context);
    const body = await request.json();
    const result = await createProductRecord(resource, body);

    return NextResponse.json(result, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Product create failed." },
      { status: 400 }
    );
  }
}

export async function PATCH(request: Request, context: RouteContext) {
  try {
    const resource = await getResource(context);
    const body = await request.json();

    if (!body.id) {
      return NextResponse.json({ error: "Record id is required." }, { status: 400 });
    }

    const { id, ...updates } = body;
    const result = await updateProductRecord(resource, id, updates);

    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Product update failed." },
      { status: 400 }
    );
  }
}

export async function DELETE(request: Request, context: RouteContext) {
  try {
    const resource = await getResource(context);
    const url = new URL(request.url);
    const id = url.searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "Record id is required." }, { status: 400 });
    }

    const result = await deleteProductRecord(resource, id);

    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Product delete failed." },
      { status: 400 }
    );
  }
}
