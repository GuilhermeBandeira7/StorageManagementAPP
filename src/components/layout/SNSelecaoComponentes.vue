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

        <b-table
          :items="items"
          :fields="fields"
          :select-mode="selectMode"
          responsive="sm"
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
            <b-button size="sm" @click="clearSelected">Limpar Seleção</b-button>
            <b-button size="sm" variant="primary" @click="emitAllSelectedItems">Salvar</b-button>
        </div>
    </div>
</template>

<script>
    export default{
        emits:['selected-items'],
        data(){
            return {
                modes: ['multi', 'single', 'range'],
                fields: ['selected', 'id','nome', 'ncm', 'serialNumber',  'codigo', 'status'],
                items: [],
                selectMode: 'multi',
                selected: []
            }
        },

        methods: {
            onRowSelected(items) {
                this.selected = items;
            },
            selectAllRows() {
                this.$refs.selectableTable.selectAllRows();
            },
            clearSelected() {
                this.$refs.selectableTable.clearSelected();
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
            emitAllSelectedItems(){
                if(this.selected != null){
                    this.$emit('selected-items', this.selected); 
                    alert('componente(s) salvo(s) na operação.');
                }
            }
        },

        created(){
            this.populateTable();
        }
    }
</script>
