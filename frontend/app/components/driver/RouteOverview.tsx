import type {Order} from '~/domain/objects';
import RouteItem from './RouteItem';
import ReturnedButton from './ReturnedButton';
import MapLink from './MapLink';

interface Props {
  orders: Order[] | null;
  mapLink: string | null;
}

/**
 * Represents the driver's route on the driver route page (/route/:token). This allows the driver to complete items and the route itself. Both parameters may be null if there is no route.
 * @param orders The orders in the route, both completed and not
 * @param mapLink The google maps link to the batch route
 */
export default function RouteOverview({orders, mapLink}: Props) {
  return (
    <main className="flex flex-col gap-5 text-center">
      {orders && mapLink ? (
        <>
          <MapLink link={mapLink} />
          <ol className="flex flex-col gap-3">
            {orders.map(order => (
              <RouteItem order={order} key={order.id.id} />
            ))}
          </ol>
          <ReturnedButton orders={orders} />
        </>
      ) : (
        <p>You have no active batch.</p>
      )}
    </main>
  );
}
