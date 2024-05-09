export const base64ToBytes = async (base64: string) => {
	const string = atob(base64);
	const length = string.length;
	const bytes = new Uint8Array(length);

	for (let i = 0; i < length; i++) {
		bytes[i] = string.charCodeAt(i);
	}

	return bytes;
};
