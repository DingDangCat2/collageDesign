import axios from 'axios';
export default function Ajax(url,data={},type){
    if(type==='GET'){
 return axios.get(url, {
        params: data
      });
    }else{
       return axios({
         headers: {
            'Content-Type':'application/json'
        },
         method: 'post',
         url: url,
         data: data
       });
    }
}
