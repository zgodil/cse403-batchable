import type {DomainObject} from '~/domain/objects';

interface Props<T extends DomainObject> {
  title: string;
  items: T[];
  onClick: (item: T) => void;
  renderItem: (item: T) => React.ReactElement;
}

export default function OverviewSection<T extends DomainObject>({
  title,
  items,
  onClick,
  renderItem,
}: Props<T>) {
  return (
    <section className="bg-white dark:bg-gray-900 p-6 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-800">
      <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
        {title}
      </h2>
      <ol className="space-y-4">
        {items.map(item => (
          <li
            key={item.id.id}
            tabIndex={0}
            onClick={() => onClick(item)}
            className="p-4 cursor-pointer border rounded-lg flex justify-between items-center bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700"
          >
            {renderItem(item)}
          </li>
        ))}
      </ol>
    </section>
  );
}
