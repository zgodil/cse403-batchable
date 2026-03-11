import * as json from '~/domain/json';
import {CrudApi} from '../crud';
import type {MenuItem} from '~/domain/objects';

/**
 * A wrapper around the Menu Item API.
 */
class MenuApi extends CrudApi<MenuItem> {
  constructor() {
    super('/menu', json.menuItem);
  }
}

export const menuApi = new MenuApi();
