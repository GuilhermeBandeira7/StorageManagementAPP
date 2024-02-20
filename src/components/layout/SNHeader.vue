<template>
    <div class="container-fluid">
        <b-navbar toggleable="lg" type="dark" variant="succes" style="display: flex; width: 100%;">
        <img src="../../assets/bg.png" style="height: 60px; width: 130px;">
        <b-navbar-brand href="#" disabled>SNGenerator</b-navbar-brand>    
        <b-navbar-toggle target="nav-collapse"></b-navbar-toggle>

        <b-collapse id="nav-collapse" is-nav class="container">
            <div>
                <b-navbar-nav>
                    <b-nav-item href="#" @click="setSelectedComponent('table-op')">Operações</b-nav-item>
                    <b-nav-item href="#" @click="setSelectedComponent('table-comp')">Componentes</b-nav-item>
                </b-navbar-nav>
            </div>
             <!-- Right aligned nav items -->
             <div>
                <b-navbar-nav class="ml-auto">

                    <b-nav-item-dropdown right >
                        <!-- Using 'button-content' slot -->
                        <template #button-content>
                            <em>Usuário</em>
                        </template>
                        <b-dropdown-item href="#" @click="reloadPage">Sair</b-dropdown-item>
                        <b-dropdown-item href="#" v-b-toggle.sidebar-1>
                            Criar
                        </b-dropdown-item>
                    </b-nav-item-dropdown>
                </b-navbar-nav>
             </div>         
        </b-collapse>
        <b-sidebar id="sidebar-1" title="Novo Usuário" shadow >
            <user-form @novo-usuario="createNewUser"></user-form>
        </b-sidebar>
    </b-navbar>
    </div>
</template>

<script>
import SNUserForm from './SNUserForm.vue';

export default {
    components: {
        'user-form': SNUserForm
    },
    data: () => {
            return{
                currentComponent : 'table-comp',
                types: [
                    'name',
                    'user',
                    'password'
                ]
            }
        },
        emits: ['selectedComponent'],
        methods: {
            setSelectedComponent(comp){
                this.currentComponent = comp;
                this.$emit('selectedComponent', this.currentComponent)
            },

            createNewUser(user){
                this.service = new this.$userService();
                this.service.update(user);
            },

            reloadPage() {
                window.location.reload();
            }
        }  
}
</script>

<style scoped>
    .navbar{
        flex-direction: row;
    }
</style>