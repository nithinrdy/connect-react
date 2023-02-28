import {
	createContext,
	Dispatch,
	ReactNode,
	SetStateAction,
	useState,
} from "react";
import { Socket, io } from "socket.io-client";

interface SocketContextType {
	socket: Socket;
	setSocket: Dispatch<SetStateAction<Socket>>;
	socketConnected: boolean;
	setSocketConnected: Dispatch<SetStateAction<boolean>>;
}

export const SocketContext = createContext<SocketContextType>({
	socket: io(),
	setSocket: () => {},
	socketConnected: false,
	setSocketConnected: () => {},
});

export const SocketProvider = (props: { children: ReactNode }) => {
	const { children } = props;
	const [socket, setSocket] = useState<Socket>(io());
	const [socketConnected, setSocketConnected] = useState(false);

	return (
		<SocketContext.Provider
			value={{ socket, setSocket, socketConnected, setSocketConnected }}
		>
			{children}
		</SocketContext.Provider>
	);
};
