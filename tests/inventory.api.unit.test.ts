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

    let filter: QueryParams<CatalogItem> = {
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

    filter = {};

    const response2 = await axios.get<CatalogItem[]>('http://localhost:3000/api/inventory/catalogs', {
        params: {
            queryParams: encodeURIComponent(JSON.stringify(filter))
        }
    });
    console.log(response2.data);
    expect(response2.status).toBe(200);
    expect(response2.data).toBeDefined();
    expect(response2.data.length).toBe(3);

    filter = {
        sort: [{ field: 'id', direction: 'desc' }, { field: 'name', direction: 'asc' }],
    }
    const response3 = await axios.get<CatalogItem[]>('http://localhost:3000/api/inventory/catalogs', {
      params: {
        queryParams: encodeURIComponent(JSON.stringify(filter))
      }
    });

    console.log(response3.data);
    expect(response3.status).toBe(200);
    expect(response3.data[0].id).toBe("00000000-0000-0000-0000-000000000003");

    filter = {
        filter: { name: { op: 'contains', value: 'e' } },
    }
    const response4 = await axios.get<CatalogItem[]>('http://localhost:3000/api/inventory/catalogs', {
      params: {
        queryParams: encodeURIComponent(JSON.stringify(filter))
      }
    });
    console.log(response4.data);
    expect(response4.status).toBe(200);
    expect(response4.data.length).toBe(2);
    expect(response4.data[0].name).toBe("Mesa"); 
    expect(response4.data[1].name).toBe("Proyector"); 

  });

});