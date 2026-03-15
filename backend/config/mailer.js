const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: parseInt(process.env.SMTP_PORT, 10),
  secure: false, // STARTTLS
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

/**
 * Send a branded confirmation email after alumni registration.
 */
async function sendConfirmationEmail(toEmail, alumniName) {
  const html = `
    <div style="font-family:'Plus Jakarta Sans',Arial,sans-serif;max-width:560px;margin:0 auto;background:#fff;border-radius:12px;overflow:hidden;border:1px solid #e2e8f0">
      <div style="background:#0D1F3C;padding:32px 24px;text-align:center">
        <h1 style="color:#fff;font-size:24px;margin:0">IKA SMANDA Kendal</h1>
        <p style="color:#94a3b8;font-size:14px;margin:8px 0 0">Ikatan Keluarga Alumni SMAN 2 Kendal</p>
      </div>
      <div style="padding:32px 24px">
        <h2 style="color:#0D1F3C;font-size:20px;margin:0 0 12px">Selamat datang, ${alumniName}! 🎉</h2>
        <p style="color:#475569;font-size:15px;line-height:1.6;margin:0 0 20px">
          Pendaftaran Anda sebagai alumni SMAN 2 Kendal telah berhasil dicatat.
          Data Anda kini telah tersimpan di Direktori Alumni IKA SMANDA.
        </p>
        <div style="background:#F5F8FE;border-radius:8px;padding:20px;margin-bottom:20px">
          <p style="color:#1560BD;font-weight:700;font-size:13px;text-transform:uppercase;letter-spacing:1px;margin:0 0 8px">Langkah Selanjutnya</p>
          <ul style="color:#475569;font-size:14px;line-height:1.8;margin:0;padding-left:18px">
            <li>Jelajahi Direktori Alumni untuk menemukan teman seangkatan</li>
            <li>Daftarkan usaha Anda di Lapak Usaha Alumni</li>
            <li>Ikuti kegiatan dan acara IKA SMANDA</li>
          </ul>
        </div>
        <p style="color:#94a3b8;font-size:13px;margin:0">
          Jika Anda tidak merasa mendaftar, abaikan email ini.
        </p>
      </div>
      <div style="background:#f8fafc;padding:16px 24px;text-align:center;border-top:1px solid #e2e8f0">
        <p style="color:#94a3b8;font-size:12px;margin:0">&copy; 2026 IKA SMANDA Kendal. All rights reserved.</p>
      </div>
    </div>
  `;

  await transporter.sendMail({
    from: process.env.SMTP_FROM,
    to: toEmail,
    subject: 'Pendaftaran Alumni Berhasil — IKA SMANDA Kendal',
    html,
  });
}

module.exports = { sendConfirmationEmail };
