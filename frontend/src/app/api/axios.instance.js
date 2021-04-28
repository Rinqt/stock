import axios from "axios";

const instance = axios.create({
  baseURL: "LINK TO API",
  headers: { language: "en" },
});

export default instance;
