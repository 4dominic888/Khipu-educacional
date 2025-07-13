import { QueryParams } from '@/types/helpers';
import { CatalogItem } from '@/types/khipu/inventory.types';
import axios from 'axios';

describe('Inventory API', () => {
  it('should return a list of catalog items withou filters', async () => {
    const response = await axios.get<CatalogItem[]>('http://localhost:3000/api/inventory/catalogs');
    console.log(response.data);
    expect(response.status).toBe(200);
    expect(response.data.length).toBeGreaterThan(0);
    expect(response.data[0].id).toBeDefined();
    expect(response.data[0].name).toBeDefined();
  });

  it('should return a list of catalog items with filters', async () => {

    const filter: QueryParams<CatalogItem> = {
        sort: [{ field: 'id', direction: 'asc' }],
        pagination: { page: 1, pageSize: 2 },
    };
    const response = await axios.get<CatalogItem[]>('http://localhost:3000/api/inventory/catalogs', {
        params: {
            queryParams: encodeURIComponent(JSON.stringify(filter))
        }
    });

    console.log(response.data);
    expect(response.status).toBe(200);
    expect(response.data.length).toBe(2);
    expect(response.data[0].id).toBe("00000000-0000-0000-0000-000000000001");

  });

});