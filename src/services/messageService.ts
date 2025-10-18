type Channel = "EMAIL" | "WHATSAPP";
import { transporter } from "../utils/emailSetup";
import axios from "axios";
import * as dotenv from "dotenv";

dotenv.config();

const WHATSAPP_TOKEN = process.env.WHATSAPP_TOKEN as string;
const PHONE_NUMBER_ID = process.env.PHONE_NUMBER_ID as string;

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
    for (const receiver of to) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

      if (!emailRegex.test(receiver)) {
        console.error("❌ Invalid email address:", receiver);
        continue; // stop before sending
      }
      const mailOptions = {
        from: process.env.EMAIL_USER,
        to: receiver,
        subject,
        html,
        text: html.replace(/<[^>]+>/g, ""),
      };

      try {
        transporter.sendMail(mailOptions);
        console.log("✅ Email sent successfully");
      } catch (error) {
        console.error("❌ Error sending email:", error);
      }
    }
  }
}
class WhatsappService extends MessageService {
  async sendMessage(subject: string, message: string, to: string[]) {
    const url = `https://graph.facebook.com/v18.0/${PHONE_NUMBER_ID}/messages`;
    for (const receiver of to) {
      try {
        const response = await axios.post(
          url,
          {
            messaging_product: "whatsapp",
            to: "201112269700", // Example: "201234567890"
            type: "text",
            text: { body: message },
          },
          {
            headers: {
              Authorization: `Bearer ${WHATSAPP_TOKEN}`,
              "Content-Type": "application/json",
            },
          }
        );

        console.log("Message sent:", response.data);
      } catch (error: any) {
        console.error(
          "Error sending message:",
          error.response?.data || error.message
        );
      }
    }
  }
}
export class MessageFactory {
  static getMessageService(channel: Channel): MessageService {
    switch (channel) {
      case "EMAIL":
        return new EmailService();
      case "WHATSAPP":
        return new WhatsappService();
    }
  }
}
