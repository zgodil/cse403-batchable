interface Props {
  onClick: () => void;
}

export default function Card({
  onClick,
  children,
}: React.PropsWithChildren<Props>) {
  return (
    <button
      onClick={onClick}
      className="w-full text-left p-4 cursor-pointer border rounded-lg flex justify-between items-center bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700"
    >
      {children}
    </button>
  );
}
