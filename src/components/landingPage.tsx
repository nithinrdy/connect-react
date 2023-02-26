import { Link } from "react-router-dom";
import "../index.css";
import { useEffect } from "react";

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
			<div className="text-white">
				<h1 className="">Connect</h1>
				<p className="">
					Let's{" "}
					<Link to="/dashboard">
						<button>hop on</button>
					</Link>{" "}
					and connect!
				</p>
				<div className=""></div>
			</div>
		</>
	);
}
