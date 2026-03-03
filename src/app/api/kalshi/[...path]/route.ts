import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";

const BASE_URL = "https://api.elections.kalshi.com/trade-api/v2";

function signRequest(method: string, path: string, timestamp: number): Record<string, string> {
  const headers: Record<string, string> = { Accept: "application/json" };
  const apiKey = process.env.KALSHI_API_KEY;
  const privateKeyPem = process.env.KALSHI_PRIVATE_KEY?.replace(/\\\\n/g, "\n").replace(/\\n/g, "\n");

  if (!apiKey || !privateKeyPem) return headers;

  const key = crypto.createPrivateKey(privateKeyPem);
  const message = `${timestamp}${method}/trade-api/v2${path}`;
  const signature = crypto.sign("sha256", Buffer.from(message), {
    key,
    padding: crypto.constants.RSA_PKCS1_PSS_PADDING,
    saltLength: crypto.constants.RSA_PSS_SALTLEN_DIGEST,
  });

  headers["KALSHI-ACCESS-KEY"] = apiKey;
  headers["KALSHI-ACCESS-TIMESTAMP"] = String(timestamp);
  headers["KALSHI-ACCESS-SIGNATURE"] = signature.toString("base64");
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

  const timestamp = Date.now();
  const headers = signRequest("GET", kalshiPath, timestamp);

  try {
    const res = await fetch(url, {
      headers,
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
