import { SleepModel, UserModel } from 'database/models';
import { Hono } from 'hono';

const app = new Hono();

class SuccessResponse {
  body: unknown;

  constructor(body: unknown) {
    this.body = {
      data: body,
      ok: true,
    };
  }
}

class ErrorResponse {
  body: unknown;

  constructor(body: unknown) {
    this.body = {
      data: body,
      ok: false,
    };
  }
}

app.get('/sleep', async (context) => {
  const token = context.req.header('Authorization')?.replace('Bearer ', '');
  if (!token) {
    context.status(401);
    return context.json(new ErrorResponse('Unauthorized'));
  }

  const user = await UserModel.findOneBy({ token });
  if (!user) {
    context.status(401);
    return context.json(new ErrorResponse('Unauthorized'));
  }

  const sleeps = await SleepModel.find({
    order: { createdAt: 'ASC' },
    select: ['id', 'goToBedAt', 'wakeUpAt', 'quality'],
    where: { userId: user.id },
  });
  return context.json(new SuccessResponse(sleeps));
});

export { app };
