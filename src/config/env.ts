import { config } from "dotenv";

config({ path: `.env.${process.env.NODE_ENV || "development"}.local` });

export const {
  PORT,
  NODE_ENV,
  API_URL,
  SCRIPT_URL,
  API_PASSWORD,
  MERCHANT,
  CURRENCY,
}: any = process.env;

console.log("PORT:", PORT);
