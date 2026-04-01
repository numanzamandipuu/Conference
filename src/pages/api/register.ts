import type { VercelRequest, VercelResponse } from '@vercel/node';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') return res.status(405).end();

  const {
    full_name,
    email,
    institution,
    phone,
    participant_type,
    trxid,
    voucherUrl
  } = req.body;

  try {
    await resend.emails.send({
      from: 'onboarding@resend.dev',
      to: 'your@email.com',
      subject: 'New Registration',
      html: `
        <h3>New Registration</h3>
        <p><strong>Name:</strong> ${full_name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Institution:</strong> ${institution}</p>
        <p><strong>Phone:</strong> ${phone}</p>
        <p><strong>Participant Type:</strong> ${participant_type}</p>
        <p><strong>Transaction ID:</strong> ${trxid}</p>
        <p><strong>Voucher:</strong> <a href="${voucherUrl}">View File</a></p>
      `
    });

    return res.status(200).json({ success: true });

  } catch (error) {
    return res.status(500).json({ error: 'Failed' });
  }
}