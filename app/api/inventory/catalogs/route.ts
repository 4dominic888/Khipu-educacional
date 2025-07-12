import { rawQueryParamsToSQL, withTransaction } from "@/lib/db";
import { CatalogItem } from "@/types/khipu/inventory.types";
import { NextResponse } from "next/server";

/**
 * Maneja solicitudes GET para consultar elementos del catálogo.
 *
 * @param req Objeto `Request` de Next.js con un parámetro opcional `query` en formato JSON codificado por URL, de tipo `QueryParams<CatalogItem>`.
 * @returns Una respuesta JSON con un arreglo de `CatalogItem[]` o un error.
 *
 * @example
 * // Request:
 * GET /api/catalog_item?query=%7B%22filter%22%3A%7B%22name%22%3A%7B%22op%22%3A%22contains%22%2C%22value%22%3A%22tool%22%7D%7D%7D
 * 
 * o
 * 
 * GET /api/catalog_item
 *
 * // Response:
 * [
 *   { "id": "1535", "name": "MESA DE ADOBE" },
 *   { "id": "1536", "name": "PUERTA DE HIERRO" },
 * ]
 */
export async function GET(req: Request) {
    const { searchParams } = new URL(req.url);
    const raw = searchParams.get('query');
    
    try {
        const { sql, values } = rawQueryParamsToSQL<CatalogItem>({
            rawQuery: raw,
            selectFields: 'id, name',
            tableName: 'catalog_item',
            defaultQuery: {
                sort: [{ field: 'name', direction: 'asc' }],
                pagination: { page: 1, pageSize: 20 }
            }
        });

        const result = await withTransaction(async (client) => {
            const { rows } = await client.query<CatalogItem>(sql, values);
            return NextResponse.json(rows);
        });

        return NextResponse.json(result);
    }
    catch (error) {
        console.log(error);
        return NextResponse.json({ error: 'Ocurrió un error inesperado' }, { status: 500 });
    }
}


/**
 * Maneja solicitudes POST para insertar uno o varios elementos en el catálogo.
 *
 * - El cuerpo debe contener un objeto o arreglo de objetos `CatalogItem`, con:
 *   - `id`: Código en el catálogo
 *   - `name`: Nombre del elemento
 * - Los datos se validan (formato JSON, campos obligatorios) antes de insertarse.
 * - Se ejecuta un `INSERT INTO` con placeholders parametrizados para seguridad SQL.
 * - La operación se realiza dentro de una transacción SQL.
 *
 * @param req Objeto `Request` de Next.js con el cuerpo JSON, pide un tipo `CatalogItem` o `CatalogItem[]`. 
 * @returns Una respuesta JSON con `{ count: number }` (filas insertadas) o mensaje de error.
 *
 * @example
 * // Request:
 * POST /api/catalog_item
 * Content-Type: application/json
 * 
 * [
 *   { "id": "uuid-1", "name": "Toolbox" },
 *   { "id": "uuid-2", "name": "Screwdriver Set" }
 * ]
 *
 * // Response:
 * { "count": 2 }
 */
export async function POST(req: Request) {
    let catalogItems : CatalogItem[];

    try {
        const body = await req.json();
        catalogItems = Array.isArray(body) ? body : [body];
    }
    catch (error) {
        return NextResponse.json({ error: 'JSON inválido' }, { status: 400 });
    }

    if (catalogItems.length === 0) return NextResponse.json({ error: 'Datos no proporcionados' }, { status: 400 });

    const invalid = catalogItems.find(item => !item.id || !item.name);
    if (invalid) return NextResponse.json({ error: 'Datos no consistentes' }, { status: 400 });

    const values: string[] = [];
    const placeholders: string[] = [];

    catalogItems.forEach(({ id, name }, i) => {
        const idx = i * 2;
        placeholders.push(`($${idx + 1}, $${idx + 2})`);
        values.push(id, name);
    });

    const query = `INSERT INTO catalog_item (id, name) VALUES ${placeholders.join(', ')}`;
    try {
        await withTransaction(async (client) => {
            const { rowCount } = await client.query(query, values);
            if (!rowCount) NextResponse.json({ error: 'No se ha agregado ningún elemento' }, { status: 500 });
            return NextResponse.json({ count: rowCount });
        });
    }
    catch (error) {
        console.log(error);
        return NextResponse.json({ error: 'Ocurrió un error inesperado' }, { status: 500 });
    }
}