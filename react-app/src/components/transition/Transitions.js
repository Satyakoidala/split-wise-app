import React from "react";
import cn from "classnames";

import "./Transition.scss";

export const HeightTransition = ({
	entered = false,
	children,
	classnames = [],
}) => {
	const elementStyles = !entered
		? {
				height: "0",
		  }
		: {};
	return (
		<div
			className={cn([
				"height-transition",
				entered ? "transition-entered" : "transition-exited",
				...classnames,
			])}
			style={elementStyles}
		>
			<div data-core-height-transition-content>{children}</div>
		</div>
	);
};

const FadeTransition = ({ entered = false, children, classnames = [] }) => {
	return (
		<div
			className={cn([
				"fade-transition",
				entered ? "transition-entered" : "transition-exited",
				...classnames,
			])}
		>
			{children}
		</div>
	);
};

export default FadeTransition;
