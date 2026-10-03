import { useEffect } from "react";
export default function useTitle(t) {
  useEffect(() => {
    document.title = t;
  }, [t]);
}
