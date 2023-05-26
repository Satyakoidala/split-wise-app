import React, { useRef, useState } from "react";

export const TransactionsList = ({
	transactions = [],
	deleteTransaction = (f) => f,
}) => {
	return (
		<div className="transactions-list">
			<ul className="user-transactions">
				{transactions.map((tr) => {
					return (
						<li className="transaction-row" key={tr.transactionID}>
							<div className="transaction-info">
								{tr.purchaseInfo}: {tr.amount} rupees.
							</div>
							<button
								type="button"
								className="delete-btn"
								value={tr.transactionID}
								onClick={(ev) => {
									ev.stopPropagation();

									deleteTransaction(
										Number.parseInt(ev.target.value, 10),
										tr.amount
									);
								}}
							>
								Delete
							</button>
						</li>
					);
				})}
			</ul>
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
				<div className="username">{username}</div>
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
				<button
					type="button"
					onClick={(ev) => {
						onSave(ev);
					}}
				>
					Add Expense
				</button>
				<input
					type="number"
					placeholder="Total Amount"
					value={total}
					readOnly
				/>
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
