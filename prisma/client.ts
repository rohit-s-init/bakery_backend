// query.js
import { PrismaTiDBCloud } from '@tidbcloud/prisma-adapter';
import { PrismaClient } from "../generated/prisma/client.js";
// import { PrismaClient } from "@prisma/client";
// import { PrismaClient } from '@prisma/client';
import dotenv from "dotenv";


// setup
dotenv.config();
const connectionString = `${process.env.DATABASE_URL}`;

// init prisma client
const adapter = new PrismaTiDBCloud({url: connectionString});
const prisma = new PrismaClient({ adapter });

// insert
// const user = await prisma.
// console.log(user)

export default prisma;