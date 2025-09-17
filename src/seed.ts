// seed.ts
import { faker } from "@faker-js/faker";
import repository from "./data/repository";
// <-- your Sequelize instance
import User from "./models/User";
import Client from "./models/Client";
import Subscription from "./models/Subscription";
import Client_Sub from "./models/Client_Sub";
import Email from "./models/Email";
import Feedback from "./models/Feedback";
import { Role } from "./models/User";
import { SUB } from "./models/Subscription";
import { TIME } from "./models/Client_Sub";
async function seed() {
  try {
    // ⚠️ This will drop & recreate tables
    await repository.sequelizeClient.sync({ force: true });

    // --- Users ---
    const users = await Promise.all(
      Array.from({ length: 10 }).map(() =>
        User.create({
          name: faker.person.fullName(),
          username: faker.internet.username(),
          password: "123456",
          role: faker.helpers.arrayElement([Role.ADMIN, Role.AGENT]),
        })
      )
    );

    // --- Clients ---
    const clients = await Promise.all(
      Array.from({ length: 8 }).map(() =>
        Client.create({
          first_name: faker.person.firstName(),
          company_name: faker.company.name(),
          street: faker.location.streetAddress(),
          phone: faker.phone.number(),
          user_id: faker.helpers.arrayElement(users).id,
          subscriptions: [],
        })
      )
    );

    // --- Subscriptions ---
    const subscriptions = await Promise.all(
      Array.from({ length: 5 }).map(() =>
        Subscription.create({
          sub_type: faker.helpers.arrayElement([
            SUB.electricity,
            SUB.gas,
            SUB.internet,
          ]),
          sub_name: faker.company.name(),
          company: faker.company.name(),
          clients: [],
        })
      )
    );

    // --- Client_Sub (link Clients & Subscriptions) ---
    await Promise.all(
      clients.map((client) =>
        Client_Sub.create({
          client_id: client.id,
          sub_id: faker.helpers.arrayElement(subscriptions).id,
          order_num: faker.string.alphanumeric(8),
          your_order_num: faker.string.alphanumeric(6),
          cost: faker.number.int({ min: 100, max: 5000 }),
          status: faker.number.int({ min: 0, max: 1 }),
          counter_number: faker.string.alphanumeric(10),
          consumption: faker.number.int({ min: 100, max: 10000 }),
          night_consumption: faker.number.int({ min: 0, max: 3000 }),
          paid: faker.datatype.boolean(),
          paid_date: faker.date.past(),
          rl: faker.datatype.boolean(),
          rl_date: faker.date.past(),
          termination_date: faker.date.future(),
          sign_date: faker.date.past(),
          contract_time: faker.helpers.arrayElement([
            TIME.oneYear,
            TIME.twoYear,
          ]),
        })
      )
    );

    await Promise.all(
      Array.from({ length: 12 }).map(() =>
        Feedback.create({
          feedback: faker.lorem.sentences(2),
          client_id: faker.helpers.arrayElement(clients).id,
          client: clients[0],
        })
      )
    );
    // --- Emails ---
    await Promise.all(
      Array.from({ length: 15 }).map(() =>
        Email.create({
          subject: faker.lorem.sentence(),
          content: faker.lorem.paragraphs(2),
        })
      )
    );

    // --- Feedback ---

    console.log("✅ Seeding completed!");
    process.exit(0);
  } catch (err) {
    console.error("❌ Seeding error:", err);
    process.exit(1);
  }
}

seed();
