import React from "react";
import cn from "classnames";

import "./ErrorHandler.scss";

const ErrorMessage = ({
	errorText,
	showError = false,
	onErrorShown = (f) => f,
	onErrorClosed = (f) => f,
	...rest
}) => {
	React.useEffect(() => {
		if (showError) {
			setTimeout(() => {
				onErrorShown();
			}, 3000);
		} else {
			onErrorClosed();
		}
	}, [showError]);

	return (
		<div className="error-box" {...rest}>
			<div className="error-message">
				<div className={cn(showError ? "show-error" : "no-error")}>
					{errorText}
				</div>
			</div>
		</div>
	);
};

export default ErrorMessage;
