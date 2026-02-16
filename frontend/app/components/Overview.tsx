import type {DomainObject} from '~/domain/objects';

interface Props<T extends DomainObject> {
  title: string;
  items: T[];
  renderItem: (item: T) => React.ReactElement;
}

export default function OverviewSection<T extends DomainObject>({
  title,
  items,
  renderItem,
}: Props<T>) {
  return (
    <section className="bg-white dark:bg-gray-900 p-6 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-800">
      <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
        {title}
      </h2>
      <ol className="space-y-4">
        {items.map(item => (
          <li key={item.id.id}>{renderItem(item)}</li>
        ))}
      </ol>
    </section>
  );
}
