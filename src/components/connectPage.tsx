import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
	RouteTransitionVariants,
	ConstituentPageElementsVariants,
} from "../framerMotionVariants/generalVariants";
import "../componentSpecificStyles/connectStyles.css";
import useSocket from "../customHooksAndServices/useSocket";
import useAuth from "../customHooksAndServices/authContextHook";
import { FaPhone, FaTimes, FaVolumeMute } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const USER_REGEX = /^[A-z0-9-_]{4,20}$/;

const servers = {
	iceServers: [
		{
			urls: ["stun:stun1.l.google.com:19302", "stun:stun2.l.google.com:19302"],
		},
	],
	iceCandidatePoolSize: 10,
};
const pc = new RTCPeerConnection(servers);
let localStream = new MediaStream();

export default function ConnectPage() {
	const { socket } = useSocket();
	const { user } = useAuth();
	const [usernameToCall, setUsernameToCall] = useState("");
	const [usernameError, setUsernameError] = useState(false);
	const [requestInProgress, setRequestInProgress] = useState(false);
	const [callInProgress, setCallInProgress] = useState(false);
	const [videoPermission, setVideoPermission] = useState<boolean | null>(null);
	const [userIsNotOnline, setUserIsNotOnline] = useState(false);
	const [caller, setCaller] = useState<string | null>(null);
	const [callReceived, setCallReceived] = useState(false);
	const [acceptedOnce, setAcceptedOnce] = useState(false);

	const navigate = useNavigate();

	const localVideoRef = React.useRef<HTMLVideoElement>(null);
	const remoteVideoRef = React.useRef<HTMLVideoElement>(null);

	useEffect(() => {
		navigator.mediaDevices
			.getUserMedia({ video: true, audio: true })
			.then((stream) => {
				localStream = stream;
				localVideoRef.current!.srcObject = stream;
				localVideoRef
					.current!.play()
					.then(() => {
						localVideoRef.current!.muted = true;
					})
					.catch((err) => {
						console.log(err);
					});
				setVideoPermission(true);
				stream.getTracks().forEach((track) => {
					pc.addTrack(track, localStream);
				});
				pc.ontrack = (e) => {
					remoteVideoRef.current!.srcObject = e.streams[0];
					setCallInProgress(true);
				};
			})
			.catch((err) => {
				console.log(err);
				setVideoPermission(false);
			});
	}, []);

	useEffect(() => {
		if (USER_REGEX.test(usernameToCall) || usernameToCall.length === 0) {
			setUsernameError(false);
		} else {
			setUsernameError(true);
		}
	}, [usernameToCall]);

	useEffect(() => {
		socket.off("incomingCall");
		socket.on("incomingCall", (data) => {
			if (acceptedOnce) {
				socket.emit("acceptCall", { caller: data.caller });
				setAcceptedOnce(false);
				return;
			}
			console.log(data);
			window.confirm("Incoming call from " + data.caller + ". Accept?")
				? socket.emit("acceptCall", { caller: data.caller }) &&
				  setAcceptedOnce(true)
				: socket.emit("rejectCall", { caller: data.caller });
		});
		socket.on("incomingOffer", (data) => {
			const { caller, sdp, type } = data;
			setCaller(caller);
			setCallReceived(true);
			pc.onicecandidate = (e) => {
				if (e.candidate) {
					socket.emit("sendCandidate", {
						to: caller,
						candidate: e.candidate,
					});
				}
			};

			if (pc.currentRemoteDescription) {
				return;
			}

			pc.setRemoteDescription(new RTCSessionDescription({ sdp, type }));
			pc.createAnswer()
				.then((answer) => {
					pc.setLocalDescription(answer);
					socket.emit("sendAnswer", {
						to: caller,
						sdp: answer.sdp,
						type: answer.type,
					});
					socket.on("incomingCandidate", (data) => {
						if (pc.currentRemoteDescription && pc.currentLocalDescription) {
							pc.addIceCandidate(new RTCIceCandidate(data));
						}
					});
				})
				.catch(() => {
					console.log("createAnswer error");
				});
		});

		socket.on("endCall", () => {
			setCallInProgress(false);
			pc.close();
			pc.onicecandidate = null;
			navigate("/call-ended");
		});
	}, [socket, navigate, acceptedOnce]);

	const startCall = () => {
		pc.onicecandidate = (e) => {
			if (e && e.candidate) {
				socket.emit("sendCandidate", {
					to: usernameToCall,
					candidate: e.candidate,
				});
			}
		};

		if (pc.currentLocalDescription) {
			return;
		}

		pc.createOffer().then((offer) => {
			pc.setLocalDescription(offer);
			socket.emit("sendOffer", {
				callee: usernameToCall,
				caller: user.username,
				sdp: offer.sdp,
				type: offer.type,
			});
			socket.on("incomingAnswer", (data) => {
				const { sdp, type } = data;
				if (pc.currentRemoteDescription) {
					return;
				}
				pc.setRemoteDescription(new RTCSessionDescription({ sdp, type }));
			});
			socket.on("incomingCandidate", (data) => {
				if (pc.currentRemoteDescription && pc.currentLocalDescription) {
					pc.addIceCandidate(new RTCIceCandidate(data));
				}
			});
		});
	};

	const handleStart = (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		if (
			usernameError ||
			requestInProgress ||
			callInProgress ||
			requestInProgress ||
			usernameToCall === user.username
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
		});
		socket.on("callRejected", () => {
			setCallInProgress(false);
			setRequestInProgress(false);
			window.alert("Call rejected");
		});
	};

	const endCall = () => {
		setCallInProgress(false);
		pc.close();
		pc.onicecandidate = null;
		socket.emit("endOtherEnd", {
			otherEnd: callReceived ? caller : usernameToCall,
		});
		navigate("/call-ended");
	};

	useEffect(() => {
		socket.on("notOnline", (data) => {
			setRequestInProgress(false);
			setUserIsNotOnline(true);
			setTimeout(() => setUserIsNotOnline(false), 2500);
		});
	}, [socket]);

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
								callInProgress ? "hidden" : ""
							}`}
							variants={ConstituentPageElementsVariants}
						>
							Looking good! You can now start a call.
						</motion.div>
					)}
					<motion.video
						ref={remoteVideoRef}
						id="remoteVideo"
						autoPlay
						className={`w-96 mt-16 mob:mt-24 rounded-3xl ${
							callInProgress
								? "wide:absolute w-11/12 max-w-3xl wide:justify-self-center mob:mt-4"
								: "hidden"
						}`}
						variants={ConstituentPageElementsVariants}
					></motion.video>
					<motion.video
						ref={localVideoRef}
						id="localVideo"
						autoPlay
						className={`w-96 mob:w-80 mt-16 mob:mt-24 rounded-3xl ${
							callInProgress
								? "wide:absolute wide:right-8 wide:bottom-8 z-10 w-48 mob:w-11/12 mob:relative mob:mt-4"
								: ""
						}`}
						muted
						variants={ConstituentPageElementsVariants}
					></motion.video>
					{callInProgress && (
						<div className="flex flex-row justify-center">
							<motion.button
								className="bg-gradient-to-tr from-gray-700 to-gray-400 text-2xl focus:outline-none rounded-xl p-4 mt-1 mob:mt-8 ml-4 mr-4"
								variants={ConstituentPageElementsVariants}
								onClick={() => {
									if (localVideoRef.current) {
										localVideoRef.current.muted = !localVideoRef.current.muted;
									}
								}}
							>
								<FaVolumeMute />
							</motion.button>
							<motion.button
								className="bg-gradient-to-tr from-gray-700 to-gray-400 text-2xl focus:outline-none rounded-xl p-4 mt-1 mob:mt-8 ml-4 mr-4"
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
								callInProgress ? "hidden" : ""
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
