<template>
  <div class="logout">
		<form v-on:submit.prevent="onSubmit">
			<it-button @click="submitLogout">Logout</it-button>
		</form>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from "vue";
import { config } from '../Config';

export default defineComponent({
  name: "logout",
  data() {
    return {
			userName: '',
			password: '',
    };
  },
  methods: {
		async submitLogout() {
			try {
				await config.login.submitLogout();
			} finally {
				this.onLogin(false);
			}
		}
  },
	props: {
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
	}
	button {
		margin: auto;
	}
</style>
