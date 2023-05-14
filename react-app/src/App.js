import React from "react";
import "./app.scss";
import timeline from "./assets/timeline.png";
import workExperience from "./assets/workExperience.webp";

const App = () => {
	return (
		<>
			<h1 className="header">
				Welcome to React App thats build using Webpack and Babel
				separately
			</h1>

			<img width="40" height="40" src={timeline} alt="timeline" />
			<img width={50} height={50} src={workExperience} alt="work exp" />
			<div> Testing </div>
		</>
	);
};

export default App;
