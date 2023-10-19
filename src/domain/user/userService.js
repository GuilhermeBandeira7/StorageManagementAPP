import api from "../../api";

export default class Service{
    constructor(){
        this.url = '/Usuario'
    }

    search(id){
        return api
        .get(`${this.url}/${id}`)
        .then(res => res.data);    
    }

    async searchByUsernamePassword(username, password){
        return api
        .get(`${this.url}/${'UserPassword'}/${username}/${password}`)
        .then(res => res.data); 
    }

    list(){
        return api.get(this.url).then(res => res.data, err => {
            console.log(err)
        })
    }

    update(element) {
        console.log(this.url);
        console.log(JSON.stringify(element));
        if(element.id) {
            return api.put(`${this.url}/${element.id}`, element);
        } else {
            return api.post(`${this.url}`, element).then(res => res.data, res => console.log('Usuário criado com sucesso ', res), err => {
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
}