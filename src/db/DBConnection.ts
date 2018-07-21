import {Pool, PoolClient} from 'pg';

export class DBConnection {
  private static instance: DBConnection;
  private pool: Pool;

  private constructor() {
    this.pool = new Pool();
  }

  static getInstance() {
    if (!this.instance) {
      this.instance = new DBConnection();
    }

    return this.instance;
  }

  public query(text: string, params: any[], callback: Function) {
    const start = Date.now();
    return this.pool.query(text, params, (err, res) => {
      const duration = Date.now() - start;
      console.log('executed query', {text, duration, rows: res.rowCount});
      callback(err, res);
    });
  }

  public getClient(callback: (client: PoolClient) => Promise<any>) {
    this.pool.connect(async (err, client, done) => {
      try {
        if (err) throw err;
        await callback(client);
      } catch (e) {
        throw e;
      } finally {
        done();
      }
    });
  }
}
