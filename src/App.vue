<template>
  <div id="app" style="overflow: auto;">
   <sn-login @user-logged="userIsAuthenticate" :authenticated="isAuthenticated" v-if="!isAuthenticated" style="align-self: center;"></sn-login> 
	<sn-home v-else style="align-self: flex-start;"></sn-home>
  </div>
</template>

<script>
import SNLogin from './components/pages/SNLogin.vue'
import SNHome from './components/pages/SNHome.vue';

export default {
  name: 'App',
  components: {
    'sn-login': SNLogin,
	'sn-home': SNHome,
  },
  data(){
	return{
		isAuthenticated : false
	}
  },
  methods:{
	userIsAuthenticate(isLogged){
		if(isLogged){
			this.isAuthenticated = true;
		}
	}
  }
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #DAE6E4;
  margin-top: 0;
  height: 100%;
  display: flex;
}

body{
	content: "";
	position: fixed;
	top: 0;
	left: 0;
	right: 0;
	height: 100%;
	z-index: -1;
	/* background-image: linear-gradient(180deg,rgba(50,70,80,.9) 0,#0d101b 100%); */
/* 	background-image: url("./assets/vista-de-perto-do-armazem.jpg"); */
	background-repeat: no-repeat;
	background-size: 80px 80px;
}

body::after {
	content: "";
	position: fixed;
	top: 0;
	height: 100%;
	left: 0;
	right: 0;
	z-index: -5;
	background-color: #DAE6E4;
	background-image: linear-gradient(180deg, rgba(42, 43, 43, 0.832) 0, #444F4D 100%);
	background-image: linear-gradient(180deg, rgba(32, 34, 34, 0.9) 0, #DAE6E4 100%), url("/src/assets/vista-de-perto-do-armazem.jpg");
	background-repeat: no-repeat; 
	background-position: center;
	background-attachment: initial;
	height: 100%;
	transition: background .2s linear;
	background-size: cover;
}
</style>
