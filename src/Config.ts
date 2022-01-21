import { Login, ServerLogin } from './Login';

const server = 'http://192.168.1.10';
const port = 8000;

export interface AppConfig {
	login: Login,
	server: string,
	port: number,
}

export const config: AppConfig = {
	login: new ServerLogin(server, port),
	server: server,
	port: port,
};
