import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import {
	RouteTransitionVariants,
	ConstituentPageElementsVariants,
} from "../framerMotionVariants/generalVariants";
import useFavorites from "../customHooksAndServices/favoritesHook";
import FavoriteData from "../models/favoriteModels";
import { FaPhone, FaTrash } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import useConnection from "../customHooksAndServices/useConnection";

export default function Favorites() {
	const { getFavorites, removeFavorite } = useFavorites();
	const [favorites, setFavorites] = useState<FavoriteData[] | null>(null);
	const [requestInProgress, setRequestInProgress] = useState<boolean>(false);
	const { setCallFromFavorites } = useConnection();

	const navigate = useNavigate();

	useEffect(() => {
		if (favorites) {
			return;
		}
		setRequestInProgress(true);
		getFavorites()
			.then((res) => {
				console.log(res);
				setFavorites(res.data);
				setRequestInProgress(false);
			})
			.catch((err) => {
				setRequestInProgress(false);
				console.log(err);
			});
	}, [getFavorites, requestInProgress, favorites]);

	const removeFav = (userToRemove: string) => {
		setRequestInProgress(true);
		removeFavorite(userToRemove)
			.then((res) => {
				setRequestInProgress(false);
				if (res.status === 200 && favorites) {
					setFavorites(
						favorites.filter((favorite) => favorite.starred !== userToRemove)
					);
				} else if (res.status === 202) {
					window.alert("No such user exists in your favorites.");
				} else {
					window.alert("Something went wrong.");
				}
			})
			.catch((err) => {
				setRequestInProgress(false);
				console.log(err);
			});
	};

	const callUser = (userToCall: string) => {
		setCallFromFavorites(userToCall);
		navigate("/connect");
	};

	return (
		<motion.div
			className="flex flex-col items-center text-white"
			variants={RouteTransitionVariants}
			initial="initial"
			animate="animate"
			exit="exit"
			style={{ fontFamily: "Raleway" }}
		>
			{requestInProgress && <div className="text-4xl mt-8">Loading...</div>}
			{!requestInProgress && (
				<div className="mt-16 w-full">
					<motion.h1
						className="text-6xl font-bold mb-8 text-center"
						variants={ConstituentPageElementsVariants}
						style={{ fontFamily: "Poiret One" }}
					>
						Favorites
					</motion.h1>
					{favorites && favorites.length === 0 && (
						<div className="text-4xl text-center mt-16 w-full">
							You currently have no favorites.
						</div>
					)}
					{favorites && favorites.length > 0 && (
						<motion.div
							className="flex flex-col items-center mt-16"
							variants={ConstituentPageElementsVariants}
						>
							{favorites.map((favorite, id) => (
								<div
									className="flex items-center justify-between mob:w-4/5 wide:w-3/5 border-b-2 pb-1 mt-4"
									key={id}
								>
									<div className="text-4xl">{favorite.starred}</div>
									<div className="flex buttons">
										<button
											className="text-2xl hover:bg-white hover:text-black p-4 transition-colors duration-300 rounded-full"
											onClick={() => {
												removeFav(favorite.starred);
											}}
										>
											<FaTrash />
										</button>
										<button
											className="ml-8 text-2xl hover:bg-white hover:text-black p-4 transition-colors duration-300 rounded-full"
											onClick={() => {
												callUser(favorite.starred);
											}}
										>
											<FaPhone />
										</button>
									</div>
								</div>
							))}
						</motion.div>
					)}
				</div>
			)}
		</motion.div>
	);
}
