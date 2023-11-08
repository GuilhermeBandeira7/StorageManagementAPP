<template>
    <div>
        <h3>OPERAÇÕES</h3>
        <b-card  class="container-fluid" style="margin-bottom: 2rem;">
            <b-row align-v="center" >
                <b-col>
                    <b-button v-b-toggle.collapse-1>Criar</b-button>
                    <b-button variant="outline-primary" style="margin-left: 5rem;" @click="exportToCsv">Exportar</b-button>
                </b-col>  
                <!-- COLLAPSE CRIAR OPERAÇÃO -->
                <b-collapse id="collapse-1" class="mt-2">
                        <b-card>
                            <div class="container" style="color: black;">
                                <b-row>
                                    <b-col class="col-4" style="display: flex; flex-direction: column;">
                                        <label for="input-3"> Tipo</label>
                                        <b-form-select
                                            id="input-3"
                                            :options="this.typeOptions"
                                            required
                                            v-model="newOperation.tipo"
                                        ></b-form-select>
                                    </b-col>
                                    <b-col class="col-4" style="display: flex; flex-direction: column;">
                                        <label> Descrição </label>
                                        <input type="text" v-model="newOperation.descricao">
                                    </b-col>
                                    <b-col class="col-4" style="display: flex; flex-direction: column;">
                                        <label> Observação </label>
                                        <input type="text" v-model="newOperation.observacao">
                                    </b-col>
                                    <b-col class="col-4" style="display: flex; flex-direction: column;">
                                        <label> Nota Fiscal </label>
                                        <input type="text" v-model="newOperation.notaFiscal">
                                    </b-col>  
                                </b-row>
                                <b-button primary="variant" style="width: 10%; margin-top: 1rem;" @click="createOperation">Criar</b-button>
                            </div>
                        </b-card>
                </b-collapse>                
            </b-row>            
        </b-card>

        <b-input v-model="filter" placeholder="Filtrar tabela..."></b-input>
        <b-table sticky-header striped hover :items="items" :fields="fields" :filter="filter" responsive="sm" head-variant="light" style="height: 100%; max-height: none;">
            <template #cell(status)="data">
                <b-button v-if="data.value == 1" pill variant="success"
                    style="margin-right: 1rem;" @click="infoPill(data.item)">
                    Aberto</b-button>
                <b-button v-else pill variant="danger"
                style="margin-right: 1rem;">
                Fechado</b-button>
            </template>

            <template #cell(Detalhes)="row">
                <b-button size="sm" v-b-modal.modal-1 class="mr-2" @click="info(row.item, $event.target)" style="margin-right: 0.5rem;">
                    {{ row.detailsShowing ? 'Componentes' : 'Componentes'}} 
                </b-button>
                <b-button size="sm" @click="infoEdit(row.item, $event.target)" variant="primary" style="margin-right: 0.5rem;">
                    Editar
                </b-button>
                <b-button size="sm" variant="danger" @click="infoRemove(row.item, $event.target)">
                    Remover
                </b-button>
            </template>   
        </b-table>
        
        <!-- <b-col class="col-4" style="display: flex; flex-direction: column; justify-content: flex-end;">
                <b-button v-b-modal.modal-tall size="sm" >Selecionar Componentes</b-button>                                   
        </b-col>  -->

        <!-- MODAL -->
        <b-modal :id="infoModalPill.id"
                class="container"
                dialog-class="my-modal-dialog"
                style="max-width: none;" hide-footer>
                <!-- SELEÇÃO DE COMPONENTES -->
                <selecao-componente :operation-id="this.selectedOpId"></selecao-componente>             
        </b-modal>                                                                                            
        <b-modal id="modal-1" size="xl" title="Componentes">
            <b-table :fields="fieldsComp" :items="this.listOfComp">
                <template #cell(actions)="row">
                    <b-button size="sm" @click="infoSelectedComp(row.item, $event.target)" class="mr-1" variant="danger">
                    Remover
                    </b-button>
                </template>
            </b-table>
        </b-modal>

        <b-modal :id="infoModalRemove.id" ref="remove-modal" size="md" class="container" hide-footer>
            <b-row>
                <p>Tem certeza que deseja remover a operação?</p>
            </b-row>
            <b-row style="display: flex;  flex-direction: row;">
                <b-col style="display: flex; ">                
                    <b-button @click="removeOperation()" style="margin-right: 1rem;">Sim</b-button>
                    <b-button @click="this.hideModal">Não</b-button>
                </b-col>
            </b-row>
        </b-modal>

    <b-modal :id="infoModalEdit.id" size="xl" title="Operação" hide-footer>
       <action-operation :operation-id="this.selectedRowId" v-on:operacao-alterado="alterOperation"></action-operation>
    </b-modal>
  </div>
</template>

