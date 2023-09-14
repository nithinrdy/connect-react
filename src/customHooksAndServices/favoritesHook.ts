import { useAxiosPrivateServiceWithInterceptors } from "./useAxiosPrivateHook";
import useAuth from "./authContextHook";

export default function useFavorites() {
	const { user } = useAuth();
	const axiosPrivateService = useAxiosPrivateServiceWithInterceptors();
	const addFavorite = async (userToAdd: string) => {
		return axiosPrivateService("/api/favorite/add", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			data: {
				userToAdd,
			},
		})
			.then((response) => {
				return response;
			})
			.catch((error) => {
				return error;
			});
	};

	const removeFavorite = async (userToRemove: string) => {
		return axiosPrivateService("/api/favorite/remove", {
			method: "DELETE",
			headers: {
				"Content-Type": "application/json",
			},
			params: {
				userToRemove,
			},
		})
			.then((response) => {
				return response;
			})
			.catch((error) => {
				return error;
			});
	};

	const getFavorites = async () => {
		return axiosPrivateService("/api/favorite/fetch", {
			method: "GET",
			params: {
				userId: user.username,
			},
		})
			.then((response) => {
				return response;
			})
			.catch((error) => {
				return error;
			});
	};

	return { addFavorite, removeFavorite, getFavorites };
}
