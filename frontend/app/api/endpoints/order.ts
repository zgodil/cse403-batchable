import * as json from '~/domain/json';
import {CrudApi} from '../crud';
import type {Order} from '~/domain/objects';
import {fetchEndpoint, fetchJSON} from '../common';

class OrderApi extends CrudApi<Order> {
  constructor() {
    super('/api/order', json.order);
  }

  /** Create order; throws on error so caller can show the server message (e.g. invalid address). */
  override async create(domainObject: Order): Promise<Order['id'] | null> {
    try {
      const id = await fetchJSON(
        'POST',
        this.resource,
        json.order.unparse(domainObject),
      );
      return json.order.field('id').parse(id);
    } catch (err) {
      this.error(`Failed to create ${this.resource}`, domainObject, err);
      throw err;
    }
  }
  async advanceState({id}: Order['id']) {
    try {
      await fetchEndpoint('PUT', `${this.resource}/${id}/advance`);
      return true;
    } catch (err) {
      this.error(`Failed to advance order state; id=${id}`, err);
      return false;
    }
  }
  async updateCookedTime({id}: Order['id'], cookedTime: Date) {
    try {
      await fetchEndpoint(
        'PUT',
        `${this.resource}/${id}/cookedTime`,
        cookedTime.toISOString(),
      );
      return true;
    } catch (err) {
      this.error(`Failed to update order cooked time; id=${id}`, err);
      return false;
    }
  }
  async remake({id}: Order['id']) {
    try {
      await fetchEndpoint('PUT', `${this.resource}/${id}/remake`);
      return true;
    } catch (err) {
      this.error(`Failed to remake order; id=${id}`, err);
      return false;
    }
  }
}

export const orderApi = new OrderApi();
