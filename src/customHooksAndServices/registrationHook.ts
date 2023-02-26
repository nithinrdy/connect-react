import axiosService from "../axios/axiosBase";
import { registerCredentials } from "../models/credentialModels";

const register = async (credentials: registerCredentials) => {
	return axiosService("/api/auth/register", {
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

export default function useRegister() {
	return { register };
}
