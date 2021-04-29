import axios from "axios";

const instance = axios.create({
	baseURL: "https://stockapi29042021.azurewebsites.net/api/",
	headers: { language: "en" },
});

export default instance;
