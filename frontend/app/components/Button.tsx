import {Link} from 'react-router';

const GLOBAL_TAILWIND =
  'cursor-pointer text-center transition-all active:scale-95';

const BIG_TAILWIND = 'rounded-lg px-5 py-2.5';
const SMALL_TAILWIND = 'rounded-md px-3 py-1.5 text-xs font-semibold';

type Color =
  | 'red'
  | 'orange'
  | 'amber'
  | 'emerald'
  | 'blue'
  | 'indigo'
  | 'purple';

export type Style = Color | 'blank' | 'dark';

const CUSTOM_TAILWIND: Record<Exclude<Style, Color>, string> = {
  dark: 'border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 font-semibold text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800',
  blank:
    'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800',
};

const getColorTailwind = (color: Color) =>
  `bg-${color}-600 text-white hover:bg-${color}-700`;

const getTailwind = (style: Style) => {
  if (style === 'blank' || style === 'dark') return CUSTOM_TAILWIND[style];
  return getColorTailwind(style);
};

interface Props {
  style?: Style;
  submit?: true;
  onClick?: () => void;
  to?: string;
  href?: string;
  tw?: string;
  small?: boolean;
}

/**
 * A lightly-customizable button component, which can be an <a>, <Link>, or <button> tag depending on props, while looking identical.
 * @param style The kind of button. Can be a color or 'dark' or 'blank'
 * @param submit Whether this is a submission button for a form
 * @param onClick What to do when the button is clicked
 * @param to The link to visit when clicked. This will force the <Button> to become a <Link>
 * @param href The link to visit when clicked. This will force the <Button> to become an <a>
 * @param tw Additional Tailwind classes to add to the button, if intense customization is needed
 * @param small Whether to make the button somewhat smaller
 * @param children The contents of the button. Hopefully not too much
 */
export default function Button({
  style = 'blue',
  submit,
  onClick,
  to,
  href,
  tw,
  small,
  children,
}: React.PropsWithChildren<Props>) {
  const styles = `${GLOBAL_TAILWIND} ${small ? SMALL_TAILWIND : BIG_TAILWIND} ${getTailwind(style)} ${tw ? ` ${tw}` : ''}`;

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
