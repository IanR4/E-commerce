import dotenv from 'dotenv';
import app from "./app.js";
import { MongoDBClient } from "./config/database.js";

dotenv.config({ path: '.env' });

const PORT = process.env.PORT || 3001;

console.log(`Environment: ${process.env.NODE_ENV}`);
console.log(`API Base URL: ${process.env.API_BASE_URL}`);
console.log(`MongoDB URI: ${process.env.MONGODB_URI ? 'Configured' : 'Not configured'}`);

app.listen(PORT, () => {
  console.log(`API running on port ${PORT}`);
});

MongoDBClient.connect();