import { parse } from "npm:pg-connection-string";
import process from "node:process";

const { host, port, database, user, password } = parse(
	// eslint-disable-next-line node/no-process-env
	process.env.DATABASE_URL ?? "",
);
export const databaseConfig = {
	database: database ?? "",
	host: host ?? "",
	password,
	port: Number.parseInt(port ?? "5432", 10),
	username: user,
};
