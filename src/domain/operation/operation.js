export default class operation{
    constructor(){
        this.id = 0,
        this.observacao = '',
        this.tipo = '',
        this.descricao = '',
        this.data = new Date().toLocaleString().replace(',', ' '),
        this.notaFiscal = '',
        this.status = 0,
        this.componentes = []
    }
}