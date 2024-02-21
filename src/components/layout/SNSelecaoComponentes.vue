<template>
    <div>
            <b-pagination
                v-model="currentPage"
                :total-rows="rows"
                :per-page="perPage"
                aria-controls="my-table"
            ></b-pagination>

        <b-table
          id="my-table"
          :items="items"
          :fields="fields"
          :select-mode="selectMode"
          :per-page="perPage"
          aria-controls="my-table"
          responsive="sm"
          :current-page="currentPage"
          ref="selectableTable"
          selectable
          @row-selected="onRowSelected">
    
            <template #cell(selected)="{ rowSelected }">
                <template v-if="rowSelected">
                    <span aria-hidden="true">&check;</span>
                    <span class="sr-only">Selected</span>
                </template>
                <template v-else>
                    <span aria-hidden="true">&nbsp;</span>
                    <span class="sr-only">Not selected</span>
                </template>
            </template>
        </b-table>
        <div style="display: flex; justify-content: space-around;">
            <b-button size="sm" @click="selectAllRows">Selecionar Tudo</b-button>
            <b-button v-if="this.selected.length > 0" size="sm" @click="clearSelected()">Limpar Seleção</b-button>
            <b-button size="sm" variant="primary" @click="addSelectedToTheOperation()">Salvar</b-button>
            <b-button size="sm" variant="danger" @click="infoCloseOperation($event.target)">Fechar Operação</b-button>
        </div>
        <div class="container-fluid" style="display: flex; flex-direction: column;">
            <b-table :items="selected" :fiels="fields"></b-table>
        </div>     
        
        <b-modal :id="infoModalCloseOp.id" ref="info-modalCLoseOp" size="md" class="container" hide-footer>
            <b-row>
                <p>Tem certeza que deseja fechar a operação?</p>
            </b-row>
            <b-row style="display: flex;  flex-direction: row;">
                <b-col style="display: flex; ">                
                    <b-button @click="closeOperation()" style="margin-right: 1rem;">Sim</b-button>
                    <b-button @click="this.hideModal">Não</b-button>
                </b-col>
            </b-row>
        </b-modal>
    </div>
</template>

<script>
    export default {
        props: {
            operationId: {
                type: Number,
                default: 0
            }
        },
        emits:['selected-items'],
        data(){
            return {
                modes: ['multi', 'single', 'range'],
                fields: ['selected', 'id','nome', 'ncm', 'serialNumber',  'codigo', 'status'],
                items: [],
                selectMode: 'multi',
                selected: [],
                perPage: 10,
                currentPage: 1,
                infoModalCloseOp: {
                    id: 'info-modalCLoseOp'
                }
            }
        }, 
        computed: 
        {
            rows() {
                return this.items.length
            }
        },

        methods: {
            onRowSelected(elements) {
                console.log(elements);
                this.selected = elements;
            },
            selectAllRows() {
                this.$refs.selectableTable.selectAllRows();

            },
            clearSelected() {
                this.$refs.selectableTable.clearSelected();
                this.selected.forEach(element => {
                    this.selected.splice(element);             
                })
            },
            populateTable(){
                this.service = new this.$componentService();
                this.service
                .listComponentsWithoutOperation()
                .then(result => {
                    if(result != null){
                        this.items = result;
                    }
                })
            },
            addSelectedToTheOperation(){
                this.service = new this.$operationService();
                this.service.addComponentsToTheOperation(this.operationId, this.selected);
            },
            infoCloseOperation(button){
                this.$root.$emit('bv::show::modal', this.infoModalCloseOp.id, button)                
            },

            closeOperation(){
                this.service = new this.$operationService();
                this.service.closeOperation(this.operationId);

                this.hideModal();
            },

            hideModal() {
                this.$refs['info-modalCLoseOp'].hide();
            }
        },

        created(){
            this.populateTable();
        }
    }
</script>
