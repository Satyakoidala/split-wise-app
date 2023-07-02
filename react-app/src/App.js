import React from "react";
import "./styles/Common.scss";
import SplitWise from "./components/Splitwise";

const App = () => {
	return (
		<>
			<h1 className="welcome-title">Welcome to SplitWise App</h1>
			<SplitWise />
		</>
	);
};

export default App;
