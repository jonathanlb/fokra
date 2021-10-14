<template>
  <img alt="Vue logo" src="./assets/logo.png">
  <div v-if="!authenticated">
		<login loginMsg="Please log in..." />
	</div>
	<div v-else>
		<activity-chooser v-bind:activities="activities" />
		<timeline-viewer v-bind:activities="activities" />
	</div>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component';
import { ActivitiesFromServer } from './Activities';
import ActivityChooser from './components/ActivityChooser.vue';
import Login from './components/Login.vue';
import TimelineViewer from './components/TimelineViewer.vue';

function isAuth(): boolean {
	let userName = window.localStorage.getItem('userName');
	let password = window.localStorage.getItem('password');
	return userName === 'Jonathan' && password === 'ee';
}

@Options({
  components: {
		ActivityChooser,
		Login,
		TimelineViewer,
  },
	data() {
		return {
			activities: new ActivitiesFromServer('http://192.168.1.9:8000'),
			authenticated: isAuth(),
		};
	},
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
