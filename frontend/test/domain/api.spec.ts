import {HttpMethods} from 'msw';
import {endpoint} from 'test/mocks/api/common';
import {describe, it, expect} from 'vitest';
import * as json from '~/domain/json';
import {fakeId, type DomainObject, type Restaurant} from '~/domain/objects';

type Resource = `/${string}`;

async function simpleFetch(
  method: `${HttpMethods}`,
  path: Resource,
  body?: unknown,
) {
  return await fetch(endpoint(path), {
    body: body !== undefined ? JSON.stringify(body) : undefined,
    method,
  });
}

async function fetchJSON(
  method: `${HttpMethods}`,
  path: Resource,
  body?: unknown,
) {
  return await (await simpleFetch(method, path, body)).json();
}

async function create<T extends DomainObject>(
  resource: Resource,
  parserPair: json.JSONParserPair<T>,
  domainObject: T,
): Promise<json.JSONDomainObject<T>['id']> {
  const id = await fetchJSON(
    'POST',
    resource,
    parserPair.unparse(domainObject),
  );
  expect(id).toBeTypeOf('number');
  expect(id).not.toBe(domainObject.id.id);
  return id;
}

async function get<T extends DomainObject>(
  resource: Resource,
  parserPair: json.JSONParserPair<T>,
  id: json.JSONDomainObject<T>['id'],
): Promise<T | null> {
  try {
    return parserPair.parse(await fetchJSON('GET', `${resource}/${id}`));
  } catch {
    return null;
  }
}

async function update<T extends DomainObject>(
  resource: Resource,
  parserPair: json.JSONParserPair<T>,
  domainObject: T,
): Promise<boolean> {
  try {
    await simpleFetch(
      'PUT',
      `${resource}/${domainObject.id.id}`,
      parserPair.unparse(domainObject),
    );
    return true;
  } catch {
    return false;
  }
}

async function remove<T extends DomainObject>(
  resource: Resource,
  id: json.JSONDomainObject<T>['id'],
): Promise<boolean> {
  try {
    await simpleFetch('DELETE', `${resource}/${id}`);
    return true;
  } catch {
    return false;
  }
}

async function expectReadbackCreated<T extends DomainObject>(
  resource: Resource,
  parserPair: json.JSONParserPair<T>,
  domainObject: T,
): Promise<json.JSONDomainObject<T>['id']> {
  const id = await create(resource, parserPair, domainObject);
  const readback = await get(resource, parserPair, id);
  if (readback === null) {
    expect.fail('read-back domain object should exist');
  }
  expect(readback.id.id).toBe(id);
  domainObject.id.id = readback.id.id;
  expect(readback).toEqual(domainObject);
  return id;
}

async function expectMissingDeleted<T extends DomainObject>(
  resource: Resource,
  parserPair: json.JSONParserPair<T>,
  domainObject: T,
) {
  const id = await create(resource, parserPair, domainObject);
  const deleted = await remove(resource, id);
  expect(deleted).toBe(true);
  const retrieved = await get(resource, parserPair, id);
  expect(retrieved).toBe(null);
}

async function expectUpdatedChanged<T extends DomainObject>(
  resource: Resource,
  parserPair: json.JSONParserPair<T>,
  domainObject: T,
  domainObject2: T,
): Promise<json.JSONDomainObject<T>['id']> {
  const id = await create(resource, parserPair, domainObject);

  const changed: T = {
    ...domainObject,
    id: {
      type: domainObject2.id.type,
      id: id,
    },
  };
  const updated = await update(resource, parserPair, changed);
  expect(updated).toBe(true);

  const readback = await get(resource, parserPair, id);
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
  it('can create and read back a restaurant', async () => {
    await expectReadbackCreated<Restaurant>(
      '/restaurant',
      json.restaurant,
      getFakeRestaurant(),
    );
  });

  it('is gone after it is deleted', async () => {
    await expectMissingDeleted<Restaurant>(
      '/restaurant',
      json.restaurant,
      getFakeRestaurant(),
    );
  });

  it('is changed after it is updated', async () => {
    await expectUpdatedChanged<Restaurant>(
      '/restaurant',
      json.restaurant,
      getFakeRestaurant(),
      getFakeRestaurant2(),
    );
  });
});
