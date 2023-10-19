<template>
    <base-card :cardHeader="'SNGenerator'" :cardTitle="''">
        <div>
            <img src="../../assets/bg.png" alt="logo MTW">
            <b-form @submit.prevent="submitLogin">
                <b-form-input type="text" id="text-user" placeholder="usuário" v-model="username" ref="userInput"></b-form-input>
                <b-form-input type="password" id="text-password" placeholder="senha" v-model="passwd" ref="passwdInput"></b-form-input>
                <b-button variant="primary" type="submit">Entrar</b-button>
            </b-form>
        </div> 
    </base-card>
</template>

<script>
    export default{
        data(){
            return{
                username : '',
                passwd: '',
                authenticated: false
            }
        },
        emits : ['logged'],
        methods: {
                submitLogin(){
                    this.service = new this.$userService();
                    this.service.searchByUsernamePassword(this.username, this.passwd)
                    .then(result => {
                        if(result != null){
                            this.authenticated = true;
                            this.$emit('user-logged', this.authenticated);
                        }
                    });
                }
            }
    }
</script>

<style scoped>
    .container{
        display: flex;
        flex-direction: column;
    }

    img{
        max-height: 6rem;
        max-width: 20rem;
        margin-bottom: 1rem;
    }
</style>
