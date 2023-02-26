import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import useAuth from "../customHooksAndServices/authContextHook";
import useLogin from "../customHooksAndServices/loginHook";
import { motion } from "framer-motion";
import { FaHome } from "react-icons/fa";
import { RouteTransitionVariants } from "../framerMotionVariants/generalVariants";
import "../componentSpecificStyles/loginPageStyles.css";

const EMAIL_REGEX = /^[A-z0-9._%+-]+@[A-z0-9.-]+\.[A-z]{2,4}$/;
const PWD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9]).{7,15}$/;

export default function LoginComponent() {
	const { setUser } = useAuth();
	const { login } = useLogin();
	const [loginEmail, setLoginEmail] = useState("");
	const [loginPassword, setLoginPassword] = useState("");

	const [loginEmailError, setLoginEmailError] = useState(false);
	const [loginPasswordError, setLoginPasswordError] = useState(false);
	const [requestInProgress, setRequestInProgress] = useState(false);

	useEffect(() => {
		setLoginPasswordError(false);
		setLoginEmailError(false);
		let validLoginEmail = EMAIL_REGEX.test(loginEmail);
		if (!validLoginEmail && loginEmail.length > 0) {
			setLoginEmailError(true);
		}
		let validLoginPassword = PWD_REGEX.test(loginPassword);
		if (!validLoginPassword && loginPassword.length > 0) {
			setLoginPasswordError(true);
		}
	}, [loginPassword, loginEmail]);

	const navigateTo = useNavigate();

	const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
		setRequestInProgress(true);
		e.preventDefault();
		if (loginPasswordError || loginEmailError) {
			return;
		}
		const data = await login({ email: loginEmail, password: loginPassword });
		console.log(data.data.user);
		setRequestInProgress(false);
		if (data.status === 200) {
			setUser(data.data.user);
			navigateTo("/dashboard");
		} else {
			window.alert(data.response.data);
		}
	};

	return (
		<>
			<motion.div
				className="text-white"
				variants={RouteTransitionVariants}
				initial="initial"
				animate="animate"
				exit="exit"
			>
				<Link to="/" className="top-7 left-8">
					<button className="home-button relative px-2 py-2 transition-all group">
						<FaHome className="h-10 w-10 group-hover:fill-black transition-colors" />
					</button>
				</Link>
				<main className="flex flex-col items-center">
					<div className="flex flex-col items-center w-full">
						<h1
							className="text-4xl font-bold mb-8"
							style={{ fontFamily: "Poiret One" }}
						>
							LOGIN
						</h1>
						<form
							className="flex flex-col items-center text-2xl"
							style={{ fontFamily: "Raleway" }}
							onSubmit={handleLogin}
						>
							<label htmlFor="login-email">Email</label>
							<input
								className="bg-gradient-to-r from-gray-800 to-gray-600 focus:outline-none rounded-xl p-3 mt-4 mb-8"
								type="email"
								name="email"
								id="login-email"
								value={loginEmail}
								onChange={(e) => setLoginEmail(e.target.value)}
								required
							/>
							<label htmlFor="login-password">Password</label>
							<input
								className="bg-gradient-to-r from-gray-800 to-gray-600 focus:outline-none rounded-xl p-3 mt-4 mb-8"
								type="password"
								name="password"
								id="login-password"
								value={loginPassword}
								onChange={(e) => setLoginPassword(e.target.value)}
								required
							/>
							<button
								type="submit"
								className="border-b-2 px-2 py-2 relative login-button transition-colors mb-8 hover:text-black mob:bg-white mob:text-black"
								disabled={requestInProgress}
							>
								Login
							</button>
							Don't have an account yet?
							<Link
								to="/register"
								className="mt-2 relative register-button px-2 py-2 transition-colors hover:text-black mob:border-b-2"
							>
								<button>Register</button>
							</Link>
						</form>
					</div>
				</main>
			</motion.div>
		</>
	);
}
