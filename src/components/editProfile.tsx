import { useEffect, useState, useReducer } from "react";
import {
	EditProfileErrorAction,
	EditProfileErrors,
	EditProperties,
} from "../models/editProfileModels";
import useAuth from "../customHooksAndServices/authContextHook";
import useEditProfile from "../customHooksAndServices/editProfileHook";
import { FaCheck } from "react-icons/fa";
import { motion } from "framer-motion";
import {
	ConstituentPageElementsVariants,
	RouteTransitionVariants,
} from "../framerMotionVariants/generalVariants";
import "../componentSpecificStyles/editProfileStyles.css";

const PWD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9]).{7,15}$/;
const EMAIL_REGEX = /^[A-z0-9._%+-]+@[A-z0-9.-]+\.[A-z]{2,4}$/;

const initialErrorState = {
	editEmail: false,
	editPassword: false,
};

const errorReducer = (
	state: EditProfileErrors,
	action: EditProfileErrorAction
): EditProfileErrors => {
	switch (action.type) {
		case "resetAllErrors":
			state.editPassword = false;
			state.editEmail = false;
			return { ...state };
		case "setEditEmailError":
			state.editEmail = true;
			return { ...state };
		case "setEditPasswordError":
			state.editPassword = true;
			return { ...state };
		default:
			return state;
	}
};

export default function EditProfile() {
	const { setUser } = useAuth();
	const { editProfileInfo } = useEditProfile();

	const [errorState, dispatchError] = useReducer(
		errorReducer,
		initialErrorState
	);

	const [requestInProgress, setRequestInProgress] = useState(false);

	const [editEmail, setEditEmail] = useState("");
	const [displayEmailChangeSuccess, setDisplayEmailChangeSuccess] =
		useState(false);
	const [editPassword, setEditPassword] = useState("");
	const [displayPasswordChangeSuccess, setDisplayPasswordChangeSuccess] =
		useState(false);
	const [editNickname, setEditNickname] = useState("");
	const [displayNicknameChangeSuccess, setDisplayNicknameChangeSuccess] =
		useState(false);

	useEffect(() => {
		dispatchError({
			type: "resetAllErrors",
		});
		let validEditEmail = EMAIL_REGEX.test(editEmail);
		if (!validEditEmail && editEmail.length > 0) {
			dispatchError({
				type: "setEditEmailError",
			});
		}
		let validEditPassword = PWD_REGEX.test(editPassword);
		if (!validEditPassword && editPassword.length > 0) {
			dispatchError({
				type: "setEditPasswordError",
			});
		}
	}, [editPassword, editEmail]);

	const handleEmailUpdate = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		setRequestInProgress(true);
		if (errorState.editEmail) {
			setRequestInProgress(false);
			return;
		}

		setRequestInProgress(false);
		const response = await editProfileInfo({
			editProperty: EditProperties.email,
			editValue: editEmail,
		});
		if (response.status === 200) {
			setUser(response.data.user);
			setDisplayEmailChangeSuccess(true);
			setTimeout(() => {
				setDisplayEmailChangeSuccess(false);
			}, 1500);
		} else {
			window.alert(response.response.data.message);
		}
	};

	const handlePasswordUpdate = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		setRequestInProgress(true);
		if (errorState.editPassword) {
			setRequestInProgress(false);
			return;
		}

		const response = await editProfileInfo({
			editProperty: EditProperties.password,
			editValue: editPassword,
		});

		setRequestInProgress(false);
		if (response.status === 200) {
			setUser(response.data.user);
			setDisplayPasswordChangeSuccess(true);
			setTimeout(() => {
				setDisplayPasswordChangeSuccess(false);
			}, 1500);
		} else {
			window.alert(response.response.data.message);
		}
	};

	const handleNicknameUpdate = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		setRequestInProgress(true);
		const response = await editProfileInfo({
			editProperty: EditProperties.nickname,
			editValue: editNickname,
		});

		setRequestInProgress(false);
		if (response.status === 200) {
			setUser(response.data.user);
			setDisplayNicknameChangeSuccess(true);
			setTimeout(() => {
				setDisplayNicknameChangeSuccess(false);
			}, 1500);
		} else {
			window.alert(response.response.data.message);
		}
	};

	return (
		<>
			<motion.main
				className="flex flex-col items-center text-white edit-profile-main"
				variants={RouteTransitionVariants}
				initial="initial"
				animate="animate"
				exit="exit"
			>
				<div className="flex flex-col forms-container items-center w-full mt-12 mb-12">
					<h1
						className="text-7xl mb-8 text-center"
						style={{ fontFamily: "Poiret One" }}
					>
						Edit your profile
					</h1>
					<motion.form
						variants={ConstituentPageElementsVariants}
						className="flex flex-col items-center w-full"
						style={{ fontFamily: "Raleway" }}
						onSubmit={handleEmailUpdate}
					>
						<div className="flex flex-col items-start w-full">
							<label>Email</label>
							<div className="w-full">
								<input
									type="email"
									value={editEmail}
									onChange={(e) => setEditEmail(e.target.value)}
									placeholder="Enter a new email"
								/>
								{errorState.editEmail && (
									<p className="text-center">
										Please enter a valid email address.
									</p>
								)}
								<div className="flex items-center">
									<button
										type="submit"
										disabled={
											requestInProgress ||
											errorState.editEmail ||
											!editEmail ||
											displayEmailChangeSuccess
										}
									>
										Update
									</button>

									<FaCheck
										className={`change-success-check-mark ${
											displayEmailChangeSuccess ? "show-check" : ""
										}`}
									/>
								</div>
							</div>
						</div>
					</motion.form>
					<motion.form
						variants={ConstituentPageElementsVariants}
						className="flex flex-col items-center w-full"
						style={{ fontFamily: "Raleway" }}
						onSubmit={handlePasswordUpdate}
					>
						<div className="flex flex-col items-start w-full">
							<label>Password</label>
							<div className="w-full">
								<input
									type="password"
									value={editPassword}
									onChange={(e) => setEditPassword(e.target.value)}
									placeholder="Enter a new password"
								/>
								{errorState.editPassword && (
									<p className="text-center">
										Password must contain a number, a capital letter, a small
										letter and must be 7 to 15 characters long.
									</p>
								)}
								<div className="flex items-center">
									<button
										type="submit"
										disabled={
											requestInProgress ||
											errorState.editPassword ||
											!editPassword ||
											displayPasswordChangeSuccess
										}
									>
										Update
									</button>
									<FaCheck
										className={`change-success-check-mark ${
											displayPasswordChangeSuccess ? "show-check" : ""
										}`}
									/>
								</div>
							</div>
						</div>
					</motion.form>
					<motion.form
						variants={ConstituentPageElementsVariants}
						className="flex flex-col items-center w-full"
						style={{ fontFamily: "Raleway" }}
						onSubmit={handleNicknameUpdate}
					>
						<div className="flex flex-col items-start w-full">
							<label>Nickname</label>
							<div className="w-full">
								<input
									type="text"
									value={editNickname}
									onChange={(e) => setEditNickname(e.target.value)}
									placeholder="Enter a new nickname"
								/>
								<div className="flex items-center">
									<button
										type="submit"
										disabled={
											requestInProgress ||
											!editNickname ||
											displayNicknameChangeSuccess
										}
									>
										Update
									</button>
									<FaCheck
										className={`change-success-check-mark ${
											displayNicknameChangeSuccess ? "show-check" : ""
										}`}
									/>
								</div>
							</div>
						</div>
					</motion.form>
				</div>
			</motion.main>
		</>
	);
}
