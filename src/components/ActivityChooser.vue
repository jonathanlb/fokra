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
import { Activity, ActivityInterface } from '../Activities';
import { ServerResponseError } from '../Login';
import { defineComponent, PropType } from 'vue';

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
		ok() {
			this.submitted = false;
		},
    logActivity() {
			let handleError = (error: Error) => {
				this.submittedMsg = `${SUBMIT_ERROR} ${error.message}`;
			}

			if (this.selectedActivity.key !== EMPTY_ACTIVITY.key) {
				this.submitted = true;
				let activityId = this.selectedActivity?.key;
				this.activities.logActivity(activityId)
					.then(() => {
						this.submittedMsg = SUBMIT_SUCCESS;
						this.selectedActivity = EMPTY_ACTIVITY;
					})
					.catch(handleError);
			}
    },
  },
	props: {
		activities: {
			type: Object as PropType<ActivityInterface>,
			required: true,
		},
		onLogin: { // eslint-disable-next-line no-unused-vars
			type: Function as PropType<(isAuth: boolean) => void>,
			required: true,
		},
	},
	beforeMount() {
		this.activities.getActions().
			then((activities: Array<Activity>) => {
				activities.sort(
					(a: Activity, b: Activity) => 
						a.name < b.name ? -1 : a.name > b.name ? 1 : 0);
				this.activityOptions = activities;
		}).catch(e => {
			if (e instanceof ServerResponseError) {
				this.onLogin(false);
			} else {
				console.error('unexpected error, getActions', e);
			}
		});
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
