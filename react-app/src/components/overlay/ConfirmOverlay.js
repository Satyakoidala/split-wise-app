import React from "react";
import reactDOM from "react-dom";

import "./Overlay.scss";

const UserDeleteConfirmOverlay = () => {};

const TransactionDeleteConfirmOverlay = ({
	transactionID,
	editPurchaseInfo,
	editPurchaseAmount,
	onClose = (f) => f,
	onDelete = (f) => f,
}) => {
	return (
		<div className="transaction-delete-confirm-overlay overlay d-flex">
			<div className="overlay-content">
				<h3>Confirm Transaction to Delete?</h3>
				<div className="purchase-info">
					<fieldset>
						<legend>Purchase Info</legend>
						<input
							type="text"
							maxLength={50}
							// placeholder="Enter Purchase Info"
							value={editPurchaseInfo}
							readOnly
							disabled
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
							value={editPurchaseAmount}
							readOnly
							disabled
						/>
					</fieldset>
				</div>
				<div className="actions d-flex">
					<button
						type="button"
						className="btn-confirm"
						onClick={() => {
							onDelete(transactionID, editPurchaseAmount);
						}}
					>
						Yes
					</button>
					<button
						type="button"
						className="btn-cancel"
						onClick={onClose}
					>
						No
					</button>
				</div>
			</div>
		</div>
	);
};

const ConfirmOverlay = ({ template, ...rest }) => {
	const overlay = document.getElementById("overlay");

	let OverlayComponent;

	switch (template) {
		case "TRANSACTION_DELETE":
			OverlayComponent = <TransactionDeleteConfirmOverlay {...rest} />;
			break;
		case "USER_DELETE":
			OverlayComponent = <UserDeleteConfirmOverlay {...rest} />;
			break;

		default:
			console.log("Normal confirm case");
	}

	return overlay && reactDOM.createPortal(OverlayComponent, overlay);
};

export default ConfirmOverlay;
