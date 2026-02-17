import * as json from '~/domain/json';
import {JSONTable} from './db';
import {http, HttpResponse} from 'msw';
import {StatusCodes} from 'http-status-codes';
import type {DomainObject} from '~/domain/objects';

export const db = {
  restaurants: new JSONTable(json.restaurant),
  orders: new JSONTable(json.order),
  drivers: new JSONTable(json.driver),
  menuItems: new JSONTable(json.menuItem),
  batches: new JSONTable(json.batch),
};

export const resetMockDatabase = () => {
  let key: keyof typeof db;
  for (key in db) {
    if (!Object.hasOwn(db, key)) continue;
    db[key].clear();
  }
};

export function endpoint(path: string) {
  return `http://localhost:5173${path}`;
}

export function notFound(type: string) {
  return HttpResponse.text(`No such ${type}`, {status: StatusCodes.NOT_FOUND});
}

export function noContent() {
  return HttpResponse.json(undefined, {status: StatusCodes.NO_CONTENT});
}

export function asId<T extends DomainObject>(
  id: string | readonly string[] | undefined,
) {
  return Number(id) as json.JSONDomainObject<T>['id'];
}

export function getCrudHandlers<T extends DomainObject>(
  resourceName: string,
  table: JSONTable<T>,
  operations = [
    'create' as const,
    'read' as const,
    'update' as const,
    'delete' as const,
  ],
) {
  const crud = {
    create: http.post(endpoint(`/${resourceName}`), async req => {
      const id = table.insert(
        (await req.request.json()) as json.JSONDomainObject<T>,
      );
      return HttpResponse.json(id, {status: StatusCodes.CREATED});
    }),
    read: http.get(endpoint(`/${resourceName}/:id`), async req => {
      const resource = table.get(asId<T>(req.params.id));
      if (!resource) {
        return HttpResponse.text(`No such ${resourceName}!`, {
          status: StatusCodes.NOT_FOUND,
        });
      }
      return HttpResponse.json(resource);
    }),
    update: http.put(endpoint(`/${resourceName}/:id`), async req => {
      table.update((await req.request.json()) as json.JSONDomainObject<T>);
      return noContent();
    }),
    delete: http.delete(endpoint(`/${resourceName}/:id`), async req => {
      table.delete(asId<T>(req.params.id));
      return noContent();
    }),
  };

  return operations.map(operation => crud[operation]);
}
