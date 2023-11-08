<template>
  <div>
    <h3>COMPONENTES</h3>
    <!-- DROPDOWN CRUD COMPONENTES -->
    <component-card @criacao-componente="createComponent"></component-card>
    <b-input v-model="filter" placeholder="Filtrar tabela..."></b-input>
    <!-- TABELA COMPONENTES DO BANCO DE DADOS -->
    <b-table striped hover :items="items" :fields="fields" :filter="filter">
      <template #cell(actions)="row">
        <b-button size="sm" @click="info(row.item, row.index, $event.target, 'editar')" class="mr-1" variant="primary" style="margin-right: 1rem;">
          Editar
        </b-button>
        <!-- <b-button size="sm" @click="info(row.item, row.index, $event.target,  'remover')" class="mr-1" variant="danger">
          Remover
        </b-button> -->
      </template>
    </b-table>

    <b-modal :id="infoModal.id" :title="infoModal.title" hide-footer>
      <action-componente :componenteId="selectedRowCompId" @componente-alterado="setAlteredComponent"></action-componente>
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
        fields: ['id','nome', 'ncm', 'serialNumber',  'codigo', 'status', 'actions'],
        filter: '',
        selected: [],
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
          status: ''
        }
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
          console.log(result);
          if(result != null){
            this.items = result;
          }
         })
      },
      createComponent(novoComponente){
        console.log(JSON.stringify(novoComponente));
        this.service = new this.$componentService();
        this.service.update(novoComponente).then(result => result != null ?
        alert('Componente criado com sucesso.') : alert('Erro ao criar componente.'));

      },

      submitChanges(){
         this.service = new this.$componentService();
         console.log(this.alteredComp);
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
      }
    },

    created() {
      this.populateTable();
    }
  }
</script>