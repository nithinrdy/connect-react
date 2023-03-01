import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
	RouteTransitionVariants,
	ConstituentPageElementsVariants,
} from "../framerMotionVariants/generalVariants";
import "../componentSpecificStyles/connectStyles.css";
import useSocket from "../customHooksAndServices/useSocket";
import useAuth from "../customHooksAndServices/authContextHook";
import { FaPhone, FaTimes, FaVolumeMute, FaStar } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import useFavorites from "../customHooksAndServices/favoritesHook";

const USER_REGEX = /^[A-z0-9-_]{4,20}$/;

export default function ConnectPage() {
	const {
		socket,
		peerConnection,
		setPeerConnection,
		servers,
		localStream,
		videoPermission,
		initiateCall,
		setAcceptedOnce,
		userIsNotOnline,
		requestInProgress,
		setRequestInProgress,
		incomingCaller,
		setIncomingCaller,
	} = useSocket();
	const { user } = useAuth();
	const { addFavorite } = useFavorites();
	const [usernameToCall, setUsernameToCall] = useState("");
	const [usernameError, setUsernameError] = useState(false);
	const [callInProgress, setCallInProgress] = useState(false);
	const [caller, setCaller] = useState<string | null>(null);
	const [callReceived, setCallReceived] = useState(false);
	const [otherPerson, setOtherPerson] = useState<string | null>(null);

	const navigate = useNavigate();

	const localVideoRef = React.useRef<HTMLVideoElement>(null);
	const remoteVideoRef = React.useRef<HTMLVideoElement>(null);

	useEffect(() => {
		localVideoRef.current!.srcObject = localStream;
		localVideoRef.current!.play().then(() => {
			if (incomingCaller) {
				if (socket) {
					socket.emit("acceptCall", { caller: incomingCaller });
					setOtherPerson(incomingCaller);
					setIncomingCaller("");
				}
			}
		});
		peerConnection.ontrack = (e) => {
			remoteVideoRef.current!.srcObject = e.streams[0];
			setCallInProgress(true);
		};
	}, [localStream, peerConnection, incomingCaller, socket, setIncomingCaller]);

	useEffect(() => {
		if (USER_REGEX.test(usernameToCall) || usernameToCall.length === 0) {
			setUsernameError(false);
		} else {
			setUsernameError(true);
		}
	}, [usernameToCall]);

	useEffect(() => {
		if (!socket) {
			return;
		}
		socket.on("incomingOffer", (data) => {
			const { caller, sdp, type } = data;
			setCaller(caller);
			setCallReceived(true);
			peerConnection.onicecandidate = (e) => {
				if (e.candidate) {
					socket.emit("sendCandidate", {
						to: caller,
						candidate: e.candidate,
					});
				}
			};

			if (peerConnection.currentRemoteDescription) {
				return;
			}

			peerConnection.setRemoteDescription(
				new RTCSessionDescription({ sdp, type })
			);
			peerConnection
				.createAnswer()
				.then((answer) => {
					peerConnection.setLocalDescription(answer);
					socket.emit("sendAnswer", {
						to: caller,
						sdp: answer.sdp,
						type: answer.type,
					});
					socket.on("incomingCandidate", (data) => {
						if (
							peerConnection.currentRemoteDescription &&
							peerConnection.currentLocalDescription
						) {
							peerConnection.addIceCandidate(new RTCIceCandidate(data));
						}
					});
				})
				.catch(() => {
					console.log("createAnswer error");
				});
		});

		socket.on("endCall", () => {
			setCallInProgress(false);
			peerConnection.onicecandidate = null;
			setPeerConnection(new RTCPeerConnection(servers));
			setAcceptedOnce(false);
			navigate("/call-ended");
		});
	}, [
		socket,
		navigate,
		peerConnection,
		setPeerConnection,
		servers,
		setAcceptedOnce,
	]);

	const startCall = () => {
		initiateCall(usernameToCall, user);
	};

	const handleStart = (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		if (
			usernameError ||
			requestInProgress ||
			callInProgress ||
			requestInProgress ||
			usernameToCall === user.username ||
			!socket
		) {
			return;
		}
		setRequestInProgress(true);

		socket.emit("startCall", {
			otherEnd: usernameToCall,
			caller: user.username,
		});
		socket.on("callAccepted", () => {
			startCall();
			setCallInProgress(true);
			setRequestInProgress(false);
			setOtherPerson(usernameToCall);
		});
		socket.on("callRejected", () => {
			setCallInProgress(false);
			setRequestInProgress(false);
			window.alert("Call rejected");
		});
	};

	const endCall = () => {
		if (!socket) {
			return;
		}
		setCallInProgress(false);
		peerConnection.onicecandidate = null;
		setPeerConnection(new RTCPeerConnection(servers));
		setAcceptedOnce(false);
		socket.emit("endOtherEnd", {
			otherEnd: callReceived ? caller : usernameToCall,
		});
		navigate("/call-ended");
	};

	const favoriteUser = () => {
		if (otherPerson) {
			addFavorite(otherPerson)
				.then((res) => {
					if (res.status === 201) {
						window.alert("Added to favorites");
					} else {
						window.alert(res.data);
					}
				})
				.catch((err) => {
					console.log(err);
					window.alert("Something went wrong");
				});
		}
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
				className="flex flex-col items-center w-screen min-h-screen m-0 p-0"
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

				<div className="flex flex-col items-center w-full h-full pt-12 mob:pt-32">
					{videoPermission && !callInProgress && (
						<motion.div
							className={`flex flex-col items-center w-4/5 text-2xl text-center mb-8 ${
								callInProgress || requestInProgress ? "hidden" : ""
							}`}
							variants={ConstituentPageElementsVariants}
						>
							Looking good! You can now start a call.
						</motion.div>
					)}
					<div
						className={`bg-gradient-to-tr from-gray-700 to-gray-400 mt-24 mob:mt-24 relative flex justify-center items-center rounded-full animate-ping wide:origin-center mob:mb-40 ${
							requestInProgress
								? "wide:absolute w-5/12 wide:w-64 wide:h-64 max-w-3xl transition-transform"
								: "hidden"
						}`}
					>
						<FaPhone className="w-40 h-40 wide:absolute mob:mb-16 mob:mt-16"></FaPhone>
					</div>
					<motion.video
						style={{ rotateY: "180deg" }}
						ref={remoteVideoRef}
						id="remoteVideo"
						autoPlay
						className={`w-96 mt-16 mob:mt-24 rounded-3xl  ${
							callInProgress
								? "wide:absolute w-11/12 max-w-3xl transition-transform wide:justify-self-center mob:mt-4"
								: "hidden"
						}`}
						variants={ConstituentPageElementsVariants}
					></motion.video>
					<motion.video
						style={{ rotateY: "180deg" }}
						ref={localVideoRef}
						id="localVideo"
						autoPlay
						className={`w-96 mob:w-80 mt-16 mob:mt-24 rounded-3xl transition-transform ${
							callInProgress || requestInProgress
								? "wide:absolute wide:right-8 wide:bottom-8 z-10 w-48 mob:w-11/12 mob:relative mob:mt-4"
								: ""
						}`}
						muted
						variants={ConstituentPageElementsVariants}
					></motion.video>
					{callInProgress && (
						<div className="flex flex-row justify-center mt--4 z-20 mb-8">
							<motion.button
								className="bg-gradient-to-tr from-gray-700 to-yellow-300 text-3xl mob:text-6xl focus:outline-none rounded-2xl p-3 mt-1 mob:mt-8 ml-4 mr-4"
								variants={ConstituentPageElementsVariants}
								onClick={favoriteUser}
							>
								<FaStar />
							</motion.button>
							<motion.button
								className="bg-gradient-to-tr from-gray-700 to-gray-400 text-3xl mob:text-6xl focus:outline-none rounded-2xl p-3 mt-1 mob:mt-8 ml-4 mr-4"
								variants={ConstituentPageElementsVariants}
								onClick={() => {
									localStream &&
										(localStream.getAudioTracks()[0].enabled =
											!localStream.getAudioTracks()[0].enabled);
								}}
							>
								<FaVolumeMute />
							</motion.button>
							<motion.button
								className="bg-gradient-to-tr from-gray-700 to-red-400 text-3xl mob:text-6xl focus:outline-none rounded-2xl p-3 mt-1 mob:mt-8 ml-4 mr-4"
								variants={ConstituentPageElementsVariants}
								onClick={endCall}
							>
								<FaTimes />
							</motion.button>
						</div>
					)}
					{videoPermission && (
						<form
							className={`flex flex-col items-center text-2xl mt-8 ${
								callInProgress || requestInProgress ? "hidden" : ""
							}`}
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
								onChange={(e) => setUsernameToCall(e.target.value)}
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
