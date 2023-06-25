import React, { useEffect, useRef, useState } from "react";
import cn from "classnames";
import EditOverlay from "./overlay/EditOverlay";
import ConfirmOverlay from "./overlay/ConfirmOverlay";
import ErrorMessage from "./ErrorHandler";
import util from "./Utils";

import "./UserActions.scss";

export const TransactionsList = ({
	transactions = [],
	deleteTransaction = (f) => f,
	editTransaction = (f) => f,
}) => {
	const [showEditOverlay, toggleShowEditOverlay] = useState(false);
	const [showDeleteConfirmOverlay, toggleDeleteConfirmOverlay] =
		useState(false);
	const currEditTransaction = useRef({});

	return transactions.length > 0 ? (
		<>
			<table className="transactions-list-table">
				<thead className="transaction-header">
					<tr>
						<th>Purchase Info</th>
						<th>Amount</th>
						<th>Actions</th>
					</tr>
				</thead>
				<tbody className="user-transactions">
					{transactions.map((tr) => {
						return (
							<tr
								className="transaction-row"
								key={tr.transactionID}
							>
								<td className="transaction-info">
									{tr.purchaseInfo}
								</td>
								<td className="transaction-amount">
									Rs. {tr.amount}
								</td>
								<td>
									<button
										type="button"
										className="edit-btn"
										value={tr.transactionID}
										onClick={(ev) => {
											ev.stopPropagation();

											toggleShowEditOverlay(true);
											currEditTransaction.current = {
												editPurchaseInfo:
													tr.purchaseInfo,
												editPurchaseAmount: tr.amount,
												transactionID: tr.transactionID,
											};
										}}
									>
										<svg
											xmlns="http://www.w3.org/2000/svg"
											width="20"
											height="20"
											viewBox="0 0 24 24"
											fill="none"
											stroke="rgb(0, 130, 211)"
											strokeWidth="2"
											strokeLinecap="round"
											strokeLinejoin="round"
											className="feather feather-edit"
										>
											<path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
											<path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
										</svg>
									</button>
									<button
										type="button"
										className="delete-btn"
										value={tr.transactionID}
										onClick={(ev) => {
											ev.stopPropagation();

											toggleDeleteConfirmOverlay(true);
											currEditTransaction.current = {
												editPurchaseInfo:
													tr.purchaseInfo,
												editPurchaseAmount: tr.amount,
												transactionID: tr.transactionID,
											};
										}}
									>
										<svg
											xmlns="http://www.w3.org/2000/svg"
											width="20"
											height="20"
											viewBox="0 0 24 24"
											fill="none"
											stroke="rgb(213, 32, 47)"
											strokeWidth="2"
											strokeLinecap="round"
											strokeLinejoin="round"
											className="feather feather-trash-2"
										>
											<polyline points="3 6 5 6 21 6"></polyline>
											<path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
											<line
												x1="10"
												y1="11"
												x2="10"
												y2="17"
											></line>
											<line
												x1="14"
												y1="11"
												x2="14"
												y2="17"
											></line>
										</svg>
									</button>
								</td>
							</tr>
						);
					})}
				</tbody>
			</table>
			{showEditOverlay && (
				<EditOverlay
					{...currEditTransaction.current}
					onClose={() => {
						currEditTransaction.current = {};
						toggleShowEditOverlay(false);
					}}
					onUpdate={(id, amount, info) => {
						editTransaction(
							id,
							amount,
							info,
							currEditTransaction.current.editPurchaseAmount
						);
						currEditTransaction.current = {};
						toggleShowEditOverlay(false);
					}}
				/>
			)}
			{showDeleteConfirmOverlay && (
				<ConfirmOverlay
					template="TRANSACTION_DELETE"
					{...currEditTransaction.current}
					onClose={() => {
						currEditTransaction.current = {};
						toggleDeleteConfirmOverlay(false);
					}}
					onDelete={(id, amount) => {
						deleteTransaction(id, amount);

						currEditTransaction.current = {};
						toggleDeleteConfirmOverlay(false);
					}}
				/>
			)}
		</>
	) : null;
};

const TransactionsInput = ({
	username = "User",
	avg,
	transactions = [],
	updateTotalExpense = (f) => f,
	addNewTransaction = (f) => f,
	deleteTransaction = (f) => f,
	editTransaction = (f) => f,
}) => {
	const amountRef = useRef();
	const purchaseInfoRef = useRef();
	const [amount, setAmount] = useState(0);
	const [purchaseInfo, updatePurchaseInfo] = useState("");
	const [total, setTotal] = useState(0);
	const [hasError, toggleHasError] = useState(false);
	const errorText = useRef("");

	useEffect(() => {
		const currTotal = transactions.reduce((sum, x) => sum + x.amount, 0);
		setTotal(currTotal);
	}, []);

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

		if (purchaseInfo === "") {
			errorText.current = util.getErrorMessage("EMPTY_PURCHASE_INFO");
			toggleHasError(true);
		} else {
			setTotal(amount + total);
			updateTotalExpense(amount);
			addNewTransaction(amount, purchaseInfo);
			setAmount(0);
			updatePurchaseInfo("");
			amountRef.current.value = "";
			purchaseInfoRef.current.value = "";
		}
	};

	return (
		<>
			<div className="user">
				<h2 className="username">{username}</h2>
				<div className="purchase-input d-flex">
					<input
						ref={purchaseInfoRef}
						type="text"
						maxLength={50}
						placeholder="Enter Purchase Info"
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
						onChangeCapture={(e) => {
							handleAmountInput(e);
						}}
						onKeyDown={(ev) => {
							if (ev.keyCode === 13) onSave(ev);
						}}
					/>
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
				<div className="price-summary d-flex">
					<div className="total-price d-flex">
						<span className="total-text">
							Total Amount Spent (INR)
						</span>
						<input
							className="total-amount"
							type="number"
							placeholder="Total Amount"
							value={total}
							readOnly
							disabled
						/>
					</div>
					<div className="settlement-price d-flex">
						<span className="settlement-text">
							Pending Settlement (INR)
						</span>
						<input
							type="number"
							className={cn("balance", {
								positive: avg - total <= 0,
								negative: avg - total > 0,
							})}
							value={avg - total}
							readOnly
							disabled
						/>
					</div>
				</div>
			</div>
			<TransactionsList
				transactions={transactions}
				deleteTransaction={(transactionID, trAmount) => {
					deleteTransaction(transactionID, trAmount);
					setTotal(total - trAmount);
				}}
				editTransaction={(transID, newAmount, newInfo, oldAmount) => {
					editTransaction(transID, newAmount, newInfo);
					setTotal(total - oldAmount + newAmount);
				}}
			/>
			<ErrorMessage
				id="transactions-input-errors"
				errorText={errorText.current}
				showError={hasError}
				onErrorShown={() => {
					errorText.current = "";
					toggleHasError(false);
				}}
				onErrorClosed={() => {}}
			/>
		</>
	);
};

export default TransactionsInput;
