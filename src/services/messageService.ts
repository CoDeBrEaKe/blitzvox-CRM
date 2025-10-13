type Channel = "EMAIL" | "WHATSAPP";
import { transporter } from "../utils/emailSetup";

abstract class MessageService {
  abstract sendMessage(
    subject: string,
    message: string,
    to: string[]
  ): Promise<void>;
}

class EmailService extends MessageService {
  async sendMessage(
    subject: string,
    html: string,
    to: string[]
  ): Promise<void> {
    to.forEach(async (receiver) => {
      console.log(receiver);
      const mailOptions = {
        from: process.env.EMAIL_USER,
        to: receiver,
        subject,
        html,
        text: html.replace(/<[^>]+>/g, ""),
      };

      try {
        await transporter.sendMail(mailOptions);
        console.log("✅ Email sent successfully");
      } catch (error) {
        console.error("❌ Error sending email:", error);
      }
    });
  }
}

export class MessageFactory {
  static getMessageService(channel: Channel): MessageService {
    switch (channel) {
      case "EMAIL":
        return new EmailService();
      case "WHATSAPP":
        return new EmailService();
    }
  }
}
