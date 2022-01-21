import { DummyLogin, ServerLogin } from './Login';

const server = 'http://192.168.1.10';
const port = 7999;

export const config: any = {
	login: new ServerLogin(server, port),
	server: server,
	port: port,
};
