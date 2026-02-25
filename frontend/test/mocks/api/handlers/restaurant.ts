import {http, HttpResponse} from 'msw';
import * as json from '~/domain/json';
import {asId, db, endpoint, makeCrudHandlers, notFound} from '../common';
import type {Restaurant} from '~/domain/objects';

const defaultRestaurant: json.JSONDomainObject<Restaurant> = {
  id: 1,
  name: 'Test Restaurant',
  location: '123 Test St',
};

export const restaurantHandlers = [
  ...makeCrudHandlers('/api/restaurant', db.restaurants),
  http.get(endpoint('/api/restaurant/me'), () => {
    const all = db.restaurants.findAll();
    if (all.length === 0) {
      db.restaurants.insert(defaultRestaurant);
      return HttpResponse.json(db.restaurants.findAll()[0]!);
    }
    return HttpResponse.json(all[0]!);
  }),
  http.put(endpoint('/api/restaurant/me'), async req => {
    const body = (await req.request.json()) as json.JSONDomainObject<Restaurant>;
    const existing = db.restaurants.findAll()[0];
    if (!existing) return HttpResponse.json(null, {status: 404});
    db.restaurants.update({...body, id: existing.id});
    return new HttpResponse(null, {status: 204});
  }),
  http.get(endpoint('/api/restaurant/:id/drivers'), req => {
    return HttpResponse.json(
      db.drivers.findMatching('restaurant', asId<Restaurant>(req.params.id)),
    );
  }),
  http.get(endpoint('/api/restaurant/:id/orders'), req => {
    const id = asId<Restaurant>(req.params.id);
    if (!db.restaurants.get(id)) return notFound('/restaurant');
    return HttpResponse.json(
      db.orders
        .findMatching('restaurant', id)
        .filter(order => order.state !== 'DELIVERED'),
    );
  }),
  http.get(endpoint('/api/restaurant/:id/menu'), req => {
    const id = asId<Restaurant>(req.params.id);
    if (!db.restaurants.get(id)) return notFound('/restaurant');
    return HttpResponse.json(db.menuItems.findMatching('restaurant', id));
  }),
];
