import { appConfig } from 'config/app.config';
import { type BotContext } from 'context';
import { UserModel } from 'database/models';
import { type NextFunction } from 'grammy';

export const stateMiddleware = async (
  context: BotContext,
  next: NextFunction,
) => {
  // @ts-expect-error Property user   is missing in type {} but required in type
  context.state = {};
  // eslint-disable-next-line node/callback-return
  await next();
};

export const userMiddleware = async (
  context: BotContext,
  next: NextFunction,
) => {
  const { from: user } = context;
  if (!user) {
    // eslint-disable-next-line node/callback-return
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

    // eslint-disable-next-line require-atomic-updates
    context.state.user = databaseUser;
    // eslint-disable-next-line node/callback-return
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
  // eslint-disable-next-line require-atomic-updates
  context.state.user = newUser;

  // eslint-disable-next-line node/callback-return
  await next();
};

export const allowedUserMiddleware = async (
  context: BotContext,
  next: NextFunction,
) => {
  const { isAllowed, username } = context.state.user;
  const isAdmin = appConfig.adminUsernames.includes(username ?? '');

  // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
  const hasAccess = isAllowed || isAdmin;

  if (!hasAccess) {
    return;
  }

  // eslint-disable-next-line node/callback-return
  await next();
};
