import { SocketContext } from "../contexts/socketProvider";
import { useContext } from "react";

export const useSocket = () => {
	const socket = useContext(SocketContext);
	return socket;
};
