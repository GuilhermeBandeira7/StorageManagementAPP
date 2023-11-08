<template>
    <div class="container" style="color: black;">
        <b-row>
            <b-col>
                <b-form-group id="observacao_op" 
                        label="observacao"
                        label-for="observacao_op">
                        <b-form-input type="text" id="observacao_op" v-model="operacao.observacao"></b-form-input>
                </b-form-group>
            </b-col>
            <b-col>
                <b-form-group id="tipo_operacao" 
                    label="Tipo"
                    label-for="tipo_operacao">
                    <b-form-input type="text" id="tipo_operacao"  v-model="operacao.tipo"></b-form-input>
                </b-form-group>
            </b-col>
            <b-col>
                <b-form-group id="descricao" 
                    label="Descrição"
                    label-for="sn_operacao">
                    <b-form-input type="text" id="sn_operacao"  v-model="operacao.descricao"></b-form-input>
                </b-form-group>
            </b-col>
        </b-row>
        <b-row>
            <b-col>
                <b-form-group id="data" 
                    label="data"
                    label-for="data_operacao">
                    <b-form-input type="text" id="data_componente" v-model="operacao.data"></b-form-input>
                </b-form-group>
            </b-col>
            <b-col >
                <b-form-group id="notaFiscal" 
                    label="Nota Fiscal"
                    label-for="notaFiscal_operacao">
                    <b-form-input type="text" id="notaFiscal_operacao"  v-model="operacao.notaFiscal"></b-form-input>
                </b-form-group>
            </b-col>
            <b-col style="display: flex; align-items: center; justify-content: center;">
                <b-button variant="primary" @click="emitAlteredOp">Modificar</b-button>
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
                    observacao: '',
                    tipo:  '',
                    descricao: '',
                    data: '',
                    notaFiscal: ''
                }
            }
        },
        methods: {
            findOperation(){
                this.service = new this.$operationService();
                this.service.search(this.operationId)
                .then(result => 
                    result != null ? this.operacao = result.value : alert('operação não encontrado')
                ).then(console.log(this.operacao)); 
            },
            emitAlteredOp(){
                this.$emit('operacao-alterado', this.operacao);
            }
        },
        created(){
            this.findOperation();
        }
   }

</script>