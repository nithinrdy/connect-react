import { Outlet, useLocation, useNavigate } from "react-router-dom";
import useAuth from "../customHooksAndServices/authContextHook";
import jwtDecode from "jwt-decode";
import useRefreshToken from "../customHooksAndServices/refreshTokenHook";
import { useEffect, useState } from "react";
import { io } from "socket.io-client";
import { useSocket } from "../customHooksAndServices/useSocket";

interface TokenContents {
	exp: number;
	iat: number;
	username: string;
}

export default function ProtectedRoutes() {
	const { user } = useAuth();
	const [loading, setLoading] = useState(true);
	const token = user.accessToken;
	const { refreshToken } = useRefreshToken();
	const navigateTo = useNavigate();
	const decodedToken = token ? jwtDecode<TokenContents>(token) : null;
	const location = useLocation();
	const currentTime = Date.now() / 1000;
	const { socket, setSocket, socketConnected, setSocketConnected } =
		useSocket();

	useEffect(() => {
		if (!user.username || socketConnected) {
			return;
		}
		setSocket(
			io("http://localhost:5000", {
				query: {
					username: user.username,
				},
			})
		);
		setSocketConnected(true);
	}, [socket, setSocket, user.username, socketConnected, setSocketConnected]);

	useEffect(() => {
		if (decodedToken && decodedToken.exp > currentTime) {
			setTimeout(() => setLoading(false), 500); // To prevent the loading screen from flashing on the screen
		} else {
			refreshToken()
				.then((data) => {
					setTimeout(() => setLoading(false), 500);
				})
				.catch((err) => {
					setTimeout(() => setLoading(false), 500);
					console.log(err);
					navigateTo("/login", { state: { from: location }, replace: true });
				});
		}
	}, [decodedToken, currentTime, refreshToken, navigateTo, location]);

	return loading ? (
		<div className="">
			<p>Loading...</p>
		</div>
	) : (
		<Outlet />
	);
}
