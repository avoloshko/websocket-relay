import dotenv from 'dotenv';
import 'reflect-metadata';

dotenv.config();

import 'src/utils/logger';

process.on('exit', (code) => {
  console.warn(`About to exit with code: ${code}`);
});

process.on('uncaughtException', (err) => {
  console.error(`${err.stack}`);
  process.exit(1);
});

process.on('SIGINT', () => {
  console.warn('Exiting SIGINT...');
  process.exit();
});
