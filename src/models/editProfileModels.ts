export interface EditProfileErrors {
	editPassword: boolean;
	editEmail: boolean;
}

export interface EditProfileErrorAction {
	type: "resetAllErrors" | "setEditPasswordError" | "setEditEmailError";
}

export enum EditProperties {
	email = "email",
	password = "password",
	nickname = "nickname",
}
