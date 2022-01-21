<template>
  <div v-if="!isAuthenticated">
		<login loginMsg="Please log in..." v-bind:onLogin="onLogin" />
	</div>
	<div v-else>
		<activity-chooser v-bind:activities="activities" />
		<timeline-viewer v-bind:activities="activities" />
		<logout v-bind:onLogin="onLogin" />
	</div>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component';
import { ActivitiesFromServer } from './Activities';
import ActivityChooser from './components/ActivityChooser.vue';
import { config } from './Config';
import Login from './components/Login.vue';
import Logout from './components/Logout.vue';
import TimelineViewer from './components/TimelineViewer.vue';

@Options({
  components: {
		ActivityChooser,
		Login,
		Logout,
		TimelineViewer,
  },
	data() {
		return {
			activities: new ActivitiesFromServer(`${config.server}:${config.port}`),
			isAuthenticated: false,
		};
	},
	methods: {
		onLogin(isAuth: boolean) {
			this.isAuthenticated = isAuth;
			this.$forceUpdate();
		}
	}
})
export default class App extends Vue {}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
