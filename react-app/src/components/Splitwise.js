import React from "react";
import _ from "lodash";
import MultiSheets from "./multi-sheets/MultiSheets";
import FadeTransition from "./transition/Transitions";

import "../styles/Common.scss";
import "./Splitwise.scss";

const MAX_SHEETS = 5;

const Intro = () => {
	return (
		<div className="main-welcome-intro">
			<span className="app-name">SplitWise</span>&nbsp; helps you to{" "}
			<b>note, manage and split</b>
			&nbsp;the expenses among your squad.
			<br />
			<br /> Whether its your shimla vacation with colleagues or an outing
			with friends, no more thinking about your spends, just note them and
			stay relaxed.
		</div>
	);
};

const SheetNameInput = ({
	onSave = (f) => f,
	onCancel = (f) => f,
	isMobileView = false,
}) => {
	const [name, setName] = React.useState("");
	const inputRef = React.useRef(null);

	React.useEffect(() => {
		if (inputRef.current) inputRef.current.focus();
	}, []);

	return (
		<div className="input-sheet d-flex">
			<fieldset>
				<legend>Sheet Name</legend>
				<input
					className="sheet-name-input"
					ref={inputRef}
					type="textbox"
					value={name}
					placeholder="Enter input and hit return key!"
					onChange={() => {
						setName(inputRef.current.value);
					}}
					onKeyDown={(ev) => {
						if (ev.keyCode === 13) {
							onSave(name);
						}
					}}
				/>
			</fieldset>
			{isMobileView && name.trim() !== "" && (
				<div className="input-sheet-actions">
					<button
						type="button"
						className="add-sheet-btn"
						onClick={() => {
							onSave(name);
						}}
					>
						<svg
							viewBox="0 0 24 24"
							width="32"
							height="32"
							stroke="currentColor"
							strokeWidth="2"
							fill="none"
							strokeLinecap="round"
							strokeLinejoin="round"
							className="css-i6dzq1"
						>
							<polyline points="20 6 9 17 4 12"></polyline>
						</svg>
					</button>
					<button
						type="button"
						className="cancel-add-sheet-btn"
						onClick={() => {
							onCancel();
						}}
					>
						<svg
							viewBox="0 0 24 24"
							width="32"
							height="32"
							stroke="currentColor"
							strokeWidth="2"
							fill="none"
							strokeLinecap="round"
							strokeLinejoin="round"
							className="css-i6dzq1"
						>
							<line x1="18" y1="6" x2="6" y2="18"></line>
							<line x1="6" y1="6" x2="18" y2="18"></line>
						</svg>
					</button>
				</div>
			)}
		</div>
	);
};

const SplitWise = () => {
	const [getStarted, toggleGetStarted] = React.useState(
		JSON.parse(_.get(window.localStorage, "isGetStarted") || false)
	);
	const [sheets, updateSheets] = React.useState(
		JSON.parse(_.get(window.localStorage, "sheets", "[]")) || []
	);
	const [addSheet, setAddSheet] = React.useState(false);
	const isMobileView = window.screen.width < 768;

	React.useEffect(() => {
		const onLoadSheets =
			JSON.parse(_.get(window.localStorage, "sheets", "[]")) || [];
		if (onLoadSheets.length === 0) {
			toggleGetStarted(false);
			_.set(window.localStorage, "isGetStarted", false);
		}
	}, []);

	React.useEffect(() => {
		_.set(window.localStorage, "isGetStarted", getStarted);
		_.set(window.localStorage, "sheets", JSON.stringify(sheets));
	}, [getStarted, sheets]);

	const onSave = (sheetName) => {
		updateSheets((prev) => [...prev, sheetName.toUpperCase()]);
		setAddSheet(false);
	};

	const onCancel = () => {
		setAddSheet(false);
	};

	return (
		<div className="split-wise-app">
			<FadeTransition entered={!getStarted}>
				{!getStarted && (
					<div className="app-intro">
						<div className="left">
							<Intro />
						</div>
						<div className="right">
							<div className="lets-get-started">
								<button
									className="get-started-btn"
									type="button"
									onClick={() => toggleGetStarted(true)}
								>
									Lets get started!
								</button>
							</div>
						</div>
					</div>
				)}
			</FadeTransition>
			<FadeTransition entered={getStarted && sheets.length === 0}>
				{getStarted && sheets.length === 0 && (
					<>
						<div className="docs-on-get-started">
							Lets create your first SplitWise expense sheet. Name
							the memory that reminds you the bills.
						</div>
						<SheetNameInput
							onSave={onSave}
							onCancel={() => {
								toggleGetStarted(false);
							}}
							isMobileView={isMobileView}
						/>
					</>
				)}
			</FadeTransition>
			<FadeTransition entered={getStarted && sheets.length > 0}>
				{getStarted && sheets.length > 0 && (
					<>
						<MultiSheets
							sheets={sheets}
							isMobileView={isMobileView}
						/>
						{sheets.length < MAX_SHEETS + 1 && (
							<div className="add-sheet-form">
								<FadeTransition entered={!addSheet}>
									{/* {!addSheet && ( */}
									<button
										type="button"
										className="add-sheet-btn"
										onClick={() => {
											setAddSheet(true);
										}}
									>
										<svg
											viewBox="0 0 24 24"
											width="32"
											height="32"
											stroke="currentColor"
											strokeWidth="2"
											fill="none"
											strokeLinecap="round"
											strokeLinejoin="round"
											className="css-i6dzq1"
										>
											<line
												x1="12"
												y1="5"
												x2="12"
												y2="19"
											></line>
											<line
												x1="5"
												y1="12"
												x2="19"
												y2="12"
											></line>
										</svg>
									</button>
									{/* )} */}
								</FadeTransition>
								<FadeTransition entered={addSheet}>
									{addSheet && (
										<>
											<button
												type="button"
												className="cancel-add-sheet-btn"
												onClick={onCancel}
											>
												<svg
													viewBox="0 0 24 24"
													width="32"
													height="32"
													stroke="currentColor"
													strokeWidth="2"
													fill="none"
													strokeLinecap="round"
													strokeLinejoin="round"
													className="css-i6dzq1"
												>
													<line
														x1="18"
														y1="6"
														x2="6"
														y2="18"
													></line>
													<line
														x1="6"
														y1="6"
														x2="18"
														y2="18"
													></line>
												</svg>
											</button>
											<SheetNameInput
												onSave={onSave}
												onCancel={onCancel}
												isMobileView={isMobileView}
											/>
										</>
									)}
								</FadeTransition>
							</div>
						)}
					</>
				)}
			</FadeTransition>
		</div>
	);
};

export default SplitWise;
