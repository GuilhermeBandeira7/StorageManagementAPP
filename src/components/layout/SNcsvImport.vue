<template>
    <div >
      <div>
        <b-card >
          <div class="d-flex " style="color: black; display: flex; flex-direction: column; align-items: center;">
            <label for="file_upload">Carregar CSV</label>
            <b-form-file
              id="file_upload"
              @change="upload"
              browse-text="Buscar"
              placeholder=""
              class="w-50"
              size="sm"
            >
            </b-form-file>
          </div>
        </b-card>
      </div>
  
      <b-table
        sticky-header
        id="tableImport"
        ref="selectableTable"
        class="w-100 my-3"
        small
        bordered
        selectable
        @row-selected="onRowSelected"
        :items="tableData"
        :fields="headers"
      >
      </b-table>
  
      <b-button variant="outline-success" size="sm" v-if="isCompSelected"
        class="px-3 d-flex" pill @click="sendSelectRows">Importar Arquivo
      </b-button>

      <b-button variant="outline-secondary" size="sm" @click="selectAllRows" >
          {{isAllSelected ? 'Deselecionar ' : 'Selecionar '}} Tudo
      </b-button>
  
    </div>
  </template>
  
  <script>
  
  export default {
    name: 'CsvImport',
    
    data() {
      return {
        headers: [],
        tableData: [],
        selected: [],
        isAllSelected: false,
        fields: ['nome', 'ncm', 'serialNumber',  'codigo', 'status', 'datetime'],
        newComponent: {
          nome: '',
          serialNumber:  '',
          ncm: '',
          codigo: '',
          status: ''
        }
      };
    },
  
    computed: {
      selectedData() {
        return this.selected.map(row => row);
      },

      isCompSelected(){
        if(this.selected.length > 0){
          return true;
        }
        return false;
      }
    },
  
    methods: {
      onRowSelected(items) {
        if(items !== undefined){
          this.selected = items;
        }
      },

      selectAllRows() {
          if(this.isAllSelected){
            this.$refs.selectableTable.clearSelected();
          }else{
            this.$refs.selectableTable.selectAllRows();
          }

          this.isAllSelected = !this.isAllSelected;
      },
  
      upload() {
        var files = document.getElementById("file_upload").files;
        try{
          if (files.length === 0) {
            throw new Error('No file loaded.');
          }
        }
        catch(error){
          console.log(error)
        }

  
        var filename = files[0].name;
        var extension = filename
          .substring(filename.lastIndexOf("."))
          .toUpperCase();
  
        if (extension === ".CSV") {
          this.csvFileToJSON(files[0]);
        } else {
          alert("arquivo inválido.");
          return;
        }
      },
  
      csvFileToJSON(file) {
        try {
          const reader = new FileReader();
          reader.readAsBinaryString(file);
          
          reader.onload = (e) => {
            var separator = ';'
            const rows = e.target.result.split("\r\n");
           
            const headers = rows[0].split(separator);
            console.log('Headers ',headers)
            for(let cont = 0; cont <= headers.length; cont++){
              if(headers[0] != 'name' || headers[1] != 'componentCode' || 
              headers[2] != 'componentNCM' || headers[3] != 'datetime' || headers[4] != 'status'){
                alert('Cabeçalho do arquivo CSV incorreto! FORMATO CORRETO: name componentCode componentNCM datetime status');
                throw new Error('incorrect header format.');
              }
            }
            const jsonData = [];
  
            for (let i = 1; i < rows.length; i++) {
              const cells = rows[i].split(separator);
              const rowData = {};
  
              headers.forEach((header, index) => {
                const key = header;
                rowData[key] = cells[index];
              });
  
              jsonData.push(rowData);
            }
  
            this.displayJsonToTable(jsonData);
          };
        }catch (error) {
          console.log(error);
        }
      },
  
      displayJsonToTable(jsonData) {
        if (jsonData.length > 0) {
          this.headers = Object.keys(jsonData[0]);
          this.tableData = jsonData;
        } else {
          this.headers = [];
          this.tableData = [];
        }
      },
  
      sendSelectRows() {
            console.log(this.selected);
            try{
              if(this.selected.length > 0){
                for(let cont = 0; cont < this.selected.length; cont++){
                  if(this.selected[cont].serialNumber != '' || this.selected[cont].name != '' || this.selected[cont].ncm != ''
                  ){
                    this.createComponent(this.selected[cont].name, this.selected[cont].componentCode, 
                    this.selected[cont].componentNCM, this.selected[cont].datetime, this.selected[cont].status);
                  }
                  else{
                    console.log('Erro ao criar componente: ', this.selected[cont])
                  }
                  
                }
                alert("Componente(s) criado(s) com sucesso.");
              }               
            }catch(err){
              console.log(err);
            }
      },

      createComponent(name, code, ncm, date, status){
          this.newComponent.nome = name;
          this.newComponent.codigo = code;
          this.newComponent.ncm = ncm;
          this.newComponent.data = date;
          this.newComponent.status = status;


          this.snGenerate();
          if(this.newComponent.ncm !== undefined ){
            this.service = new this.$componentService();
            this.service.update(this.newComponent);
          }
        
      },

      snGenerate() {
                var serialNumber = '';
                var allowedCharts = this.allowCharts();
                for (var i = 1; i < 8; i++) {
                    serialNumber += this.allowCharts()[Math.floor(Math.random() * allowedCharts.length)];
                }
                this.newComponent.serialNumber = serialNumber;
      },

      allowCharts() {
                var chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
                return chars.match(/[A-Za-z0-9]/g);
      },

    },
  };
  </script>
  
  <style>
    #tableImport:hover {
      background-color: transparent;
    }
  </style>
  