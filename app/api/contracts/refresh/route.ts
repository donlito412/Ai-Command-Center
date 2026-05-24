import { NextResponse } from "next/server";
import { refreshContractSources } from "@/lib/contracts/sources";

export async function POST() {
  try {
    const result = await refreshContractSources();

    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Contract source refresh failed."
      },
      { status: 400 }
    );
  }
}
