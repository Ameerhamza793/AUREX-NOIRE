import nodemailer from "nodemailer";

const NOTIFY_EMAIL = "hamzakkstarplays68@gmail.com";

function createTransporter() {
  const user = process.env.GMAIL_USER;
  const pass = process.env.GMAIL_APP_PASSWORD;
  if (!user || !pass) return null;
  return nodemailer.createTransport({ service: "gmail", auth: { user, pass } });
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
    console.warn("[Email] GMAIL_USER or GMAIL_APP_PASSWORD not set — skipping email.");
    return;
  }

  const totalItems = order.items.reduce((sum, i) => sum + i.quantity, 0);
  const now = new Date().toLocaleString("en-PK", { timeZone: "Asia/Karachi", dateStyle: "medium", timeStyle: "short" });

  const itemCards = order.items.map((item) => {
    const imageBlock = item.imageUrl
      ? `<img src="${item.imageUrl}" width="80" height="80"
           style="width:80px;height:80px;object-fit:cover;border-radius:10px;border:1px solid #2a2a2a;display:block;" />`
      : `<div style="width:80px;height:80px;background:#1a1a1a;border-radius:10px;border:1px solid #2a2a2a;font-size:28px;text-align:center;line-height:80px;">🛍</div>`;

    const lineTotal = (parseFloat(item.price) * item.quantity).toFixed(0);

    return `
    <tr>
      <td style="padding:16px 0;border-bottom:1px solid #1a1a1a;vertical-align:middle;">
        <table style="border-collapse:collapse;width:100%;">
          <tr>
            <td style="width:80px;padding-right:16px;vertical-align:middle;">${imageBlock}</td>
            <td style="vertical-align:middle;">
              <p style="margin:0 0 4px;color:#e5e5e5;font-size:14px;font-weight:600;line-height:1.4;">${item.name}</p>
              <p style="margin:0;color:#888;font-size:12px;">Qty: <strong style="color:#aaa;">${item.quantity}</strong></p>
              <p style="margin:4px 0 0;color:#888;font-size:12px;">Unit: <strong style="color:#D4AF37;">${parseFloat(item.price).toFixed(0)} PKR</strong></p>
            </td>
            <td style="text-align:right;vertical-align:middle;white-space:nowrap;">
              <p style="margin:0;color:#D4AF37;font-size:15px;font-weight:700;">${lineTotal} PKR</p>
            </td>
          </tr>
        </table>
      </td>
    </tr>`;
  }).join("");

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width,initial-scale=1">
  <title>New Order — AUREX NOIRE</title>
