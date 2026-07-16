import { Injectable, Logger } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import crypto from 'node:crypto';
import { env } from 'src/config/env.config';

@Injectable()
export class EmailService {
  private readonly logger = new Logger(EmailService.name);
  private transporter: nodemailer.Transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      host: env.SMTP_HOST,
      port: env.SMTP_PORT,
      secure: false,
      auth: {
        user: env.SMTP_USER,
        pass: env.SMTP_PASS,
      },
    });
  }

  async sendEmail({
    to,
    subject,
    html,
  }: {
    to: string;
    subject: string;
    html: string;
  }) {
    try {
      await this.transporter.sendMail({
        from: `"UURL" <${env.SMTP_USER}>`,
        to,
        subject,
        html,
      });

      this.logger.log(`Email "${subject}" sent successfully to ${to}`);
    } catch (error) {
      this.logger.error(`Failed to send email to ${to}`, error);
      throw new Error('Email delivery failed');
    }
  }

  async sendOtpEmail(to: string, otp: string) {
    return this.sendEmail({
      to,
      subject: 'Verify Your Account - OTP Code',
      html: `
        <div style="font-family: Arial, sans-serif; max-width:600px; margin:auto; padding:20px; border:1px solid #eee; border-radius:5px;">
          <h2>Account Verification</h2>

          <p>
            Thank you for registering. Use the following OTP to verify your account.
            This code is valid for <b>10 minutes</b>.
          </p>

          <div style="background:#f4f4f4; padding:15px; font-size:24px; font-weight:bold; text-align:center; letter-spacing:5px;">
            ${otp}
          </div>

          <p style="margin-top:20px; font-size:12px; color:#777;">
            If you didn't request this email, you can safely ignore it.
          </p>
        </div>
      `,
    });
  }

  async sendPasswordResetEmail(to: string, otp: string) {
    return this.sendEmail({
      to,
      subject: 'Reset Your Password',
      html: `
        <div style="font-family: Arial, sans-serif; max-width:600px; margin:auto; padding:20px; border:1px solid #eee; border-radius:5px;">
          <h2>Password Reset</h2>

          <p>
            We received a request to reset your password.
            Use the OTP below to continue.
            This code expires in <b>10 minutes</b>.
          </p>

          <div style="background:#f4f4f4; padding:15px; font-size:24px; font-weight:bold; text-align:center; letter-spacing:5px;">
            ${otp}
          </div>

          <p style="margin-top:20px; font-size:12px; color:#777;">
            If you didn't request a password reset, ignore this email.
          </p>
        </div>
      `,
    });
  }

  generateOTP(): string {
    return crypto.randomInt(100000, 1000000).toString();
  }
}
