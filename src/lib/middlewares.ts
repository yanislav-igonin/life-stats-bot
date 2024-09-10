import { UserModel } from 'database/models';
import { type NextFunction } from 'grammy';
import { type BotContext } from 'lib/context';

export const stateMiddleware = async (
  context: BotContext,
  next: NextFunction,
) => {
  // @ts-expect-error Property user   is missing in type {} but required in type
  context.state = {};
  await next();
};

export const userMiddleware = async (
  context: BotContext,
  next: NextFunction,
) => {
  const { from: user } = context;
  if (!user) {
    await next();
    return;
  }

  const {
    id: userId,
    first_name: firstName,
    language_code: language,
    last_name: lastName,
    username,
  } = user;

  const databaseUser = await UserModel.findOneBy({ tgId: userId.toString() });
  if (databaseUser) {
    // Update user info
    databaseUser.firstName = firstName;
    databaseUser.language = language;
    databaseUser.lastName = lastName;
    databaseUser.username = username;
    await databaseUser.save();

    context.state.user = databaseUser;
    await next();
    return;
  }

  const newUser = await UserModel.create({
    firstName,
    language,
    lastName,
    tgId: userId.toString(),
    username,
  }).save();
  context.state.user = newUser;

  await next();
};
