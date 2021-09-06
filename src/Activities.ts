export type Activity = {
	key: number;
	name: string;
	timestamp: number;
};

export interface ActivityInterface {
	getActions(): Promise<Array<Activity>>;
	getActivities(start: number, end: number, maxEvents: number): Promise<Array<Activity>>;
	logActivity(aid: number): Promise<void>;
}

export class ActivitiesFromServer implements ActivityInterface {
	fetchPrefix: string;
	actions: Record<number, Activity> = {};

	constructor(fetchPrefix: string) {
		this.fetchPrefix = fetchPrefix;
	}

	getActions(): Promise<Array<Activity>> {
		// TODO: handle pages
		return fetch(`${this.fetchPrefix}/action/get/20/0`).
			then(resp => resp.json()).
			then(activities => activities.map(
				(keyName: Array<number|string>) => { 
					const key = keyName[0] as number; 
					const name = keyName[1] as string;
					const timestamp = 0;

					this.actions[key] = { key, name, timestamp };
					return { key, name, timestamp };
				}));
	}

	getActivities(start: number, end: number, maxEvents: number): Promise<Array<Activity>> {
		return fetch(`${this.fetchPrefix}/activity/get/${start}/${end}/${maxEvents}`).
			then(resp => {
				if (resp.status !== 200) {
					throw new Error(resp.status.toString());
				}
				return resp.json();
			}).
			then(data => data.map(
				(x: Array<number>) => {
					const timestamp = x[0];
					const key = x[1];
					const name = this.actions[key]?.name;
					return { key, timestamp, name };
				}));
	}

	logActivity(aid: number): Promise<void> {
		return fetch(`${this.fetchPrefix}/activity/log/${aid}`).
			then(resp => {
				if (resp.status !== 200) {
					throw new Error(`${resp.status}`);
				}
			});
	}
}