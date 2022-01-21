export class ServerLogin {
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

export class DummyLogin {
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
