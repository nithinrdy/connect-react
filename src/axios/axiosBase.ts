import axios, { AxiosInstance } from "axios";

const axiosService: AxiosInstance = axios.create({
	withCredentials: true,
});

export const axiosPrivateService: AxiosInstance = axios.create({
	withCredentials: true,
});

export default axiosService;
