import {
	RouteTransitionVariants,
	ConstituentPageElementsVariants,
} from "../framerMotionVariants/generalVariants";
import { motion } from "framer-motion";
import "../componentSpecificStyles/callEndedStyles.css";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

export default function CallEndedPage() {
	useEffect(() => {
		if (window.localStorage) {
			if (!localStorage.getItem("firstLoad")) {
				localStorage["firstLoad"] = true;
				window.location.reload();
			}
		}
	}, []);
	const navigate = useNavigate();
	return (
		<motion.div
			className="text-white flex flex-col items-center"
			variants={RouteTransitionVariants}
		>
			<motion.h1
				className="text-center text-7xl mt-12"
				variants={ConstituentPageElementsVariants}
				style={{ fontFamily: "Poiret One" }}
			>
				Call Ended
			</motion.h1>

			<motion.button
				onClick={() => {
					navigate("/dashboard");
				}}
				variants={ConstituentPageElementsVariants}
				className="mt-8 call-ended-page-back-to-dashboard-button border-b-2 relative px-2 py-2 text-2xl transition-colors hover:text-black mob:bg-white mob:text-black"
			>
				Back to Dashboard
			</motion.button>
		</motion.div>
	);
}
