// Vercel serverless function — no @vercel/node dependency needed
// Plain Node.js types work fine for Vercel API routes
import type { IncomingMessage, ServerResponse } from "http";
import nodemailer from "nodemailer";

const NOTIFY_EMAIL = "hamzakkstarplays68@gmail.com";

export default async function handler(req: IncomingMessage & { body?: any }, res: ServerResponse) {
  // CORS preflight
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    res.writeHead(204);
    res.end();
    return;
  }

  if (req.method !== "POST") {
    res.writeHead(405, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ error: "Method not allowed" }));
    return;
  }

  // Parse body (Vercel provides req.body automatically)
  const order = (req as any).body;

  console.log("[send-order] Received order for:", order?.customerName, "| Total:", order?.totalAmount);

  const user = process.env.GMAIL_USER;
  const pass = process.env.GMAIL_APP_PASSWORD;

  if (!user || !pass) {
    console.error("[send-order] MISSING CREDENTIALS — GMAIL_USER:", !!user, "GMAIL_APP_PASSWORD:", !!pass);
    // Still return 200 so customer sees success, but log clearly
    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ success: true, warning: "Email not sent: credentials missing in environment" }));
    return;
  }

  console.log("[send-order] Gmail credentials found, creating transporter...");

  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: { user, pass },
    });

    // Verify SMTP connection before sending
    await transporter.verify();
    console.log("[send-order] SMTP connection verified ✅");

    const itemRows = (order.items || [])
      .map((item: any) =>
        `<tr>
          <td style="padding:8px 0;color:#e5e5e5;font-size:13px;">${item.name || "Product"}</td>
          <td style="padding:8px 0;color:#888;font-size:13px;text-align:center;">x${item.quantity}</td>
          <td style="padding:8px 0;color:#D4AF37;font-size:13px;text-align:right;">${parseFloat(item.price || 0).toFixed(0)} PKR</td>
        </tr>`
      )
      .join("");

    const html = `<!DOCTYPE html>
<html>
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#0a0a0a;font-family:'Segoe UI',Arial,sans-serif;">
<div style="max-width:580px;margin:0 auto;padding:32px 16px;">

  <div style="text-align:center;padding:32px;background:#111;border:1px solid #D4AF37;border-radius:12px;margin-bottom:24px;">
    <p style="margin:0 0 8px;color:#D4AF37;font-size:11px;letter-spacing:4px;text-transform:uppercase;">New Order Alert</p>
    <h1 style="margin:0;color:#fff;font-size:28px;letter-spacing:3px;text-transform:uppercase;">AUREX NOIRE</h1>
  </div>

  <div style="background:#111;border:1px solid #1f1f1f;border-radius:12px;padding:24px;margin-bottom:16px;">
    <h2 style="margin:0 0 16px;color:#D4AF37;font-size:11px;letter-spacing:3px;text-transform:uppercase;">Customer Details</h2>
    <table style="width:100%;border-collapse:collapse;">
      <tr><td style="color:#888;padding:5px 0;font-size:13px;width:110px;">Name</td><td style="color:#e5e5e5;font-size:13px;">${order.customerName}</td></tr>
      <tr><td style="color:#888;padding:5px 0;font-size:13px;">Phone</td><td style="color:#e5e5e5;font-size:13px;">${order.customerPhone}</td></tr>
      <tr><td style="color:#888;padding:5px 0;font-size:13px;">Email</td><td style="color:#e5e5e5;font-size:13px;">${order.customerEmail}</td></tr>
      <tr><td style="color:#888;padding:5px 0;font-size:13px;">City</td><td style="color:#e5e5e5;font-size:13px;">${order.customerCity}</td></tr>
      <tr><td style="color:#888;padding:5px 0;font-size:13px;">Address</td><td style="color:#e5e5e5;font-size:13px;">${order.customerAddress}</td></tr>
      <tr><td style="color:#888;padding:5px 0;font-size:13px;">Payment</td>
        <td style="padding:5px 0;">
          <span style="background:${order.paymentMethod === 'COD' ? '#854d0e' : '#14532d'};color:${order.paymentMethod === 'COD' ? '#fbbf24' : '#4ade80'};padding:3px 10px;border-radius:20px;font-size:11px;font-weight:bold;">${order.paymentMethod === 'COD' ? 'Cash on Delivery' : 'Online Payment'}</span>
        </td>
      </tr>
    </table>
  </div>

  <div style="background:#111;border:1px solid #1f1f1f;border-radius:12px;padding:24px;margin-bottom:16px;">
    <h2 style="margin:0 0 12px;color:#D4AF37;font-size:11px;letter-spacing:3px;text-transform:uppercase;">Items Ordered</h2>
    <table style="width:100%;border-collapse:collapse;">
      <tr style="border-bottom:1px solid #1f1f1f;">
        <th style="color:#888;font-size:11px;text-align:left;padding-bottom:8px;font-weight:normal;">Product</th>
        <th style="color:#888;font-size:11px;text-align:center;padding-bottom:8px;font-weight:normal;">Qty</th>
        <th style="color:#888;font-size:11px;text-align:right;padding-bottom:8px;font-weight:normal;">Price</th>
      </tr>
      ${itemRows}
    </table>
  </div>

  <div style="background:#D4AF37;border-radius:12px;padding:20px 24px;margin-bottom:24px;">
    <table style="width:100%;">
      <tr>
        <td style="color:#0a0a0a;font-size:13px;font-weight:bold;letter-spacing:2px;text-transform:uppercase;">Total Amount</td>
        <td style="color:#0a0a0a;font-size:24px;font-weight:bold;text-align:right;">${parseFloat(order.totalAmount || 0).toFixed(0)} PKR</td>
      </tr>
    </table>
  </div>

  <p style="text-align:center;color:#333;font-size:11px;margin-top:32px;">AUREX NOIRE · aurexnoire.com</p>
</div>
</body>
</html>`;

    const info = await transporter.sendMail({
      from: `"AUREX NOIRE Orders" <${user}>`,
      to: NOTIFY_EMAIL,
      subject: `🛒 New Order — ${order.customerName} — ${parseFloat(order.totalAmount || 0).toFixed(0)} PKR`,
      html,
    });

    console.log("[send-order] ✅ Email sent successfully! MessageId:", info.messageId);
    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ success: true, messageId: info.messageId }));

  } catch (err: any) {
    console.error("[send-order] ❌ EMAIL FAILED:", err?.message || err);
    console.error("[send-order] Full error:", JSON.stringify(err, Object.getOwnPropertyNames(err)));
    // Return 500 so we know something failed — customer already on confirmation page
    res.writeHead(500, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ success: false, error: err?.message || "Email send failed" }));
  }
}
