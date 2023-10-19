import api from "../../api";

export default class Service{
    constructor(){
        this.url = '/Operacao'
    }

    search(id){
        return api
        .get(`${this.url}/${id}`)
        .then(res => res.data);    
    }

    list(){
        console.log(this.url)
        return api.get(this.url).then(res => res.data, err => {
            console.log(err)
        })
    }

    update(element) {
        console.log(element.id);
        if(element.id) {
            return api.put(`${this.url}/${element.id}`, element);
        } else {
            return api.post(this.url, element).then(res => res.data, err => {
                console.log(err);
                throw new Error(err.message);
            });
        }
    }

    erase(element) {

        return api
            .delete(`${this.url}/${element.id}`)
            .then(null, err => {
                console.log(err);
                throw new Error(err.message);
            });
        
    }

    removeComponentOfTheOperation(op, compId){
        console.log(`${this.url}/RemoveComponentOp/${op}/${compId}`);
        return api.delete(`${this.url}/RemoveComponentOp/${op}/${compId}`)
        .then(result => console.log(result));
    }
}