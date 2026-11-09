import React from "react";
import { Check, Minus, ChevronDown } from "lucide-react";

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
            className="block text-sm font-semibold text-neutral-800 uppercase tracking-wider"
          >
            {label}
            {props.required && <span className="text-rose-600 ml-1">*</span>}
          </label>
        )}
        <div className="relative rounded-lg">
          {Icon && (
            <div className="absolute inset-y-0 start-0 flex items-center ps-3.5 pointer-events-none text-neutral-400">
              <Icon className="w-4 h-4" />
            </div>
          )}
          <input
            ref={ref}
            id={inputId}
            className={`w-full h-11 px-3.5 bg-white border rounded-lg text-neutral-900 text-sm transition-colors duration-150 placeholder:text-neutral-400 focus:outline-none focus:border-primary-600 focus:ring-1 focus:ring-primary-600 disabled:opacity-50 disabled:bg-neutral-50 ${
              Icon ? "ps-10" : ""
            } ${
              error
                ? "border-rose-400 focus:border-rose-600 focus:ring-rose-600"
                : "border-neutral-300 hover:border-neutral-400"
            } ${className}`}
            {...props}
          />
        </div>
        {error && <p className="text-sm text-rose-600">{error}</p>}
        {helper && !error && (
          <p className="text-sm text-neutral-500">{helper}</p>
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
            className="block text-sm font-semibold text-neutral-800 uppercase tracking-wider"
          >
            {label}
            {props.required && <span className="text-rose-600 ml-1">*</span>}
          </label>
        )}
        <div className="relative">
          <select
            ref={ref}
            id={selectId}
            className={`w-full h-11 ps-3.5 pe-9 bg-white border rounded-lg text-neutral-900 text-sm transition-colors duration-150 focus:outline-none focus:border-primary-600 focus:ring-1 focus:ring-primary-600 disabled:opacity-50 disabled:bg-neutral-50 cursor-pointer appearance-none ${
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
          <div className="absolute inset-y-0 end-0 flex items-center pe-3 pointer-events-none text-neutral-400">
            <ChevronDown className="w-4 h-4" />
          </div>
        </div>
        {error && <p className="text-sm text-rose-600">{error}</p>}
        {helper && !error && (
          <p className="text-sm text-neutral-500">{helper}</p>
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
          className="block text-sm font-semibold text-neutral-800 uppercase tracking-wider"
        >
          {label}
          {props.required && <span className="text-rose-600 ml-1">*</span>}
        </label>
      )}
      <textarea
        ref={ref}
        id={textareaId}
        className={`w-full p-3 bg-white border rounded-lg text-neutral-900 text-sm transition-colors duration-150 placeholder:text-neutral-400 focus:outline-none focus:border-primary-600 focus:ring-1 focus:ring-primary-600 disabled:opacity-50 disabled:bg-neutral-50 resize-y min-h-24 ${
          error
            ? "border-rose-400 focus:border-rose-600"
            : "border-neutral-300 hover:border-neutral-400"
        } ${className}`}
        {...props}
      />
      {error && <p className="text-sm text-rose-600">{error}</p>}
      {helper && !error && <p className="text-sm text-neutral-500">{helper}</p>}
    </div>
  );
});
FormTextarea.displayName = "FormTextarea";

export interface CheckboxProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "type"> {
  indeterminate?: boolean;
  shape?: "circle" | "square";
}

export const Checkbox = React.forwardRef<HTMLInputElement, CheckboxProps>(
  (
    {
      checked,
      indeterminate = false,
      shape = "square",
      className = "",
      disabled,
      onChange,
      ...props
    },
    ref
  ) => {
    const inputRef = React.useRef<HTMLInputElement | null>(null);

    React.useEffect(() => {
      if (inputRef.current) {
        inputRef.current.indeterminate = Boolean(indeterminate);
      }
    }, [indeterminate]);

    const isIndeterminate = Boolean(indeterminate);
    const isChecked = Boolean(checked && !isIndeterminate);
    const isActive = isChecked || isIndeterminate;

    const shapeClasses =
      shape === "circle" ? "rounded-full" : "rounded-md";

    return (
      <div
        className={`relative inline-flex items-center justify-center shrink-0 w-5 h-5 ${className}`}
      >
        <input
          ref={(node) => {
            inputRef.current = node;
            if (typeof ref === "function") ref(node);
            else if (ref)
              (
                ref as React.MutableRefObject<HTMLInputElement | null>
              ).current = node;
          }}
          type="checkbox"
          checked={Boolean(checked)}
          disabled={disabled}
          onChange={onChange}
          className="peer absolute inset-0 opacity-0 w-full h-full cursor-pointer disabled:cursor-not-allowed z-10"
          {...props}
        />
        <div
          aria-hidden="true"
          className={`pointer-events-none w-5 h-5 ${shapeClasses} border-2 flex items-center justify-center transition-all duration-150 select-none ${
            disabled
              ? "bg-neutral-100 border-neutral-200 text-neutral-400"
              : isActive
              ? "bg-primary-600 border-primary-600 text-white shadow-2xs peer-hover:bg-primary-700 peer-hover:border-primary-700"
              : "bg-white border-neutral-300 text-transparent shadow-2xs peer-hover:border-primary-500 group-hover:border-primary-500"
          } peer-focus-visible:ring-2 peer-focus-visible:ring-primary-500/30 peer-focus-visible:ring-offset-1`}
        >
          {isIndeterminate ? (
            <Minus className="w-3 h-3 stroke-[3]" />
          ) : isChecked ? (
            <Check className="w-3.5 h-3.5 stroke-[2.75]" />
          ) : null}
        </div>
      </div>
    );
  }
);
Checkbox.displayName = "Checkbox";

export interface FormCheckboxProps extends CheckboxProps {
  label: React.ReactNode;
  description?: string;
  containerClassName?: string;
}

export function FormCheckbox({
  label,
  description,
  containerClassName = "",
  className = "",
  id,
  ...props
}: FormCheckboxProps) {
  const generatedId = React.useId();
  const checkboxId = id || generatedId;

  return (
    <label
      htmlFor={checkboxId}
      className={`flex items-start gap-3 cursor-pointer select-none group ${containerClassName}`}
    >
      <Checkbox
        id={checkboxId}
        className={`mt-0.5 ${className}`}
        {...props}
      />
      <div>
        <span className="text-sm sm:text-base font-medium text-neutral-900 group-hover:text-primary-700 transition-colors">
          {label}
        </span>
        {description && (
          <p className="text-sm text-neutral-500 mt-0.5 font-normal">
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
            <span className="text-sm text-neutral-500 block">
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

export interface RadioProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "type"> {
  className?: string;
}

export const Radio = React.forwardRef<HTMLInputElement, RadioProps>(
  ({ checked, className = "", disabled, onChange, ...props }, ref) => {
    return (
      <div
        className={`relative inline-flex items-center justify-center shrink-0 w-5 h-5 ${className}`}
      >
        <input
          ref={ref}
          type="radio"
          checked={Boolean(checked)}
          disabled={disabled}
          onChange={onChange}
          className="peer absolute inset-0 opacity-0 w-full h-full cursor-pointer disabled:cursor-not-allowed z-10"
          {...props}
        />
        <div
          aria-hidden="true"
          className={`pointer-events-none w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all duration-150 select-none ${
            disabled
              ? "bg-neutral-100 border-neutral-200 text-neutral-400"
              : checked
              ? "bg-white border-primary-600 shadow-2xs"
              : "bg-white border-neutral-300 shadow-2xs peer-hover:border-primary-500 group-hover:border-primary-500"
          } peer-focus-visible:ring-2 peer-focus-visible:ring-primary-500/30 peer-focus-visible:ring-offset-1`}
        >
          {checked && (
            <span className="w-2.5 h-2.5 rounded-full bg-primary-600 block" />
          )}
        </div>
      </div>
    );
  }
);
Radio.displayName = "Radio";

export interface FormRadioProps extends RadioProps {
  label: React.ReactNode;
  description?: string;
  containerClassName?: string;
}

export function FormRadio({
  label,
  description,
  containerClassName = "",
  className = "",
  id,
  ...props
}: FormRadioProps) {
  const generatedId = React.useId();
  const radioId = id || generatedId;

  return (
    <label
      htmlFor={radioId}
      className={`flex items-start gap-3 cursor-pointer select-none group ${containerClassName}`}
    >
      <Radio id={radioId} className={`mt-0.5 ${className}`} {...props} />
      <div>
        <span className="text-sm font-medium text-neutral-900 group-hover:text-primary-700 transition-colors">
          {label}
        </span>
        {description && (
          <p className="text-sm text-neutral-500 mt-0.5 font-normal">
            {description}
          </p>
        )}
      </div>
    </label>
  );
}
