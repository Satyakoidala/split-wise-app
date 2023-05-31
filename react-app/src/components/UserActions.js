import React, { useRef, useState } from "react";

import "./UserAction.scss";

export const TransactionsList = ({
	transactions = [],
	deleteTransaction = (f) => f,
}) => {
	return (
		<div className="transactions-list-table">
			{transactions.length > 0 && (
				<>
					<div className="transaction-header d-flex">
						<h3>Purchase Info</h3>
						<h3>Amount</h3>
						<h3>Delete</h3>
					</div>
					<ul className="user-transactions">
						{transactions.map((tr) => {
							return (
								<li
									className="transaction-row d-flex"
									key={tr.transactionID}
								>
									<span className="transaction-info">
										{tr.purchaseInfo}
									</span>
									<span className="transaction-amount">
										Rs. {tr.amount}
									</span>
									<button
										type="button"
										className="delete-btn"
										value={tr.transactionID}
										onClick={(ev) => {
											ev.stopPropagation();

											deleteTransaction(
												Number.parseInt(
													ev.target.value,
													10
												),
												tr.amount
											);
										}}
									>
										X
									</button>
								</li>
							);
						})}
					</ul>
				</>
			)}
		</div>
	);
};

const TransactionsInput = ({
	username = "User",
	updateTotalExpense = (f) => f,
	updateTransactions = (f) => f,
	transactions = [],
	deleteTransaction = (f) => f,
}) => {
	const amountRef = useRef();
	const purchaseInfoRef = useRef();
	const [amount, setAmount] = useState(0);
	const [purchaseInfo, updatePurchaseInfo] = useState("");
	const [total, setTotal] = useState(0);

	const handleAmountInput = (ev) => {
		ev.stopPropagation();
		const inputAmount = Number.parseInt(ev.target.value, 10);

		// console.log(inputAmount);
		setAmount(inputAmount);
	};

	const handlePurchaseInfoInput = (ev) => {
		ev.stopPropagation();
		const purchaseInfoText = ev.target.value;

		updatePurchaseInfo(purchaseInfoText);
	};

	const onSave = (ev) => {
		ev.stopPropagation();

		setTotal(amount + total);
		updateTotalExpense(amount);
		updateTransactions(amount, purchaseInfo);
		setAmount(0);
		updatePurchaseInfo("");
		amountRef.current.value = "";
		purchaseInfoRef.current.value = "";
	};

	return (
		<>
			<div className="user">
				<h3 className="username">{username}</h3>
				<div className="d-flex">
					{/* <div className="left"> */}
					<input
						ref={purchaseInfoRef}
						type="text"
						maxLength={50}
						placeholder="Enter Purchase Info"
						style={{ width: 200 }}
						onChangeCapture={(e) => {
							handlePurchaseInfoInput(e);
						}}
						onKeyDown={(ev) => {
							if (ev.keyCode === 13) {
								amountRef.current.focus();
							}
						}}
					/>
					{/* </div> */}
					{/* <div className="right"> */}
					<input
						ref={amountRef}
						type="number"
						min={1}
						max={10000}
						placeholder="Enter amount"
						style={{ width: 200 }}
						onChangeCapture={(e) => {
							handleAmountInput(e);
						}}
						onKeyDown={(ev) => {
							if (ev.keyCode === 13) onSave(ev);
						}}
					/>
					{/* </div> */}
					<button
						className="add-expense-btn"
						type="button"
						onClick={(ev) => {
							onSave(ev);
						}}
					>
						Add Expense
					</button>
				</div>
				<div className="user-total-display d-flex">
					<span className="total-text">Total Amount Spent:</span>
					<input
						type="number"
						placeholder="Total Amount"
						value={total}
						readOnly
					/>
				</div>
			</div>
			<TransactionsList
				transactions={transactions}
				deleteTransaction={(transactionID, trAmount) => {
					deleteTransaction(transactionID, trAmount);
					setTotal(total - trAmount);
				}}
			/>
		</>
	);
};

export default TransactionsInput;
