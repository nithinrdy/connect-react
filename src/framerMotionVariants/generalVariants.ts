const RouteTransitionVariants = {
	initial: {
		opacity: 0,
		scale: 0.5,
	},
	animate: {
		opacity: 1,
		scale: 1,
		transition: {
			type: "linear",
			duration: 0.3,
			ease: "easeOut",
			delayChildren: 0.5,
			staggerChildren: 0.2,
		},
	},
	exit: {
		opacity: 0,
		scale: 2.5,
		transition: {
			delayChildren: 0.1,
			staggerChildren: 0.1,
			type: "linear",
			duration: 0.3,
			ease: "easeOut",
		},
	},
};

export { RouteTransitionVariants };
