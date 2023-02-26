import { Link } from "react-router-dom";
import "../componentSpecificStyles/landingPageStyles.css";
import { useEffect } from "react";
import { motion } from "framer-motion";
import {
	LandingPageButtonTransitionVariants,
	LandingPageTextTransitionVariants,
	LandingPageTitleTransitionVariants,
} from "../framerMotionVariants/landingPageVariants";
import { RouteTransitionVariants } from "../framerMotionVariants/generalVariants";

export default function LandingPageComponent() {
	useEffect(() => {
		document.body.style.overflow = "hidden";
		let rootHtml = document.querySelector("html");
		rootHtml!.style.overflow = "hidden";
		rootHtml!.style.position = "fixed";
		rootHtml!.style.width = "100vw";
		return () => {
			document.body.style.overflow = "unset";
			rootHtml!.style.overflow = "unset";
			rootHtml!.style.position = "unset";
			rootHtml!.style.width = "unset";
		};
	});
	return (
		<>
			<motion.div
				className="text-white flex flex-col items-center z-10"
				variants={RouteTransitionVariants}
				initial="initial"
				animate="animate"
				exit="exit"
			>
				<motion.h1
					variants={LandingPageTitleTransitionVariants}
					className="text-9xl landing-page-title-text mt-20 mb-20 mob:text-7xl"
					style={{ fontFamily: "Poiret One" }}
				>
					<span>C</span>
					<span>o</span>
					<span>n</span>
					<span>n</span>
					<span>e</span>
					<span>c</span>
					<span>t</span>
				</motion.h1>
				<div className="align-text-bottom flex flex-col justify-center h-32 mob:text-center">
					<motion.p
						variants={LandingPageTextTransitionVariants}
						className="text-white text-4xl"
						style={{ fontFamily: "Raleway" }}
					>
						Let's{" "}
						<Link className="text-white pb-4" to="/dashboard">
							<motion.button
								variants={LandingPageButtonTransitionVariants}
								className="landing-page-dashboard-button uppercase relative border-b-2 px-2 py-2 hover:text-black hover:text-5xl transition-all mob:bg-white mob:text-black hover:font-extrabold"
							>
								hop in
							</motion.button>
						</Link>{" "}
						and connect!
					</motion.p>
				</div>
			</motion.div>
		</>
	);
}
