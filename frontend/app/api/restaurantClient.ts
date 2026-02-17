import * as domainJson from '~/domain/json';
import type {Driver, MenuItem, Restaurant} from '~/domain/objects';

interface BackendRestaurant {
  id: number;
  name: string;
  location: string;
}

interface BackendDriver {
  id: number;
  restaurantId: number;
  name: string;
  phoneNumber: string;
  onShift: boolean;
}

interface BackendMenuItem {
  id: number;
  restaurantId: number;
  name: string;
}

export interface RestaurantPageData {
  restaurant: Restaurant;
  drivers: Driver[];
  menuItems: MenuItem[];
}

export interface RestaurantApiClientOptions {
  baseUrl?: string;
  fetchImpl?: typeof fetch;
  getAccessToken?: () => Promise<string | null> | string | null;
}

export class RestaurantApiClientError extends Error {
  constructor(
    message: string,
    readonly status: number,
  ) {
    super(message);
    this.name = 'RestaurantApiClientError';
  }
}

const configuredApiBaseUrl = import.meta.env.VITE_API_BASE_URL?.trim();
const DEFAULT_API_BASE_URL = configuredApiBaseUrl || 'http://localhost:8080';

function stripTrailingSlash(value: string): string {
  return value.replace(/\/+$/, '');
}

function parseRestaurant(payload: BackendRestaurant): Restaurant {
  return domainJson.restaurant.parse(payload);
}

function parseDriver(payload: BackendDriver): Driver {
  return domainJson.driver.parse({
    id: payload.id,
    restaurant: payload.restaurantId,
    name: payload.name,
    phoneNumber: payload.phoneNumber,
    onShift: payload.onShift,
  });
}

function parseMenuItem(payload: BackendMenuItem): MenuItem {
  return domainJson.menuItem.parse({
    id: payload.id,
    restaurant: payload.restaurantId,
    name: payload.name,
  });
}

function toBackendRestaurant(restaurant: Restaurant): BackendRestaurant {
  return domainJson.restaurant.unparse(restaurant);
}

function toBackendDriver(driver: Driver): BackendDriver {
  const parsed = domainJson.driver.unparse(driver);
  return {
    id: parsed.id,
    restaurantId: parsed.restaurant,
    name: parsed.name,
    phoneNumber: parsed.phoneNumber,
    onShift: parsed.onShift,
  };
}

function toBackendMenuItem(menuItem: MenuItem): BackendMenuItem {
  const parsed = domainJson.menuItem.unparse(menuItem);
  return {
    id: parsed.id,
    restaurantId: parsed.restaurant,
    name: parsed.name,
  };
}

export class RestaurantApiClient {
  private readonly baseUrl: string;
  private readonly fetchImpl: typeof fetch;
  private readonly getAccessToken?: RestaurantApiClientOptions['getAccessToken'];

  constructor(options: RestaurantApiClientOptions = {}) {
    this.baseUrl = stripTrailingSlash(options.baseUrl ?? DEFAULT_API_BASE_URL);
    this.fetchImpl = options.fetchImpl ?? fetch;
    this.getAccessToken = options.getAccessToken;
  }

  private async request<T>(path: string, init?: RequestInit): Promise<T> {
    const headers = new Headers(init?.headers);
    headers.set('Accept', 'application/json');
    if (init?.body && !headers.has('Content-Type')) {
      headers.set('Content-Type', 'application/json');
    }

    const token = await this.getAccessToken?.();
    if (token) {
      headers.set('Authorization', `Bearer ${token}`);
    }

    const response = await this.fetchImpl(`${this.baseUrl}${path}`, {
      ...init,
      headers,
    });

    if (!response.ok) {
      const method = init?.method ?? 'GET';
      let message = `${method} ${path} failed with status ${response.status}`;
      const details = await response.text();
      if (details) {
        message = `${message}: ${details}`;
      }
      throw new RestaurantApiClientError(message, response.status);
    }

    if (response.status === 204) {
      return undefined as T;
    }

    return (await response.json()) as T;
  }

  async getRestaurant(restaurantId: number): Promise<Restaurant> {
    const payload = await this.request<BackendRestaurant>(
      `/restaurant/${restaurantId}`,
    );
    return parseRestaurant(payload);
  }

  async getDrivers(restaurantId: number): Promise<Driver[]> {
    const payload = await this.request<BackendDriver[]>(
      `/restaurant/${restaurantId}/drivers`,
    );
    return payload.map(parseDriver);
  }

  async getMenuItems(restaurantId: number): Promise<MenuItem[]> {
    const payload = await this.request<BackendMenuItem[]>(
      `/restaurant/${restaurantId}/menu`,
    );
    return payload.map(parseMenuItem);
  }

  async getRestaurantPageData(
    restaurantId: number,
  ): Promise<RestaurantPageData> {
    const [restaurant, drivers, menuItems] = await Promise.all([
      this.getRestaurant(restaurantId),
      this.getDrivers(restaurantId),
      this.getMenuItems(restaurantId),
    ]);
    return {
      restaurant,
      drivers,
      menuItems,
    };
  }

  async updateRestaurant(restaurant: Restaurant): Promise<void> {
    await this.request<void>(`/restaurant/${restaurant.id.id}`, {
      method: 'PUT',
      body: JSON.stringify(toBackendRestaurant(restaurant)),
    });
  }

  async createDriver(driver: Driver): Promise<void> {
    await this.request<void>('/driver', {
      method: 'POST',
      body: JSON.stringify(toBackendDriver(driver)),
    });
  }

  async updateDriver(driver: Driver): Promise<void> {
    await this.request<void>('/driver', {
      method: 'PUT',
      body: JSON.stringify(toBackendDriver(driver)),
    });
  }

  async updateDriverShift(driverId: number, onShift: boolean): Promise<void> {
    await this.request<void>(`/driver/${driverId}/shift?onShift=${onShift}`, {
      method: 'PUT',
    });
  }

  async deleteDriver(driverId: number): Promise<void> {
    await this.request<void>(`/driver/${driverId}`, {
      method: 'DELETE',
    });
  }

  async createMenuItem(menuItem: MenuItem): Promise<void> {
    await this.request<void>('/menu', {
      method: 'POST',
      body: JSON.stringify(toBackendMenuItem(menuItem)),
    });
  }

  async deleteMenuItem(menuItemId: number): Promise<void> {
    await this.request<void>(`/menu/${menuItemId}`, {
      method: 'DELETE',
    });
  }
}

export function createRestaurantApiClient(
  options: RestaurantApiClientOptions = {},
) {
  return new RestaurantApiClient(options);
}
