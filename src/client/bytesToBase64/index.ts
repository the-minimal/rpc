export const bytesToBase64 = async (bytes: Uint8Array) => {
	return btoa(String.fromCharCode(...bytes));
};
