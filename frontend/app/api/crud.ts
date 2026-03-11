import type {DomainObject} from '~/domain/objects';
import {fetchEndpoint, fetchJSON, type Resource} from './common';
import * as json from '~/domain/json';

/**
 * Represents a base class for performing CRUD operations on domain objects of a given type.
 * Thanks to MSW, this works both in production and development!
 */
export abstract class CrudApi<T extends DomainObject> {
  private static DELAY = 300;

  /**
   * Creates a new CrudApi of a given type
   * @param resource The base url for the associated resource, i.e. '/driver' for the driverApi.
   * @param parserPair The JSON parser pair associated with the domain object, to serialize and deserialize network data
   */
  constructor(
    protected resource: Resource,
    protected parserPair: json.JSONParserPair<T>,
  ) {}

  private delay(): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, CrudApi.DELAY));
  }

  /** Prints an error message. Exists to be mocked. */
  protected error(message: string, ...info: unknown[]) {
    console.error(message, ...info);
  }

  /**
   * Creates a new domain object, with the structure provided by a given skeleton object.
   * @param domainObject The new domain object to create. The `id` field must be one acquired from `fakeId`, to match with the back-end's expectations
   * @returns The id of the newly created object, or null if creation fails
   */
  async create(domainObject: T) {
    try {
      await this.delay();
      const id = await fetchJSON(
        'POST',
        this.resource,
        this.parserPair.unparse(domainObject),
      );
      return this.parserPair.field('id').parse(id);
    } catch (err) {
      this.error(`Failed to create ${this.resource}`, domainObject, err);
      return null;
    }
  }

  /**
   * Reads a domain object based on a given id.
   * @param id The id of the object to fetch
   * @returns The content of the object, or null if it couldn't be found
   */
  async read({id}: T['id']) {
    try {
      await this.delay();
      return this.parserPair.parse(
        await fetchJSON('GET', `${this.resource}/${id}`),
      );
    } catch (err) {
      this.error(`Failed to read ${this.resource}; id=${id}`, err);
      return null;
    }
  }

  /**
   * Checks the existence of a given object.
   * @param id The id of the object to check the existence of
   * @returns true iff an object with that id exists
   */
  async exists({id}: T['id']) {
    try {
      await this.delay();
      await fetchJSON('GET', `${this.resource}/${id}`);
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Updates the fields of a given domain object.
   * @param domainObject The object to update. The id field will be used to identify which object to change, and the remaining fields will determine the update.
   * @returns true iff the object was successfully updated
   */
  async update(domainObject: T) {
    try {
      await this.delay();
      await fetchEndpoint(
        'PUT',
        this.resource,
        this.parserPair.unparse(domainObject),
      );
      return true;
    } catch (err) {
      this.error(
        `Failed to update ${this.resource}; id=${domainObject.id.id}`,
        err,
      );
      return false;
    }
  }

  /**
   * Deletes a given domain object.
   * @param id The id of the object to remove
   * @returns true iff the object was present and then succesfully deleted
   */
  async delete({id}: T['id']) {
    try {
      await this.delay();
      await fetchEndpoint('DELETE', `${this.resource}/${id}`);
      return true;
    } catch (err) {
      this.error(`Failed to delete ${this.resource}; id=${id}`, err);
      return false;
    }
  }
}
