import { Pool, PoolClient } from "pg";

export interface PostgresRepositoryBase {
    db: Pool | PoolClient;
}