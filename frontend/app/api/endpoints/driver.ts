import * as json from '~/domain/json';
import {CrudApi} from '../crud';
import type {Batch, Driver} from '~/domain/objects';
import {fetchEndpoint, fetchJSON} from '../common';

export class DriverApi extends CrudApi<Driver> {
  constructor() {
    super('/driver', json.driver);
  }
  async setOnShift(driverId: Driver['id'], onShift: boolean) {
    try {
      await fetchEndpoint(
        'PUT',
        `${this.resource}/${driverId}/shift?onShift=${onShift}`,
      );
      return true;
    } catch (err) {
      console.error(`Failed to change driver shift; id=${driverId.id}`, err);
      return false;
    }
  }
  async getBatch(driverId: Driver['id']) {
    try {
      const batch: json.JSONDomainObject<Batch> | null = await fetchJSON(
        'PUT',
        `${this.resource}/${driverId}/batch`,
      );
      return batch === null ? null : json.batch.parse(batch);
    } catch (err) {
      console.error(`Failed to get driver batch; id=${driverId.id}`, err);
      return null;
    }
  }
}
