import { SleepModel, UserModel } from 'database/models';
import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { DateTime } from 'luxon';
import { And, LessThanOrEqual, MoreThanOrEqual } from 'typeorm';

const app = new Hono();
app.use('*', cors());

class SuccessResponse {
  ok = true;

  data: unknown;

  constructor(data: unknown) {
    this.data = data;
  }
}

class ErrorResponse {
  ok = false;

  data: unknown;

  constructor(data: unknown) {
    this.data = data;
  }
}

app.get('/auth', async (context) => {
  const token = context.req.header('Authorization')?.replace('Bearer ', '');
  if (!token) {
    context.status(401);
    return context.json(new ErrorResponse('Unauthorized'));
  }

  const user = await UserModel.findOneBy({
    token,
  });
  if (!user) {
    context.status(401);
    return context.json(new ErrorResponse('Unauthorized'));
  }

  return context.json(new SuccessResponse(user));
});

app.get('/sleep', async (context) => {
  const token = context.req.header('Authorization')?.replace('Bearer ', '');
  if (!token) {
    context.status(401);
    return context.json(new ErrorResponse('Unauthorized'));
  }

  const user = await UserModel.findOneBy({
    token,
  });
  if (!user) {
    context.status(401);
    return context.json(new ErrorResponse('Unauthorized'));
  }

  const sleeps = await SleepModel.find({
    order: {
      goToBedAt: 'ASC',
    },
    select: ['id', 'goToBedAt', 'wakeUpAt', 'quality'],
    where: {
      goToBedAt: And(
        MoreThanOrEqual(DateTime.now().minus({ years: 0.5 }).toJSDate()),
        LessThanOrEqual(DateTime.now().toJSDate()),
      ),
      userId: user.id,
    },
  });
  return context.json(new SuccessResponse(sleeps));
});

export { app };
