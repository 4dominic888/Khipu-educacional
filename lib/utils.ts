import { QueryParams } from "@/core/shared";
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}


/**
 * Convierte un string que originalmente era un JSON pero es un URIComponent a un JSON.
 * @param input El URIComponent a convertir
 * @returns El JSON o `undefined` si no se logra convertir.
 */
function uriComponentToJson(input: string): any | undefined {
  try {
    return JSON.parse(decodeURIComponent(input));
  } catch(error) {
    console.log(error);
    return undefined;
  }
}

/**
 * Convierte un string que originalmente era un JSON pero esta en URL a un objeto de tipo `QueryParams`.
 * @param raw JSON en URL
 * @returns Objeto de tipo `QueryParams` o `undefined` si no se logra convertir.
 */
export function rawToQueryParams<T>(raw: string | null): QueryParams<T> | undefined {
  if (raw) {
    const queryParams = uriComponentToJson(raw);
    if(!queryParams) return undefined;

    return {
      filter: queryParams.filter,
      sort: queryParams.sort,
      pagination: queryParams.pagination
    };
  }
}