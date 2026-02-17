import {describe, expect, it, vi} from 'vitest';
import {
  RestaurantApiClient,
  RestaurantApiClientError,
} from '~/api/restaurantClient';

describe('RestaurantApiClient', () => {
  it('maps backend restaurant page payloads into frontend domain objects', async () => {
    const fetchMock = vi
      .fn()
      .mockResolvedValueOnce(
        new Response(
          JSON.stringify({
            id: 1,
            name: 'Batchable Kitchen',
            location: '1234 UW Ave, Seattle, WA 98122',
          }),
          {status: 200},
        ),
      )
      .mockResolvedValueOnce(
        new Response(
          JSON.stringify([
            {
              id: 7,
              restaurantId: 1,
              name: 'Ben',
              phoneNumber: '2061234567',
              onShift: true,
            },
          ]),
          {status: 200},
        ),
      )
      .mockResolvedValueOnce(
        new Response(
          JSON.stringify([
            {
              id: 11,
              restaurantId: 1,
              name: 'Burger',
            },
          ]),
          {status: 200},
        ),
      );

    const client = new RestaurantApiClient({
      baseUrl: 'http://localhost:8080/',
      fetchImpl: fetchMock as unknown as typeof fetch,
    });
    const result = await client.getRestaurantPageData(1);

    expect(fetchMock).toHaveBeenCalledTimes(3);
    expect(fetchMock.mock.calls.map(call => call[0])).toEqual([
      'http://localhost:8080/restaurant/1',
      'http://localhost:8080/restaurant/1/drivers',
      'http://localhost:8080/restaurant/1/menu',
    ]);
    expect(result).toEqual({
      restaurant: {
        id: {type: 'Restaurant', id: 1},
        name: 'Batchable Kitchen',
        location: {address: '1234 UW Ave, Seattle, WA 98122'},
      },
      drivers: [
        {
          id: {type: 'Driver', id: 7},
          restaurant: {type: 'Restaurant', id: 1},
          name: 'Ben',
          phoneNumber: {compact: '2061234567'},
          onShift: true,
        },
      ],
      menuItems: [
        {
          id: {type: 'MenuItem', id: 11},
          restaurant: {type: 'Restaurant', id: 1},
          name: 'Burger',
        },
      ],
    });
  });

  it('adds bearer auth token when configured', async () => {
    const fetchMock = vi.fn().mockResolvedValue(
      new Response(
        JSON.stringify({
          id: 1,
          name: 'Batchable Kitchen',
          location: '1234 UW Ave, Seattle, WA 98122',
        }),
        {status: 200},
      ),
    );

    const client = new RestaurantApiClient({
      baseUrl: 'http://localhost:8080',
      fetchImpl: fetchMock as unknown as typeof fetch,
      getAccessToken: async () => 'token-123',
    });
    await client.getRestaurant(1);

    const [, init] = fetchMock.mock.calls[0] as [string, RequestInit];
    const headers = new Headers(init.headers);
    expect(headers.get('Authorization')).toBe('Bearer token-123');
  });

  it('throws a typed error for failed responses', async () => {
    const fetchMock = vi
      .fn()
      .mockResolvedValue(new Response('not found', {status: 404}));

    const client = new RestaurantApiClient({
      baseUrl: 'http://localhost:8080',
      fetchImpl: fetchMock as unknown as typeof fetch,
    });
    const request = client.getRestaurant(1);

    await expect(request).rejects.toBeInstanceOf(RestaurantApiClientError);
    await expect(request).rejects.toMatchObject({status: 404});
  });
});
