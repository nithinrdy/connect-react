import { useEffect, useState } from "react";
import useRegister from "../customHooksAndServices/registrationHook";

import "../index.css";
import { useNavigate, Link } from "react-router-dom";
import useAuth from "../customHooksAndServices/authContextHook";
import { FaArrowLeft } from "react-icons/fa";

const USER_REGEX = /^[A-z][A-z0-9-_]{4,20}$/;
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
		if (EMAIL_REGEX.test(registerEmail) && registerEmail.length > 0) {
			setRegisterEmailError(false);
		} else {
			setRegisterEmailError(true);
		}
		if (USER_REGEX.test(registerUsername) && registerUsername.length > 0) {
			setRegisterUsernameError(false);
		} else {
			setRegisterUsernameError(true);
		}
		if (PWD_REGEX.test(registerPassword) && registerPassword.length > 0) {
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
			<Link to="/" className="">
				<FaArrowLeft className="" />
				<span className="">Back to the Landing Page</span>
			</Link>
			<main className="">
				<div className="">
					<div className="">
						<h1 className="">REGISTER</h1>
						<form className="" onSubmit={handleRegister}>
							<div className="">
								<label htmlFor="register-email">Email</label>
								<input
									type="email"
									name="email"
									id="register-email"
									value={registerEmail}
									autoComplete="off"
									onChange={(e) => setRegisterEmail(e.target.value)}
									required
								/>
								<label htmlFor="username">Username</label>
								<input
									type="text"
									name="username"
									id="username"
									value={registerUsername}
									autoComplete="off"
									onChange={(e) => setRegisterUsername(e.target.value)}
									required
								/>
								<label htmlFor="nickname">Nickname</label>
								<input
									type="text"
									name="nickname"
									id="register-nickname"
									value={registerNickname}
									onChange={(e) => setRegisterNickname(e.target.value)}
									required
								/>
								<label htmlFor="register-password">Password</label>
								<input
									type="password"
									name="password"
									id="register-password"
									value={registerPassword}
									autoComplete="off"
									onChange={(e) => setRegisterPassword(e.target.value)}
									required
								/>

								<br />
							</div>
							<div className="">
								<button
									type="submit"
									className=""
									disabled={
										requestInProgress ||
										registerEmailError ||
										registerUsernameError ||
										registerPasswordError
									}
								>
									Register
								</button>
								<Link to="/login" className="">
									Already have an account? Login
								</Link>
							</div>
						</form>
					</div>
				</div>
			</main>
		</>
	);
}
