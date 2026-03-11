import * as json from '~/domain/json';
import {CrudApi} from '../crud';
import type {Driver, MenuItem, Order, Restaurant} from '~/domain/objects';
import {fetchJSON} from '../common';

class RestaurantApi extends CrudApi<Restaurant> {
  constructor() {
    super('/restaurant', json.restaurant);
  }

  /** Get the current user's restaurant id (requires auth). Creates one if none exists. */
  async getMyRestaurantId(): Promise<Restaurant['id'] | null> {
    try {
      const r = await fetchJSON('GET', '/restaurant/me');
      if (typeof r === 'number') {
        return json.restaurant.field('id').parse(r);
      }
      return json.restaurant.parse(r).id;
    } catch (err) {
      console.error('Cannot get my restaurant id', err);
      return null;
    }
  }

  /**
   * Returns all drivers associated with a given restaurant
   * @param id The id of the restaurant
   * @returns A list of all the drivers, or null if it fails
   */
  async getDrivers({id}: Restaurant['id']) {
    try {
      const drivers: json.JSONDomainObject<Driver>[] = await fetchJSON(
        'GET',
        `${this.resource}/${id}/drivers`,
      );
      return drivers.map(json.driver.parse);
    } catch (err) {
      this.error(`Cannot get drivers for restaurant; id=${id}`, err);
      return null;
    }
  }

  /**
   * Returns all orders associated with a given restaurant
   * @param id The id of the restaurant
   * @returns A list of all the orders, or null if it fails
   */
  async getOrders({id}: Restaurant['id']) {
    try {
      const orders: json.JSONDomainObject<Order>[] = await fetchJSON(
        'GET',
        `${this.resource}/${id}/orders`,
      );
      return orders.map(json.order.parse);
    } catch (err) {
      this.error(`Cannot find orders for restaurant; id=${id}`, err);
      return null;
    }
  }

  /**
   * Returns all menu items associated with a given restaurant
   * @param id The id of the restaurant
   * @returns A list of all the menu items, or null if it fails
   */
  async getMenuItems({id}: Restaurant['id']) {
    try {
      const menuItems: json.JSONDomainObject<MenuItem>[] = await fetchJSON(
        'GET',
        `${this.resource}/${id}/menu`,
      );
      return menuItems.map(json.menuItem.parse);
    } catch (err) {
      this.error(`Cannot get menu items for restaurant; id=${id}`, err);
      return null;
    }
  }
}

export const restaurantApi = new RestaurantApi();
