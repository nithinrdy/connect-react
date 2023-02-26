import useAuth from "../customHooksAndServices/authContextHook";
import { motion } from "framer-motion";
import {
	RouteTransitionVariants,
	ConstituentPageElementsVariants,
} from "../framerMotionVariants/generalVariants";

export default function DashboardComponent() {
	const { user } = useAuth();

	return (
		<motion.div
			variants={RouteTransitionVariants}
			initial="initial"
			animate="animate"
			exit="exit"
		>
			<div className="flex flex-col items-center w-full text-white">
				<motion.h1
					variants={ConstituentPageElementsVariants}
					className="text-7xl mt-14 mb-12 text-center"
					style={{ fontFamily: "Poiret One" }}
				>
					Hello {user.username}!
				</motion.h1>
			</div>
		</motion.div>
	);
}
