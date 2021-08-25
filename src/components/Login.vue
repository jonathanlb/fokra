<template>
  <div class="login">
		<form>
			<h2>{{loginMsg}}</h2>
			<it-input v-model="userName" message="User Name"/>
			<it-input v-model="password" message="Password" type="password"/>
			<it-button @click="submitLogin">Submit</it-button>
		</form>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  name: "login",
  data() {
    return {
			userName: '',
			password: '',
    };
  },
  methods: {
		submitLogin() {
			window.localStorage.setItem('userName', this.userName);
			window.localStorage.setItem('password', this.password);
		}
  },
	props: {
		loginMsg: String,
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
