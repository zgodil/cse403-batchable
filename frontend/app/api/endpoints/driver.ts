import * as json from '~/domain/json';
import {CrudApi} from '../crud';
import type {Batch, Driver, Order} from '~/domain/objects';
import {fetchEndpoint, fetchJSON} from '../common';

/**
 * A wrapper around the Driver API.
 */
class DriverApi extends CrudApi<Driver> {
  constructor() {
    super('/driver', json.driver);
  }
  /**
   * Returns the {@link Driver}, {@link Order}s, and Google Maps link associated with a driver. This method does not require any authorization beyond a driver token.
   * @param token The token for the driver
   * @returns An object containing all of the route information, or null if it fails
   */
  async getRouteInfo(token: string) {
    try {
      const routeInfo: {
        driver: json.JSONDomainObject<Driver>;
        mapLink: string | null;
        orders: json.JSONDomainObject<Order>[] | null;
      } = await fetchJSON('GET', `${this.resource}/route/${token}`, undefined, {
        includeAuth: false,
      });

      return {
        driver: json.driver.parse(routeInfo.driver),
        mapLink: routeInfo.mapLink,
        orders: routeInfo.orders?.map(json.order.parse) ?? null,
      };
    } catch (err) {
      this.error(`Failed to read driver by token; token=${token}`, err);
      return null;
    }
  }
  /**
   * Marks a driver as having returned to the restaurant. This method does not require any authorization beyond a driver token.
   * @param token The token for the driver
   * @returns true iff they were successfully marked as returned
   */
  async markReturned(token: string) {
    try {
      await fetchEndpoint(
        'PUT',
        `${this.resource}/returned/${token}`,
        undefined,
        {includeAuth: false},
      );
      return true;
    } catch (err) {
      this.error(`Failed to mark driver as returned; token=${token}`, err);
      return false;
    }
  }
  /**
   * Returns the batch assigned to a given driver.
   * @param id The id of the driver to retrieve the batch for
   * @returns The batch object assigned to the driver, or null if there is no assigned batch (or if the request fails)
   */
  async getBatch({id}: Driver['id']) {
    try {
      const batch: json.JSONDomainObject<Batch> | null = await fetchJSON(
        'GET',
        `${this.resource}/${id}/batch`,
      );
      return batch === null ? null : json.batch.parse(batch);
    } catch (err) {
      this.error(`Failed to get driver batch; id=${id}`, err);
      return null;
    }
  }
}

export const driverApi = new DriverApi();
