import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT),
    secure: Number(process.env.SMTP_PORT) === 465,
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
    },
});

export interface MailOptions {
    to: string;
    subject: string;
    html: string;
    text?: string;
}

export async function sendMail({
    to,
    subject,
    html,
    text,
}: MailOptions): Promise<boolean> {
    try {
        await transporter.sendMail({
            from: `"SmartWatch AI" <${process.env.SMTP_USER}>`,
            to,
            subject,
            text,
            html,
        });

        console.log(`Email sent to ${to}`);
        return true;
    } catch (error) {
        console.error("Failed to send email:", error);
        return false;
    }
}

export async function sendOtpTo(name: string, email: string, otp: number) {
    return await sendMail({
        to: email,
        subject: "Verify Your Email",
        html: `
    <div style="background:#f4f4f4;padding:40px 20px;font-family:Arial,Helvetica,sans-serif;">
        <div style="max-width:600px;margin:auto;background:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 5px 20px rgba(0,0,0,0.08);">

            <div style="background:#2563eb;padding:30px;text-align:center;">
                <h1 style="color:white;margin:0;">Welcome!</h1>
                <p style="color:#dbeafe;margin-top:10px;">
                    Verify your email address
                </p>
            </div>

            <div style="padding:40px;">
                <h2 style="margin-top:0;color:#222;">
                    Hello ${name},
                </h2>

                <p style="font-size:16px;color:#555;line-height:1.7;">
                    Thank you for registering. To complete your account setup,
                    please enter the verification code below.
                </p>

                <div style="text-align:center;margin:35px 0;">
                    <div style="
                        display:inline-block;
                        background:#f3f6ff;
                        border:2px dashed #2563eb;
                        color:#2563eb;
                        padding:18px 40px;
                        font-size:36px;
                        font-weight:bold;
                        letter-spacing:10px;
                        border-radius:10px;
                    ">
                        ${otp}
                    </div>
                </div>

                <p style="color:#555;font-size:15px;">
                    This OTP is valid for <b>10 minutes</b>.
                </p>

                <p style="color:#555;font-size:15px;">
                    If you didn't create this account, you can safely ignore this email.
                </p>

                <hr style="border:none;border-top:1px solid #eee;margin:35px 0;">

                <p style="text-align:center;color:#999;font-size:13px;">
                    This is an automated email. Please do not reply.
                </p>
            </div>

        </div>
    </div>
    `,
    });
}