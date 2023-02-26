import useAuth from "../customHooksAndServices/authContextHook";

export default function DashboardComponent() {
	const { user } = useAuth();

	return (
		<div className="">
			<h1 className="">
				Hello {user.username}!
			</h1>
			<p className="">
				Welcome to your dashboard.
			</p>
		</div>
	);
}
