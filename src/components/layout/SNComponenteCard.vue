<template>
    <div>
        <b-card  class="container-fluid" style="margin-bottom: 2rem;">
            <b-row align-v="center">
                <b-col>
                    <b-button v-b-toggle.collapse-1>Criar</b-button>
                </b-col>
                <b-col>
                    <b-button variant="outline-primary" v-b-toggle.collapse-4>Importar</b-button>
                </b-col>  
                <!-- CRIAR COMPONENTE -->
                <b-collapse id="collapse-1" class="mt-2">
                        <b-card>
                            <div class="container">
                                <b-form style="color: black;" >
                                    <b-row align-v="center" align-h="center">
                                        <b-col class="col-4" style="display: flex; flex-direction: column;">
                                            <b-form-group id="name_input" 
                                            label="Nome"
                                            label-for="criar_nome">
                                                <b-form-input type="text" id="criar_nome" v-model="componente.nome" required></b-form-input>
                                            </b-form-group>
                                        </b-col>
                                        <b-col class="col-4" style="display: flex; flex-direction: column;">
                                            <b-form-group
                                            id="sn_input"
                                            label="Serial Number"
                                            label-for="criar_sn"
                                            >
                                                <b-form-input type="text" id="criar_sn" v-model="componente.serialNumber" disabled></b-form-input>
                                            </b-form-group>                                        
                                        </b-col>
                                        <b-col class="col-4" style="display: flex; flex-direction: row;">
                                            <b-form-group align-self="flex-end">
                                                <b-button type="button" primary="primary" @click="snGenerate">Gerar SN</b-button>
                                            </b-form-group>
                                        </b-col>
                                        <b-col class="col-4" style="display: flex; flex-direction: column;">
                                            <b-form-group id="codigo_input"
                                            label="Código"
                                            label-for="criar_codigo">

                                            <b-form-input type="text" id="criar_codigo" v-model="componente.codigo" required></b-form-input>
                                        </b-form-group>
                                    </b-col>
                                    <b-col class="col-4" style="display: flex; flex-direction: column;">
                                            <b-form-group id="status_input"
                                            label="Status"
                                            label-for="input-3">
                                                <b-form-select
                                                    id="input-3"
                                                    :options="this.statusOptions"
                                                    required
                                                    v-model="componente.status"
                                                    style="width: 100%;"
                                                ></b-form-select>
                                            </b-form-group>
                                        </b-col>  
                                        <b-col class="col-4" style="display: flex; flex-direction: column;">
                                            <b-form-group
                                            id="ncm_input"
                                            label="NCM"
                                            label-for="criar_ncm">
                                                <b-form-input type="text" id="crair_ncm" v-model="componente.ncm" required></b-form-input>
                                            </b-form-group>
                                        </b-col>                                                                                                  
                                    </b-row>
                                    <b-button primary="variant" style="width: 10%; margin-top: 1rem;" @click="submitComponent">Criar</b-button>
                                </b-form>
                            </div>
                        </b-card>
                </b-collapse>
                <!-- IMPORTAR  --> 
                <b-collapse id="collapse-4" class="mt-2">
                        <b-card>
                            <csv-import></csv-import>
                       </b-card>
                </b-collapse>            
            </b-row>            
        </b-card>
    </div>
</template>

<script>
import SNcsvImport from  './SNcsvImport.vue'
    export default{
        components: {
            'csv-import' : SNcsvImport
        },
        emits:  [ 'criacao-componentes'],
        data(){
            return{
                 componente : {
                    nome :  '',
                    serialNumber: '',
                    ncm: '',
                    codigo: '',
                    status: '',            
                },
                componenteId: 0 ,
                statusOptions: ['Estoque', 'Locado', 'Vendido']
            }
        },
        methods: {
            submitComponent(){
                this.$emit('criacao-componente', this.componente);
              },

              snGenerate() {
                var serialNumber = '';
                var allowedCharts = this.allowCharts();
                console.log(allowedCharts)
                for (var i = 0; i < 8; i++) {
                    serialNumber += this.allowCharts()[Math.floor(Math.random() * allowedCharts.length)];
                }

                this.componente.serialNumber = serialNumber;
            },

            allowCharts() {
                var chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
                return chars.match(/[A-Za-z0-9]/g);
            },

            findComponent(){
                if(this.componenteId > 0){
                    this.service.search(this.componenteId).then(result => this.componente = result);
                    if(this.componente === null){
                        alert('Nenhum componente encontrador com este ID.')
                    }
                    else{
                        console.log(this.componente)
                        this.editComponent();
                    }
                }
                else{
                    alert('Nenhum componente encontrador com este ID.')
                }
            },

            editComponent(){
                
                this.service.update(this.componente, this.componenteId)
                .then(result => 
                    console.log(result)
                );
            }           
        },  
        created(){
            this.service = new this.$componentService();
        }
    }
    
</script>