<template>
    <div>
            <b-form-group
            label="Selection mode:"
            label-for="table-select-mode-select"
            label-cols-md="4"
            style="display: flex; flex-direction: row;" >
                <b-form-select
                    id="table-select-mode-select"
                    v-model="selectMode"
                    :options="modes"
                    class="mb-3"
                    style="width: 150px;"
                ></b-form-select>
            </b-form-group>

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
            <b-button size="sm" @click="clearSelected()">Limpar Seleção</b-button>
            <b-button size="sm" variant="primary" @click="addSelectedToTheOperation()">Salvar</b-button>
            <b-button size="sm" variant="danger" @click="closeOperation()">Fechar Operação</b-button>
        </div>
        <div class="container-fluid" style="display: flex; flex-direction: column;">
            <p style="align-self: center; margin-top: 2rem;">COMPONENTES SELECIONADOS</p>
            <b-table :items="selected" :fiels="fields"></b-table>
        </div>       
    </div>
</template>

<script>
    export default{
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
                currentPage: 1
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
                console.log(elements, ' elements')
                elements.forEach(element => {
                    console.log(element);
                    if(this.DidNotFindElementWithSameId(element)){
                        this.selected.push(element);
                        console.log(this.selected);
                    }

                    console.log(this.selected ,"selecioandos");     
                    console.log(element);
                });
            },
            onRowUnselected(value){
                console.log('entrou.');
                this.selected.forEach(element => {
                    if(element.id === value.id){
                        element.selected = false;
                        this.selected.filter((element => {
                            return element.id != value.id;
                        }))
                    }
                })
            },

            DidNotFindElementWithSameId(value){
                var result =  this.selected.filter((element => { return element.id == value.id} ))
                if(result.length > 0){ //encontrou um elemento com o mesmo id daquele que queremos adicionar
                return false;
                }else{ //senão encontrou um elemento com o mesmo id retorna true
                    return true;
                }
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
                    console.log(result);
                    if(result != null){
                        this.items = result;
                    }
                })
            },
            addSelectedToTheOperation(){
                console.log(this.selected);
                console.log(this.operationId, 'id da operação')
                this.service = new this.$operationService();
                this.service.addComponentsToTheOperation(this.operationId, this.selected);
            },
            closeOperation(){
                this.service = new this.$operationService();
                this.service.closeOperation(this.operationId);
            }
        },

        created(){
            this.populateTable();
        }
    }
</script>
