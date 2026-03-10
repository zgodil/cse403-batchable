import {driverApi} from '~/api/endpoints/driver';
import Button from '../Button';
import {useContext} from 'react';
import {DriverTokenContext} from '../DriverTokenContext';
import type {Order} from '~/domain/objects';
import {ConfettiContext} from '~/components/ConfettiProvider';

interface Props {
  orders: Order[];
}

export default function ReturnedButton({orders}: Props) {
  const token = useContext(DriverTokenContext);
  const toss = useContext(ConfettiContext);

  const allDelivered = orders.every(order => order.state === 'delivered');

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
