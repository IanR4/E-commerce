import dotenv from 'dotenv';
import app from "./app.js";
import { MongoDBClient } from "./config/database.js";

dotenv.config({ path: '.env' });

const PORT = process.env.PORT;

console.log(`Environment: ${process.env.NODE_ENV}`);
console.log(`API Base URL: ${process.env.API_BASE_URL}`);

app.listen(PORT, () => {
  console.log(`API running on http://localhost:${PORT}`);
});

MongoDBClient.connect();

