import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import useAuth from "../customHooksAndServices/authContextHook";
import useLogin from "../customHooksAndServices/loginHook";
import { motion } from "framer-motion";
import { FaHome } from "react-icons/fa";
import { RouteTransitionVariants } from "../framerMotionVariants/generalVariants";
import "../componentSpecificStyles/loginStyles.css";
import { LoginAndRegisterPageElementVariants } from "../framerMotionVariants/loginAndRegisterVariants";

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
						<motion.h1
							variants={LoginAndRegisterPageElementVariants}
							className="text-4xl font-bold mb-8"
							style={{ fontFamily: "Poiret One" }}
						>
							LOGIN
						</motion.h1>
						<form
							className="flex flex-col items-center text-2xl"
							style={{ fontFamily: "Raleway" }}
							onSubmit={handleLogin}
						>
							<motion.label
								variants={LoginAndRegisterPageElementVariants}
								htmlFor="login-email"
							>
								Email
							</motion.label>
							<motion.input
								variants={LoginAndRegisterPageElementVariants}
								className="bg-gradient-to-r from-gray-800 to-gray-600 focus:outline-none rounded-xl p-3 mt-4"
								type="email"
								name="email"
								id="login-email"
								value={loginEmail}
								onChange={(e) => setLoginEmail(e.target.value)}
								required
							/>
							<p
								className={`text-white text-center w-80 text-base mb-8 transition-opacity opacity-${
									loginEmailError ? "1" : "0"
								}`}
							>
								Please enter a valid email
							</p>
							<motion.label
								variants={LoginAndRegisterPageElementVariants}
								htmlFor="login-password"
							>
								Password
							</motion.label>
							<motion.input
								variants={LoginAndRegisterPageElementVariants}
								className="bg-gradient-to-r from-gray-800 to-gray-600 focus:outline-none rounded-xl p-3 mt-4"
								type="password"
								name="password"
								id="login-password"
								value={loginPassword}
								onChange={(e) => setLoginPassword(e.target.value)}
								required
							/>
							<p
								className={`text-white text-center w-80 text-base mb-8 transition-opacity opacity-${
									loginPasswordError ? "1" : "0"
								}`}
							>
								Password must contain a number, a capital letter, a small letter
								and must be between 7 and 15 characters long
							</p>
							<motion.button
								variants={LoginAndRegisterPageElementVariants}
								type="submit"
								className="border-b-2 px-2 py-2 relative login-button transition-colors mb-8 hover:text-black mob:bg-white mob:text-black"
								disabled={
									requestInProgress || loginEmailError || loginPasswordError
								}
							>
								Login
							</motion.button>
							<motion.p variants={LoginAndRegisterPageElementVariants}>
								Don't have an account yet?
							</motion.p>
							<Link
								to="/register"
								className="mt-2 relative register-button px-2 py-2 transition-colors hover:text-black mob:border-b-2"
							>
								<motion.button variants={LoginAndRegisterPageElementVariants}>
									Register
								</motion.button>
							</Link>
						</form>
					</div>
				</main>
			</motion.div>
		</>
	);
}
