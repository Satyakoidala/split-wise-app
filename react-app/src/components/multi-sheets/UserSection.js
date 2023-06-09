import React, { useEffect, useRef, useState } from "react";
import cn from "classnames";
import { v4 as uuidv4 } from "uuid";
import _ from "lodash";
import TransactionsInput from "./UserActions";
import ErrorMessage from "../error-handler/ErrorHandler";
import util from "../Utils";

import "./UserSection.scss";
import ConfirmOverlay from "../overlay/ConfirmOverlay";

const useActionTray = (id) => {
	const NO_OF_USERS_LS_NAME = `${id}_no_of_users`;
	const USERS_LS_NAME = `${id}_users`;

	const [noOfUsers, setNoOfUsers] = useState(
		JSON.parse(_.get(window.localStorage, NO_OF_USERS_LS_NAME) || "0")
	);
	const [users, setUsers] = useState(
		JSON.parse(_.get(window.localStorage, USERS_LS_NAME) || "[]")
	);

	useEffect(() => {
		_.set(
			window.localStorage,
			NO_OF_USERS_LS_NAME,
			JSON.stringify(noOfUsers)
		);
		_.set(window.localStorage, USERS_LS_NAME, JSON.stringify(users));
	}, [noOfUsers, users]);

	const addUser = (name) => {
		setNoOfUsers(noOfUsers + 1);
		setUsers([
			...users,
			{
				idx: uuidv4(),
				name: `${name.toUpperCase()}`,
				transactions: [],
			},
		]);
	};

	const removeUser = (idx) => {
		setNoOfUsers(noOfUsers - 1);
		const usr = util.findUser(users, idx);

		if (usr === undefined) console.log("No User Found!");
		else {
			setUsers(
				users.filter((x) => {
					return idx !== x.idx;
				})
			);
		}

		return usr;
	};

	const addTransaction = (idx, amount, purchaseInfoText) => {
		const usr = util.findUser(users, idx);
		const index = users.indexOf(usr);

		if (usr !== undefined) {
			setUsers([
				...users.slice(0, index),
				{
					...usr,
					transactions: [
						...usr.transactions,
						{
							transactionID: uuidv4(),
							amount,
							purchaseInfo: `${purchaseInfoText}`,
						},
					],
				},
				...users.slice(index + 1),
			]);
		}
	};

	const removeTransaction = (idx, transactionID) => {
		const usr = util.findUser(users, idx);
		const index = users.indexOf(usr);

		const updatedTransactions = usr.transactions.filter((tr) => {
			return transactionID !== tr.transactionID;
		});

		// console.log(updatedTransactions);

		if (usr !== undefined) {
			setUsers([
				...users.slice(0, index),
				{
					...usr,
					transactions: updatedTransactions,
				},
				...users.slice(index + 1),
			]);
		}
	};

	const editTransaction = (idx, transactionID, amount, purchaseInfoText) => {
		const usr = util.findUser(users, idx);
		const index = users.indexOf(usr);

		const transaction = usr.transactions.find((x) => {
			return transactionID === x.transactionID;
		});
		const transID = usr.transactions.indexOf(transaction);

		if (usr !== undefined) {
			setUsers([
				...users.slice(0, index),
				{
					...usr,
					transactions: [
						...usr.transactions.slice(0, transID),
						{
							transactionID,
							amount,
							purchaseInfo: `${purchaseInfoText}`,
						},
						...usr.transactions.slice(transID + 1),
					],
				},
				...users.slice(index + 1),
			]);
		}
	};

	return {
		noOfUsers,
		users,
		addUser,
		removeUser,
		addTransaction,
		removeTransaction,
		editTransaction,
	};
};

