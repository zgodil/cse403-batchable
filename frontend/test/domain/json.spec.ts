import {describe, expect, it} from 'vitest';
import * as json from '~/domain/json';
import type {
  Restaurant,
  DomainObject,
  Batch,
  Order,
  MenuItem,
  Driver,
} from '~/domain/objects';

function testPair<T extends DomainObject>(
  parserPair: json.JSONParserPair<T>,
  json: json.JSONDomainObject<T>,
  domainObject: T,
  reversable: boolean = true,
) {
  expect(parserPair.parse(json)).toEqual(domainObject);
  if (reversable) expect(parserPair.unparse(domainObject)).toEqual(json);
}

describe('Restaurant parsing', () => {
  it('parses a valid Restaurant', () => {
    testPair<Restaurant>(
      json.restaurant,
      {
        id: 5,
        location: '1600 Pennsylvania Avenue NW, Washington, DC 20500',
        name: 'The White House',
      },
      {
        id: {
          type: 'Restaurant',
          id: 5,
        },
        location: {
          address: '1600 Pennsylvania Avenue NW, Washington, DC 20500',
        },
        name: 'The White House',
      },
    );
  });

  it('survives an invalid WorldLocation', () => {
    testPair<Restaurant>(
      json.restaurant,
      {
        id: 173,
        location: '978164HKASDG&Q@^',
        name: 'The White House',
      },
      {
        id: {
          type: 'Restaurant',
          id: 173,
        },
        location: {
          address: '978164HKASDG&Q@^',
        },
        name: 'The White House',
      },
    );
  });
});

describe('Driver parsing', () => {
  it('parses a valid Driver', () => {
    testPair<Driver>(
      json.driver,
      {
        id: 98712,
        phoneNumber: '9782372819',
        restaurant: 1238,
        name: 'Jane Doe',
        onShift: false,
      },
      {
        id: {
          type: 'Driver',
          id: 98712,
        },
        phoneNumber: {
          compact: '9782372819',
        },
        restaurant: {
          type: 'Restaurant',
          id: 1238,
        },
        name: 'Jane Doe',
        onShift: false,
      },
    );
  });
});

describe('Order parsing', () => {
  it('parses a valid Order', () => {
    testPair<Order>(
      json.order,
      {
        id: 8129387,
        restaurant: 124192,
        destination: '1600 Pennsylvania Avenue NW, Washington, DC 20500',
        itemNames: ['Tragedy', 'Comedy'],
        initialTime: 'Fri, 29 Aug 2003 08:30:00 GMT',
        deliveryTime: 'Fri, 29 Aug 2003 08:30:00 GMT',
        cookedTime: 'Fri, 29 Aug 2003 08:30:00 GMT',
        state: 'cooked',
        highPriority: true,
        currentBatch: 19237245,
      },
      {
        id: {
          type: 'Order',
          id: 8129387,
        },
        restaurant: {
          type: 'Restaurant',
          id: 124192,
        },
        destination: {
          address: '1600 Pennsylvania Avenue NW, Washington, DC 20500',
        },
        itemNames: ['Tragedy', 'Comedy'],
        initialTime: new Date('Fri, 29 Aug 2003 08:30:00 GMT'),
        deliveryTime: new Date('Fri, 29 Aug 2003 08:30:00 GMT'),
        cookedTime: new Date('Fri, 29 Aug 2003 08:30:00 GMT'),
        state: 'cooked',
        highPriority: true,
        currentBatch: {
          type: 'Batch',
          id: 19237245,
        },
      },
    );
  });

  it('survives a null batch', () => {
    testPair<Order>(
      json.order,
      {
        id: 8129387,
        restaurant: 124192,
        destination: '1600 Pennsylvania Avenue NW, Washington, DC 20500',
        itemNames: [],
        initialTime: 'Fri, 29 Aug 2003 08:30:00 GMT',
        deliveryTime: 'Fri, 29 Aug 2003 08:30:00 GMT',
        cookedTime: 'Fri, 29 Aug 2003 08:30:00 GMT',
        state: 'cooked',
        highPriority: true,
        currentBatch: null,
      },
      {
        id: {
          type: 'Order',
          id: 8129387,
        },
        restaurant: {
          type: 'Restaurant',
          id: 124192,
        },
        destination: {
          address: '1600 Pennsylvania Avenue NW, Washington, DC 20500',
        },
        itemNames: [],
        initialTime: new Date('Fri, 29 Aug 2003 08:30:00 GMT'),
        deliveryTime: new Date('Fri, 29 Aug 2003 08:30:00 GMT'),
        cookedTime: new Date('Fri, 29 Aug 2003 08:30:00 GMT'),
        state: 'cooked',
        highPriority: true,
        currentBatch: null,
      },
    );
  });

  it('survives an invalid date', () => {
    testPair<Order>(
      json.order,
      {
        id: 8129387,
        restaurant: 124192,
        destination: '1600 Pennsylvania Avenue NW, Washington, DC 20500',
        itemNames: ['Tragedy', 'Comedy'],
        initialTime: 'Hello!!!',
        deliveryTime: 'Fri, 29 Aug 2003 08:30:00 GMT',
        cookedTime: 'Fri, 29 Aug 2003 08:30:00 GMT',
        state: 'cooked',
        highPriority: true,
        currentBatch: null,
      },
      {
        id: {
          type: 'Order',
          id: 8129387,
        },
        restaurant: {
          type: 'Restaurant',
          id: 124192,
        },
        destination: {
          address: '1600 Pennsylvania Avenue NW, Washington, DC 20500',
        },
        itemNames: ['Tragedy', 'Comedy'],
        initialTime: new Date(NaN),
        deliveryTime: new Date('Fri, 29 Aug 2003 08:30:00 GMT'),
        cookedTime: new Date('Fri, 29 Aug 2003 08:30:00 GMT'),
        state: 'cooked',
        highPriority: true,
        currentBatch: null,
      },
      false,
    );
  });
});

