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
  
      <b-button variant="outline-success" size="sm" 
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
        fields: ['nome', 'ncm', 'serialNumber',  'codigo', 'status'],
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
      }
    },
  
    methods: {
      onRowSelected(items) {
          this.selected = items;
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
        if (files.length === 0) {
          return;
        }
  
        var filename = files[0].name;
        var extension = filename
          .substring(filename.lastIndexOf("."))
          .toUpperCase();
  
        if (extension === ".CSV") {
          this.csvFileToJSON(files[0]);
        } else {
          alert("Selecione um arquivo CSV válido");
        }
  
        alert('Arquivo carregado')
        console.log("Carregado");
      },
  
      csvFileToJSON(file) {
        try {
          const reader = new FileReader();
          reader.readAsBinaryString(file);
          
          reader.onload = (e) => {
            var separator = ';'
            const rows = e.target.result.split("\r\n");
           
            const headers = rows[0].split(separator);
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
        } catch (e) {
          console.log(e);
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
        console.log(this.selected.length);
           if(this.selected != null){
            for(let cont = 0; cont < this.selected.length - 1; cont++){
              console.log(this.selected[cont])
              this.createComponent(this.selected[cont].name, this.selected[cont].componentCode, 
              this.selected[cont].componentNCM, this.selected[cont].datetime, this.selected[cont].status);
            }
          } 
      },

      createComponent(name, code, ncm, date, status){
          this.newComponent.nome = name;
          this.newComponent.codigo = code;
          this.newComponent.ncm = ncm;
          this.newComponent.data = date;
          this.newComponent.status = status;

          this.snGenerate();
          console.log(this.newComponent);
          this.service = new this.$componentService();
          this.service.update(this.newComponent);
        
      },

      snGenerate() {
                var serialNumber = '';
                var allowedCharts = this.allowCharts();
                for (var i = 0; i < 8; i++) {
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
  