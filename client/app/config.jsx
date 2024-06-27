import axios from "axios"

const base_url = process.env.NEXT_PUBLIC_SERVER_URL;   

const instance = axios.create({
    timeout: 100000,
    baseURL: base_url,
    
  });

  export default instance;
  

