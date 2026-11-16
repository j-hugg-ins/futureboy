import {
  useEffect,
  useId,
  useRef,
  useState,
  type KeyboardEvent,
} from "react";
import {
  currencyLabel,
  useCurrency,
} from "../context/CurrencyContext";
import type { PresentmentCurrency } from "../lib/currency";

export function CurrencySwitcher() {
  const { currency, setCurrency, currencies } = useCurrency();
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const rootRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLUListElement>(null);
  const listId = useId();

  useEffect(() => {
    if (!open) return;

    function onPointerDown(event: MouseEvent) {
      if (!rootRef.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    }

    function onKeyDown(event: globalThis.KeyboardEvent) {
      if (event.key === "Escape") {
        setOpen(false);
      }
    }

    document.addEventListener("mousedown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("mousedown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  useEffect(() => {
    if (!open) return;
    listRef.current
      ?.querySelectorAll<HTMLElement>('[role="option"]')
      [activeIndex]?.focus();
  }, [open, activeIndex]);

  function toggleOpen() {
    if (open) {
      setOpen(false);
      return;
    }
    setActiveIndex(Math.max(0, currencies.indexOf(currency)));
    setOpen(true);
  }

  function select(code: PresentmentCurrency) {
    setCurrency(code);
    setOpen(false);
  }

  function moveActive(delta: number) {
    setActiveIndex(
      (index) => (index + delta + currencies.length) % currencies.length,
    );
  }

  function onListKeyDown(event: KeyboardEvent<HTMLUListElement>) {
    if (event.key === "ArrowDown") {
      event.preventDefault();
      moveActive(1);
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      moveActive(-1);
    } else if (event.key === "Home") {
      event.preventDefault();
      setActiveIndex(0);
    } else if (event.key === "End") {
      event.preventDefault();
      setActiveIndex(currencies.length - 1);
    } else if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      select(currencies[activeIndex]);
    }
  }

  return (
    <div className="currency-switcher" ref={rootRef}>
      <button
        type="button"
        className="currency-switcher__trigger"
        aria-label="Currency"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={listId}
        onClick={toggleOpen}
      >
        {currencyLabel(currency)}
      </button>
      {open ? (
        <ul
          id={listId}
          ref={listRef}
          className="currency-switcher__list"
          role="listbox"
          aria-label="Currency"
          tabIndex={-1}
          onKeyDown={onListKeyDown}
        >
          {currencies.map((code, index) => (
            <li key={code} role="presentation">
              <button
                type="button"
                role="option"
                aria-selected={code === currency}
                className={
                  index === activeIndex
                    ? "currency-switcher__option is-active"
                    : "currency-switcher__option"
                }
                tabIndex={index === activeIndex ? 0 : -1}
                onClick={() => select(code)}
                onMouseEnter={() => setActiveIndex(index)}
              >
                {currencyLabel(code)}
              </button>
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}
