import { setup } from './setup';
import { config } from 'dotenv';

config();
console.info('Initiating setup...');
setup().catch((error) => console.log(error));
