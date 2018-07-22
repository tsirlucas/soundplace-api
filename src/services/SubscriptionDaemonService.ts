import uuid from 'uuid/v4';

export class SubscriptionDaemonService {
  private static instance: SubscriptionDaemonService;
  private minute = 40000;
  private pools: {[index: string]: {timer: NodeJS.Timer; count: number}} = {};

  static getInstance() {
    if (!this.instance) {
      this.instance = new SubscriptionDaemonService();
    }

    return this.instance;
  }

  public run(cb: () => Promise<void>) {
    try {
      const id = uuid();
      this.repeater(id, cb);
      return id;
    } catch (e) {
      throw e;
    }
  }

  public runWithoutRepetition(id: string, cb: () => Promise<void>) {
    try {
      this.repeater(id, cb);

      return id;
    } catch (e) {
      throw e;
    }
  }

  public stop(id: string) {
    if (this.pools[id]) {
      this.pools[id].count = this.pools[id].count - 1;
      if (this.pools[id].count === 0) {
        clearTimeout(this.pools[id].timer);
        delete this.pools[id];
      }
    }
  }

  private async repeater(id: string, cb: () => Promise<void>) {
    try {
      if (!this.pools[id]) {
        this.pools[id] = {
          timer: setTimeout(() => this.requester(id, cb), this.minute),
          count: 1,
        };

        await this.requester(id, cb);
      } else {
        this.pools[id].count = this.pools[id].count + 1;
      }
    } catch (e) {
      throw e;
    }
  }

  private async requester(poolId: string, cb: () => Promise<void>) {
    const pool = this.pools[poolId] || {};
    clearTimeout(pool.timer);

    await cb().catch((err) => console.log(err));

    if (this.pools[poolId]) {
      this.pools[poolId].timer = setTimeout(() => this.requester(poolId, cb), this.minute);
    }
  }
}
