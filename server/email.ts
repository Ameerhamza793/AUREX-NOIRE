import nodemailer from "nodemailer";

const NOTIFY_EMAIL = "hamzakkstarplays68@gmail.com";

function createTransporter() {
  const user = process.env.GMAIL_USER;
  const pass = process.env.GMAIL_APP_PASSWORD;

  if (!user || !pass) return null;

  return nodemailer.createTransport({
    service: "gmail",
    auth: { user, pass },
  });
}

interface OrderEmailData {
  orderId: number | null;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  customerAddress: string;
  customerCity: string;
  paymentMethod: string;
  totalAmount: string;
  items: { name: string; quantity: number; price: string; imageUrl?: string }[];
}

export async function sendOrderNotificationEmail(order: OrderEmailData) {
  const transporter = createTransporter();
  if (!transporter) {
    console.warn("[Email] GMAIL_USER or GMAIL_APP_PASSWORD not set — skipping email notification.");
    return;
  }

  const itemCards = order.items
    .map(
      (item) =>
        `<div style="display:flex;align-items:center;gap:16px;padding:14px 0;border-bottom:1px solid #1f1f1f;">
          ${item.imageUrl
            ? `<img src="${item.imageUrl}" alt="${item.name}" width="72" height="72"
                style="width:72px;height:72px;object-fit:cover;border-radius:8px;flex-shrink:0;border:1px solid #2a2a2a;" />`
            : `<div style="width:72px;height:72px;background:#1a1a1a;border-radius:8px;flex-shrink:0;display:flex;align-items:center;justify-content:center;">
                <span style="color:#444;font-size:22px;">🛍</span>
              </div>`
          }
          <div style="flex:1;min-width:0;">
            <p style="margin:0 0 4px;color:#e5e5e5;font-size:14px;font-weight:500;line-height:1.3;">${item.name}</p>
            <p style="margin:0;color:#888;font-size:12px;">Qty: ${item.quantity}</p>
          </div>
          <div style="text-align:right;flex-shrink:0;">
            <p style="margin:0;color:#D4AF37;font-size:14px;font-weight:bold;">${parseFloat(item.price).toFixed(0)} PKR</p>
          </div>
        </div>`
    )
    .join("");

  const html = `
<!DOCTYPE html>
<html>
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#0a0a0a;font-family:'Segoe UI',Arial,sans-serif;">
  <div style="max-width:580px;margin:0 auto;padding:32px 16px;">

    <!-- Header -->
    <div style="text-align:center;padding:32px;background:#111;border:1px solid #D4AF37;border-radius:12px;margin-bottom:24px;">
      <p style="margin:0 0 8px;color:#D4AF37;font-size:11px;letter-spacing:4px;text-transform:uppercase;">New Order Alert</p>
      <h1 style="margin:0;color:#ffffff;font-size:28px;letter-spacing:3px;text-transform:uppercase;">AUREX NOIRE</h1>
      <p style="margin:12px 0 0;color:#888;font-size:13px;">Order #${order.orderId ?? "—"}</p>
    </div>

    <!-- Customer Details -->
    <div style="background:#111;border:1px solid #1f1f1f;border-radius:12px;padding:24px;margin-bottom:16px;">
      <h2 style="margin:0 0 16px;color:#D4AF37;font-size:11px;letter-spacing:3px;text-transform:uppercase;">Customer</h2>
      <table style="width:100%;border-collapse:collapse;">
        <tr><td style="color:#888;padding:4px 0;font-size:13px;width:120px;">Name</td><td style="color:#e5e5e5;padding:4px 0;font-size:13px;">${order.customerName}</td></tr>
        <tr><td style="color:#888;padding:4px 0;font-size:13px;">Phone</td><td style="color:#e5e5e5;padding:4px 0;font-size:13px;">${order.customerPhone}</td></tr>
        <tr><td style="color:#888;padding:4px 0;font-size:13px;">Email</td><td style="color:#e5e5e5;padding:4px 0;font-size:13px;">${order.customerEmail}</td></tr>
        <tr><td style="color:#888;padding:4px 0;font-size:13px;">City</td><td style="color:#e5e5e5;padding:4px 0;font-size:13px;">${order.customerCity}</td></tr>
        <tr><td style="color:#888;padding:4px 0;font-size:13px;">Address</td><td style="color:#e5e5e5;padding:4px 0;font-size:13px;">${order.customerAddress}</td></tr>
        <tr><td style="color:#888;padding:4px 0;font-size:13px;">Payment</td>
          <td style="padding:4px 0;">
            <span style="background:${order.paymentMethod === 'COD' ? '#854d0e' : '#14532d'};color:${order.paymentMethod === 'COD' ? '#fbbf24' : '#4ade80'};padding:2px 10px;border-radius:20px;font-size:11px;font-weight:bold;letter-spacing:1px;">${order.paymentMethod}</span>
          </td>
        </tr>
      </table>
    </div>

    <!-- Items -->
    <div style="background:#111;border:1px solid #1f1f1f;border-radius:12px;padding:24px;margin-bottom:16px;">
      <h2 style="margin:0 0 8px;color:#D4AF37;font-size:11px;letter-spacing:3px;text-transform:uppercase;">Items Ordered</h2>
      ${itemCards}
    </div>

    <!-- Total -->
    <div style="background:#D4AF37;border-radius:12px;padding:20px 24px;display:flex;justify-content:space-between;align-items:center;margin-bottom:24px;">
      <span style="color:#0a0a0a;font-size:13px;font-weight:bold;letter-spacing:2px;text-transform:uppercase;">Total Amount</span>
      <span style="color:#0a0a0a;font-size:24px;font-weight:bold;">${parseFloat(order.totalAmount).toFixed(0)} PKR</span>
    </div>

    <!-- CTA -->
    <div style="text-align:center;">
      <a href="https://aurexnoire.com/admin" style="display:inline-block;background:#D4AF37;color:#0a0a0a;padding:14px 32px;border-radius:8px;text-decoration:none;font-weight:bold;font-size:12px;letter-spacing:2px;text-transform:uppercase;">View in Admin Panel</a>
    </div>

    <p style="text-align:center;color:#333;font-size:11px;margin-top:32px;">AUREX NOIRE · aurexnoire.com</p>
  </div>
</body>
</html>`;

  await transporter.sendMail({
    from: `"AUREX NOIRE Orders" <${process.env.GMAIL_USER}>`,
    to: NOTIFY_EMAIL,
    subject: `🛒 New Order — ${order.customerName} — ${parseFloat(order.totalAmount).toFixed(0)} PKR`,
    html,
  });

  console.log(`[Email] Order notification sent to ${NOTIFY_EMAIL}`);
}
