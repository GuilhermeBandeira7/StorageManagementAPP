<template>
    <div class="container" style="color: black;">
        <b-row>
            <b-col>
                <b-form-group id="nome_comp" 
                        label="Nome"
                        label-for="nome_componente">
                        <b-form-input type="text" id="nome_componente" v-model="componente.nome"></b-form-input>
                </b-form-group>
            </b-col>
            <b-col>
                <b-form-group id="codigo_componente" 
                    label="Código"
                    label-for="cod_componente">
                    <b-form-input type="text" id="cod_componente"  v-model="componente.codigo"></b-form-input>
                </b-form-group>
            </b-col>
            <b-col>
                <b-form-group id="serialnumber" 
                    label="Serial Number"
                    label-for="sn_componente">
                    <b-form-input type="text" id="sn_componente"  v-model="componente.serialNumber"></b-form-input>
                </b-form-group>
            </b-col>
        </b-row>
        <b-row>
            <b-col>
                <b-form-group id="status" 
                    label="Status"
                    label-for="status_componente">
                    <b-form-input type="text" id="cod_componente" v-model="componente.status"></b-form-input>
                </b-form-group>
            </b-col>
            <b-col >
                <b-form-group id="ncm" 
                    label="NCM"
                    label-for="ncm_componente">
                    <b-form-input type="text" id="ncm_componente"  v-model="componente.ncm"></b-form-input>
                </b-form-group>
            </b-col>
            <b-col style="display: flex; align-items: center; justify-content: center;">
                <b-button variant="primary" @click="emitAlteredComp">Modificar</b-button>
            </b-col>
        </b-row>
    </div>
</template>

<script>
   export default{
        props:{
            componenteId: {
                type: Number,
                default: 0
            }
        },
        emits: ['componente-alterado'],
        data() {
            return {
                    componente: {
                    nome: '',
                    serialNumber:  '',
                    ncm: '',
                    codigo: '',
                    status: ''
                }
            }
        },
        methods: {
            findComponent(){
                this.service = new this.$componentService();
                this.service.search(this.componenteId)
                .then(result => 
                    result != null ? this.componente = result.value : alert('componente não encontrado')
                ).then(console.log(this.componente)); 
            },
            emitAlteredComp(){
                this.$emit('componente-alterado', this.componente);
            }
        },
        created(){
            this.findComponent();
        }
   }

</script>