import { Outlet } from "react-router-dom";
import "../componentSpecificStyles/ornamentStyles.css";

export default function OrnamentsComponent() {
	return (
		<>
			<div className="ornaments mt-60 fixed pointer-events-none">
				<div className="ornament">
					<div className="triangle triangle-1 -mt-20 rotate-90"></div>
				</div>
				<div className="ornament wide:ml-96">
					<div className="triangle triangle-2 ml-60 mob:ml-40 rotate-12"></div>
				</div>
				<div className="ornament wide:ml-96">
					<div className="circle circle-1 mt-72 ml-96 mob:ml-40"></div>
				</div>
				<div className="ornament">
					<div className="triangle triangle-3 mt-80 mob:mt-20 -ml-50 rotate-45"></div>
				</div>
				<div className="ornament">
					<div className="circle circle-2 mt-40 ml-96"></div>
				</div>
			</div>
			<Outlet />
		</>
	);
}
