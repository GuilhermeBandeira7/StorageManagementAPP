<template>
    <div class="px-3 py-2">
        <b-container fluid style="display: flex; flex-direction: column;">
            <b-row class="my-1">
                <b-col sm="3">
                    <label for="input-name">Nome</label>
                </b-col>
                <b-col sm="9">
                    <b-form-input id="input-name" :state="state" v-model="user.nome"></b-form-input>
                </b-col>
            </b-row>

            <b-row class="my-1">
                <b-col sm="3">
                    <label for="input-usuario">Usuário</label>
                </b-col>
                <b-col sm="9">
                    <b-form-input id="input-usuario" :state="state" v-model="user.usuario"></b-form-input>
                </b-col>
            </b-row>

            <b-row class="my-1">
                <b-col sm="3">
                    <label for="input-senha">Senha</label>
                </b-col>
                <b-col sm="9">
                    <b-form-input id="input-invalid" type="password" :state="state" v-model="user.senha"></b-form-input>
                </b-col>
            </b-row>

            <b-row class="my-1">
                <b-col sm="3">
                    <label for="input-senha-confirma">Confirma Senha</label>
                </b-col>
                <b-col sm="9">
                    <b-form-input id="input-senha-confirma" type="password" :state="this.statePassword" v-model="user.senhaConfirmada"></b-form-input>
                </b-col>
            </b-row>

            <b-row class="my-1">
                <b-col sm="9" class="container-fluid">
                    <b-button variant="primary" @click="createUser"> Criar Usuário</b-button>
                </b-col>
            </b-row>
        </b-container>         
    </div>
</template>

<script>
    export default{
        data(){
            return{
                user: {
                    nome: '',
                    usuario: '',
                    senha: '',
                    senhaConfirmada: ''
                },
                newUser:{
                    nome: '',
                    login: '',
                    senha: ''
                }              
            }
        },
        computed: {
            statePassword(){
                if(this.user.senha === this.user.senhaConfirmada ){
                    return true;
                }else{
                    return false;
                }
            },
            state(){
                return this.user.senha.length >= 4; 
            }
        },
        methods: {
            createUser(){
                this.newUser.nome = this.user.nome;
                this.newUser.login = this.user.usuario;
                this.newUser.senha = this.user.senha;
                this.service = new this.$userService();
                if(this.statePassword){
                    this.service.update(this.newUser);
                }
            }
        }
    }
</script>