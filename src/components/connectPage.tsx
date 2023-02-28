import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
	RouteTransitionVariants,
	ConstituentPageElementsVariants,
} from "../framerMotionVariants/generalVariants";
import "../componentSpecificStyles/connectStyles.css";
import useSocket from "../customHooksAndServices/useSocket";
import useAuth from "../customHooksAndServices/authContextHook";
import { FaPhone } from "react-icons/fa";

const USER_REGEX = /^[A-z0-9-_]{4,20}$/;

export default function ConnectPage() {
	const { socket } = useSocket();
	const { user } = useAuth();
	const [usernameToCall, setUsername] = useState("");
	const [usernameError, setUsernameError] = useState(false);
	const [requestInProgress, setRequestInProgress] = useState(false);
	const [videoPermission, setVideoPermission] = useState<boolean | null>(null);
	const [localStream, setLocalStream] = useState<MediaStream>();
	const [userIsNotOnline, setUserIsNotOnline] = useState(false);

	const videoRef = React.useRef<HTMLVideoElement>(null);

	useEffect(() => {
		navigator.mediaDevices
			.getUserMedia({ video: true, audio: true })
			.then((stream) => {
				setLocalStream(stream);
				videoRef.current!.srcObject = stream;
				videoRef
					.current!.play()
					.then(() => {
						videoRef.current!.muted = true;
					})
					.catch((err) => {
						console.log(err);
					});
				setVideoPermission(true);
			})
			.catch((err) => {
				console.log(err);
				setVideoPermission(false);
			});
		socket.on("incomingCall", (data) => {
			console.log("call", data);
		});
		socket.on("callAccepted", (data) => {});
		socket.on("callRejected", (data) => {});
		socket.on("notOnline", (data) => {
			setRequestInProgress(false);
			setUserIsNotOnline(true);
			setTimeout(() => setUserIsNotOnline(false), 2500);
		});
	}, [socket]);

	useEffect(() => {
		if (USER_REGEX.test(usernameToCall) || usernameToCall.length === 0) {
			setUsernameError(false);
		} else {
			setUsernameError(true);
		}
	}, [usernameToCall]);

	const handleStart = (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		if (usernameError || requestInProgress) {
			return;
		}
		socket.emit("call", {
			userToCall: usernameToCall,
			from: user.username,
			message: "Hello",
		});
	};
	return (
		<motion.div
			className="text-white"
			variants={RouteTransitionVariants}
			initial="initial"
			animate="animate"
			exit="exit"
		>
			<main
				className="flex flex-col items-center"
				style={{ fontFamily: "Raleway" }}
			>
				{videoPermission === null && (
					<div className="flex flex-col items-center w-4/5 text-center mt-32 mob:mt-32">
						<motion.label
							className="text-4xl"
							variants={ConstituentPageElementsVariants}
							htmlFor="username"
						>
							Checking for camera and microphone permissions...
						</motion.label>
					</div>
				)}
				{videoPermission === false && (
					<div className="flex flex-col items-center w-4/5 mt-32 text-center mob:mt-32">
						<motion.label
							className="text-4xl"
							variants={ConstituentPageElementsVariants}
							htmlFor="username"
						>
							Your media device could not be accessed.
							<br className="mt-8 block" />
							<span className="text-2xl">
								If you have disabled camera and microphone permissions, please
								enable them to use this feature.
							</span>
						</motion.label>
					</div>
				)}

				<div className="flex flex-col items-center w-full mt-12 mob:mt-32">
					{videoPermission && (
						<motion.div
							className="flex flex-col items-center w-4/5 text-2xl text-center mb-80"
							variants={ConstituentPageElementsVariants}
						>
							Looking good! You can now start a call.
						</motion.div>
					)}
					<motion.video
						ref={videoRef}
						id="localVideo"
						className="w-96 mob:w-80 fixed mt-16 mob:mt-24 rounded-3xl"
						muted
						variants={ConstituentPageElementsVariants}
					></motion.video>
					{videoPermission && (
						<form
							className="flex flex-col items-center text-2xl mt-8"
							style={{ fontFamily: "Raleway" }}
							onSubmit={(e) => handleStart(e)}
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
								value={usernameToCall}
								onChange={(e) => setUsername(e.target.value)}
								required
							/>
							<p
								className={`text-white text-center w-80 text-base mb-1 transition-opacity ${
									usernameError ? "opacity-1" : "opacity-0"
								}`}
							>
								Username must be alphanumeric and be between 4 and 20 characters
								long.
							</p>
							<p
								className={`text-white text-center w-80 text-base mb-4 transition-opacity ${
									userIsNotOnline ? "opacity-1" : "opacity-0"
								}`}
							>
								User is not online.
							</p>

							<motion.button
								variants={ConstituentPageElementsVariants}
								type="submit"
								className="px-2 py-2 relative connect-page-start-button transition-colors mb-8 hover:text-black after:rounded-full after:origin-center"
								disabled={requestInProgress || usernameError}
							>
								<FaPhone className="text-4xl" />
							</motion.button>
						</form>
					)}
				</div>
			</main>
		</motion.div>
	);
}
