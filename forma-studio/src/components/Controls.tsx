import { useLayoutEffect, useRef, useState } from 'react';
import type { ButtonHTMLAttributes, ReactNode } from 'react';

interface IconButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  label: string;
  children: ReactNode;
}

export const IconButton = ({ label, className = '', children, ...props }: IconButtonProps) => (
  <button
    type="button"
    className={`icon-button ${className}`}
    aria-label={label}
    title={label}
    {...props}
  >
    {children}
  </button>
);

interface NumberFieldProps {
  label: string;
  accessibleLabel?: string;
  value: number;
  min: number;
  max: number;
  step?: number;
  unit?: string;
  onChange: (value: number) => void;
}

export const NumberField = ({
  label,
  accessibleLabel,
  value,
  min,
  max,
  step = 0.1,
  unit = 'm',
  onChange,
}: NumberFieldProps) => {
  const [draft, setDraft] = useState(String(value));
  const [editing, setEditing] = useState(false);
  const cancelCommit = useRef(false);
  useLayoutEffect(() => {
    if (!editing) setDraft(String(Number(value.toFixed(2))));
  }, [value, editing]);

  const commit = (inputValue: string) => {
    if (cancelCommit.current) {
      cancelCommit.current = false;
      return;
    }
    const next = Number(inputValue);
    if (!inputValue.trim() || !Number.isFinite(next)) {
      setDraft(String(value));
      return;
    }
    const clamped = Math.min(max, Math.max(min, next));
    setDraft(String(clamped));
    if (clamped !== value) onChange(clamped);
  };

  return (
    <label className="number-field">
      <span>{label}</span>
      <span className="number-input-wrap">
        <input
          type="number"
          aria-label={accessibleLabel || label}
          value={draft}
          min={min}
          max={max}
          step={step}
          onChange={(event) => setDraft(event.target.value)}
          onFocus={() => setEditing(true)}
          onBlur={(event) => {
            commit(event.currentTarget.value);
            setEditing(false);
          }}
          onKeyDown={(event) => {
            if (event.key === 'Enter') event.currentTarget.blur();
            if (event.key === 'Escape') {
              cancelCommit.current = true;
              setDraft(String(value));
              event.currentTarget.blur();
            }
          }}
        />
        <span className="input-unit">{unit}</span>
      </span>
    </label>
  );
};

export const ObjectNameField = ({
  value,
  onChange,
}: {
  value: string;
  onChange: (value: string) => void;
}) => {
  const [draft, setDraft] = useState(value);
  const cancelCommit = useRef(false);
  useLayoutEffect(() => setDraft(value), [value]);

  return (
    <label className="name-field">
      <span>Name</span>
      <input
        aria-label="Object name"
        value={draft}
        maxLength={60}
        onChange={(event) => setDraft(event.target.value)}
        onBlur={() => {
          if (cancelCommit.current) {
            cancelCommit.current = false;
            return;
          }
          const next = draft.trim() || value;
          setDraft(next);
          if (next !== value) onChange(next);
        }}
        onKeyDown={(event) => {
          if (event.key === 'Enter') event.currentTarget.blur();
          if (event.key === 'Escape') {
            cancelCommit.current = true;
            setDraft(value);
            event.currentTarget.blur();
          }
        }}
      />
    </label>
  );
};

export const SectionLabel = ({ children, aside }: { children: ReactNode; aside?: ReactNode }) => (
  <div className="section-label">
    <h3>{children}</h3>
    {aside && <span>{aside}</span>}
  </div>
);
