import {useId} from 'react';

type Props = {
  type: string;
  name: string;
  label?: React.ReactNode;
} & React.InputHTMLAttributes<HTMLInputElement>;

export default function FormField(props: Props) {
  const inputId = useId();
  const horizontal = props.type === 'checkbox' || props.type === 'radio';
  const label = props.label && (
    <label
      className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300"
      htmlFor={inputId}
    >
      {props.label}
    </label>
  );
  const input = (
    <input
      className={`${horizontal ? 'relative bottom-0.5' : 'w-full'} p-2 border rounded bg-transparent border-gray-300 dark:border-gray-700`}
      {...props}
      id={inputId}
    />
  );
  return (
    <div className={horizontal ? 'flex gap-3' : ''}>
      {horizontal ? (
        <>
          {input}
          {label}
        </>
      ) : (
        <>
          {label}
          {input}
        </>
      )}
    </div>
  );
}
