interface Props {
  style?: 'primary' | 'secondary';
  submit?: true;
  onClick?: () => void;
  href?: string;
  tw?: string;
}

/**
 * A lightly-customizable button component, which can be an <a> or <button> tag depending on props, while looking identical.
 * @param style The kind of button. 'primary' is blue and white, 'secondary' is grey and black
 * @param submit Whether this is a submission button for a form
 * @param onClick What to do when the button is clicked
 * @param href The link to visit when clicked. This will force the <Button> to become an <a>
 * @param tw Additional Tailwind classes to add to the button, if intense customization is needed
 * @param children The contents of the button. Hopefully not too much
 */
export default function Button({
  style = 'primary',
  submit,
  onClick,
  href,
  tw,
  children,
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
