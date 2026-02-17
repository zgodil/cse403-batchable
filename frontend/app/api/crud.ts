import type {DomainObject} from '~/domain/objects';
import {fetchEndpoint, fetchJSON, type Resource} from './common';
import * as json from '~/domain/json';

/**
 * Represents a base class for performing CRUD operations on domain objects of a given type.
 * Thanks to MSW, this works both in production and development!
 */
export class CrudApi<T extends DomainObject> {
  constructor(
    protected resource: Resource,
    protected parserPair: json.JSONParserPair<T>,
  ) {}

  async create(domainObject: T) {
    const id = await fetchJSON(
      'POST',
      this.resource,
      this.parserPair.unparse(domainObject),
    );
    return this.parserPair.field('id').parse(id);
  }

  async read({id}: T['id']): Promise<T | null> {
    try {
      return this.parserPair.parse(
        await fetchJSON('GET', `${this.resource}/${id}`),
      );
    } catch {
      return null;
    }
  }

  async update(domainObject: T): Promise<boolean> {
    try {
      await fetchEndpoint(
        'PUT',
        `${this.resource}/${domainObject.id.id}`,
        this.parserPair.unparse(domainObject),
      );
      return true;
    } catch (err) {
      console.log(
        `Failed to update ${this.resource}; id=${domainObject.id.id}`,
        err,
      );
      return false;
    }
  }

  async delete({id}: T['id']): Promise<boolean> {
    try {
      await fetchEndpoint('DELETE', `${this.resource}/${id}`);
      return true;
    } catch (err) {
      console.log(`Failed to delete ${this.resource}; id=${id}`, err);
      return false;
    }
  }
}
