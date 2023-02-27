import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
	RouteTransitionVariants,
	ConstituentPageElementsVariants,
} from "../framerMotionVariants/generalVariants";
import "../componentSpecificStyles/connectStyles.css";

const USER_REGEX = /^[A-z0-9-_]{4,20}$/;

export default function ConnectPage() {
	const [username, setUsername] = useState("");
	const [usernameError, setUsernameError] = useState(false);
	const [requestInProgress, setRequestInProgress] = useState(false);

	useEffect(() => {
		if (USER_REGEX.test(username) || username.length === 0) {
			setUsernameError(false);
		} else {
			setUsernameError(true);
		}
	}, [username]);

	const handleStart = () => {
		if (usernameError || requestInProgress) {
			return;
		}
		setRequestInProgress(true);
	};
	return (
		<motion.div
			className="text-white"
			variants={RouteTransitionVariants}
			initial="initial"
			animate="animate"
			exit="exit"
		>
			<main className="flex flex-col items-center">
				<div className="flex flex-col items-center w-full mt-12 mob:mt-32">
					<form
						className="flex flex-col items-center text-2xl"
						style={{ fontFamily: "Raleway" }}
						onSubmit={handleStart}
					>
						<motion.label
							className="text-4xl"
							variants={ConstituentPageElementsVariants}
							htmlFor="username"
						>
							Enter username to call
						</motion.label>
						<motion.input
							variants={ConstituentPageElementsVariants}
							className="bg-gradient-to-r from-gray-800 to-gray-600 focus:outline-none rounded-xl p-3 mt-4"
							type="text"
							name="username"
							id="username"
							value={username}
							onChange={(e) => setUsername(e.target.value)}
							required
						/>
						<p
							className={`text-white text-center w-80 text-base mb-8 transition-opacity opacity-${
								usernameError ? "1" : "0"
							}`}
						>
							Username must be alphanumeric and be between 4 and 20 characters
							long.
						</p>

						<motion.button
							variants={ConstituentPageElementsVariants}
							type="submit"
							className="border-b-2 px-2 py-2 relative connect-page-start-button transition-colors mb-8 hover:text-black mob:bg-white mob:text-black"
							disabled={requestInProgress || usernameError}
						>
							Start
						</motion.button>
					</form>
				</div>
			</main>
		</motion.div>
	);
}
