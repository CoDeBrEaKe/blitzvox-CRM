import { createServer } from "./server";
import repository from "./data/repository";

const server = createServer();

const port = process.env.PORT || 3000;

server.listen(port, async () => {
  try {
    await repository.sequelizeClient.authenticate();
    console.log("Successfully connected to the database");
  } catch (error) {
    console.log("Failed to connect to the database");
    console.log(error);
  }

  console.log(`API is running on ${port}`);
});