<script>
   import SNSelecaoComponentes from './SNSelecaoComponentes.vue';
   import SNactionOperation from './SNactionOperation.vue';
   
    export default{
        components: {          
            'selecao-componente': SNSelecaoComponentes,
            'action-operation': SNactionOperation
        },
        data() {
            return{
                operationComponents: [],
                items: [],
                itemsOp: [],
                fields: ['observacao','tipo','descricao','notaFiscal', 'data', 'status','Detalhes'],
                filter: '',
                fieldsComp: ['id','nome', 'ncm', 'serialNumber',  'codigo', 'status', 'Actions'],
                typeOptions: ['Venda', 'Locação', 'Estoque', 'Estoque SP', 'Descarte'],
                show: true,
                modalShow: false,
                newOperation: {
                    tipo: '',
                    descricao: '',
                    observacao: '',
                    notaFiscal: '',
                    componentes: [],
                    status: 1
                },
                listOfComp: [],
                infoModal: {
                id: 'info-modal',
                title: '',
                content: ''
                },
                infoModalComp: {
                    id: 'info-modal',
                    title: '',
                    content: ''
                },
                infoModalEdit:{
                    id: 'info-modal2',
                    title: '',
                    content: ''
                },
                infoModalRemove: {
                    id: 'info-modal3',
                    title: '',
                    content: ''
                },
                infoModalPill: {
                    id: 'info-modal4',
                    title: '',
                    content: ''
                },
                selectedRowId: '',
                selectedCompId: '',
                selectedOp: '',
                OperationOpenedOrClosed: "Aberto",
                selectedOpId: '',
                options: {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                    hour: "numeric",
                    minute: "numeric",
                    second: "numeric"
                }

            }
        },
        methods : {
            populateTable(){
                this.service = new this.$operationService();
                this.service
                .list()
                .then(result => {
                    console.log(result);
                    if(result != null){
                        this.items = result;                      
                        for(let cont = 0; cont < this.items.length; cont++){
                            console.log(this.items[cont].data, 'data');
                            var messedUpDateTime = this.items[cont].data;
                            console.log(messedUpDateTime);
                            var formattedDateTime = new Date(messedUpDateTime);
                            var newDate = formattedDateTime.toLocaleDateString('pt-BR', this.options);
                            this.items[cont].data = newDate;
                            this.operationComponents.unshift(this.items[cont].componentes);
                        }
                    }
                })
            },
            updateSelection(selectedItems){
                if(this.newOperation.componentes.length > 0){
                    this.newOperation.componentes = [];
                }
                if(selectedItems != null){
                    this.newOperation.componentes = selectedItems;
                    console.log(this.newOperation.componentes);
                }else{
                    console.log('empty.')
                }
            },

            createOperation(){
                this.service = new this.$operationService();
                this.service.update(this.newOperation).then(alert('Operação criada com sucesso.'));
            },

            populateDetails(){
                if(this.listOfComp.length > 0){
                    this.listOfComp = [];
                }
                this.service = new this.$operationService();
                this.service.search(this.selectedRowId).then(result => this.listOfComp =  result.value.componentes);
            },
            info(item, button, mode) { 
                console.log('ENTROU');             
                this.infoModal.title = `${item.nome}: ${item.id}`
                this.infoModal.content = JSON.stringify(item, null, 2)
                this.selectedRowId = item.id;
                this.$root.$emit('bv::show::modal', this.infoModal.id, button);
                if(mode === 'remover'){
                    this.removeComponent();
                }else{
                    this.populateDetails();                    
                }
            },

            infoEdit(item, button){
                this.infoModal.title = `${item.nome}: ${item.id}`
                this.infoModal.content = JSON.stringify(item, null, 2)             
                this.selectedRowId = item.id;
                this.$root.$emit('bv::show::modal', this.infoModalEdit.id, button)
            },

            infoRemove(item, button){
                this.infoModalRemove.title = `${item.nome}: ${item.id}`
                this.infoModalRemove.content = JSON.stringify(item, null, 2)            
                this.selectedOp = item;
                console.log(this.selectedOp);
                this.$root.$emit('bv::show::modal', this.infoModalRemove.id, button)
            },

            infoPill(item, button){
                this.infoModalPill.title = `${item.nome}: ${item.id}`
                this.infoModalPill.content = JSON.stringify(item, null, 2)
                this.selectedOpId = item.id; 
                if(this.OperationOpenedOrClosed === "Aberto"){
                    this.$root.$emit('bv::show::modal', this.infoModalPill.id, button)
                }
            },

            infoSelectedComp(item){
                console.log('remove comp')
                this.infoModalComp.title = `${item.nome}: ${item.id}`
                this.infoModalComp.content = JSON.stringify(item, null, 2)
                this.selectedCompId = item.id;
                this.removeCompFromOperation();
            },

            removeOperation(){
                this.service = new this.$operationService();
                this.service.erase(this.selectedOp)
                .then(alert('Operação removida com sucesso.'));

                this.hideModal();
            },

            removeComponent(){
                console.log('ENTROU');
                this.service = new this.$operationService();
                this.service.erase(this.selectedRowId)
                .then(alert('Operação removida com sucesso.'));
            },

            removeCompFromOperation(){
                this.service = new this.$operationService();
                this.service.removeComponentOfTheOperation(this.selectedRowId, this.selectedCompId);
                alert('Componente removido da operação.');
            },

            alterOperation(operation){
                this.service = new this.$operationService();
                this.service.update(operation).then(alert('Componente alterado da operação.'));
            },
            
            hideModal() {
                this.$refs['remove-modal'].hide()
            },

            exportToCsv(){
                const csvContent = this.convertToCsv(this.items); 
                const blob = new Blob([csvContent], {type: 'text/csv;charset=utf-8'});
                const url = URL.createObjectURL(blob);
                const link = document.createElement('a');
                link.href=url;
                link.setAttribute('download', 'export_data.csv');
                link.click();
            },

            convertToCsv(data){
                const headers = Object.keys(data[0]);
                const rows = data.map(obj => headers.map(header => obj[header]));
                const headerRow = headers.join(',');
                const csvRows = [headerRow, ...rows.map(row => row.join(','))];
                return csvRows.join('\n')
            }
        },

        created() {
            this.populateTable();
        }
    }
    
</script>

<style>
.my-modal-dialog {
    max-width: 100% !important;
}
</style>