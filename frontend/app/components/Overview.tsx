import {useEffect, useState, type ReactNode} from 'react';
import type {DomainObject} from '~/domain/objects';
import LoadError from './LoadError';
import Loading from './Loading';

interface Props<T extends DomainObject> {
  title: string;
  loadItems: () => Promise<T[] | null>;
  renderItem: (item: T) => React.ReactElement;
}

function useLoader<T>(loader: () => Promise<T>) {
  const [loaded, setLoaded] = useState(true);
  const [response, setResponse] = useState<T | null>(null);

  useEffect(() => {
    if (!loaded) return;

    setResponse(null);
    setLoaded(false);

    void loader().then(response => {
      setResponse(response);
      setLoaded(true);
    });
  }, []);

  return {loaded, response};
}

/**
 * Represents a list of {@link DomainObject}s.
 * @param title The header for the entire list
 * @param loadItems An array of domain objects
 * @param renderItem A function to convert a single domain object to JSX
 */
export default function OverviewSection<T extends DomainObject>({
  title,
  loadItems,
  renderItem,
}: Props<T>) {
  const {response: items, loaded} = useLoader(loadItems);

  let content: ReactNode = <Loading>Loading items...</Loading>;
  if (loaded) {
    content = items ? (
      <ol className="space-y-4">
        {items.map(item => (
          <li key={item.id.id}>{renderItem(item)}</li>
        ))}
      </ol>
    ) : (
      <LoadError>Failed to load</LoadError>
    );
  }

  return (
    <section className="bg-white dark:bg-gray-900 p-6 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-800">
      <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
        {title}
      </h2>
      {content}
    </section>
  );
}
