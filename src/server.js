import express from 'express';
import 'express-async-errors';
import bodyParser from 'body-parser';
import cors from 'cors';

import routes from './routes';

export default {
  start({ port = process.env.PORT || 8080 } = {}) {
    const app = express();
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({ extended: true }));
    app.use(cors());
    app.use(routes);

    return new Promise(resolve => {
      const server = app.listen(port, () => {
        const originalClose = server.close.bind(server);
        server.close = () =>
          new Promise(resolveClose => {
            // promisify server.close() to close gracefully and notify via resolveClose
            originalClose(resolveClose);
          });
      });
      resolve(server);
    });
  },
};
