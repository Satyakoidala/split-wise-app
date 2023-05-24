import React from "react";
import "./App.scss";

// import CashInput from "./components/UserActions";
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
