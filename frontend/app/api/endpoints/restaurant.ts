import * as json from '~/domain/json';
import {CrudApi} from '../crud';
import type {Driver, MenuItem, Restaurant} from '~/domain/objects';
import {fetchJSON} from '../common';

export class RestaurantApi extends CrudApi<Restaurant> {
  constructor() {
    super('/restaurant', json.restaurant);
  }
  async getDrivers(restaurantId: Restaurant['id']) {
    try {
      const drivers: json.JSONDomainObject<Driver>[] = await fetchJSON(
        'GET',
        `${this.resource}/${restaurantId.id}/drivers`,
      );
      return drivers.map(json.driver.parse);
    } catch (err) {
      console.error(
        `Cannot get drivers for restaurant; id=${restaurantId.id}`,
        err,
      );
      return null;
    }
  }
  async getMenuItems(restaurantId: Restaurant['id']) {
    try {
      const menuItems: json.JSONDomainObject<MenuItem>[] = await fetchJSON(
        'GET',
        `${this.resource}/${restaurantId.id}/menu`,
      );
      return menuItems.map(json.menuItem.parse);
    } catch (err) {
      console.error(
        `Cannot get menu items for restaurant; id=${restaurantId.id}`,
        err,
      );
      return null;
    }
  }
}
