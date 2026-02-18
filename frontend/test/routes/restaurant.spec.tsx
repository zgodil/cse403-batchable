import {describe, it, expect, beforeEach, vi} from 'vitest';
import {
  render,
  screen,
  fireEvent,
  waitFor,
  within,
} from '@testing-library/react';
import {createRoutesStub} from 'react-router';
import type {Driver, MenuItem, Restaurant} from '~/domain/objects';
import RestaurantPage from '../../app/routes/restaurant';
import {restaurantApi} from '~/api/endpoints/restaurant';
import {driverApi} from '~/api/endpoints/driver';
import {menuApi} from '~/api/endpoints/menu';

const restaurantId: Restaurant['id'] = {type: 'Restaurant', id: 77};

const testRestaurant: Restaurant = {
  id: restaurantId,
  name: 'Batchable Restaurant',
  location: {address: '123 Test Ave, Seattle, WA'},
};

const testDrivers: Driver[] = [
  {
    id: {type: 'Driver', id: 701},
    restaurant: restaurantId,
    name: 'Ben',
    phoneNumber: {compact: '2061112222'},
    onShift: true,
  },
];

const testMenuItems: MenuItem[] = [
  {
    id: {type: 'MenuItem', id: 901},
    restaurant: restaurantId,
    name: 'Mochi',
  },
];

const RestaurantStub = createRoutesStub([
  {path: '/', Component: RestaurantPage},
]);

function getSectionByHeading(name: string) {
  const heading = screen.getByRole('heading', {name});
  const section = heading.closest('section');
  if (!section) throw new Error(`Section not found for heading: ${name}`);
  return section;
}

async function renderLoadedRestaurantPage() {
  render(<RestaurantStub />);
  await screen.findByText('Ben');
}

