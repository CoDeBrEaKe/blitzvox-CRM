type Channel = "EMAIL" | "WHATSAPP";

abstract class MessageService {
  abstract sendMessage(subject: string, message: string, to: string): void;
}

class EmailService extends MessageService {
  sendMessage(subject: string, message: string, to: string): void {
    console.log(
      `Email sent to ${to} with subject: ${subject} and message: ${message}`
    );
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
