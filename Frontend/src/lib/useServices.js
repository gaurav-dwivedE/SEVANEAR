import { useEffect, useState } from "react";
import { servicesApi, getErrorMessage } from "./api";

let cache = null;
export function useServices() {
  const [services, setServices] = useState(cache || []);
  const [loading, setLoading] = useState(!cache);
  const [error, setError] = useState("");
  useEffect(() => {
    let ignore = false;
    servicesApi
      .list()
      .then(({ data }) => {
        cache = data.data || [];
        if (!ignore) setServices(cache);
      })
      .catch((e) => !ignore && setError(getErrorMessage(e)))
      .finally(() => !ignore && setLoading(false));
    return () => {
      ignore = true;
    };
  }, []);
  return { services, loading, error };
}
