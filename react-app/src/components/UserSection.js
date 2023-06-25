import React, { useEffect, useRef, useState } from "react";
import cn from "classnames";
import _ from "lodash";
import TransactionsInput from "./UserActions";
import ErrorMessage from "./ErrorHandler";
import util from "./Utils";

import "./UserSection.scss";

const useActionTray = () => {
	const [noOfUsers, setNoOfUsers] = useState(
		JSON.parse(_.get(window.localStorage, "no_of_users") || "0")
	);
	const [users, setUsers] = useState(
		JSON.parse(_.get(window.localStorage, "users") || "[]")
	);

	useEffect(() => {
		_.set(window.localStorage, "no_of_users", JSON.stringify(noOfUsers));
		_.set(window.localStorage, "users", JSON.stringify(users));
	}, [noOfUsers, users]);

	const addUser = (name) => {
		setNoOfUsers(noOfUsers + 1);
		setUsers([
			...users,
			{
				idx: noOfUsers + 1,
				name: `${name}`,
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

		if (usr !== undefined) {
			setUsers([
				// ...users.filter((x) => {
				// 	return idx !== x.idx;
				// }),
				...users.slice(0, idx - 1),
				{
					...usr,
					transactions: [
						...usr.transactions,
						{
							transactionID: usr.transactions.length + 1,
							amount,
							purchaseInfo: `${purchaseInfoText}`,
						},
					],
				},
				...users.slice(idx),
			]);
		}
	};

	const removeTransaction = (idx, transactionID) => {
		const usr = util.findUser(users, idx);

		const updatedTransactions = usr.transactions.filter((tr) => {
			return transactionID !== tr.transactionID;
		});

		// console.log(updatedTransactions);

		if (usr !== undefined) {
			setUsers([
				...users.slice(0, idx - 1),
				{
					...usr,
					transactions: updatedTransactions,
				},
				...users.slice(idx),
			]);
		}
	};

	const editTransaction = (idx, transactionID, amount, purchaseInfoText) => {
		const usr = util.findUser(users, idx);

		if (usr !== undefined) {
			setUsers([
				...users.slice(0, idx - 1),
				{
					...usr,
					transactions: [
						...usr.transactions.slice(0, transactionID - 1),
						{
							transactionID,
							amount,
							purchaseInfo: `${purchaseInfoText}`,
						},
						...usr.transactions.slice(transactionID),
					],
				},
				...users.slice(idx),
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

const ActionTray = () => {
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
	} = useActionTray();
	const [showUserInput, toggleShowUserInput] = useState(false);
	const [name, setName] = useState("");
	const nameRef = useRef();
	const [hasError, toggleHasError] = useState(false);
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
		} else if (users.find((x) => x.name === name)) {
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
		<div className="split-wise-app">
			<div className="users-actions">
				{noOfUsers > 0 ? (
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
											onDeleteUser(user.idx);
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
												user.transactions[
													transactionID - 1
												].amount;
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
								</div>
							);
						})}
					</div>
				) : !showUserInput ? (
					<div className="intro suggestions">
						Add your buddy, and note their expenses. <br />
						<br />
						Remember, you can split the bills but not the
						friendship.
					</div>
				) : (
					<div className="user-encouragement suggestions">
						Yes! You are on track!! Thats it! Add your buddy!
					</div>
				)}
				{showUserInput && (
					<div className="add-user-section d-flex">
						{/* <div className=""> */}
						<input
							ref={nameRef}
							type="text"
							placeholder="Type Name here.."
							onChangeCapture={(e) => {
								e.stopPropagation();
								setName(e.target.value);
							}}
						/>
						{/* </div> */}
						{/* <div className="user-action-buttons"> */}
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
						{/* </div> */}
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
						Add Your Buddy
					</button>
				)}
			</div>
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

export default ActionTray;
