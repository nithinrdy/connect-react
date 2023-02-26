import {
	createContext,
	Dispatch,
	ReactNode,
	SetStateAction,
	useState,
} from "react";
import { UserInfo } from "../models/userInfoModel";

interface AuthContextType {
	user: UserInfo;
	setUser: Dispatch<SetStateAction<UserInfo>>;
}

export const AuthContext = createContext<AuthContextType>({
	user: {
		accessToken: "",
		username: "",
		email: "",
		nickname: "",
	},
	setUser: () => {},
});

export const AuthProvider = (props: { children: ReactNode }) => {
	const { children } = props;
	const [user, setUser] = useState({
		accessToken: "",
		username: "",
		nickname: "",
		email: "",
	});

	return (
		<AuthContext.Provider value={{ user, setUser }}>
			{children}
		</AuthContext.Provider>
	);
};
