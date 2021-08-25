<template>
  <div class="activity-chooser">
    <div v-if="!submitted">
			<label for="activity-selector">Select an activity</label>
			<it-select
				id="activity-selector"
				v-model="selectedActivity"
				track-by="name"
				:options="activityOptions"
			/>
      <it-button id="save-btn" @click="logActivity">Done</it-button>
    </div>

    <div v-else>
			<h4>{{submittedMsg}}</h4>
      <it-button @click="ok">OK</it-button>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";

type Activity = {
	name: string;
	key: number;
};

const EMPTY_ACTIVITY = { name: '', key: 0 };
const SUBMIT_SUCCESS = 'Huzzah!';
const SUBMIT_ERROR = 'Could not log action:';

export default defineComponent({
  name: "activity-chooser",
  data() {
    return {
			activityOptions: [] as Array<Activity>,
			selectedActivity: EMPTY_ACTIVITY,
      submitted: false,
			submittedMsg: '',
    };
  },
  methods: {
		addActivity(name: string, key: number) {
			this.activityOptions.push({ name, key });
			this.activityOptions.sort(
				(a, b) => a.name < b.name ? -1 : a.name > b.name ? 1 : 0);
		},
		ok() {
			this.submitted = false;
		},
    logActivity() {
			let ac = this;

			let handleError = (error: Error) => {
				ac.submittedMsg = `${SUBMIT_ERROR} ${error.message}`;
			}

			ac.submitted = true;
			if (ac.selectedActivity !== EMPTY_ACTIVITY) {
				let activityId = ac.selectedActivity?.key;
				fetch(`http://192.168.1.19:8000/activity/log/${activityId}`)
					.then(resp => {
						if (resp.status === 200) {
							ac.submittedMsg = SUBMIT_SUCCESS;
							ac.selectedActivity = EMPTY_ACTIVITY;
						} else {
							console.log('errro', resp);
							handleError(new Error(`${resp.status}`));
						}})
					.catch(handleError);
			}
    },
  },
	beforeMount() {
		let ac = this;
		fetch('http://192.168.1.19:8000/action/get/20/0')
			.then(resp => resp.json())
			.then(activities => activities.forEach(
				(keyName: Array<number|string>) =>
					ac.addActivity(keyName[1] as string, keyName[0] as number)));
	},
});
</script>

<style>
	.activity-chooser {
		border: 2px solid #aaa;
		border-radius: 5px;
		box-shadow: 5px 5px 10px;
		background-color: #eee;
		margin: 10px;
		padding: 10px;
	}
	button {
		margin: auto;
	}
</style>
