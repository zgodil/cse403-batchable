import type {Driver} from '~/domain/objects';
import RouteOverview from './RouteOverview';
import RouteHeader from './RouteHeader';

interface Props {
  driverId: Driver['id'];
}

export default function DriverPage({driverId}: Props) {
  return (
    <>
      <RouteHeader driverId={driverId} />
      <RouteOverview driverId={driverId} />
    </>
  );
}
