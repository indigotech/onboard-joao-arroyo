import { setup } from '../setup';
import { before } from 'mocha';
import { config } from 'dotenv';

before(async () => {
  config({ path: `${process.cwd()}/test.env` });
  await setup();
});

require('./hello.test');
require('./create-user.test');
require('./login.test');
require('./user-query.test');
