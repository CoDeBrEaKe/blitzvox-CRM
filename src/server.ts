import express, { Request, Response } from "express";
import cookieParser from "cookie-parser";
import morgan from "morgan";
import cors from "cors";
import { createRoutes } from "./routes";
import config from "./config";
import { listDocuments } from "./utils/s3";

export const createServer = () => {
  const app = express();
  const allowedOrigins = "https://blitzvox.netlify.app";
  console.log(allowedOrigins);
  app.disable("x-powered-by").use(morgan("dev"));
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use(cookieParser()).use(
    cors({
      origin: [allowedOrigins, "http://127.0.0.1:8002"],
      credentials: true, // ✅ this is critical for cookies
    })
  );

  createRoutes(app);

  app.get("/", (req: Request, res: Response) => {
    res.status(200).json({ message: "Welcome to the API" });
  });
  app.get(
    "/api/documents/:clientId/:subscriptionId",
    async (req: Request, res: Response) => {
      try {
        const { clientId, subscriptionId } = req.params;
        const { firstName, lastName } = req.query as {
          firstName: string;
          lastName: string;
        };

        // Validate required parameters
        if (!firstName || !lastName || !clientId || !subscriptionId) {
          return res
            .status(400)
            .json({
              error:
                "Missing required fields: clientId, subscriptionId, firstName, or lastName",
            });
        }

        // Fetch documents
        const documents = await listDocuments(
          firstName,
          lastName,
          clientId,
          subscriptionId
        );

        // Generate HTML response
        const html = `
      <!DOCTYPE html>
      <html lang="en">
        <head>
          <title>Documents for ${firstName} ${lastName}</title>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <style>
            body { font-family: Arial, sans-serif; margin: 20px; }
            h1 { color: #333; }
            ul { list-style-type: none; padding: 0; }
            li { margin: 10px 0; }
            a { color: #007BFF; text-decoration: none; }
            a:hover { text-decoration: underline; }
          </style>
        </head>
        <body>
          <h1>Documents for ${firstName} ${lastName} (Subscription ${subscriptionId})</h1>
          ${
            documents.length > 0
              ? `
            <ul>
              ${documents
                .map(
                  (doc) => `
                <li>
                  <a href="${doc.url}" target="_blank" rel="noopener noreferrer">
                    ${doc.key.split("/").pop() || "Unnamed Document"}
                  </a>
                </li>
              `
                )
                .join("")}
            </ul>
          `
              : "<p>No documents found.</p>"
          }
        </body>
      </html>
    `;

        res.setHeader("Content-Type", "text/html");
        res.status(200).send(html);
      } catch (error) {
        console.error("Error retrieving documents:", error);
        res.status(500).send("An error occurred while retrieving documents");
      }
    }
  );

  return app;
};
