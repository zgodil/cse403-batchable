import * as json from '~/domain/json';
import {CrudApi} from '../crud';
import type {Driver, MenuItem, Restaurant} from '~/domain/objects';
import {fetchJSON} from '../common';

export class RestaurantApi extends CrudApi<Restaurant> {
  constructor() {
    super('/restaurant', json.restaurant);
  }
  async getDrivers({id}: Restaurant['id']) {
    try {
      const drivers: json.JSONDomainObject<Driver>[] = await fetchJSON(
        'GET',
        `${this.resource}/${id}/drivers`,
      );
      return drivers.map(json.driver.parse);
    } catch (err) {
      console.error(`Cannot get drivers for restaurant; id=${id}`, err);
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
      console.error(`Cannot get menu items for restaurant; id=${id}`, err);
      return null;
    }
  }
}
