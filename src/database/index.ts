import { databaseConfig, isProduction } from "config";
import { DataSource } from "typeorm";

const databasePath = isProduction() ? "dist/database" : "src/database";

export default new DataSource({
	entities: [`${databasePath}/models/*.model.*`],
	migrations: [`${databasePath}/migrations/*.*`],
	type: "postgres",
	...databaseConfig,
});
