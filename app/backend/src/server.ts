import { App } from './app';
import 'dotenv/config';
// import User from './Controller/User';

const server = new App();

const PORT = process.env.PORT || 3001;

server.start(PORT);
