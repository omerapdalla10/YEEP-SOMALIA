import { useCallback, useEffect, useState } from "react";
import { api, ApiError } from "./api";

interface QueryState<T> {
  data: T;
  loading: boolean;
  error: string | null;
}

/**
 * Fetch a list resource from the API. Pass `null` as the path to skip the
 * request (e.g. while waiting on another value). `params` is serialised to a
 * query string; pass a stable object or memoise upstream.
 */
export function useCollection<T = unknown>(path: string | null, params?: Record<string, unknown>) {
  const [state, setState] = useState<QueryState<T[]>>({
    data: [],
    loading: path !== null,
    error: null,
  });
  const [nonce, setNonce] = useState(0);
  const key = params ? JSON.stringify(params) : "";

  useEffect(() => {
    if (path === null) return;
    let alive = true;
    // Deliberate: reset to a loading state the moment the query key changes.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setState((s) => ({ ...s, loading: true, error: null }));
    api
      .get<T[]>(path, params)
      .then((res) => alive && setState({ data: res.data ?? [], loading: false, error: null }))
      .catch(
        (err: ApiError) => alive && setState({ data: [], loading: false, error: err.message }),
      );
    return () => {
      alive = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [path, key, nonce]);

  const refetch = useCallback(() => setNonce((n) => n + 1), []);
  return { ...state, refetch };
}

/** Fetch a single object resource (e.g. /dashboard/admin, /stats). */
export function useResource<T = unknown>(path: string | null) {
  const [state, setState] = useState<QueryState<T | null>>({
    data: null,
    loading: path !== null,
    error: null,
  });
  const [nonce, setNonce] = useState(0);

  useEffect(() => {
    if (path === null) return;
    let alive = true;
    // Deliberate: reset to a loading state the moment the query key changes.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setState((s) => ({ ...s, loading: true, error: null }));
    api
      .get<T>(path)
      .then((res) => alive && setState({ data: res.data, loading: false, error: null }))
      .catch(
        (err: ApiError) => alive && setState({ data: null, loading: false, error: err.message }),
      );
    return () => {
      alive = false;
    };
  }, [path, nonce]);

  const refetch = useCallback(() => setNonce((n) => n + 1), []);
  return { ...state, refetch };
}
