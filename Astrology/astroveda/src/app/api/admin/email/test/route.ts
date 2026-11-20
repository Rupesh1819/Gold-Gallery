import { NextResponse } from 'next/server';
import { sendTransactionalEmail } from '@/lib/notifications/emailService';
import { verifyAdminRequest } from '@/lib/auth/adminSession';

export async function POST(request: Request) {
  const admin = await verifyAdminRequest(request);
  if (!admin.valid) {
    return NextResponse.json({ error: 'Unauthorized: Admin session required' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { to } = body;

    if (!to || !to.includes('@')) {
      return NextResponse.json({ error: 'Valid recipient email required' }, { status: 400 });
    }

    const testHtml = `
      <div style="font-family:sans-serif;padding:30px;background:#10172B;color:#F7F3EA;border-radius:12px;">
        <h2 style="color:#F6D186;">MyGuruji Email Dispatcher Test</h2>
        <p>Namaste! Your transactional email service is correctly connected and operational.</p>
        <p style="color:#D8B56D;font-size:12px;">Sent at: ${new Date().toISOString()}</p>
      </div>
    `;

    const result = await sendTransactionalEmail({
      to,
      subject: 'MyGuruji Sanctuary: Email Dispatcher Verification',
      html: testHtml,
    });

    return NextResponse.json({
      success: result.success,
      mode: result.mode,
      message: result.mode === 'resend' 
        ? `Live verification email sent via Resend API to ${to}` 
        : `Preview dispatch recorded for ${to}. To send real inbox emails, add RESEND_API_KEY to your .env file.`,
      error: result.error,
    });
  } catch (err: any) {
    return NextResponse.json({ error: 'Failed to dispatch test verification email.' }, { status: 500 });
  }
}

