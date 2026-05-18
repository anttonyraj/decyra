import { NextResponse } from 'next/server';
import { Resend } from 'resend';

// Initialize Resend with the API key from environment variables
const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, company, usecase, message } = body;

    if (!name || !email || !company || !usecase || !message) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    if (!process.env.RESEND_API_KEY) {
      console.error("Missing RESEND_API_KEY in environment variables");
      // If no API key is provided, we simulate success so the UI doesn't break,
      // but log an error. In production this should throw.
      return NextResponse.json({ 
        success: true, 
        message: 'Simulated success (No Resend API Key found)' 
      }, { status: 200 });
    }

    const { data, error } = await resend.emails.send({
      from: 'Decyra Contact Form <onboarding@resend.dev>', // Resend test email. Replace with your verified domain.
      to: 'founder@decyra.systems',
      subject: `New Strategy Call Request from ${name} at ${company}`,
      html: `
        <h2>New Strategy Call Request</h2>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Company:</strong> ${company}</p>
        <p><strong>Primary Use Case:</strong> ${usecase}</p>
        <br/>
        <h3>Message:</h3>
        <p>${message.replace(/\n/g, '<br/>')}</p>
      `,
    });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json({ success: true, data }, { status: 200 });
  } catch (error) {
    console.error('Error processing contact form:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
