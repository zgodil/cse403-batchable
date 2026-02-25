import {
  initialBatches,
  initialDrivers,
  initialMenuItems,
  initialOrders,
  initialRestaurant,
} from './seedData';
import * as json from '~/domain/json';
import {db, resetMockDatabase} from './common';

export function seedMockDatabaseForBrowser() {
  resetMockDatabase();

  db.restaurants.insert(json.restaurant.unparse(initialRestaurant));
  initialDrivers.forEach(driver => {
    db.drivers.insert(json.driver.unparse(driver));
  });
  initialMenuItems.forEach(menuItem => {
    db.menuItems.insert(json.menuItem.unparse(menuItem));
  });
  initialBatches.forEach(batch => {
    db.batches.insert(json.batch.unparse(batch));
  });
  initialOrders.forEach(order => {
    db.orders.insert(json.order.unparse(order));
  });
}
