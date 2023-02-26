import axiosService from "../axios/axiosBase";
import { loginCredentials } from "../models/credentialModels";

const login = async (credentials: loginCredentials) => {
	return axiosService("/api/auth/login", {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
		data: JSON.stringify(credentials),
	})
		.then((data) => {
			return data;
		})
		.catch((err) => {
			return err;
		});
};

export default function useLogin() {
	return { login };
}
