import { useLocation, Route, Routes } from "react-router-dom";
import { AnimatePresence } from "framer-motion";

import LoginComponent from "./login";
import RegisterComponent from "./register";
import ProtectedRoutes from "./ProtectedRoutes";
import DashboardComponent from "./dashboard";
import LandingPageComponent from "./landingPage";
import EditProfile from "./editProfile";
import SideMenuWrapper from "./sideMenuWrapper";
import ConnectPage from "./connectPage";
import CallEndedPage from "./callEnded";
import { ConnectionProvider } from "../contexts/connectionProvider";
import Favorites from "./favorites";

const PageTransitionWrapper = () => {
	const location = useLocation();
	return (
		<ConnectionProvider>
			<AnimatePresence mode="wait">
				<Routes location={location} key={location.pathname}>
					<Route path="/" element={<LandingPageComponent />} />
					<Route element={<ProtectedRoutes />}>
						<Route element={<SideMenuWrapper />}>
							<Route path="/dashboard" element={<DashboardComponent />} />
							<Route path="/connect" element={<ConnectPage />} />
							<Route path="/call-ended" element={<CallEndedPage />} />
							<Route path="/edit-profile" element={<EditProfile />} />
							<Route path="/favorites" element={<Favorites />} />
						</Route>
					</Route>
					<Route path="/login" element={<LoginComponent />} />
					<Route path="/register" element={<RegisterComponent />} />
				</Routes>
			</AnimatePresence>
		</ConnectionProvider>
	);
};

export default PageTransitionWrapper;
