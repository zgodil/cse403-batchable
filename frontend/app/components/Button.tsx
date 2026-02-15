interface Props {
  style?: 'primary' | 'secondary';
  submit?: true;
  onClick?: () => void;
  href?: string;
}

export default function Button({
  style = 'primary',
  submit,
  children,
  onClick,
  href,
}: React.PropsWithChildren<Props>) {
  const styles = {
    primary:
      'flex-1 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition text-center',
    secondary:
      'flex-1 py-2 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg text-center',
  }[style];

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
