import {
	createContext,
	Dispatch,
	ReactNode,
	SetStateAction,
	useEffect,
	useState,
	useRef,
} from "react";
import { Socket, io } from "socket.io-client";
import { useNavigate } from "react-router-dom";
import { UserInfo } from "../models/userInfoModel";

interface SocketContextType {
	socket: Socket;
	setSocket: Dispatch<SetStateAction<Socket>>;
	socketConnected: boolean;
	setSocketConnected: Dispatch<SetStateAction<boolean>>;
	servers: RTCConfiguration;
	peerConnection: RTCPeerConnection;
	setPeerConnection: Dispatch<SetStateAction<RTCPeerConnection>>;
	localStream: MediaStream | null;
	callInProgress: boolean;
	setCallInProgress: Dispatch<SetStateAction<boolean>>;
	videoPermission: boolean | null;
	initiateCall: (username: string, user: UserInfo) => void;
	setAcceptedOnce: Dispatch<SetStateAction<boolean>>;
	userIsNotOnline: boolean;
	requestInProgress: boolean;
	setRequestInProgress: Dispatch<SetStateAction<boolean>>;
}

const servers = {
	iceServers: [
		{
			urls: ["stun:stun1.l.google.com:19302", "stun:stun2.l.google.com:19302"],
		},
	],
	iceCandidatePoolSize: 10,
};

export const SocketContext = createContext<SocketContextType>({
	socket: io(),
	setSocket: () => {},
	socketConnected: false,
	setSocketConnected: () => {},
	servers: servers,
	peerConnection: new RTCPeerConnection(servers),
	setPeerConnection: () => {},
	localStream: null,
	callInProgress: false,
	setCallInProgress: () => {},
	videoPermission: null,
	initiateCall: () => {},
	setAcceptedOnce: () => {},
	userIsNotOnline: false,
	requestInProgress: false,
	setRequestInProgress: () => {},
});

export const SocketProvider = (props: { children: ReactNode }) => {
	const { children } = props;
	const [socket, setSocket] = useState<Socket>(io());
	const [socketConnected, setSocketConnected] = useState(false);
	const [peerConnection, setPeerConnection] = useState<RTCPeerConnection>(
		new RTCPeerConnection(servers)
	);
	const [acceptedOnce, setAcceptedOnce] = useState(false);
	const [videoPermission, setVideoPermission] = useState<boolean | null>(null);
	const [callInProgress, setCallInProgress] = useState(false);
	const [requestInProgress, setRequestInProgress] = useState(false);
	const [userIsNotOnline, setUserIsNotOnline] = useState(false);
	const localStream = useRef<MediaStream | null>(null);
	const navigate = useNavigate();

	useEffect(() => {
		navigator.mediaDevices
			.getUserMedia({ video: true, audio: true })
			.then((stream) => {
				localStream.current = stream;
				setVideoPermission(true);
				localStream.current!.getTracks().forEach((track) => {
					peerConnection.addTrack(track, localStream.current!);
				});
			})
			.catch((err) => {
				console.log(err);
				setVideoPermission(false);
			});
		socket.off("incomingCall");
		socket.on("incomingCall", (data) => {
			console.log("incoming call");
			navigate("/connect");
			if (acceptedOnce) {
				socket.emit("acceptCall", { caller: data.caller });
				return;
			}
			if (
				window.confirm("Incoming call from " + data.caller + ". Accept call?")
			) {
				socket.emit("acceptCall", { caller: data.caller });
				setAcceptedOnce(true);
			} else {
				socket.emit("rejectCall", { caller: data.caller });
			}
		});
		socket.on("notOnline", (data) => {
			setRequestInProgress(false);
			setUserIsNotOnline(true);
			setTimeout(() => setUserIsNotOnline(false), 2500);
		});
	}, [
		socket,
		acceptedOnce,
		setAcceptedOnce,
		peerConnection,
		localStream,
		navigate,
	]);

	const initiateCall = (usernameToCall: string, user: UserInfo) => {
		peerConnection.onicecandidate = (e) => {
			if (e && e.candidate) {
				socket.emit("sendCandidate", {
					to: usernameToCall,
					candidate: e.candidate,
				});
			}
		};

		if (peerConnection.currentLocalDescription) {
			return;
		}
		peerConnection.createOffer().then((offer) => {
			peerConnection.setLocalDescription(offer);
			socket.emit("sendOffer", {
				callee: usernameToCall,
				caller: user.username,
				sdp: offer.sdp,
				type: offer.type,
			});
			socket.on("incomingAnswer", (data) => {
				const { sdp, type } = data;
				if (peerConnection.currentRemoteDescription) {
					return;
				}
				peerConnection.setRemoteDescription(
					new RTCSessionDescription({ sdp, type })
				);
			});
			socket.on("incomingCandidate", (data) => {
				if (
					peerConnection.currentRemoteDescription &&
					peerConnection.currentLocalDescription
				) {
					peerConnection.addIceCandidate(new RTCIceCandidate(data));
				}
			});
		});
	};

	return (
		<SocketContext.Provider
			value={{
				socket,
				setSocket,
				socketConnected,
				setSocketConnected,
				servers,
				peerConnection,
				setPeerConnection,
				localStream: localStream.current,
				callInProgress,
				setCallInProgress,
				videoPermission,
				initiateCall,
				setAcceptedOnce,
				userIsNotOnline,
				requestInProgress,
				setRequestInProgress,
			}}
		>
			{children}
		</SocketContext.Provider>
	);
};
