const RouteTransitionVariants = {
	initial: {
		opacity: 0,
		y: 100,
	},
	animate: {
		opacity: 1,
		y: 0,
		transition: {
			type: "linear",
			duration: 0.3,
			ease: "easeOut",
			delayChildren: 0.5,
			staggerChildren: 0.1,
		},
	},
	exit: {
		opacity: 0,
		y: -100,
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
