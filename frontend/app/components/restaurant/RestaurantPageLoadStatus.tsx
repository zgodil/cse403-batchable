import LoadError from '../LoadError';
import Loading from '../Loading';

type RestaurantPageLoadStatusProps = {
  isLoadingData: boolean;
  loadError: string | null;
};

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
