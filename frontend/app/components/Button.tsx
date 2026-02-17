import {Link} from 'react-router';

const GLOBAL_STYLE =
  'px-5 py-2.5 cursor-pointer text-center transition-all active:scale-95 rounded-lg';

const STYLES = {
  primary: 'bg-blue-600 text-white hover:bg-blue-700',
  secondary:
    'bg-purple-600 text-white font-semibold shadow-md hover:bg-purple-700',
  blank:
    'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800',
};

interface Props {
  style?: keyof typeof STYLES;
  submit?: true;
  onClick?: () => void;
  to?: string;
  href?: string;
  tw?: string;
}

/**
 * A lightly-customizable button component, which can be an <a>, <Link>, or <button> tag depending on props, while looking identical.
 * @param style The kind of button. 'primary' is blue and white, 'secondary' is purple and white, 'blank' is black and grey
 * @param submit Whether this is a submission button for a form
 * @param onClick What to do when the button is clicked
 * @param to The link to visit when clicked. This will force the <Button> to become a <Link>
 * @param href The link to visit when clicked. This will force the <Button> to become an <a>
 * @param tw Additional Tailwind classes to add to the button, if intense customization is needed
 * @param children The contents of the button. Hopefully not too much
 */
export default function Button({
  style = 'primary',
  submit,
  onClick,
  to,
  href,
  tw,
  children,
}: React.PropsWithChildren<Props>) {
  const styles = `${GLOBAL_STYLE} ${STYLES[style]} ${tw ? ` ${tw}` : ''}`;

  const props = {
    onClick,
    className: styles,
    role: 'button',
  };

  if (to) {
    return (
      <Link to={to} {...props}>
        {children}
      </Link>
    );
  }

  if (href) {
    return (
      <a href={href} {...props}>
        {children}
      </a>
    );
  }

  return (
    <button type={submit ? 'submit' : 'button'} {...props}>
      {children}
    </button>
  );
}
