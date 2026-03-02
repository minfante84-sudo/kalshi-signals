import { NextRequest, NextResponse } from "next/server";

const BASE_URL = "https://api.elections.kalshi.com/trade-api/v2";

function getAuthHeaders(): Record<string, string> {
  const headers: Record<string, string> = { Accept: "application/json" };
  const apiKey = process.env.KALSHI_API_KEY;
  if (apiKey) {
    headers["Authorization"] = `Bearer ${apiKey}`;
  }
  return headers;
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  const { path } = await params;
  const kalshiPath = "/" + path.join("/");
  const searchParams = request.nextUrl.searchParams.toString();
  const url = `${BASE_URL}${kalshiPath}${searchParams ? `?${searchParams}` : ""}`;

  try {
    const res = await fetch(url, {
      headers: getAuthHeaders(),
      next: { revalidate: 15 },
    });

    if (!res.ok) {
      return NextResponse.json(
        { error: `Kalshi API error: ${res.status}` },
        { status: res.status }
      );
    }

    const data = await res.json();
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch from Kalshi API" },
      { status: 500 }
    );
  }
}
