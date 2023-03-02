import { useEffect, useState } from "react";
import useRegister from "../customHooksAndServices/registrationHook";
import { useNavigate, Link } from "react-router-dom";
import useAuth from "../customHooksAndServices/authContextHook";
import { FaHome } from "react-icons/fa";
import { motion } from "framer-motion";
import { RouteTransitionVariants } from "../framerMotionVariants/generalVariants";
import { LoginAndRegisterPageElementVariants } from "../framerMotionVariants/loginAndRegisterVariants";
import "../componentSpecificStyles/registerStyles.css";

const USER_REGEX = /^[A-z0-9-_]{4,20}$/;
const PWD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9]).{7,15}$/;
const EMAIL_REGEX = /^[A-z0-9._%+-]+@[A-z0-9.-]+\.[A-z]{2,4}$/;

export default function RegisterComponent() {
	const { setUser } = useAuth();
	const { register } = useRegister();

	const [requestInProgress, setRequestInProgress] = useState(false);

	const [registerEmail, setRegisterEmail] = useState("");
	const [registerEmailError, setRegisterEmailError] = useState(false);
	const [registerUsername, setRegisterUsername] = useState("");
	const [registerUsernameError, setRegisterUsernameError] = useState(false);
	const [registerPassword, setRegisterPassword] = useState("");
	const [registerPasswordError, setRegisterPasswordError] = useState(false);
	const [registerNickname, setRegisterNickname] = useState("");

	useEffect(() => {
		if (EMAIL_REGEX.test(registerEmail) || registerEmail.length === 0) {
			setRegisterEmailError(false);
		} else {
			setRegisterEmailError(true);
		}
		if (USER_REGEX.test(registerUsername) || registerUsername.length === 0) {
			setRegisterUsernameError(false);
		} else {
			setRegisterUsernameError(true);
		}
		if (PWD_REGEX.test(registerPassword) || registerPassword.length === 0) {
			setRegisterPasswordError(false);
		} else {
			setRegisterPasswordError(true);
		}
	}, [registerEmail, registerUsername, registerPassword]);

	const navigateTo = useNavigate();

	const handleRegister = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		if (
			registerEmailError ||
			registerUsernameError ||
			registerPasswordError ||
			requestInProgress
		) {
			return;
		}
		setRequestInProgress(true);
		const data = await register({
			email: registerEmail,
			username: registerUsername,
			password: registerPassword,
			nickname: registerNickname,
		});

		setRequestInProgress(false);
		if (data.status === 201) {
			setUser(data.data.user);
			navigateTo("/dashboard");
		} else {
			window.alert(data.response.data);
		}
	};

	return (
		<>
			<motion.div
				variants={RouteTransitionVariants}
				className="text-white"
				initial="initial"
				animate="animate"
				exit="exit"
			>
				<Link to="/" className="top-7 left-8 fixed">
					<button className="home-button relative px-2 py-2 transition-all group">
						<FaHome className="h-10 w-10 group-hover:fill-black transition-colors" />
					</button>
				</Link>
				<main className="flex flex-col items-center">
					<div className="flex flex-col items-center w-full mt-12">
						<motion.h1
							variants={LoginAndRegisterPageElementVariants}
							className="text-4xl font-bold mb-8"
							style={{ fontFamily: "Poiret One" }}
						>
							REGISTER
						</motion.h1>
						<form
							className="flex flex-col items-center text-2xl w-full"
							style={{ fontFamily: "Raleway" }}
							onSubmit={handleRegister}
						>
							<motion.label
								variants={LoginAndRegisterPageElementVariants}
								htmlFor="register-email"
							>
								Email
							</motion.label>
							<motion.input
								variants={LoginAndRegisterPageElementVariants}
								className="bg-gradient-to-r from-gray-800 to-gray-600 focus:outline-none rounded-xl p-3 mt-4 mob:w-4/5"
								type="email"
								name="email"
								id="register-email"
								value={registerEmail}
								autoComplete="off"
								onChange={(e) => setRegisterEmail(e.target.value)}
								required
							/>
							<p
								className={`text-white text-center w-80 text-base mb-8 transition-opacity ${
									registerEmailError ? "opacity-1" : "opacity-0"
								}`}
							>
								Please enter a valid email
							</p>
							<motion.label
								variants={LoginAndRegisterPageElementVariants}
								htmlFor="username"
							>
								Username
							</motion.label>
							<motion.input
								variants={LoginAndRegisterPageElementVariants}
								className="bg-gradient-to-r from-gray-800 to-gray-600 focus:outline-none rounded-xl p-3 mt-4 mob:w-4/5"
								type="text"
								name="username"
								id="username"
								value={registerUsername}
								autoComplete="off"
								onChange={(e) => setRegisterUsername(e.target.value)}
								required
							/>
							<p
								className={`text-white text-center w-80 text-base mb-8 transition-opacity ${
									registerUsernameError ? "opacity-1" : "opacity-0"
								}`}
							>
								Username must contain alphanumeric characters and be 4 to 20
								characters long.
							</p>

							<motion.label
								variants={LoginAndRegisterPageElementVariants}
								htmlFor="register-password"
							>
								Password
							</motion.label>
							<motion.input
								variants={LoginAndRegisterPageElementVariants}
								className="bg-gradient-to-r from-gray-800 to-gray-600 focus:outline-none rounded-xl p-3 mt-4 mob:w-4/5"
								type="password"
								name="password"
								id="register-password"
								value={registerPassword}
								autoComplete="off"
								onChange={(e) => setRegisterPassword(e.target.value)}
								required
							/>
							<p
								className={`text-white text-center w-80 text-base mb-8 transition-opacity ${
									registerPasswordError ? "opacity-1" : "opacity-0"
								}`}
							>
								Password must contain a number, a capital letter, a small letter
								and must be 7 to 15 characters long
							</p>
							<motion.label
								variants={LoginAndRegisterPageElementVariants}
								htmlFor="nickname"
							>
								Nickname
							</motion.label>
							<motion.input
								variants={LoginAndRegisterPageElementVariants}
								className="bg-gradient-to-r from-gray-800 to-gray-600 focus:outline-none rounded-xl p-3 mt-4 mb-8 mob:w-4/5"
								type="text"
								name="nickname"
								id="register-nickname"
								value={registerNickname}
								onChange={(e) => setRegisterNickname(e.target.value)}
								required
							/>

							<motion.button
								variants={LoginAndRegisterPageElementVariants}
								type="submit"
								className="border-b-2 px-2 py-2 relative register-page-register-button transition-colors mb-8 hover:text-black mob:bg-white mob:text-black"
								disabled={
									requestInProgress ||
									registerEmailError ||
									registerUsernameError ||
									registerPasswordError
								}
							>
								Register
							</motion.button>
							<motion.p variants={LoginAndRegisterPageElementVariants}>
								Already have an account?
							</motion.p>
							<Link
								to="/login"
								className="mt-2 mb-8 relative register-page-login-button px-2 py-2 transition-colors hover:text-black mob:border-b-2"
							>
								<motion.button variants={LoginAndRegisterPageElementVariants}>
									Login
								</motion.button>
							</Link>
						</form>
					</div>
				</main>
			</motion.div>
		</>
	);
}
