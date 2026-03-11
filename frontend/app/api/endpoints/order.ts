import * as json from '~/domain/json';
import {CrudApi} from '../crud';
import type {Order} from '~/domain/objects';
import {fetchEndpoint} from '../common';

/**
 * A wrapper around the Order API. This API doesn't support `update()`.
 */
class OrderApi extends CrudApi<Order> {
  constructor() {
    super('/order', json.order);
  }
  /**
   * Marks a given order as completed. This method does not require authorization beyond the a driver token.
   * @param id The order to deliver
   * @param driverToken The token for the driver who is assigned the batch the order is contained within
   * @returns true iff it is successfully marked as delivered
   */
  async markDelivered({id}: Order['id'], driverToken: string) {
    try {
      await fetchEndpoint(
        'PUT',
        `${this.resource}/${id}/delivered/${driverToken}`,
        undefined,
        {includeAuth: false},
      );
      return true;
    } catch (err) {
      this.error(`Failed to mark order as delivered; id=${id}`, err);
      return false;
    }
  }
  /**
   * Advances the state of a given order, from `cooking` to `cooked`.
   * @param id The id of the order to advance
   * @returns true iff the order is successfully advanced
   */
  async advanceState({id}: Order['id']) {
    try {
      await fetchEndpoint('PUT', `${this.resource}/${id}/advance`);
      return true;
    } catch (err) {
      this.error(`Failed to advance order state; id=${id}`, err);
      return false;
    }
  }
  /**
   * Modifies the estimated cooked time timestamp of a given order.
   * @param id The id of the order to update
   * @param cookedTime The new cooked timestamp
   * @returns true iff the update is successful
   */
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
  /**
   * Marks a given order as being remade, causing it to act as though it were just added.
   * @param id The id of the order to be remade
   * @returns true iff it successfully recreates the order
   */
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
