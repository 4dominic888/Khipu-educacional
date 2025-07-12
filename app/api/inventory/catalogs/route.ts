import { rawQueryParamsToSQL, withTransaction } from "@/lib/db";
import { CatalogItem } from "@/types/khipu/inventory.types";
import { NextResponse } from "next/server";

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

export async function POST(req: Request) {
    let CatalogItems : CatalogItem[];

    try {
        const body = await req.json();
        CatalogItems = Array.isArray(body) ? body : [body];
    }
    catch (error) {
        return NextResponse.json({ error: 'JSON inválido' }, { status: 400 });
    }

    if (CatalogItems.length === 0) return NextResponse.json({ error: 'Datos no proporcionados' }, { status: 400 });

    const invalid = CatalogItems.find(item => !item.id || !item.name);
    if (invalid) return NextResponse.json({ error: 'Datos no consistentes' }, { status: 400 });

    const values: string[] = [];
    const placeholders: string[] = [];

    CatalogItems.forEach(({ id, name }, i) => {
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