export interface Login {
	isAuth(): boolean;
	reset(): void;
	submitLogin(userName: string, password: string): Promise<void>;
	submitLogout(): Promise<void>;
}

export class ServerLogin implements Login {
	server: string;
	port: number;
	authenticated: boolean;

	constructor(server: string, port: number) {
		this.server = server;
		this.port = port;
		this.authenticated = false;
	}

	isAuth(): boolean {
		return this.authenticated;
	}

	reset(): void {
		this.authenticated = false;
	}

	async submitLogin(userName: string, password: string): Promise<void> {
		const response = await fetch(
			`${this.server}:${this.port}/users/login`,
			{	
				method: 'POST',
				credentials: 'include',
				headers: {
					'Content-type': 'application/json'
				},
				body: JSON.stringify({
					username: userName,
					password: password
				})
			});
		this.authenticated = response.status === 200;
	}

	async submitLogout(): Promise<void> {
		await fetch(
			`${this.server}:${this.port}/users/logout`,
			{	
				method: 'GET',
				credentials: 'include',
			});
		this.reset();
	}
}

export class DummyLogin implements Login {
	isAuth(): boolean {
		const userName = window.localStorage.getItem('userName');
		const password = window.localStorage.getItem('password');
		return userName === 'Jonathan' && password === 'ee';
	}

	reset(): void {
		window.localStorage.setItem('userName', '');
		window.localStorage.setItem('password', '');
	}

	async submitLogin(userName: string, password: string): Promise<void> {
		window.localStorage.setItem('userName', userName);
		window.localStorage.setItem('password', password);
	}

	async submitLogout(): Promise<void> {
		this.reset();
	}
}

export class ServerResponseError extends Error {
	status: number;
	msg: string;

	constructor(r: Response) {
		super();
		this.status = r.status;
		this.msg = r.statusText;
	}
}
