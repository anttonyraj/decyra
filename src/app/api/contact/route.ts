import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, company, usecase, message } = body;

    // Validate required fields
    if (!name || !email || !company || !usecase || !message) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const GOOGLE_SCRIPT_URL = process.env.GOOGLE_SCRIPT_URL;

    if (!GOOGLE_SCRIPT_URL) {
      console.error("Missing GOOGLE_SCRIPT_URL in environment variables");
      // Simulate success if the URL isn't configured yet so the UI doesn't break
      return NextResponse.json({ 
        success: true, 
        message: 'Simulated success (No GOOGLE_SCRIPT_URL found)' 
      }, { status: 200 });
    }

    // Forward the payload to the Google Apps Script Web App
    const response = await fetch(GOOGLE_SCRIPT_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      // Send the exact body received from the client
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      throw new Error(`Google Script returned status ${response.status}`);
    }

    // Attempt to parse the response from Google Script (usually JSON if configured correctly)
    const result = await response.json().catch(() => ({}));

    return NextResponse.json({ success: true, ...result }, { status: 200 });
  } catch (error) {
    console.error('Error forwarding contact form to Google Script:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
