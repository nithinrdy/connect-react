import "../componentSpecificStyles/sideMenuStyles.css";
import useLogout from "../customHooksAndServices/logoutHook";
import { useNavigate, Link, useLocation } from "react-router-dom";
import useAuth from "../customHooksAndServices/authContextHook";
import { Dispatch, SetStateAction } from "react";
import { useEffect } from "react";
import useConnection from "../customHooksAndServices/useConnection";

export default function SideMenu(props: {
	showMenu: boolean;
	setShowMenu: Dispatch<SetStateAction<boolean>>;
}) {
	const { socket, setSocket, setSocketConnected } = useConnection();
	const { showMenu, setShowMenu } = props;
	const { logout } = useLogout();
	const navigate = useNavigate();
	const { setUser } = useAuth();
	const { pathname } = useLocation();

	useEffect(() => {
		if (showMenu) {
			document.body.style.overflow = "hidden"; // Prevents the background from being scrolled when menu is open
		}
		if (!showMenu) {
			document.body.style.overflow = "auto";
		}
	}, [showMenu]);

	const handleLogout = () => {
		if (!socket) {
			return;
		}
		logout().then(() => {
			setUser({
				username: "",
				accessToken: "",
				email: "",
				nickname: "",
			});
			navigate("/");
			setSocket(null);
			setSocketConnected(false);
		});
	};
	return (
		<div
			className={`flex flex-col items-center side-menu pt-32 ${
				showMenu ? "side-menu-active" : ""
			}`}
		>
			{
				// Anchor tag used as selector in the stylesheet since that's how Links are rendered in the DOM.
				// Can't add this comment to the stylesheet because tailwind complains.
			}
			<Link to="edit-profile" onClick={() => setShowMenu(false)}>
				<button>Edit your profile</button>
			</Link>
			<Link to="favorites" onClick={() => setShowMenu(false)}>
				<button>View your favorites</button>
			</Link>
			{pathname !== "/dashboard" ? (
				<Link
					to="/dashboard"
					className="mt-auto" // auto margin moves the button to the end (justify flex-end isn't a thing, apparently)
					onClick={() => setShowMenu(false)}
				>
					<button>Back to dashboard</button>
				</Link>
			) : null}
			<button
				className={`logout-button ${pathname === "/dashboard" ? "mt-auto" : ""}`}
				onClick={() => {
					handleLogout();
					setShowMenu(false);
				}}
			>
				Log out
			</button>
		</div>
	);
}
