import '../mocks/fetch';
import {describe, it, expect} from 'vitest';
import {CrudApi} from '~/api/crud';
import {RestaurantApi} from '~/api/endpoints/restaurant';
import {fakeId, type DomainObject, type Restaurant} from '~/domain/objects';

async function checkedCreate<T extends DomainObject>(
  api: CrudApi<T>,
  domainObject: T,
) {
  const id = await api.create(domainObject);
  if (id === null) {
    expect.fail('created object must have non-null id');
  }
  expect(id.id).toBeTypeOf('number');
  expect(id.id).not.toBe(domainObject.id.id);
  return id;
}

async function expectReadbackCreated<T extends DomainObject>(
  api: CrudApi<T>,
  domainObject: T,
) {
  const id = await checkedCreate(api, domainObject);
  const readback = await api.read(id);
  if (readback === null) {
    expect.fail('read-back domain object should exist');
  }
  expect(readback.id.id).toBe(id.id);
  domainObject.id.id = readback.id.id;
  expect(readback).toEqual(domainObject);
  return id;
}

async function expectMissingDeleted<T extends DomainObject>(
  api: CrudApi<T>,
  domainObject: T,
) {
  const id = await checkedCreate(api, domainObject);
  const deleted = await api.delete(id);
  expect(deleted).toBe(true);
  const retrieved = await api.read(id);
  expect(retrieved).toBe(null);
}

async function expectUpdatedChanged<T extends DomainObject>(
  api: CrudApi<T>,
  domainObject: T,
  domainObject2: T,
) {
  const id = await checkedCreate(api, domainObject);

  const changed: T = {
    ...domainObject2,
    id,
  };
  const updated = await api.update(changed);
  expect(updated).toBe(true);

  const readback = await api.read(id);
  expect(readback).toEqual(changed);

  return id;
}

function getFakeRestaurant(): Restaurant {
  return {
    id: fakeId('Restaurant'),
    location: {address: '123 Batch St, Seattle WA'},
    name: 'Batchable Kitchen',
  };
}

function getFakeRestaurant2(): Restaurant {
  return {
    id: fakeId('Restaurant'),
    location: {address: '123 Batch St, Seattle OR'},
    name: 'Batchable Evil Kitchen',
  };
}

describe('/restaurant endpoint', () => {
  const api = new RestaurantApi();

  it('can create and read back a restaurant', async () => {
    await expectReadbackCreated<Restaurant>(api, getFakeRestaurant());
  });

  it('is gone after it is deleted', async () => {
    await expectMissingDeleted<Restaurant>(api, getFakeRestaurant());
  });

  it('is changed after it is updated', async () => {
    await expectUpdatedChanged<Restaurant>(
      api,
      getFakeRestaurant(),
      getFakeRestaurant2(),
    );
  });
});
