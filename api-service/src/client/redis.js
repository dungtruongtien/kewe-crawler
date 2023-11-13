import { createClient } from 'redis';

let GLOBAL_MEMCACHE_CLIENT = null;

export const initMemcache = async () => {
  GLOBAL_MEMCACHE_CLIENT = await createClient({
    url: 'redis://localhost:6379'
  })
    .on('error', err => {
      console.log('Redis Client Error', err);
      process.exit(1);
    })
    .connect();
}

export const set = (key, value) => {
  return GLOBAL_MEMCACHE_CLIENT.set(key, value);
}

export const get = (key) => {
  return GLOBAL_MEMCACHE_CLIENT.get(key);
}
