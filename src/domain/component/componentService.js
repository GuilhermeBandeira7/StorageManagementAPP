import api from "../../api";

export default class Service{
    constructor(){
        this.url = '/Componente'
    }

    async search(id){
        const res = await api
            .get(`${this.url}/${id}`);
        return res.data;    
    }

    list(){
        return api.get(this.url).then(res => res.data, err => {
            console.log(err)
        })
    }

    listComponentsWithoutOperation(){
        console.log(`${this.url}/ReturnComponents`);
        return api.get(`${this.url}/ReturnComponents`)
        .then(res => res.data, err => console.log(err))
    }

    update(element) {
        if(element.id) {
            return api.put(`${this.url}/${element.id}`, element);
        } else{
            if(element != null) {
                //console.log(JSON.stringify(element));
                return api.post(`${this.url}/`, element).then(res => res.data, err => {
                    //alert("Erro ao adicionar componente.");
                    console.log(err);
                });
            }
        }
    }

    erase(id) {
        console.log('ERASE');
        console.log(`${this.url}/${id}`)
        return api
            .delete(`${this.url}/${id}`)
            .then(null, err => {
                console.log(err);
                throw new Error(err.message);
            });
        
    }
}