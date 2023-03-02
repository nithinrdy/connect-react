import { ConnectionContext } from "../contexts/connectionProvider";
import { useContext } from "react";

const useConnection = () => {
	const socket = useContext(ConnectionContext);
	return socket;
};

export default useConnection;
