/**
 * Represents a loading message. Though this imposes no textual format, it applies styling so that loading messages look consistent throughout the site.
 */
export default function Loading({children}: React.PropsWithChildren<{}>) {
  return (
    <p className="mb-4 text-sm text-gray-600 dark:text-gray-300">{children}</p>
  );
}
