import { useEffect, useState } from "react";
import { categoriesApi, servicesApi, getErrorMessage } from "./api";

export function useCategories() {
  const [categories, setCategories] = useState([]);
  useEffect(() => {
    categoriesApi.list().then(({ data }) => setCategories(data.data || [])).catch(() => {});
  }, []);
  return categories;
}

// params: { category, q, pincode }
export function useServices(params = {}) {
  const [state, setState] = useState({ services: [], loading: true, error: "" });
  const key = JSON.stringify(params);
  useEffect(() => {
    let ignore = false;
    setState((s) => ({ ...s, loading: true, error: "" }));
    const t = setTimeout(() => {
      servicesApi
        .list(params)
        .then(({ data }) => !ignore && setState({ services: data.data || [], loading: false, error: "" }))
        .catch((e) => !ignore && setState({ services: [], loading: false, error: getErrorMessage(e) }));
    }, params.q ? 250 : 0);
    return () => { ignore = true; clearTimeout(t); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);
  return state;
}
