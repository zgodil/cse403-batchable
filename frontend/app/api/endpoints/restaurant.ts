import * as json from '~/domain/json';
import {CrudApi} from '../crud';
import type {Driver, MenuItem, Order, Restaurant} from '~/domain/objects';
import {fetchEndpoint, fetchJSON} from '../common';

class RestaurantApi extends CrudApi<Restaurant> {
  constructor() {
    super('/api/restaurant', json.restaurant);
  }

  /** Get the current user's restaurant (requires auth). Creates one if none exists. */
  async getMyRestaurant(): Promise<Restaurant | null> {
    try {
      const r = await fetchJSON('GET', '/api/restaurant/me');
      return json.restaurant.parse(r);
    } catch (err) {
      console.error('Cannot get my restaurant', err);
      return null;
    }
  }

  /** Update the current user's restaurant (name, location). Uses PUT /api/restaurant/me. */
  async updateMyRestaurant(restaurant: Restaurant): Promise<boolean> {
    try {
      await fetchEndpoint('PUT', '/api/restaurant/me', json.restaurant.unparse(restaurant));
      return true;
    } catch (err) {
      console.error('Cannot update my restaurant', err);
      return false;
    }
  }

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
