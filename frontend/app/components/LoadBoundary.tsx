import {type ReactNode} from 'react';
import type {Loader} from '~/util/query';
import LoadError from './LoadError';
import Loading from './Loading';

interface Props<T> {
  loader: Loader<T>;
  name: string;
  children: (data: T) => ReactNode;
}

/**
 * Represents a portion of the page that depends on data loaded via a {@link Loader}. Provides templated loading and error messages depending on the outcome of the async work. Due to this component having a function as a child, it must be used in a format similar to:
 * ```tsx
 * <LoadBoundary loader={loader} name="items">
 *  {items => <p>We have items: {items.join(', ')</p>}
 * </LoadBoundary>
 * ```
 * @param loader The loader which is providing the data for this section
 * @param name The name to be used in the loading/error message
 * @param children A function which takes in a non-null loader data result and produces JSX.
 */
export default function LoadBoundary<T>({loader, name, children}: Props<T>) {
  return loader.loaded ? (
    loader.response ? (
      children(loader.response)
    ) : (
      <LoadError>Failed to load {name}.</LoadError>
    )
  ) : (
    <Loading>Loading {name}...</Loading>
  );
}
