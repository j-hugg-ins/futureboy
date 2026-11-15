import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import {
  CURRENCY_CONFIG,
  formatCatalogueMoney,
  hasRateForCurrency,
  isPresentmentCurrency,
  normalizeRatesFromGbp,
  PRESENTMENT_CURRENCIES,
  type PresentmentCurrency,
} from "../lib/currency";

const STORAGE_KEY = "futureboy-currency";

type RatesPayload = {
  country: string | null;
  defaultCurrency: PresentmentCurrency;
  currencies: PresentmentCurrency[];
  ratesFromGbp: Record<string, number>;
  asOf: string;
};

type CurrencyContextValue = {
  currency: PresentmentCurrency;
  setCurrency: (code: PresentmentCurrency) => void;
  ratesFromGbp: Record<string, number>;
  ratesReady: boolean;
  defaultCurrency: PresentmentCurrency;
  formatMoney: (penceGbp: number) => string;
  currencies: PresentmentCurrency[];
};

const CurrencyContext = createContext<CurrencyContextValue | null>(null);

function readStoredCurrency(): PresentmentCurrency | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return isPresentmentCurrency(raw) ? raw : null;
  } catch {
    return null;
  }
}

function writeStoredCurrency(code: PresentmentCurrency) {
  try {
    localStorage.setItem(STORAGE_KEY, code);
  } catch {
    /* ignore */
  }
}

export function CurrencyProvider({ children }: { children: ReactNode }) {
  const [currency, setCurrencyState] = useState<PresentmentCurrency>("gbp");
  const [defaultCurrency, setDefaultCurrency] =
    useState<PresentmentCurrency>("gbp");
  const [ratesFromGbp, setRatesFromGbp] = useState<Record<string, number>>({
    gbp: 1,
  });
  const [ratesReady, setRatesReady] = useState(false);

  useEffect(() => {
    let cancelled = false;
    fetch("/api/currency-rates")
      .then(async (res) => {
        if (!res.ok) throw new Error("rates failed");
        return (await res.json()) as RatesPayload;
      })
      .then((data) => {
        if (cancelled) return;
        const def = isPresentmentCurrency(data.defaultCurrency)
          ? data.defaultCurrency
          : "gbp";
        setDefaultCurrency(def);
        setRatesFromGbp(normalizeRatesFromGbp(data.ratesFromGbp || {}));
        setRatesReady(true);
        const stored = readStoredCurrency();
        setCurrencyState(stored ?? def);
      })
      .catch(() => {
        if (cancelled) return;
        setRatesFromGbp({ gbp: 1 });
        setRatesReady(true);
        const stored = readStoredCurrency();
        setCurrencyState(stored ?? "gbp");
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const setCurrency = useCallback((code: PresentmentCurrency) => {
    if (!isPresentmentCurrency(code)) return;
    setCurrencyState(code);
    writeStoredCurrency(code);
  }, []);

  const formatMoney = useCallback(
    (penceGbp: number) => {
      if (!hasRateForCurrency(currency, ratesFromGbp)) {
        return formatCatalogueMoney(penceGbp, "gbp", { gbp: 1 });
      }
      return formatCatalogueMoney(penceGbp, currency, ratesFromGbp);
    },
    [currency, ratesFromGbp],
  );

  const value = useMemo<CurrencyContextValue>(
    () => ({
      currency,
      setCurrency,
      ratesFromGbp,
      ratesReady,
      defaultCurrency,
      currencies: PRESENTMENT_CURRENCIES,
      formatMoney,
    }),
    [
      currency,
      setCurrency,
      ratesFromGbp,
      ratesReady,
      defaultCurrency,
      formatMoney,
    ],
  );

  return (
    <CurrencyContext.Provider value={value}>{children}</CurrencyContext.Provider>
  );
}

export function useCurrency() {
  const ctx = useContext(CurrencyContext);
  if (!ctx) {
    throw new Error("useCurrency must be used within CurrencyProvider");
  }
  return ctx;
}

export function currencyLabel(code: PresentmentCurrency) {
  const { label, symbol } = CURRENCY_CONFIG.currencies[code];
  return `${label} ${symbol}`;
}
