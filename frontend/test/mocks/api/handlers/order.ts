import {http, HttpResponse} from 'msw';
import {
  asId,
  db,
  endpoint,
  makeCrudHandlers,
  noContent,
  notFound,
} from '../common';
import {nextStateAfter, type Batch, type Order} from '~/domain/objects';
import * as json from '~/domain/json';

export const orderHandlers = [
  ...makeCrudHandlers('/order', db.orders, ['create', 'read', 'delete']),
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

    const domain = json.order.parse(order);
    db.orders.update(
      json.order.unparse({
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
      }),
    );

    return noContent();
  }),
  ...makeCrudHandlers('/order/batch', db.batches, ['read']),
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
];
