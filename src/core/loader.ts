export type PagesMap = Record<string, { default: any }>;

export function loadPages(): PagesMap {
  // NOTE: this function is intended to be used in a Vite environment
  // where import.meta.glob is available. Example usage in the app:
  //
  // const pages = loadPages(); // returns map like { './pages/index.tsx': { default: ... } }
  //
  // For type-checking we cast to any.
  // In a non-Vite bundler you must implement equivalent logic.
  // @ts-ignore
  const pages = import.meta.glob("../../example/pages/**/*.tsx", {
    eager: true,
  }) as PagesMap;
  return pages;
}
