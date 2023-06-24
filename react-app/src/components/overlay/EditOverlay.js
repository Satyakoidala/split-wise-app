import React, { useState } from "react";
import reactDOM from "react-dom";

import "./Overlay.scss";

const TransactionEditOverlay = ({
	transactionID,
	editPurchaseInfo,
	editPurchaseAmount,
	onClose = (f) => f,
	onUpdate = (f) => f,
}) => {
	const [amount, setAmount] = useState(editPurchaseAmount);
	const [purchaseInfo, updatePurchaseInfo] = useState(editPurchaseInfo);

	return (
		<div className="transaction-edit-overlay overlay d-flex">
			<div className="overlay-content">
				<h2>Edit Transaction</h2>
				<div className="purchase-info">
					<fieldset>
						<legend>Purchase Info</legend>
						<input
							type="text"
							maxLength={50}
							// placeholder="Enter Purchase Info"
							onChangeCapture={(e) => {
								e.stopPropagation();

								updatePurchaseInfo(e.target.value);
							}}
							value={purchaseInfo}
						/>
					</fieldset>
				</div>
				<div className="purchase-amount">
					<fieldset>
						<legend>Purchase Amount</legend>
						<input
							type="number"
							min={1}
							max={10000}
							// placeholder="Enter amount"
							onChangeCapture={(e) => {
								e.stopPropagation();

								setAmount(Number.parseInt(e.target.value, 10));
							}}
							value={amount}
						/>
					</fieldset>
				</div>
				<div className="actions d-flex">
					<button
						type="button"
						className="btn-update"
						onClick={() => {
							onUpdate(transactionID, amount, purchaseInfo);
						}}
					>
						Update
					</button>
					<button
						type="button"
						className="btn-cancel"
						onClick={onClose}
					>
						Cancel
					</button>
				</div>
			</div>
		</div>
	);
};

const EditOverlay = ({ ...rest }) => {
	const overlay = document.getElementById("overlay");

	return (
		overlay &&
		reactDOM.createPortal(<TransactionEditOverlay {...rest} />, overlay)
	);
};

export default EditOverlay;
