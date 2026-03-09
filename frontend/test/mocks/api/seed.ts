import {
  initialBatches,
  initialDrivers,
  initialMenuItems,
  initialOrders,
  initialRestaurant,
} from './seed_data';
import * as json from '~/domain/json';
import type {DomainObject} from '~/domain/objects';
import {db, resetMockDatabase} from './common';

function insertAndSyncId<T extends DomainObject>(
  object: T,
  insert: (domainObject: json.JSONDomainObject<T>) => T['id']['id'] | null,
  parser: json.JSONParserPair<T>,
) {
  const id = insert(parser.unparse(object));
  if (id !== null) {
    object.id.id = id;
  }
}

export function seedMockDatabaseForBrowser() {
  resetMockDatabase();

  // Insert in dependency order so references are valid at insert time.
  insertAndSyncId(
    initialRestaurant,
    row => db.restaurants.insert(row),
    json.restaurant,
  );
  initialDrivers.forEach(driver => {
    insertAndSyncId(driver, row => db.drivers.insert(row), json.driver);
  });
  initialBatches.forEach(batch => {
    insertAndSyncId(batch, row => db.batches.insert(row), json.batch);
  });
  initialOrders.forEach(order => {
    insertAndSyncId(order, row => db.orders.insert(row), json.order);
  });
  initialMenuItems.forEach(menuItem => {
    insertAndSyncId(menuItem, row => db.menuItems.insert(row), json.menuItem);
  });
}
