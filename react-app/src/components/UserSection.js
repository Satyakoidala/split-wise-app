import React, { useRef, useState } from "react";
import CashInput from "./UserActions";

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
	};

	const addTransaction = (idx, amount, purchaseInfoText) => {
		const usr = users.find((x) => {
			return idx === x.idx;
		});

		if (usr !== undefined) {
			setUsers([
				...users.filter((x) => {
					return idx !== x.idx;
				}),
				{
					...usr,
					transactions: [
						...usr.transactions,
						{
							amount,
							purchaseInfo: `${purchaseInfoText}`,
						},
					],
				},
			]);
		}
	};

	return { noOfUsers, users, addUser, removeUser, addTransaction };
};

const ActionTray = () => {
	const userSectionRef = useRef();
	const [totalExpense, setTotalExpense] = useState(0);
	const { noOfUsers, users, addUser, addTransaction } = useActionTray();
	const [showUserInput, toggleShowUserInput] = useState(false);
	const [name, setName] = useState("");
	const nameRef = useRef();

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
		<>
			<div className="users" id="users" ref={userSectionRef}>
				{users.map((user) => {
					return (
						<>
							<CashInput
								key={user.idx}
								username={user.name}
								updateTotalExpense={(amount) => {
									setTotalExpense(totalExpense + amount);
								}}
								updateTransactions={(amount, purchaseInfo) => {
									addTransaction(
										user.idx,
										amount,
										purchaseInfo
									);
								}}
							/>
							<div className="transactions-list">
								<ul className="user-transactions">
									{user.transactions.map((tr) => {
										return (
											<li>
												{tr.purchaseInfo}: {tr.amount}{" "}
												rupees.
											</li>
										);
									})}
								</ul>
							</div>
						</>
					);
				})}
			</div>
			{showUserInput && (
				<div className="add-user-section">
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
						type="button"
						onClick={(ev) => {
							onSave(ev);
						}}
					>
						Save
					</button>
					<button
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
					type="button"
					onClick={(ev) => {
						onAddUser(ev);
					}}
				>
					Add User
				</button>
			)}
			<div className="expenses-summary">
				<div className="total-expense">
					Total Expenses: {totalExpense} rupees.
				</div>
				{noOfUsers > 0 && (
					<div className="avg-expense">
						Average Expenses per head: {totalExpense / noOfUsers}{" "}
						rupees.
					</div>
				)}
			</div>
		</>
	);
};

export default ActionTray;
