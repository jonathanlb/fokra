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
			let ac = this;

			let handleError = (error: Error) => {
				ac.submittedMsg = `${SUBMIT_ERROR} ${error.message}`;
			}

			if (ac.selectedActivity.key !== EMPTY_ACTIVITY.key) {
				ac.submitted = true;
				let activityId = ac.selectedActivity?.key;
				this.activities.logActivity(activityId)
					.then(() => {
						ac.submittedMsg = SUBMIT_SUCCESS;
						ac.selectedActivity = EMPTY_ACTIVITY;
					})
					.catch(handleError);
			}
    },
  },
	props: {
		activities: {
			type: Object as PropType<ActivityInterface>,
			required: true,
		}
	},
	beforeMount() {
		let ac = this;
		this.activities.getActions().
			then((activities: Array<Activity>) => {
				activities.sort(
					(a: Activity, b: Activity) => 
						a.name < b.name ? -1 : a.name > b.name ? 1 : 0);
				ac.activityOptions = activities;
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
