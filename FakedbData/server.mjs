import { App } from '@tinyhttp/app';
import { Low } from 'lowdb';
import { JSONFile } from 'lowdb/node';
import { createApp } from 'json-server/lib/app.js';

const port = Number(process.env.PORT ?? 3000);
const adapter = new JSONFile(new URL('./db.json', import.meta.url));
const db = new Low(adapter, {});

await db.read();

const app = new App();
app.use('/api/v1', createApp(db));

app.listen(port, () => {
  console.log(`Mock API listening on http://localhost:${port}/api/v1`);
});
