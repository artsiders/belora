import React from "react";

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helper?: string;
  icon?: React.ComponentType<{ className?: string }>;
}

export const FormInput = React.forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, helper, icon: Icon, className = "", id, ...props }, ref) => {
    const generatedId = React.useId();
    const inputId = id || generatedId;

    return (
      <div className="space-y-1.5 w-full">
        {label && (
          <label
            htmlFor={inputId}
            className="block text-xs font-semibold text-neutral-800 uppercase tracking-wider"
          >
            {label}
            {props.required && <span className="text-rose-600 ml-1">*</span>}
          </label>
        )}
        <div className="relative rounded-xl">
          {Icon && (
            <div className="absolute inset-y-0 start-0 flex items-center ps-3.5 pointer-events-none text-neutral-400">
              <Icon className="w-4 h-4" />
            </div>
          )}
          <input
            ref={ref}
            id={inputId}
            className={`w-full h-11 px-3.5 bg-white border rounded-xl text-neutral-900 text-sm transition-colors duration-150 placeholder:text-neutral-400 focus:outline-none focus:border-primary-600 focus:ring-1 focus:ring-primary-600 disabled:opacity-50 disabled:bg-neutral-50 ${
              Icon ? "ps-10" : ""
            } ${
              error
                ? "border-rose-400 focus:border-rose-600 focus:ring-rose-600"
                : "border-neutral-300 hover:border-neutral-400"
            } ${className}`}
            {...props}
          />
        </div>
        {error && <p className="text-xs text-rose-600">{error}</p>}
        {helper && !error && (
          <p className="text-xs text-neutral-500">{helper}</p>
        )}
      </div>
    );
  }
);
FormInput.displayName = "FormInput";

export interface SelectOption {
  value: string;
  label: string;
  disabled?: boolean;
}

export interface SelectProps
  extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  helper?: string;
  options: SelectOption[];
}

export const FormSelect = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ label, error, helper, options, className = "", id, ...props }, ref) => {
    const generatedId = React.useId();
    const selectId = id || generatedId;

    return (
      <div className="space-y-1.5 w-full">
        {label && (
          <label
            htmlFor={selectId}
            className="block text-xs font-semibold text-neutral-800 uppercase tracking-wider"
          >
            {label}
            {props.required && <span className="text-rose-600 ml-1">*</span>}
          </label>
        )}
        <select
          ref={ref}
          id={selectId}
          className={`w-full h-11 px-3.5 bg-white border rounded-xl text-neutral-900 text-sm transition-colors duration-150 focus:outline-none focus:border-primary-600 focus:ring-1 focus:ring-primary-600 disabled:opacity-50 disabled:bg-neutral-50 cursor-pointer ${
            error
              ? "border-rose-400 focus:border-rose-600"
              : "border-neutral-300 hover:border-neutral-400"
          } ${className}`}
          {...props}
        >
          {options.map((opt) => (
            <option key={opt.value} value={opt.value} disabled={opt.disabled}>
              {opt.label}
            </option>
          ))}
        </select>
        {error && <p className="text-xs text-rose-600">{error}</p>}
        {helper && !error && (
          <p className="text-xs text-neutral-500">{helper}</p>
        )}
      </div>
    );
  }
);
FormSelect.displayName = "FormSelect";

export interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  helper?: string;
}

export const FormTextarea = React.forwardRef<
  HTMLTextAreaElement,
  TextareaProps
>(({ label, error, helper, className = "", id, ...props }, ref) => {
  const generatedId = React.useId();
  const textareaId = id || generatedId;

  return (
    <div className="space-y-1.5 w-full">
      {label && (
        <label
          htmlFor={textareaId}
          className="block text-xs font-semibold text-neutral-800 uppercase tracking-wider"
        >
          {label}
          {props.required && <span className="text-rose-600 ml-1">*</span>}
        </label>
      )}
      <textarea
        ref={ref}
        id={textareaId}
        className={`w-full p-3 bg-white border rounded-xl text-neutral-900 text-sm transition-colors duration-150 placeholder:text-neutral-400 focus:outline-none focus:border-primary-600 focus:ring-1 focus:ring-primary-600 disabled:opacity-50 disabled:bg-neutral-50 resize-y min-h-24 ${
          error
            ? "border-rose-400 focus:border-rose-600"
            : "border-neutral-300 hover:border-neutral-400"
        } ${className}`}
        {...props}
      />
      {error && <p className="text-xs text-rose-600">{error}</p>}
      {helper && !error && <p className="text-xs text-neutral-500">{helper}</p>}
    </div>
  );
});
FormTextarea.displayName = "FormTextarea";

export interface CheckboxProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  label: React.ReactNode;
  description?: string;
}

export function FormCheckbox({
  label,
  description,
  className = "",
  id,
  ...props
}: CheckboxProps) {
  const generatedId = React.useId();
  const checkboxId = id || generatedId;

  return (
    <label
      htmlFor={checkboxId}
      className={`flex items-start gap-3 cursor-pointer select-none group ${className}`}
    >
      <input
        type="checkbox"
        id={checkboxId}
        className="mt-0.5 w-4.5 h-4.5 rounded border-neutral-300 text-primary-600 focus:ring-primary-600 cursor-pointer accent-primary-600"
        {...props}
      />
      <div>
        <span className="text-sm sm:text-base font-medium text-neutral-900 group-hover:text-primary-700 transition-colors">
          {label}
        </span>
        {description && (
          <p className="text-xs text-neutral-500 mt-0.5 font-normal">
            {description}
          </p>
        )}
      </div>
    </label>
  );
}

export interface ToggleSwitchProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label?: string;
  description?: string;
  disabled?: boolean;
}

export function ToggleSwitch({
  checked,
  onChange,
  label,
  description,
  disabled = false,
}: ToggleSwitchProps) {
  return (
    <div className="flex items-center justify-between gap-4">
      {(label || description) && (
        <div>
          {label && (
            <span className="text-sm sm:text-base font-semibold text-neutral-900 block">
              {label}
            </span>
          )}
          {description && (
            <span className="text-xs text-neutral-500 block">
              {description}
            </span>
          )}
        </div>
      )}
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        disabled={disabled}
        onClick={() => onChange(!checked)}
        className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-primary-600/30 disabled:opacity-50 disabled:cursor-not-allowed ${
          checked ? "bg-primary-600" : "bg-neutral-200"
        }`}
      >
        <span
          className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-xs transition duration-200 ease-in-out ${
            checked ? "translate-x-5" : "translate-x-0"
          }`}
        />
      </button>
    </div>
  );
}
