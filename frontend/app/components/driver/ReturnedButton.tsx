import {driverApi} from '~/api/endpoints/driver';
import Button from '../Button';
import {useContext} from 'react';
import {DriverTokenContext} from '../DriverTokenContext';
import type {Order} from '~/domain/objects';
import {ConfettiContext} from '~/components/ConfettiProvider';

interface Props {
  orders: Order[];
}

/**
 * Represents a button that can be used to complete the route. It can only be clicked once every order is delivered.
 * @param orders The orders in the batch to be completed
 */
export default function ReturnedButton({orders}: Props) {
  const token = useContext(DriverTokenContext);
  const toss = useContext(ConfettiContext);

  const allDelivered = orders.every(order => order.state === 'delivered');

  /** Completes the route via the API */
  const completeRoute = async () => {
    if (!token) {
      alert('Failed to authenticate driver');
      return;
    }

    if (!(await driverApi.markReturned(token))) {
      alert('Failed to complete route');
      return;
    }

    toss(1000);
  };

  return (
    <Button style="emerald" onClick={allDelivered ? completeRoute : undefined}>
      Complete Route
    </Button>
  );
}
