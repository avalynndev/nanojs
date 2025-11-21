import React from "react";

type QueryOptions = {
  deps?: any[];
  parseJson?: boolean;
};

export function useQuery<T = unknown>(url: string, options?: QueryOptions) {
  const [data, setData] = React.useState<T | null>(null);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<Error | null>(null);

  React.useEffect(() => {
    let alive = true;
    setLoading(true);
    fetch(url)
      .then((r) =>
        options?.parseJson !== false ? r.json() : (r as unknown as T)
      )
      .then((d) => {
        if (!alive) return;
        setData(d as T);
        setLoading(false);
      })
      .catch((err) => {
        if (!alive) return;
        setError(err);
        setLoading(false);
      });
    return () => {
      alive = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, options?.deps ?? [url]);

  return { data, loading, error };
}
