import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type { CartItem, ShippingZone } from "../lib/types";
import { getProduct } from "../lib/products";

const STORAGE_KEY = "futureboy-cart";

type CartContextValue = {
  items: CartItem[];
  shippingZone: ShippingZone;
  setShippingZone: (zone: ShippingZone) => void;
  addItem: (handle: string, qty?: number) => void;
  removeItem: (handle: string) => void;
  setQuantity: (handle: string, quantity: number) => void;
  clear: () => void;
  itemCount: number;
  subtotalPence: number;
};

const CartContext = createContext<CartContextValue | null>(null);

function loadCart(): CartItem[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as CartItem[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [shippingZone, setShippingZone] = useState<ShippingZone>("uk");
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setItems(loadCart());
    setReady(true);
  }, []);

  useEffect(() => {
    if (!ready) return;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }, [items, ready]);

  const addItem = useCallback((handle: string, qty = 1) => {
    const product = getProduct(handle);
    if (!product?.available) return;
    setItems((prev) => {
      const existing = prev.find((i) => i.handle === handle);
      if (existing) {
        return prev.map((i) =>
          i.handle === handle ? { ...i, quantity: i.quantity + qty } : i,
        );
      }
      return [...prev, { handle, quantity: qty }];
    });
  }, []);

  const removeItem = useCallback((handle: string) => {
    setItems((prev) => prev.filter((i) => i.handle !== handle));
  }, []);

  const setQuantity = useCallback((handle: string, quantity: number) => {
    if (quantity < 1) {
      setItems((prev) => prev.filter((i) => i.handle !== handle));
      return;
    }
    setItems((prev) =>
      prev.map((i) => (i.handle === handle ? { ...i, quantity } : i)),
    );
  }, []);

  const clear = useCallback(() => setItems([]), []);

  const itemCount = useMemo(
    () => items.reduce((n, i) => n + i.quantity, 0),
    [items],
  );

  const subtotalPence = useMemo(
    () =>
      items.reduce((sum, i) => {
        const p = getProduct(i.handle);
        return sum + (p?.pricePence ?? 0) * i.quantity;
      }, 0),
    [items],
  );

  const value = useMemo(
    () => ({
      items,
      shippingZone,
      setShippingZone,
      addItem,
      removeItem,
      setQuantity,
      clear,
      itemCount,
      subtotalPence,
    }),
    [
      items,
      shippingZone,
      addItem,
      removeItem,
      setQuantity,
      clear,
      itemCount,
      subtotalPence,
    ],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}
