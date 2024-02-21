<template>
  <div>
    <h3>COMPONENTES</h3>
    <!-- DROPDOWN CRUD COMPONENTES -->
    <component-card @criacao-componente="createComponent"></component-card>
    <b-input v-model="filter" placeholder="Filtrar tabela..."></b-input>
    <!-- TABELA COMPONENTES DO BANCO DE DADOS -->
    <b-table striped hover selectable :items="items" :fields="fields" 
    :filter="filter" @row-selected="onRowSelected" ref="selectableTable">
      <template #cell(selected)="{ rowSelected }">
        <template v-if="rowSelected" >
          <span aria-hidden="true">&check;</span>
          <span class="sr-only">Selected</span>
        </template>
        <template v-else>
          <span aria-hidden="true">&nbsp;</span>
          <span class="sr-only">Not selected</span>
        </template>
      </template>
      <template #cell(info)="row">
        <b-button size="sm" variant="danger" @click="infoRemove(row.item, $event.target)">
          <b-icon icon="trash" aria-hidden="true"></b-icon>
        </b-button>
      </template>
    </b-table>
    <b-row class="mb-3">
      <b-col>
        <b-button v-if="isComponentSelected" variant="outline-success" size="sm" 
          class="px-3 d-flex" pill @click="exportCompsToCsv">Exportar Componentes Selecionados
        </b-button>
      </b-col>
      <b-col>
        <b-button v-if="isComponentSelected" variant="outline-primary" size="sm" 
          class="px-3 d-flex"  @click="selectAllRows">{{this.allSelected === false ? 'Selecionar Tudo': 'Deselecionar Tudo'}}
        </b-button>
      </b-col>
    </b-row>
    <!-- MODAL -->
    <b-modal :id="infoModal.id" :title="infoModal.title" hide-footer>
      <action-componente :componenteId="selectedRowCompId" @componente-alterado="setAlteredComponent"></action-componente>
    </b-modal>
    <!-- MODAL REMOVER COMPONENTE -->
    <b-modal :id="infoModalRemove.id" ref="remove-modal" size="md" class="container" hide-footer>
            <b-row>
                <p>Tem certeza que deseja remover o componente?</p>
            </b-row>
            <b-row style="display: flex;  flex-direction: row;">
                <b-col style="display: flex; ">                
                    <b-button @click="removeComponent()" style="margin-right: 1rem;">Sim</b-button>
                    <b-button @click="this.hideModal">Não</b-button>
                </b-col>
            </b-row>
    </b-modal>
  </div>
</template>

<script>
  import SNComponentCard from  './SNComponenteCard.vue'
  import SNActionComponente from  './SNActionComponente.vue'
  export default {
    components: {
      'component-card' : SNComponentCard,
      'action-componente' : SNActionComponente
    },
    data() {
      return {
        items: [],
        fields: ['id', 'selected', 'nome', 'ncm', 'serialNumber',  'codigo', 'data', 'status', 'info'],
        filter: '',
        selected: [],
        selectedComponents: [],
        infoModal: {
          id: 'info-modal',
          title: '',
          content: ''
        },
        selectedRowCompId: '',
        alteredComp: {
          nome: '',
          serialNumber:  '',
          ncm: '',
          codigo: '',
          status: '',
          dateTime: new Date()
        },
        allSelected: false,
        options: {
          year: "numeric",
          month: "long",
          day: "numeric",
          hour: "numeric",
          minute: "numeric",
          second: "numeric"
        },
        infoModalRemove: {
          id: 'info-modal3',
          title: '',
          content: ''
        },
        selectedComp: ''
      }
    },
    methods : {
      info(item, index, button, mode) {
        if(mode === 'editar'){
          this.infoModal.title = `${item.nome}: ${item.id}`
          this.infoModal.content = JSON.stringify(item, null, 2)
          this.selectedRowCompId = item.id;
          this.$root.$emit('bv::show::modal', this.infoModal.id, button)
        }else{
          this.service = new this.$componentService();
          this.service.erase(item).then(alert('Componente removido com sucesso.'));
        }
      },
      populateTable(){
         this.service = new this.$componentService();
         this.service
         .list()
         .then(result => {
          if(result != null){
            this.items = result;
            for(let cont = 0; cont < this.items.length; cont++){
              var messedUpDateTime = this.items[cont].dateTime;
              var formattedDateTime = new Date(messedUpDateTime);
              var newDate = formattedDateTime.toLocaleDateString('pt-BR', this.options);
              this.items[cont].data = newDate;
            }
          }
         }).catch(error => {
          console.log(error);
         })
      },
      createComponent(novoComponente){
        this.service = new this.$componentService();
        this.service.update(novoComponente).then(result => result != null ?
        alert('Componente criado com sucesso.') : alert('Erro ao criar componente.'));

      },

      submitChanges(){
         this.service = new this.$componentService();
         this.service.update(this.alteredComp).then(result =>
         result != null ? alert('componente alterado com sucesso.'): alert('Erro ao tentar alterar componente.'));
      },

      setAlteredComponent(newComp){
        if(newComp != null){
          this.alteredComp = newComp;
          this.submitChanges();
        }else{
          alert('Não foi possível alterar o componente.')
        }
      },

      onRowSelected(items){
        this.selectedComponents = items;
      },

      selectAllRows() {
        if(this.allSelected === false){
          this.$refs.selectableTable.selectAllRows();
        }else{
          for(let cont = 0; cont <= this.selectedComponents.length; cont++){
            this.$refs.selectableTable.unselectRow(cont);
          }
        }
        this.allSelected = !this.allSelected;
      },

      convertToCsv(data){
        const headers = Object.keys(data[0]);
        const rows = data.map(obj => headers.map(header => obj[header]));
        const headerRow = headers.join(',');
        const csvRows = [headerRow, ...rows.map(row => row.join(','))];
        return csvRows.join('\n');
      },

      exportCompsToCsv(){
        const csvContent = this.convertToCsv(this.selectedComponents);
        const blob = new Blob([csvContent], {type: 'text/csv;charset=utf-8'});
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href=url;
        link.setAttribute('download', 'export_data.csv');
        link.click();
      },

      infoRemove(item, button){
        this.infoModalRemove.title = `${item.nome}: ${item.id}`
        this.infoModalRemove.content = JSON.stringify(item, item.id, 2)            
        this.selectedComp = item;
        console.log(this.selectedComp);
        this.$root.$emit('bv::show::modal', this.infoModalRemove.id, button)
      },

      removeComponent(){
        this.service = new this.$componentService();
         this.service.erase(this.selectedComp.id).then(result => alert('Componente removido ', result), err => {
          console.log(err);
         });

         this.hideModal();
      },

      hideModal() {
        this.$refs['remove-modal'].hide()
      }
    },

    computed: {
      isComponentSelected(){
        if(this.selectedComponents.length > 0){
          return true;
        }
        return false
      }
    },

    created() {
      this.populateTable();
    }
  }
</script>