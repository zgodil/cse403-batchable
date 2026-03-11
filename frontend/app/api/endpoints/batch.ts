import * as json from '~/domain/json';
import {CrudApi} from '../crud';
import type {Batch, Order} from '~/domain/objects';
import {fetchJSON} from '../common';

/**
 * A wrapper around the Batch API. This API doesn't support `create()`, `update()`, or `delete()`.
 */
class BatchApi extends CrudApi<Batch> {
  constructor() {
    super('/order/batch', json.batch);
  }
  /**
   * Returns a list of all the orders within a given batch.
   * @param id The id of the batch to get orders for
   * @returns The orders, or null if it fails
   */
  async getOrders({id}: Batch['id']) {
    try {
      const orders: json.JSONDomainObject<Order>[] = await fetchJSON(
        'GET',
        `${this.resource}/${id}/orders`,
      );
      return orders.map(json.order.parse);
    } catch (err) {
      this.error(`Cannot get orders for batch; id=${id}`, err);
      return null;
    }
  }
}

export const batchApi = new BatchApi();