describe('Batch parsing', () => {
  it('parses a valid Batch', () => {
    testPair<Batch>(
      json.batch,
      {
        id: 871634,
        driver: 512387,
        route: '_p~iF~ps|U_ulLnnqC_mqNvxq`@',
        dispatchTime: 'Fri, 30 Jan 2026 01:30:00 GMT',
        expectedCompletionTime: 'Fri, 30 Jan 2026 01:30:00 GMT',
      },
      {
        id: {
          type: 'Batch',
          id: 871634,
        },
        driver: {
          type: 'Driver',
          id: 512387,
        },
        route: {
          encoded: '_p~iF~ps|U_ulLnnqC_mqNvxq`@',
        },
        dispatchTime: new Date('Fri, 30 Jan 2026 01:30:00 GMT'),
        expectedCompletionTime: new Date('Fri, 30 Jan 2026 01:30:00 GMT'),
      },
    );
  });

  it('survives an invalid Polyline', () => {
    testPair<Batch>(
      json.batch,
      {
        id: 871634,
        driver: 512387,
        route: 'Hello World! 1 2 3 4 5',
        dispatchTime: 'Fri, 30 Jan 2026 01:30:00 GMT',
        expectedCompletionTime: 'Fri, 30 Jan 2026 01:30:00 GMT',
      },
      {
        id: {
          type: 'Batch',
          id: 871634,
        },
        driver: {
          type: 'Driver',
          id: 512387,
        },
        route: {
          encoded: 'Hello World! 1 2 3 4 5',
        },
        dispatchTime: new Date('Fri, 30 Jan 2026 01:30:00 GMT'),
        expectedCompletionTime: new Date('Fri, 30 Jan 2026 01:30:00 GMT'),
      },
    );
  });
});

describe('MenuItem parsing', () => {
  it('parses a valid MenuItem', () => {
    testPair<MenuItem>(
      json.menuItem,
      {
        id: 5123,
        restaurant: 9123,
        name: 'Eggs Benedict',
      },
      {
        id: {
          type: 'MenuItem',
          id: 5123,
        },
        restaurant: {
          type: 'Restaurant',
          id: 9123,
        },
        name: 'Eggs Benedict',
      },
    );
  });
});
