import { createClient } from 'redis';

let client;

export async function getRedis() {
  if (client) return client;
  const url = process.env.REDIS_URL;
  if (!url) throw new Error('REDIS_URL env not set');
  client = createClient({ url });
  client.on('error', err => console.error('Redis Client Error', err));
  await client.connect();
  return client;
}

export async function getJson(key, fallback) {
  try {
    const c = await getRedis();
    const val = await c.get(key);
    return val ? JSON.parse(val) : fallback;
  } catch (e) {
    console.error('redis get error', e);
    return fallback;
  }
}

export async function setJson(key, obj) {
  try {
    const c = await getRedis();
    await c.set(key, JSON.stringify(obj));
  } catch (e) {
    console.error('redis set error', e);
  }
}
