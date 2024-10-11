/* eslint-disable no-negated-condition */
/* eslint-disable node/no-process-exit */
/* eslint-disable no-console */
/* eslint-disable import/no-extraneous-dependencies */
import * as path from "node:path";
import prompts from "npm:prompts";
import { MigrationCreateCommand } from "npm:typeorm/commands/MigrationCreateCommand.d.ts";
import { MigrationGenerateCommand } from "npm:typeorm/commands/MigrationGenerateCommand.d.ts";
import { MigrationRevertCommand } from "npm:typeorm/commands/MigrationRevertCommand.d.ts";
import { MigrationRunCommand } from "npm:typeorm/commands/MigrationRunCommand.d.ts";
import { MigrationShowCommand } from "npm:typeorm/commands/MigrationShowCommand.d.ts";
import type * as yargs from "npm:yargs";

enum OPERATION {
	CREATE = "create",
	GENERATE = "generate",
	REVERT = "revert",
	RUN = "run",
	SHOW = "show",
}

const operationsClasses: Record<string, yargs.CommandModule> = {
	[OPERATION.GENERATE]: new MigrationGenerateCommand(),
	[OPERATION.CREATE]: new MigrationCreateCommand(),
	[OPERATION.REVERT]: new MigrationRevertCommand(),
	[OPERATION.RUN]: new MigrationRunCommand(),
	[OPERATION.SHOW]: new MigrationShowCommand(),
};

type PromptResult = {
	migrationName?: string;
	operation: OPERATION;
};

const runPrompt = async (): Promise<PromptResult> => {
	const response = await prompts(
		[
			{
				choices: [
					{ title: "Generate migration", value: OPERATION.GENERATE },
					{ title: "Create empty migration", value: OPERATION.CREATE },
					{ title: "Execute all pending migrations", value: OPERATION.RUN },
					{
						title: "Revert the most recently executed migration",
						value: OPERATION.REVERT,
					},
					{
						title: "Show all migrations and whether they've been run or not",
						value: OPERATION.SHOW,
					},
				],
				initial: 0,
				message: "Select operation",
				name: "operation",
				type: "select",
			},
			{
				message: "Migration name",
				name: "migrationName",
				type: (previous) =>
					[OPERATION.GENERATE, OPERATION.CREATE].includes(previous)
						? "text"
						: null,
				validate: (input: string) => input.length > 1,
			},
		],
		{
			onCancel: () => {
				console.log("Goodbye!");
				process.exit(0);
			},
		},
	);

	return response;
};

const main = async () => {
	const { operation, migrationName } = await runPrompt();

	const migrationsPath = path.resolve(process.cwd(), "src/database/migrations");
	const ormConfigPath = path.resolve(migrationsPath, "..", "index.ts");

	const command = operationsClasses[operation];
	const pathForCommand = migrationName !== undefined
		? path.resolve(migrationsPath, migrationName)
		: migrationsPath;

	await command.handler({
		$0: "dumb",
		_: [],
		dataSource: ormConfigPath,
		path: pathForCommand,
	});
};

main().catch((error) => {
	console.error(error);
	process.exit(1);
});
