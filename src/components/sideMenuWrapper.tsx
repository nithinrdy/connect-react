import { useState } from "react";
import { Outlet } from "react-router-dom";
import "../componentSpecificStyles/sideMenuButtonStyles.css";
import SideMenu from "./sideMenu";

export default function SideMenuWrapper() {
	const [showMenu, setShowMenu] = useState(false);
	return (
		<>
			<button
				className={`hamburger-icon ml-8 mt-8 mob:ml-4 mob:mt-5 text-white text-4xl ${
					showMenu ? "menu-active" : ""
				}`}
				onClick={() => setShowMenu(!showMenu)}
			>
				<span className="bar-1"></span>
				<span className="bar-2"></span>
				<span className="bar-3"></span>
			</button>
			<SideMenu showMenu={showMenu} setShowMenu={setShowMenu} />
			<Outlet />
		</>
	);
}
