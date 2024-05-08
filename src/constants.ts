import type { AnyProcedure } from "@types";

export const PROCEDURE_MAP = new Map<`${string}:${string}`, AnyProcedure>();

export const DEFAULT_ERROR = "Something went wrong";
export const PROCEDURE_NOT_FOUND_ERROR = "Procedure not found";
export const DEFAULT_CODE = 500;

export const TEXT_DECODER = new TextDecoder();
