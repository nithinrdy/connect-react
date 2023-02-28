import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./components/App";
import { AuthProvider } from "./contexts/authProvider";
import { SocketProvider } from "./contexts/socketProvider";

const root = ReactDOM.createRoot(
	document.getElementById("root") as HTMLElement
);
root.render(
	<React.StrictMode>
		<AuthProvider>
			<SocketProvider>
				<App />
			</SocketProvider>
		</AuthProvider>
	</React.StrictMode>
);
