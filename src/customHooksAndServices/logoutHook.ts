import axiosService from "../axios/axiosBase";

const logout = async () => {
	return axiosService("/api/auth/logout", {
		method: "GET",
		headers: {
			"Content-Type": "application/json",
		},
		withCredentials: true,
	})
		.then((data) => {
			return data;
		})
		.catch((err) => {
			return err;
		});
};

export default function useLogout() {
	return { logout };
}
