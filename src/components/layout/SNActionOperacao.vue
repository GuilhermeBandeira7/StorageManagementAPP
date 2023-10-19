<template>
    <div class="container" style="color: black;">
        <b-row>
            <b-col>
                <b-form-group id="tipo_op" 
                        label="Tipo"
                        label-for="tipo_operacao">
                        <b-form-input type="text" id="tipo_operacao" v-model="operacao.tipo"></b-form-input>
                </b-form-group>
            </b-col>
            <b-col>
                <b-form-group id="descricao_operacao" 
                    label="Descrição"
                    label-for="descricao_operacao">
                    <b-form-input type="text" id="descricao_operacao"  v-model="operacao.descricao"></b-form-input>
                </b-form-group>
            </b-col>
            <b-col>
                <b-form-group id="serialnumber" 
                    label="Serial Number"
                    label-for="sn_componente">
                    <b-form-input type="text" id="sn_componente"  v-model="operacao.findOperacao"></b-form-input>
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
            operationId: {
                type: Number,
                default: 0
            }
        },
        emits: ['operacao-alterado'],
        data() {
            return {
                    operacao: {
                        tipo: '',
                        descricao: '',
                        fatura:  '',
                        notaFiscal: '',
                        data: ''
                    }
            }
        },
        methods: {
            findOperacao(){
                this.service = new this.$operationService();
                this.service.search(this.operationId)
                .then(result => 
                    result != null ? this.operacao = result.value : alert('componente não encontrado')
                ).then(console.log(this.operacao)); 
            },
            emitAlteredComp(){
                this.$emit('operacao-alterado', this.operacao);
            }
        },
        created(){
            this.findComponent();
        }
   }

</script>