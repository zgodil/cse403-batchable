import LoadError from '../LoadError';
import Loading from '../Loading';

type RestaurantPageLoadStatusProps = {
  isLoadingData: boolean;
  loadError: string | null;
};

/**
 * Represents loading and error status messages for the restaurant admin page.
 * @param isLoadingData Whether initial page data is still loading
 * @param loadError A user-visible backend load error message, if any
 */
export default function RestaurantPageLoadStatus({
  isLoadingData,
  loadError,
}: RestaurantPageLoadStatusProps) {
  return (
    <>
      {isLoadingData && <Loading>Loading restaurant data...</Loading>}
      {loadError && <LoadError>{loadError}</LoadError>}
    </>
  );
}
