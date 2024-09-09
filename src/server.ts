import { Hono } from 'hono';

const app = new Hono();
app.get('/', (context) => context.text('da fuk'));

export { app };
