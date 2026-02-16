interface Props {
  style?: 'primary' | 'secondary';
  submit?: true;
  onClick?: () => void;
  href?: string;
  tw?: string;
}

export default function Button({
  style = 'primary',
  submit,
  children,
  onClick,
  href,
  tw,
}: React.PropsWithChildren<Props>) {
  const styles =
    {
      primary:
        'cursor-pointer py-2 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition text-center',
      secondary:
        'cursor-pointer py-2 px-4 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg text-center',
    }[style] + (tw ? ` ${tw}` : '');

  if (href) {
    return (
      <a className={styles} onClick={onClick} href={href}>
        {children}
      </a>
    );
  }

  return (
    <button
      type={submit ? 'submit' : 'button'}
      className={styles}
      onClick={onClick}
    >
      {children}
    </button>
  );
}
