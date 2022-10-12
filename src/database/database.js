import pg from "pg";
import dotenv from "dotenv";

dotenv.config();

const { Pool } = pg;
// const connectionString = process.env.DATABASE_URL;

// const user = process.env.LOCAL_DATABASE_USER;
// const password = process.env.LOCAL_DATABASE_PASSWORD;
// const host = "localhost";
// const port = 5432;
// const database = "projeto16-shortly";

// const connection = new Pool({
//   user,
//   password,
//   host,
//   port,
//   database,
// });

const databaseConfig = {
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
};

const connection = new Pool(databaseConfig);

export default connection;
