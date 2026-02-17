import * as json from '~/domain/json';
import {CrudApi} from '../crud';
import type {Restaurant} from '~/domain/objects';

export class RestaurantApi extends CrudApi<Restaurant> {
  constructor() {
    super('/restaurant', json.restaurant);
  }
}
