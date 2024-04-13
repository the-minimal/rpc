export const error = (code: number, message: string) => {
	throw { code, message };
};
