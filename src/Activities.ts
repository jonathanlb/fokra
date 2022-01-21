export type Activity = {
	key: number;
	name: string;
	timestamp: number;
};

export interface ActivityInterface {
	getActionName(key: number): string,
	getActions(): Promise<Array<Activity>>;
	getActivities(start: number, end: number, maxEvents: number): Promise<Array<Activity>>;
	logActivity(aid: number): Promise<void>;
}

export class ActivitiesFromServer implements ActivityInterface {
	fetchPrefix: string;
	actionNames: Record<number, string> = {};

	constructor(fetchPrefix: string) {
		this.fetchPrefix = fetchPrefix;
	}

	getActionName(key: number): string {
		return this.actionNames[key] || key.toString(); // XXX
	}

	getActions(): Promise<Array<Activity>> {
		// TODO: handle pages
		// TODO: memoize?
		return fetch(
			`${this.fetchPrefix}/action/get/20/0`,
			{
				method: 'GET',
				credentials: 'include'
			}).then(resp => resp.json()).
			then(activities => activities.map(
				(keyName: Array<number|string>) => { 
					const key = keyName[0] as number; 
					const name = keyName[1] as string;
					const timestamp = 0;

					this.actionNames[key] = name;
					return { key, name, timestamp };
				}));
			// XXX TODO: handle error
	}

	getActivities(start: number, end: number, maxEvents: number): Promise<Array<Activity>> {
		return fetch(
			`${this.fetchPrefix}/activity/get/${start}/${end}/${maxEvents}`,
			{
				method: 'GET',
				credentials: 'include'
			}).then(resp => {
				if (resp.status !== 200) {
					throw new Error(resp.status.toString());
				}
				return resp.json();
			}).
			then(data => data.map(
				(x: Array<number>) => {
					const timestamp = x[0];
					const key = x[1];
					const name = this.actionNames[key] as string;
					return { key, timestamp, name };
				}));
			// XXX TODO: handle error
	}

	logActivity(aid: number): Promise<void> {
		return fetch(
			`${this.fetchPrefix}/activity/log/${aid}`,
			{
				method: 'GET',
				credentials: 'include'
			}).then(resp => {
				if (resp.status !== 200) {
					throw new Error(`${resp.status}`);
				}
			});
	}
}
