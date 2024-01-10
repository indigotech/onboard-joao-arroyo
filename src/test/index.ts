import { setup } from '../server';
import { before } from 'mocha';

before(async () => {
  await setup();
});

require('./hello.test');
