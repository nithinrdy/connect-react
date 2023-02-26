const LoginAndRegisterPageElementVariants = {
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
};

export { LoginAndRegisterPageElementVariants };
