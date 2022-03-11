import 'src/boot';

import settings from 'src/config/settings';
import {Server} from 'src/server';
import {Client} from 'src/client';

if (settings.server) {
  new Server().start();
}

if (settings.client) {
  new Client().start();
}
