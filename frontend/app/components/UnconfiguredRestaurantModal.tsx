import {useLoader} from '~/util/query';
import Button from './Button';
import Modal, {useModal} from './Modal';
import {useContext} from 'react';
import {RestaurantContext} from './RestaurantProvider';
import {restaurantApi} from '~/api/endpoints/restaurant';

/**
 * A modal which only renders if the user has not configured their restaurant location. This helps prevent users from walking into a whole host of confusing errors.
 */
export default function UnconfiguredRestaurantModal() {
  const state = useModal(true);
  const restaurantId = useContext(RestaurantContext);

  // loads the status of the restaurant's address not being set
  const loader = useLoader(async () => {
    if (!restaurantId) return null;
    const restaurant = await restaurantApi.read(restaurantId);
    if (!restaurant) throw new Error('failed to load restaurant');
    return restaurant.location.address === 'Address not set';
  }, [restaurantId]);

  return (
    loader.response === true && (
      <Modal state={state} title="Restaurant Configuration Required">
        <p className="mb-4">
          Welcome to Batchable! Your brand new restaurant will need to have its
          address specified before you can start making orders.
        </p>
        <Button to="/restaurant#edit-restaurant" tw="w-full">
          Configure My Restaurant
        </Button>
      </Modal>
    )
  );
}
