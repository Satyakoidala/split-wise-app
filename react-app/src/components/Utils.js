const getErrorMessage = (templateID) => {
	switch (templateID) {
		case "EMPTY_USERNAME":
			return "Empty Username is not allowed!";
		case "NOT_UNIQUE_USERNAME":
			return "Enter a unique username :)";
		case "EMPTY_PURCHASE_INFO":
			return "Empty Purchase Information!!";
		case "EMPTY_PURCHASE_AMOUNT":
			return "Empty Purchase Amount is not allowed!";
		default:
			return "No error!!";
	}
};

const findUser = (users, id) => {
	return users.find((x) => {
		return id === x.idx;
	});
};

export default {
	getErrorMessage,
	findUser,
};
