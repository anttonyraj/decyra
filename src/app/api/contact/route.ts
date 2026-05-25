import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { action } = body;

    if (!action || (action !== "contact" && action !== "visitor")) {
      return NextResponse.json({ error: "Invalid action type" }, { status: 400 });
    }

    // Extract visitor geolocation parameters from Vercel headers
    const ip = req.headers.get("x-real-ip") || req.headers.get("x-forwarded-for") || "127.0.0.1";
    const city = req.headers.get("x-vercel-ip-city") || "Unknown City";
    const country = req.headers.get("x-vercel-ip-country") || "Unknown Country";

    // Build payload to send to Google Apps Script
    const payload = {
      ...body,
      ip,
      city,
      country,
    };

    const scriptUrl = process.env.CONTACT_SHEET_SCRIPT_URL;

    if (!scriptUrl) {
      console.warn("⚠️ CONTACT_SHEET_SCRIPT_URL is not set. Google Apps Script submission skipped. Payload was:", payload);
      return NextResponse.json({ 
        status: "success", 
        mock: true, 
        message: "Request logged locally (Environment variable not set)." 
      });
    }

    // Forward the POST request to the Google Apps Script URL
    const response = await fetch(scriptUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("❌ Google Apps Script Web App returned an error status:", response.status, errorText);
      return NextResponse.json({ error: "Google Apps Script connection failed" }, { status: 502 });
    }

    const result = await response.json();
    return NextResponse.json(result);

  } catch (error: any) {
    console.error("❌ Contact API handler error:", error);
    return NextResponse.json({ error: error.message || "Internal server error" }, { status: 500 });
  }
}
