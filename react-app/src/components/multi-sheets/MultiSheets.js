import React from "react";
import cn from "classnames";
import SheetActionTray from "./UserSection";

import "./MultiSheets.scss";

const Sheet = ({ index, sheetName = "Sheet" }) => {
	const [showSheet, toggleShowSheet] = React.useState(false);
	return (
		<div
			className={cn(`sheet-${index}`, "accordion", {
				"accordion-entered": showSheet,
				"accordion-exited": !showSheet,
			})}
		>
			<div className="accordion-content">
				<button
					type="button"
					className={cn("accordion-btn", {
						"accordion-expanded": showSheet,
						"accordion-collapsed": !showSheet,
					})}
					onClick={() => toggleShowSheet(!showSheet)}
				>
					<span className="accordion-btn-text">{sheetName}</span>
					<span className="accordion-icon">
						{showSheet ? (
							<svg
								viewBox="0 0 24 24"
								width="48"
								height="48"
								stroke="currentColor"
								strokeWidth="2"
								fill="none"
								strokeLinecap="round"
								strokeLinejoin="round"
								className="css-i6dzq1"
							>
								<polyline points="18 15 12 9 6 15"></polyline>
							</svg>
						) : (
							<svg
								viewBox="0 0 24 24"
								width="48"
								height="48"
								stroke="currentColor"
								strokeWidth="2"
								fill="none"
								strokeLinecap="round"
								strokeLinejoin="round"
								className="css-i6dzq1"
							>
								<polyline points="6 9 12 15 18 9"></polyline>
							</svg>
						)}
					</span>
				</button>
				{showSheet && <SheetActionTray sheetId={`sheet_${index}`} />}
			</div>
		</div>
	);
};

const MultiSheets = ({ sheets = [] }) => {
	return (
		<div className="multi-sheets sheets">
			{sheets.map((sheetName, index) => {
				return (
					<Sheet
						key={index + 1}
						index={index + 1}
						sheetName={sheetName}
					/>
				);
			})}
		</div>
	);
};

export default MultiSheets;
