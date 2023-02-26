const LandingPageTitleTransitionVariants = {
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
		},
	},
	exit: {
		opacity: 0,
		y: -100,
		transition: {
			type: "linear",
			duration: 0.3,
			ease: "easeInOut",
		},
	},
	hover: {
		y: -10,
	},
};

const LandingPageTextTransitionVariants = {
	initial: {
		opacity: 0,
		y: -100,
	},
	animate: {
		opacity: 1,
		y: 0,
		transition: {
			type: "linear",
			duration: 0.3,
			ease: "easeOut",
		},
	},
	exit: {
		opacity: 0,
		y: 100,
		transition: {
			type: "linear",
			duration: 0.3,
			ease: "easeOut",
		},
	},
};

const LandingPageButtonTransitionVariants = {
	initial: {
		scale: 1,
	},
	animate: {
		scale: [1, 4, 1],
		transition: {
			delay: 1,
			type: "linear",
			duration: 0.3,
			ease: "easeOut",
		},
	},
};

export {
	LandingPageTitleTransitionVariants,
	LandingPageTextTransitionVariants,
	LandingPageButtonTransitionVariants,
};
