import React from "react";
import cn from "classnames";

import "./Transition.scss";

export const HeightTransition = ({ entered = false, children }) => {
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
			])}
			style={elementStyles}
		>
			<div data-core-height-transition-content>{children}</div>
		</div>
	);
};

const FadeTransition = ({ entered = false, children }) => {
	return (
		<div
			className={cn([
				"fade-transition",
				entered ? "transition-entered" : "transition-exited",
			])}
		>
			{children}
		</div>
	);
};

export default FadeTransition;