describe('Restaurant page', () => {
  beforeEach(() => {
    vi.restoreAllMocks();

    vi.spyOn(console, 'error').mockImplementation(() => {});
    vi.spyOn(window, 'alert').mockImplementation(() => {});

    vi.spyOn(restaurantApi, 'read').mockResolvedValue(testRestaurant);
    vi.spyOn(restaurantApi, 'getDrivers').mockResolvedValue(testDrivers);
    vi.spyOn(restaurantApi, 'getMenuItems').mockResolvedValue(testMenuItems);
    vi.spyOn(restaurantApi, 'update').mockResolvedValue(true);

    vi.spyOn(driverApi, 'create').mockResolvedValue({type: 'Driver', id: 999});
    vi.spyOn(driverApi, 'update').mockResolvedValue(true);
    vi.spyOn(driverApi, 'delete').mockResolvedValue(true);

    vi.spyOn(menuApi, 'create').mockResolvedValue({type: 'MenuItem', id: 998});
    vi.spyOn(menuApi, 'update').mockResolvedValue(true);
    vi.spyOn(menuApi, 'delete').mockResolvedValue(true);
  });

  it('loads backend restaurant data and clears loading state', async () => {
    render(<RestaurantStub />);

    expect(screen.getByText('Loading restaurant data...')).toBeInTheDocument();

    await screen.findByText('Ben');
    await waitFor(() =>
      expect(
        screen.queryByText('Loading restaurant data...'),
      ).not.toBeInTheDocument(),
    );
    expect(
      screen.getByDisplayValue('Batchable Restaurant'),
    ).toBeInTheDocument();
    expect(screen.getByText('Mochi')).toBeInTheDocument();
  });

  it('shows load error when backend data is missing', async () => {
    vi.mocked(restaurantApi.getDrivers).mockResolvedValueOnce(null);

    render(<RestaurantStub />);

    await screen.findByText('Could not load restaurant data from the backend.');
    expect(
      screen.queryByRole('heading', {name: 'Restaurant Details'}),
    ).not.toBeInTheDocument();
  });

  it('keeps drivers and menu edit modes mutually exclusive', async () => {
    await renderLoadedRestaurantPage();

    const driversSection = getSectionByHeading('Drivers');
    const menuSection = getSectionByHeading('Menu Items');

    fireEvent.click(
      within(driversSection).getByRole('button', {name: 'Edit Drivers'}),
    );
    expect(
      within(driversSection).getByRole('button', {name: 'Done Editing'}),
    ).toBeInTheDocument();

    fireEvent.click(
      within(menuSection).getByRole('button', {name: 'Edit Menu'}),
    );

    expect(
      within(driversSection).getByRole('button', {name: 'Edit Drivers'}),
    ).toBeInTheDocument();
    expect(
      within(menuSection).getByRole('button', {name: 'Done Editing'}),
    ).toBeInTheDocument();
  });

  it('updates restaurant details when finishing edit mode', async () => {
    await renderLoadedRestaurantPage();

    const detailsSection = getSectionByHeading('Restaurant Details');

    fireEvent.click(
      within(detailsSection).getByRole('button', {name: 'Edit Restaurant'}),
    );

    fireEvent.change(screen.getByDisplayValue('Batchable Restaurant'), {
      target: {value: 'Updated Batchable Restaurant'},
    });
    fireEvent.change(screen.getByDisplayValue('123 Test Ave, Seattle, WA'), {
      target: {value: '123 Updated St, Seattle, WA'},
    });

    fireEvent.click(
      within(detailsSection).getByRole('button', {name: 'Done Editing'}),
    );

    await waitFor(() =>
      expect(restaurantApi.update).toHaveBeenCalledWith(
        expect.objectContaining({
          name: 'Updated Batchable Restaurant',
          location: {address: '123 Updated St, Seattle, WA'},
        }),
      ),
    );
  });

  it('creates a new driver from the add driver modal and refreshes data', async () => {
    await renderLoadedRestaurantPage();

    const driversSection = getSectionByHeading('Drivers');
    fireEvent.click(
      within(driversSection).getByRole('button', {name: /\+ add driver/i}),
    );

    fireEvent.change(screen.getByLabelText('Driver Name'), {
      target: {value: 'H'},
    });
    fireEvent.change(screen.getByLabelText('Phone Number (digits only)'), {
      target: {value: '2063334444'},
    });
    fireEvent.click(screen.getByRole('button', {name: 'Add Driver'}));

    await waitFor(() =>
      expect(driverApi.create).toHaveBeenCalledWith(
        expect.objectContaining({
          restaurant: restaurantId,
          name: 'H',
          phoneNumber: {compact: '2063334444'},
          onShift: false,
        }),
      ),
    );
    await waitFor(() => expect(restaurantApi.read).toHaveBeenCalledTimes(2));
  });

  it('alerts when creating a driver fails', async () => {
    vi.mocked(driverApi.create).mockResolvedValueOnce(null);

    await renderLoadedRestaurantPage();

    const driversSection = getSectionByHeading('Drivers');
    fireEvent.click(
      within(driversSection).getByRole('button', {name: /\+ add driver/i}),
    );

    fireEvent.change(screen.getByLabelText('Driver Name'), {
      target: {value: 'Failed Driver'},
    });
    fireEvent.change(screen.getByLabelText('Phone Number (digits only)'), {
      target: {value: '2065556666'},
    });
    fireEvent.click(screen.getByRole('button', {name: 'Add Driver'}));

    await waitFor(() =>
      expect(window.alert).toHaveBeenCalledWith('Failed to create driver.'),
    );
    expect(restaurantApi.read).toHaveBeenCalledTimes(1);
  });

  it('updates and deletes menu items in edit mode', async () => {
    await renderLoadedRestaurantPage();

    const menuSection = getSectionByHeading('Menu Items');
    fireEvent.click(
      within(menuSection).getByRole('button', {name: 'Edit Menu'}),
    );
    fireEvent.click(within(menuSection).getByRole('button', {name: 'Edit'}));

    fireEvent.change(within(menuSection).getByDisplayValue('Mochi'), {
      target: {value: 'Updated Mochi'},
    });
    fireEvent.click(within(menuSection).getByRole('button', {name: 'Done'}));

    await waitFor(() =>
      expect(menuApi.update).toHaveBeenCalledWith(
        expect.objectContaining({name: 'Updated Mochi'}),
      ),
    );

    fireEvent.click(within(menuSection).getByRole('button', {name: 'Delete'}));
    await waitFor(() =>
      expect(menuApi.delete).toHaveBeenCalledWith({type: 'MenuItem', id: 901}),
    );
  });
});
