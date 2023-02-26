import { Link } from "react-router-dom";
import "../index.css";
import { useEffect } from "react";

export default function LandingPageComponent() {
	useEffect(() => {
		document.body.style.overflow = "hidden"; // Prevents scrolling on the landing page, caused by the SVGs being off screen
		let rootHtml = document.querySelector("html");
		rootHtml!.style.overflow = "hidden"; // Prevents scrolling on the landing page, caused by the SVGs being off screen
		rootHtml!.style.position = "fixed";
		rootHtml!.style.width = "100vw";
		return () => {
			document.body.style.overflow = "unset"; // Resets overflow property to allow scrolling once the user leaves the landing page\
			rootHtml!.style.overflow = "unset"; // Resets overflow property to allow scrolling once the user leaves the landing page
			rootHtml!.style.position = "unset";
			rootHtml!.style.width = "unset";
		};
	});
	return (
		<>
			<div className="">
				<h1 className="">Connect</h1>
				<p className="">Let's hop on and connect!</p>
				<div className="">
					<Link to="/login">
						<button className="">Login</button>
					</Link>
					<Link to="/register">
						<button className="">Register</button>
					</Link>
				</div>
			</div>
		</>
	);
}
