import uuid from 'uuid/v4';

export class SubscriptionDaemonService {
  private static instance: SubscriptionDaemonService;
  private minute = 60000;
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
      await this.requester(cb);

      if (!this.pools[id]) {
        this.pools[id] = {
          timer: setTimeout(() => this.repeater(id, cb), this.minute),
          count: 1,
        };
      } else {
        this.pools[id].count = this.pools[id].count + 1;
      }
    } catch (e) {
      throw e;
    }
  }

  private async requester(cb: () => Promise<void>) {
    return cb().catch((err) => console.log(err));
  }
}
