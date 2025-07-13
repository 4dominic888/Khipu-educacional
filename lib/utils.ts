import { failure, QueryParams, Result, SortOrder, success } from "@/types/helpers";
import { clsx, type ClassValue } from "clsx"
import { Pool, PoolClient, QueryResultRow } from "pg";
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

type RunQueryParams = {
  db: Pool | PoolClient,
  query: string,
  params: unknown[],
  errorMessage: string
}

/**
 * Ejecuta una consulta SQL con manejo de errores y respuesta tipada.
 * 
 * @template T Tipo del dato esperado en la respuesta.
 * @param db Conexión a la base de datos (`Pool` o `PoolClient`).
 * @param query SQL parametrizado.
 * @param params Parámetros del SQL.
 * @param errorMessage Mensaje personalizado para devolver en caso de error o fallo.
 * @returns Resultado de tipo `Result<T, string>` conteniendo el primer registro, o un mensaje de error.
 */
export async function runQuery<T extends QueryResultRow>(
  {db, query, params, errorMessage} : RunQueryParams
): Promise<Result<T, string>> {
  try {
    const { rows, rowCount } = await db.query<T>(query, params);

    if (!rowCount || rows.length === 0) {
      return failure(errorMessage);
    }

    return success(rows[0]);
  } catch (error) {
    console.error(error);
    return failure(errorMessage);
  }
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