import useAuth from "../customHooksAndServices/authContextHook";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
	RouteTransitionVariants,
	ConstituentPageElementsVariants,
} from "../framerMotionVariants/generalVariants";
import "../componentSpecificStyles/dashboardStyles.css";
import { useEffect } from "react";

export default function DashboardComponent() {
	const { user } = useAuth();

	useEffect(() => {
		localStorage.removeItem("firstLoad");
	});

	return (
		<motion.div
			className="w-full wide:h-screen flex flex-col justify-center"
			variants={RouteTransitionVariants}
			initial="initial"
			animate="animate"
			exit="exit"
		>
			<div className="flex flex-row mob:flex-col mob:mt-32 items-center justify-evenly w-full h-40 text-white">
				<motion.h1
					variants={ConstituentPageElementsVariants}
					className="text-7xl mt-14 mb-12 text-center"
					style={{ fontFamily: "Poiret One" }}
				>
					Hello {user.username}!
				</motion.h1>
				<div className="w-1 h-full mob:h-1 mob:w-4/5 border-2"></div>
				<motion.div
					variants={ConstituentPageElementsVariants}
					className="flex flex-col text-2xl"
					style={{ fontFamily: "Raleway" }}
				>
					<Link to="/connect" className="mt-8 flex flex-col mob:items-center">
						<button className="border-b-2 dashboard-connect-button relative px-2 py-2 transition-colors hover:text-black mob:border-b-2 mob:bg-white mob:text-black">
							Connect!
						</button>
					</Link>
				</motion.div>
			</div>
		</motion.div>
	);
}
