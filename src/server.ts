import {connection as Connection, server as WebSocketServer} from 'websocket';
import http, {ServerResponse} from 'http';

import settings from 'src/config/settings';

export class Server {
  httpServer?: http.Server;
  wsServer?: WebSocketServer;

  connection?: Connection;

  requestId = 0;

  responseMap = new Map<number, ServerResponse>();

  start() {
    this.startHttpServer();

    this.startWsServer();
  }

  startHttpServer() {
    this.httpServer = http.createServer((request, response) => {
      const { headers, method, url } = request;
      const chunks: Buffer[] = [];
      request.on('error', (err) => {
        console.error('body error');
        response.writeHead(500);
        response.end();
      }).on('data', (chunk) => {
        chunks.push(chunk);
      }).on('end', () => {
        const data = Buffer.concat(chunks).toString();
        const requestId = ++this.requestId;

        const payload = JSON.stringify({
          requestId,
          headers,
          method,
          data,
          url,
        });

        this.responseMap.set(requestId, response);

        this.connection?.sendUTF(payload);

        console.debug(payload);
      });
    });

    this.httpServer.listen(settings.port, function () {
      console.log((new Date()) + ' Server is listening on port 8080');
    });
  }

  startWsServer() {
    this.wsServer = new WebSocketServer({
      httpServer: this.httpServer!,
      autoAcceptConnections: false
    });

    function originIsAllowed(origin: string) {
      // put logic here to detect whether the specified origin is allowed.
      return true;
    }

    this.wsServer.on('request', (request) => {
      if (!originIsAllowed(request.origin)) {
        // Make sure we only accept requests from an allowed origin
        request.reject();
        console.log((new Date()) + ' Connection from origin ' + request.origin + ' rejected.');
        return;
      }

      this.connection = request.accept('echo-protocol', request.origin);
      console.log((new Date()) + ' Connection accepted.');

      this.connection.on('message', (message) => {
        if (message.type === 'utf8') {
          const payload = JSON.parse(message.utf8Data!);
          const {requestId, headers, data, status} = payload;

          const response = this.responseMap.get(requestId);
          this.responseMap.delete(requestId);

          if (response) {
            response.writeHead(status, headers);
            response.write(data);
            response.end();
          }
        }
      });

      this.connection.on('close', (reasonCode, description) => {
        console.log((new Date()) + ' Peer ' + this.connection!.remoteAddress + ' disconnected.');
        this.connection = undefined;
      });
    });
  }
}
