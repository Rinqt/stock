import axios from "axios";

const instance = axios.create({
  baseURL: "https://stockapi20200306052122.azurewebsites.net/api/",
  headers: { language: "en" }
});

export default instance;
