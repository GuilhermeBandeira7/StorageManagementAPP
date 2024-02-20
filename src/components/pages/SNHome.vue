<template>
    <div id="home" class="container-fluid" >
        <sn-header @selectedComponent="displaySelectedTable" ></sn-header>  
        <sn-table-comp v-if="currentTable == 'table-comp'"></sn-table-comp>
        <sn-table-op v-else-if="currentTable == 'table-op'"></sn-table-op>
    </div>
    
</template>

<script>
    import SNHeader from '../layout/SNHeader.vue';
    import SNTableComponentes from '../layout/SNTableComponentes.vue';
    import SNTableOperacoes from '../layout/SNTableOperacoes.vue';
    
    export default{
        components: {
            'sn-header': SNHeader,
            'sn-table-comp': SNTableComponentes,
            'sn-table-op' : SNTableOperacoes
        },
        data(){
            return{
                currentTable: ''
            }
        },
        methods: {
            displaySelectedTable(comp){
                this.currentTable = comp;
            }
        },
    }
</script>

<style scoped>
    #home{
        display: flex;
        flex-direction: column;
    }
</style>