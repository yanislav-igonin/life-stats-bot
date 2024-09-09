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

app.get('/sleep', async (context) => {
  const token = context.req.header('Authorization')?.replace('Bearer ', '');
  if (!token) {
    context.status(401);
    return context.json('Unauthorized');
  }

  const user = await UserModel.findOneBy({ token });
  if (!user) {
    context.status(401);
    return context.json('Unauthorized');
  }

  const sleeps = await SleepModel.findBy({ userId: user.id });
  context.json(new SuccessResponse(sleeps));
});

export { app };
