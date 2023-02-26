import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import useAuth from "../customHooksAndServices/authContextHook";
import useLogin from "../customHooksAndServices/loginHook";
import { FaArrowLeft } from "react-icons/fa";

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
			<Link to="/" className="">
				<FaArrowLeft className="" />
				<span className="">Back to the Landing Page</span>
			</Link>
			<main className="">
				<div className="">
					<div className="">
						<h1 className="">LOGIN</h1>
						<form className="" onSubmit={handleLogin}>
							<label htmlFor="login-email">Email</label>
							<input
								type=""
								name="email"
								id="login-email"
								value={loginEmail}
								onChange={(e) => setLoginEmail(e.target.value)}
								required
							/>
							<label htmlFor="login-password">Password</label>
							<input
								type=""
								name="password"
								id="login-password"
								value={loginPassword}
								onChange={(e) => setLoginPassword(e.target.value)}
								required
							/>
							<button type="submit" className="" disabled={requestInProgress}>
								Login
							</button>
							<Link to="/register" className="">
								Don't have an account yet? Register
							</Link>
						</form>
					</div>
				</div>
			</main>
		</>
	);
}
