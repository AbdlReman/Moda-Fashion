/**
 * Contact Form API Route
 * 
 * This route handles contact form submissions and sends emails via Gmail using nodemailer.
 * 
 * Required Environment Variables (add to .env.local):
 * 
 * EMAIL_USER=your-email@gmail.com
 * EMAIL_PASS=your-app-password
 * RECIPIENT_EMAIL=recipient-email@gmail.com (optional, defaults to EMAIL_USER)
 * 
 * How to get Gmail App Password:
 * 1. Go to your Google Account settings
 * 2. Enable 2-Step Verification if not already enabled
 * 3. Go to Security > 2-Step Verification > App passwords
 * 4. Generate a new app password for "Mail"
 * 5. Use the generated 16-character password as EMAIL_PASS
 * 
 * Note: Do NOT use your regular Gmail password. You must use an App Password.
 */

import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export async function POST(request) {
  try {
    const body = await request.json();
    const { name, email, subject, phone, message } = body;

    // Validate required fields
    if (!name || !email || !message) {
      return NextResponse.json(
        { error: 'Name, email, and message are required' },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      );
    }

    // Check if email credentials are configured
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
      return NextResponse.json(
        { 
          error: 'Email service is not configured. Please add EMAIL_USER and EMAIL_PASS to your .env.local file.',
          details: process.env.NODE_ENV === 'development' ? 'Missing EMAIL_USER or EMAIL_PASS environment variables' : undefined
        },
        { status: 500 }
      );
    }

    // Create transporter
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS, // Use App Password, not regular password
      },
    });

    // Email content
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: process.env.RECIPIENT_EMAIL || process.env.EMAIL_USER, // Send to your email
      replyTo: email, // Allow replying directly to the sender
      subject: subject || `Contact Form Submission from ${name}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9f9f9;">
          <div style="background-color: #ffffff; padding: 30px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
            <h2 style="color: #333; margin-top: 0; border-bottom: 2px solid #007bff; padding-bottom: 10px;">
              New Contact Form Submission
            </h2>
            
            <div style="margin-top: 20px;">
              <p style="color: #666; margin: 10px 0;">
                <strong style="color: #333; display: inline-block; width: 120px;">Name:</strong>
                <span>${name}</span>
              </p>
              
              <p style="color: #666; margin: 10px 0;">
                <strong style="color: #333; display: inline-block; width: 120px;">Email:</strong>
                <a href="mailto:${email}" style="color: #007bff; text-decoration: none;">${email}</a>
              </p>
              
              ${phone ? `
              <p style="color: #666; margin: 10px 0;">
                <strong style="color: #333; display: inline-block; width: 120px;">Phone:</strong>
                <a href="tel:${phone}" style="color: #007bff; text-decoration: none;">${phone}</a>
              </p>
              ` : ''}
              
              ${subject ? `
              <p style="color: #666; margin: 10px 0;">
                <strong style="color: #333; display: inline-block; width: 120px;">Subject:</strong>
                <span>${subject}</span>
              </p>
              ` : ''}
              
              <div style="margin-top: 20px; padding-top: 20px; border-top: 1px solid #eee;">
                <strong style="color: #333; display: block; margin-bottom: 10px;">Message:</strong>
                <p style="color: #666; line-height: 1.6; white-space: pre-wrap; background-color: #f5f5f5; padding: 15px; border-radius: 4px;">
                  ${message}
                </p>
              </div>
            </div>
            
            <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee; text-align: center;">
              <p style="color: #999; font-size: 12px; margin: 0;">
                This email was sent from the contact form on your website.
              </p>
            </div>
          </div>
        </div>
      `,
      text: `
New Contact Form Submission

Name: ${name}
Email: ${email}
${phone ? `Phone: ${phone}` : ''}
${subject ? `Subject: ${subject}` : ''}

Message:
${message}
      `,
    };

    // Send email
    await transporter.sendMail(mailOptions);

    return NextResponse.json(
      { 
        success: true, 
        message: 'Your message has been sent successfully! We will get back to you soon.' 
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error sending email:', error);
    
    // Check if it's a configuration error
    if (error.code === 'EAUTH') {
      return NextResponse.json(
        { 
          error: 'Email authentication failed. Please check your EMAIL_USER and EMAIL_PASS in .env.local file. Make sure you are using a Gmail App Password, not your regular password.',
          details: process.env.NODE_ENV === 'development' ? error.message : undefined
        },
        { status: 500 }
      );
    }

    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
      return NextResponse.json(
        { 
          error: 'Email service is not configured. Please add EMAIL_USER and EMAIL_PASS to your .env.local file.',
          details: process.env.NODE_ENV === 'development' ? 'Missing EMAIL_USER or EMAIL_PASS environment variables' : undefined
        },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { 
        error: 'Failed to send message. Please try again later.',
        details: process.env.NODE_ENV === 'development' ? error.message : undefined
      },
      { status: 500 }
    );
  }
}

