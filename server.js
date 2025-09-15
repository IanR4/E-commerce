import dotenv from 'dotenv';
import routes from "./routes/routes.js";

// Load the appropriate .env file based on NODE_ENV
dotenv.config({ path: '.env' });

console.log(`Environment: ${process.env.NODE_ENV}`);
console.log(`API Base URL: ${process.env.API_BASE_URL}`);

const PORT = process.env.PORT;
routes.listen(PORT, () => {
  console.log(`API Testing demo running on http://localhost:${PORT}`);
});