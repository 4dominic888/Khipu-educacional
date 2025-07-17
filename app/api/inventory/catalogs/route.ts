import { executeTransationInApi } from "@/infrastructure/shared/db";
import { RepositorySimpleWithAddAll } from "@/core/shared/repository-base";
import { CatalogInventoryRepository } from "@/lib/repositories/inventory";
import { rawToQueryParams } from "@/lib/utils";
import { Result } from "@/types/helpers";
import { CatalogItem } from "@/core/domain/inventory/main";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
    try {
        const { searchParams } = new URL(req.url);
        const raw = searchParams.get('queryParams');
        const queryParams = rawToQueryParams<CatalogItem>(raw);

        return await executeTransationInApi(req)(async (client) => {
            const repo : RepositorySimpleWithAddAll<CatalogItem> = new CatalogInventoryRepository(client);
            const result = await repo.getAll(queryParams);
            if(result.length === 0) return NextResponse.json({ error: 'No se encontraron elementos' }, { status: 404 });
            return NextResponse.json(result);
        });
    }
    catch (error) {
        return NextResponse.json({ error: error }, { status: 500 });
    }
}

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

    let result : Result<any, string> | undefined;
    try {
        executeTransationInApi(req)(async (client) => {
            const repo : RepositorySimpleWithAddAll<CatalogItem> = new CatalogInventoryRepository(client);
            
            if(catalogItems.length === 1) result = await repo.add(catalogItems[0]);
            else result = await repo.addAll(catalogItems);
    
            return NextResponse.json(result.message);
        });
    }
    catch (error) {
        return NextResponse.json({ error: result?.message ?? 'Error al agregar' }, { status: 500 });
    }
}