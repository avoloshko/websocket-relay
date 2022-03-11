import {w3cwebsocket as WebSocket} from 'websocket';
import axios from 'axios';

import settings from 'src/config/settings';

export class Client {
  wsClient?: WebSocket;

  start() {
    this.connect();
  }

  connect() {
    this.wsClient = new WebSocket(settings.wsURL, 'echo-protocol');

    this.wsClient.onopen = () => {
      console.debug('ws open');
      this.wsClient?.send(JSON.stringify({
        requestId: 0,
      }));
    };

    this.wsClient.onmessage = (event) => {
      const {
        requestId,
        headers,
        method,
        body,
        url,
      } = JSON.parse(event.data.toString());

      delete headers.host;

      axios({
        method: method,
        url: settings.serverURL + url,
        data: body,
        transformResponse: (res) => res,
        headers,
      }).then((response) => {
        this.wsClient?.send(JSON.stringify({
          requestId,
          headers: response.headers,
          status: response.status,
          data: response.data.toString(),
        }));
      }).catch((err) => {
        this.wsClient?.send(JSON.stringify({
          requestId,
          headers: err.response.headers,
          status: err.response.status,
          data: err.response.data.toString(),
        }));
      });
    };
  }
}
