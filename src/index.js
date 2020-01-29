import Server from './server';

Server.start().then(server => console.log(`API Server started on port: ${server.address().port} 🔥`));
