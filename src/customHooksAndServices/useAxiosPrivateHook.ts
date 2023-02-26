import { axiosPrivateService } from "../axios/axiosBase";
import useAuth from "./authContextHook";
import { useEffect } from "react";
import useRefreshToken from "./refreshTokenHook";

export const useAxiosPrivateServiceWithInterceptors = () => {
	const { user, setUser } = useAuth();
	const token = user.accessToken;
	const { refreshToken } = useRefreshToken();
	useEffect(() => {
		const reqInt = axiosPrivateService.interceptors.request.use(
			(config) => {
				if (token) {
					config.headers["Authorization"] = `Bearer ${token}`;
				}
				return config;
			},
			(error) => {
				return Promise.reject(error);
			}
		);

		const resInt = axiosPrivateService.interceptors.response.use(
			(response) => {
				return response;
			},
			async (error) => {
				if (error.response.status === 401 || error.response.status === 403) {
					const prevRequest = error.config;
					if (!prevRequest.retriedAlready) {
						prevRequest.retriedAlready = true;
						const userWithRefreshedToken = await refreshToken();
						setUser(userWithRefreshedToken);
						prevRequest.headers[
							"Authorization"
						] = `Bearer ${userWithRefreshedToken.accessToken}`;
						return axiosPrivateService(prevRequest);
					}
				}
				return Promise.reject(error);
			}
		);
		return () => {
			axiosPrivateService.interceptors.request.eject(reqInt);
			axiosPrivateService.interceptors.response.eject(resInt);
		};
	});

	return axiosPrivateService;
};
