<template>
  <div class="login">
		<div v-if="waiting" class="waiting"></div>
		<form v-on:submit.prevent="onSubmit">
			<h2>{{loginMsg}}</h2>
			<it-input v-model="userName" message="User Name"/>
			<it-input v-model="password" message="Password" type="password"/>
			<it-button @click="submitLogin">Submit</it-button>
		</form>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from "vue";
import { config } from '../Config';

export default defineComponent({
  name: "login",
  data() {
    return {
			userName: '',
			password: '',
			waiting: false,
    };
  },
  methods: {
		async submitLogin() {
			try {
				this.waiting = true;
				await config.login.submitLogin(this.userName, this.password);
				if (config.login.isAuth()) {
					this.onLogin(true);
				} else {
					alert('Failed to log in with username and password.');
				}
			} catch (e) {
					alert(`Cannot log in at this time: ${e.message}`);
			} finally {
					this.waiting = false;
			}
		}
  },
	props: {
		loginMsg: String,
		onLogin: { // eslint-disable-next-line no-unused-vars
			type: Function as PropType<(isAuth: boolean) => void>,
			required: true,
		},
	},
});
</script>

<style>
	.login {
		border: 2px solid #aaa;
		border-radius: 5px;
		box-shadow: 5px 5px 10px;
		background-color: #eee;
		margin: auto;
		padding: 10px;
		width: 65%;
		position: relative;
	}
	.waiting {
		border-radius: 5px;
		background-color: rgb(192, 192, 192, 0.375);
		position: absolute;
		height: 100%;
		width: 100%;
		z-index: 2;
		left: 0;
		top: 0;
	}
	@keyframes spinner {
		0% {
			transform: translate3d(-50%, -50%, 0) rotate(0deg);
		}
		100% {
			transform: translate3d(-50%, -50%, 0) rotate(360deg);
		}
	}
	.waiting::before {
		animation: 1.5s linear infinite spinner;
		animation-play-state: inherit;
		border: solid 5px grey;
		border-bottom-color: lightblue;
		border-radius: 50%;
		content: "";
		height: 40px;
		width: 40px;
		position: absolute;
		top: 50%;
		left: 50%;
		transform: translate3d(-50%, -50%, 0);
		will-change: transform;
	}
	button {
		margin: auto;
	}
</style>
