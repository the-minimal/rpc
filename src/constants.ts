import { type Procedure, Protocol } from "./types.js";

export const PROCEDURE_MAP = new Map<string, Procedure.Any>();

export const PROTOCOL_METHOD_MAP = {
	[Protocol.Json]: "json",
	[Protocol.Binary]: "arrayBuffer",
} as const;

export const PROTOCOL_CONTENT_TYPE_MAP = {
	[Protocol.Json]: "application/json",
	[Protocol.Binary]: "application/octet-stream",
} as const;

export const DEFAULT_ERROR = "Something went wrong";
export const PROCEDURE_NOT_FOUND_ERROR = "Procedure not found";
export const DEFAULT_CODE = 500;
