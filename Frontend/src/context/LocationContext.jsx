import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { authApi, getErrorMessage, lookupPincode } from "../lib/api";
import { useAuth } from "./AuthContext";

const Ctx = createContext(null);
const KEY = "sevanear_pin";

// The customer's service-area PIN code. Logged-in customers keep it on their
// profile; visitors keep it in the browser.
export function LocationProvider({ children }) {
  const { user, isAuthenticated, isAdmin, loading, updateUser } = useAuth();
  const [guest, setGuest] = useState(() => {
    try { return JSON.parse(localStorage.getItem(KEY)) || null; } catch { return null; }
  });
  const [askOpen, setAskOpen] = useState(false);

  const pincode = isAuthenticated ? user?.pincode || "" : guest?.pincode || "";
  const city = isAuthenticated ? user?.city || "" : guest?.city || "";

  // Ask once after login if the customer hasn't set a PIN code yet.
  useEffect(() => {
    if (loading || !isAuthenticated || isAdmin) return;
    if (!user?.pincode && !sessionStorage.getItem("sevanear_pin_skipped")) setAskOpen(true);
  }, [loading, isAuthenticated, isAdmin, user?.pincode]);

  const save = useCallback(
    async (pin) => {
      let info;
      try {
        info = await lookupPincode(pin);
      } catch (e) {
        return { ok: false, message: getErrorMessage(e, "Could not verify this PIN code.") };
      }
      if (isAuthenticated) {
        try {
          const { data } = await authApi.setPincode({ pincode: pin, city: info.city });
          updateUser({ pincode: data.user.pincode, city: data.user.city });
        } catch (e) {
          return { ok: false, message: getErrorMessage(e) };
        }
      } else {
        const g = { pincode: pin, city: info.city };
        localStorage.setItem(KEY, JSON.stringify(g));
        setGuest(g);
      }
      setAskOpen(false);
      return { ok: true, info };
    },
    [isAuthenticated, updateUser]
  );

  const skip = () => {
    sessionStorage.setItem("sevanear_pin_skipped", "1");
    setAskOpen(false);
  };

  const value = useMemo(
    () => ({ pincode, city, save, askOpen, openAsk: () => setAskOpen(true), skip }),
    [pincode, city, save, askOpen]
  );
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export const useLocationCtx = () => useContext(Ctx);
