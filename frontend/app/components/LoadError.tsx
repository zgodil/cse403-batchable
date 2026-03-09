/**
 * Represents a message indicating that loading failed. Though this imposes no textual format, it applies styling so that error messages look consistent throughout the site.
 */
export default function LoadError({children}: React.PropsWithChildren<{}>) {
  return (
    <p className="mb-4 rounded-md border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-800 dark:border-amber-800 dark:bg-amber-950 dark:text-amber-100">
      {children}
    </p>
  );
}
