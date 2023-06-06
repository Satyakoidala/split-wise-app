import React, { useEffect, useRef, useState } from "react";
import cn from "classnames";
import TransactionsInput from "./UserActions";

import "./UserSection.scss";

const useActionTray = () => {
	const [noOfUsers, setNoOfUsers] = useState(0);
	const [users, setUsers] = useState([]);

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
		const usr = users.find((x) => {
			return idx === x.idx;
		});

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
		const usr = users.find((x) => {
			return idx === x.idx;
		});

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
		const usr = users.find((x) => {
			return idx === x.idx;
		});

		const updatedTransactions = usr.transactions.filter((tr) => {
			return transactionID !== tr.transactionID;
		});

		console.log(updatedTransactions);

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

	return {
		noOfUsers,
		users,
		addUser,
		removeUser,
		addTransaction,
		removeTransaction,
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
	} = useActionTray();
	const [showUserInput, toggleShowUserInput] = useState(false);
	const [name, setName] = useState("");
	const nameRef = useRef();

	useEffect(() => {
		console.log(users);
	}, [users]);

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

		addUser(name);
		toggleShowUserInput(false);
	};

	const onCancel = (ev) => {
		ev.stopPropagation();

		// const elm = nameRef.current;
		// if (elm) elm.target.value = "";
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
										updateTotalExpense={(amount) => {
											setTotalExpense(
												totalExpense + amount
											);
										}}
										updateTransactions={(
											amount,
											purchaseInfo
										) => {
											addTransaction(
												user.idx,
												amount,
												purchaseInfo
											);
										}}
										transactions={user.transactions}
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
		</div>
	);
};

export default ActionTray;
