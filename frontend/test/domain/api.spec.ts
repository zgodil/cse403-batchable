import {endpoint} from 'test/mocks/handlers/common';
import {describe, it, expect} from 'vitest';
import * as json from '~/domain/json';
import {fakeId, type Restaurant} from '~/domain/objects';

describe('/restaurant endpoint', () => {
  it('can create and read back a restaurant', async () => {
    const restaurant: Restaurant = {
      id: fakeId('Restaurant'),
      location: {address: '123 Batch St, Seattle WA'},
      name: 'Batchable Kitchen',
    };
    const id = await (
      await fetch(endpoint('/restaurant'), {
        body: JSON.stringify(json.restaurant.unparse(restaurant)),
        method: 'POST',
      })
    ).json();
    expect(id).toBeTypeOf('number');
    const readback = await (await fetch(endpoint(`/restaurant/${id}`))).json();
    const readbackDomain = json.restaurant.parse(readback);
    expect(readbackDomain.id.id).not.toBe(restaurant.id.id);
    restaurant.id.id = readbackDomain.id.id;
    expect(readbackDomain).toEqual(restaurant);
  });
});
