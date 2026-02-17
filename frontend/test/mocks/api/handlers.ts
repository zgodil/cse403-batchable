import {http, HttpResponse} from 'msw';
import {
  asId,
  db,
  endpoint,
  getCrudHandlers as makeCrudHandlers,
  noContent,
  notFound,
} from './common';
import {
  nextStateAfter,
  type Batch,
  type Driver,
  type Order,
  type Restaurant,
} from '~/domain/objects';
import * as json from '~/domain/json';

export const handlers = [
  ...makeCrudHandlers('restaurant', db.restaurants),
  http.get(endpoint('/restaurant/:id/drivers'), req => {
    return HttpResponse.json(
      db.drivers.findMatching('restaurant', asId<Restaurant>(req.params.id)),
    );
  }),
  http.get(endpoint('/restaurant/:id/menu'), req => {
    return HttpResponse.json(
      db.menuItems.findMatching('restaurant', asId<Restaurant>(req.params.id)),
    );
  }),
  ...makeCrudHandlers('driver', db.drivers),
  http.put(endpoint('/driver/:id/shift'), req => {
    const driver = db.drivers.get(asId<Driver>(req.params.id));
    if (!driver) return notFound('driver');
    const queryParams = new URL(req.request.url).searchParams;
    db.drivers.update({
      ...driver,
      onShift: queryParams.get('onShift') === 'true',
    });
    return noContent();
  }),
  http.put(endpoint('/driver/:id/batch'), req => {
    const batch =
      db.batches.findMatching('driver', asId<Driver>(req.params.id))[0] ?? null;
    return HttpResponse.json(batch);
  }),
  ...makeCrudHandlers('order', db.orders, ['create', 'read', 'delete']),
  http.put(endpoint('/order/:id/advance'), req => {
    const order = db.orders.get(asId<Order>(req.params.id));
    if (!order) return notFound('order');
    if (order.state !== 'delivered') {
      db.orders.update({
        ...order,
        state: nextStateAfter(order.state),
      });
    }
    return noContent();
  }),
  http.put(endpoint('/order/:id/cookedTime'), async req => {
    const order = db.orders.get(asId<Order>(req.params.id));
    if (!order) return notFound('order');
    const time = (await req.request.json()) as string;
    db.orders.update({
      ...order,
      cookedTime: time,
    });
    return noContent();
  }),
  http.put(endpoint('/order/:id/remake'), async req => {
    const order = db.orders.get(asId<Order>(req.params.id));
    if (!order) return notFound('order');
    db.orders.delete(order.id);

    const domain = json.order.parse(order);
    const newOrder = json.order.unparse({
      ...domain,
      state: 'cooking',
      initialTime: new Date(),
      currentBatch: null,
      highPriority: true,
      cookedTime: new Date(
        domain.cookedTime.getTime() - domain.initialTime.getTime(),
      ),
      deliveryTime: new Date(
        domain.deliveryTime.getTime() - domain.initialTime.getTime(),
      ),
    });

    db.orders.insert(newOrder);
    return noContent();
  }),
  ...makeCrudHandlers('batch', db.batches, ['read']),
  http.get(endpoint('/order/batch/:id'), req => {
    const batch = db.batches.get(asId<Batch>(req.params.id));
    if (!batch) return notFound('batch');
    return HttpResponse.json(batch);
  }),
  http.get(endpoint('/order/batch/:id/orders'), req => {
    const orders = db.orders.findAll(
      order => order.currentBatch?.id === asId<Batch>(req.params.id),
    );
    return HttpResponse.json(orders);
  }),
  ...makeCrudHandlers('menuItem', db.menuItems, ['create', 'delete']),
];