const SheetActionTray = ({ title, sheetId = "sheet-x" }) => {
	const userSectionRef = useRef();
	const [totalExpense, setTotalExpense] = useState(0);
	const {
		noOfUsers,
		users,
		addUser,
		addTransaction,
		removeUser,
		removeTransaction,
		editTransaction,
	} = useActionTray(sheetId);
	const [showUserInput, toggleShowUserInput] = useState(false);
	const [name, setName] = useState("");
	const nameRef = useRef();
	const [hasError, toggleHasError] = useState(false);
	const [toBeDeletedUser, setToBeDeletedUser] = useState(null);
	const errorText = useRef("");

	useEffect(() => {
		const currTotal = users
			.map((x) => x.transactions)
			.flat()
			.reduce((sum, x) => sum + x.amount, 0);
		setTotalExpense(currTotal);
	}, []);

	const onDeleteUser = (id) => {
		const removedUser = removeUser(id);

		const totalAmount = removedUser.transactions.reduce((total, tr) => {
			return total + tr.amount;
		}, 0);

		setTotalExpense(totalExpense - totalAmount);
	};

	const onAddUser = (ev) => {
		ev.stopPropagation();

		toggleShowUserInput(true);
	};

	const onSave = (ev) => {
		ev.stopPropagation();

		if (name === "") {
			errorText.current = util.getErrorMessage("EMPTY_USERNAME");
			toggleHasError(true);
		} else if (users.find((x) => x.name === name.toUpperCase())) {
			errorText.current = util.getErrorMessage("NOT_UNIQUE_USERNAME");
			toggleHasError(true);
		} else {
			addUser(name);
			toggleShowUserInput(false);
			setName("");
		}
	};

	const onCancel = (ev) => {
		ev.stopPropagation();

		setName("");
		toggleShowUserInput(false);
	};

	return (
		<div className="action-tray">
			{title && <h2 className="sheet-header">{title}</h2>}
			<div className="expenses-summary column-50">
				<div className="total-expense left">
					Total Expenses: Rs.{totalExpense}
				</div>
				{noOfUsers > 0 && (
					<div className="avg-expense right">
						Average Expenses per head: Rs.
						{Math.round(totalExpense / noOfUsers)}
					</div>
				)}
			</div>
			<div className="users-actions">
				{noOfUsers > 0 && (
					<div
						className="users block"
						id="users"
						ref={userSectionRef}
					>
						{users.map((user) => {
							return (
								<div
									className={cn(
										"user-view",
										`user-${user.idx}`
									)}
									key={user.idx}
								>
									<button
										type="button"
										className="delete-usr"
										onClick={(ev) => {
											ev.stopPropagation();
											setToBeDeletedUser(user.idx);
										}}
									>
										X
									</button>
									<TransactionsInput
										key={user.idx}
										username={user.name}
										avg={Math.round(
											totalExpense / noOfUsers
										)}
										editTransaction={(
											transactionID,
											amount,
											purchaseInfo
										) => {
											editTransaction(
												user.idx,
												transactionID,
												amount,
												purchaseInfo
											);
											const previousAmount =
												user.transactions.find(
													(x) =>
														x.transactionID ===
														transactionID
												).amount;
											setTotalExpense(
												totalExpense -
													previousAmount +
													amount
											);
										}}
										updateTotalExpense={(amount) => {
											setTotalExpense(
												totalExpense + amount
											);
										}}
										addNewTransaction={(
											amount,
											purchaseInfo
										) => {
											addTransaction(
												user.idx,
												amount,
												purchaseInfo
											);
										}}
										deleteTransaction={(
											transactionID,
											amount
										) => {
											removeTransaction(
												user.idx,
												transactionID
											);
											setTotalExpense(
												totalExpense - amount
											);
										}}
										transactions={user.transactions}
									/>
									{toBeDeletedUser &&
										toBeDeletedUser === user.idx && (
											<ConfirmOverlay
												template="USER_DELETE"
												username={user.name}
												onClickedYes={() => {
													onDeleteUser(user.idx);
													if (toBeDeletedUser)
														setToBeDeletedUser(
															null
														);
												}}
												onClickedNo={() => {
													setToBeDeletedUser(null);
												}}
											/>
										)}
								</div>
							);
						})}
					</div>
				)}
				{!showUserInput ? (
					<div className="intro suggestions">
						{/* Add your buddy, and note their expenses. <br />
						<br />
						Remember, you can split the bills but not the
							friendship. */}
						{noOfUsers > 0 ? (
							<>Tag your buddy now!!</>
						) : (
							<>
								Tag yourself first and later you can add your
								buddies.
							</>
						)}
					</div>
				) : (
					<div className="user-encouragement suggestions">
						{noOfUsers > 0 ? (
							<>
								Yes! Thats it!! You are right on the money!
								<br />
								Add your buddy now!!
							</>
						) : (
							<>Input your name and stay back to see the magic!</>
						)}
					</div>
				)}
				{showUserInput && (
					<div className="add-user-section d-flex">
						<input
							ref={nameRef}
							type="text"
							placeholder="Type Name here.."
							onChangeCapture={(e) => {
								e.stopPropagation();
								setName(e.target.value);
							}}
						/>
						<button
							className="save-btn"
							type="button"
							onClick={(ev) => {
								onSave(ev);
							}}
						>
							Save
						</button>
						<button
							className="cancel-btn"
							type="button"
							onClick={(ev) => {
								onCancel(ev);
							}}
						>
							Cancel
						</button>
					</div>
				)}
				{!showUserInput && (
					<button
						className="add-user-btn"
						type="button"
						onClick={(ev) => {
							onAddUser(ev);
						}}
					>
						{noOfUsers > 0 ? (
							<span>
								Add Your Buddy&nbsp;
								<svg
									viewBox="0 0 24 24"
									width="14"
									height="14"
									stroke="currentColor"
									strokeWidth="3"
									fill="none"
									strokeLinecap="round"
									strokeLinejoin="round"
									className="css-i6dzq1"
								>
									<path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
									<circle cx="8.5" cy="7" r="4"></circle>
									<line x1="20" y1="8" x2="20" y2="14"></line>
									<line
										x1="23"
										y1="11"
										x2="17"
										y2="11"
									></line>
								</svg>
							</span>
						) : (
							"Tag yourself"
						)}
					</button>
				)}
			</div>
			<ErrorMessage
				id="username-input-errors"
				errorText={errorText.current}
				showError={hasError}
				onErrorShown={() => {
					errorText.current = "";
					if (nameRef.current) {
						nameRef.current.value = "";
						nameRef.current.focus();
					}
					toggleHasError(false);
					setName("");
				}}
				onErrorClosed={() => {}}
			/>
		</div>
	);
};

export default SheetActionTray;
