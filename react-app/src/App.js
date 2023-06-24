import React from "react";
import "./styles/Common.scss";

// import TransactionsInput from "./components/UserActions";
import ActionTray from "./components/UserSection";

const App = () => {
	return (
		<>
			<h1>Welcome to SplitWise App</h1>
			<ActionTray />
		</>
	);
};

export default App;
