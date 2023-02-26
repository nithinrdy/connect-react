import { Outlet } from "react-router-dom";
import "../index.css";

export default function OrnamentsComponent() {
	return (
		<>
			<div className="ornaments mt-60 fixed">
				<div className="ornament">
					<div className="triangle triangle-1 -mt-20 rotate-90"></div>
				</div>
				<div className="ornament ml-96">
					<div className="triangle triangle-2 ml-60 rotate-12"></div>
				</div>
				<div className="ornament ml-96">
					<div className="circle circle-1 mt-72 ml-96"></div>
				</div>
				<div className="ornament">
					<div className="triangle triangle-3 mt-80 -ml-40 rotate-45"></div>
				</div>
				<div className="ornament">
					<div className="circle circle-2 mt-40 ml-96"></div>
				</div>
			</div>
			<Outlet />
		</>
	);
}
