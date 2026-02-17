import * as json from '~/domain/json';
import {CrudApi} from '../crud';
import type {MenuItem} from '~/domain/objects';

export class MenuApi extends CrudApi<MenuItem> {
  constructor() {
    super('/menu', json.menuItem);
  }
}
