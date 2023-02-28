import { SocketContext } from "../contexts/socketProvider";
import { useContext } from "react";

const useSocket = () => {
	const socket = useContext(SocketContext);
	return socket;
};

export default useSocket;