</head>
<body style="margin:0;padding:0;background:#0a0a0a;font-family:'Segoe UI',Helvetica,Arial,sans-serif;">
<div style="max-width:600px;margin:0 auto;padding:24px 16px;">

  <!-- HEADER -->
  <div style="background:linear-gradient(135deg,#111 0%,#1a1500 100%);border:1px solid #D4AF37;border-radius:16px;padding:36px 32px;text-align:center;margin-bottom:20px;">
    <p style="margin:0 0 6px;color:#D4AF37;font-size:10px;letter-spacing:5px;text-transform:uppercase;">New Order Received</p>
    <h1 style="margin:0 0 8px;color:#ffffff;font-size:30px;font-weight:700;letter-spacing:4px;text-transform:uppercase;">AUREX NOIRE</h1>
    <p style="margin:0;color:#888;font-size:12px;letter-spacing:1px;">Order #${order.orderId ?? "—"} · ${now} · PKT</p>
  </div>

  <!-- CUSTOMER -->
  <div style="background:#111;border:1px solid #1f1f1f;border-radius:14px;padding:24px;margin-bottom:16px;">
    <p style="margin:0 0 16px;color:#D4AF37;font-size:10px;letter-spacing:3px;text-transform:uppercase;font-weight:700;">👤 Customer Information</p>
    <table style="width:100%;border-collapse:collapse;">
      <tr>
        <td style="color:#666;font-size:12px;padding:6px 0;width:100px;vertical-align:top;">Full Name</td>
        <td style="color:#e5e5e5;font-size:13px;font-weight:600;padding:6px 0;">${order.customerName}</td>
      </tr>
      <tr>
        <td style="color:#666;font-size:12px;padding:6px 0;vertical-align:top;">Phone</td>
        <td style="padding:6px 0;">
          <a href="tel:${order.customerPhone}" style="color:#D4AF37;text-decoration:none;font-size:13px;">${order.customerPhone}</a>
        </td>
      </tr>
      <tr>
        <td style="color:#666;font-size:12px;padding:6px 0;vertical-align:top;">Email</td>
        <td style="padding:6px 0;">
          <a href="mailto:${order.customerEmail}" style="color:#4ade80;text-decoration:none;font-size:13px;">${order.customerEmail}</a>
        </td>
      </tr>
      <tr>
        <td style="color:#666;font-size:12px;padding:6px 0;vertical-align:top;">City</td>
        <td style="color:#e5e5e5;font-size:13px;padding:6px 0;">${order.customerCity}</td>
      </tr>
      <tr>
        <td style="color:#666;font-size:12px;padding:6px 0;vertical-align:top;">Address</td>
        <td style="color:#e5e5e5;font-size:13px;padding:6px 0;">${order.customerAddress}</td>
      </tr>
      <tr>
        <td style="color:#666;font-size:12px;padding:6px 0;vertical-align:top;">Payment</td>
        <td style="padding:6px 0;">
          <span style="
            display:inline-block;
            background:${order.paymentMethod === 'COD' ? '#3a1a00' : '#0a2e1a'};
            color:${order.paymentMethod === 'COD' ? '#f59e0b' : '#4ade80'};
            border:1px solid ${order.paymentMethod === 'COD' ? '#92400e' : '#166534'};
            padding:3px 12px;border-radius:20px;font-size:11px;font-weight:700;letter-spacing:1px;text-transform:uppercase;">
            ${order.paymentMethod === 'COD' ? '💵 Cash on Delivery' : '💳 Online Payment'}
          </span>
        </td>
      </tr>
    </table>
  </div>

  <!-- ITEMS WITH IMAGES -->
  <div style="background:#111;border:1px solid #1f1f1f;border-radius:14px;padding:24px;margin-bottom:16px;">
    <p style="margin:0 0 4px;color:#D4AF37;font-size:10px;letter-spacing:3px;text-transform:uppercase;font-weight:700;">🛒 Items Ordered</p>
    <p style="margin:0 0 16px;color:#555;font-size:11px;">${totalItems} item${totalItems !== 1 ? 's' : ''}</p>
    <table style="width:100%;border-collapse:collapse;">
      ${itemCards}
    </table>
  </div>

  <!-- TOTAL -->
  <div style="background:linear-gradient(135deg,#D4AF37 0%,#b8952a 100%);border-radius:14px;padding:22px 28px;margin-bottom:24px;">
    <table style="width:100%;border-collapse:collapse;">
      <tr>
        <td style="color:#2a1a00;font-size:12px;font-weight:700;letter-spacing:2px;text-transform:uppercase;vertical-align:middle;">Order Total</td>
        <td style="text-align:right;vertical-align:middle;">
          <span style="color:#0a0a0a;font-size:28px;font-weight:800;letter-spacing:1px;">${parseFloat(order.totalAmount).toFixed(0)}</span>
          <span style="color:#4a3000;font-size:14px;font-weight:700;"> PKR</span>
        </td>
      </tr>
    </table>
  </div>

  <!-- FOOTER -->
  <div style="text-align:center;padding:8px 0 24px;">
    <p style="margin:0 0 16px;color:#444;font-size:11px;letter-spacing:1px;">AUREX NOIRE — Luxury Watches &amp; Accessories</p>
    <p style="margin:0;color:#333;font-size:10px;">aurexnoire.com</p>
  </div>

</div>
</body>
</html>`;

  await transporter.sendMail({
    from: `"AUREX NOIRE Orders" <${process.env.GMAIL_USER}>`,
    to: NOTIFY_EMAIL,
    subject: `🛒 New Order — ${order.customerName} — ${parseFloat(order.totalAmount).toFixed(0)} PKR (${totalItems} item${totalItems !== 1 ? 's' : ''})`,
    html,
  });

  console.log(`[Email] ✅ Order notification sent to ${NOTIFY_EMAIL}`);
}
