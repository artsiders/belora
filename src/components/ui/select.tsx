"use client";

import React, { useState, useRef, useEffect, useId, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronDown,
  Check,
  Search,
  X,
  Plus,
  LucideIcon,
} from "lucide-react";
import { Badge, BadgeVariant } from "@/components/ui/badge";

export interface SelectOption<T = string> {
  value: T;
  label: string;
  sublabel?: string;
  description?: string;
  badge?: string;
  badgeVariant?: BadgeVariant;
  icon?: LucideIcon | React.ComponentType<{ className?: string }>;
  avatarInitials?: string;
  disabled?: boolean;
  group?: string;
}

export interface SelectProps<T = string> {
  id?: string;
  label?: string;
  required?: boolean;
  error?: string;
  helper?: string;
  options: SelectOption<T>[];
  value?: T;
  onChange: (value: T) => void;
  placeholder?: string;
  searchable?: boolean;
  searchPlaceholder?: string;
  clearable?: boolean;
  disabled?: boolean;
  className?: string;
  size?: "sm" | "md";
  variant?: "default" | "ghost";
  creatable?: boolean;
  createPrompt?: string;
  onCreateNew?: (query: string) => void;
  renderOption?: (option: SelectOption<T>, isSelected: boolean) => React.ReactNode;
  renderValue?: (option: SelectOption<T>) => React.ReactNode;
}

export function Select<T = string>({
  id,
  label,
  required = false,
  error,
  helper,
  options,
  value,
  onChange,
  placeholder = "Sélectionner une option...",
  searchable = false,
  searchPlaceholder = "Rechercher...",
  clearable = false,
  disabled = false,
  className = "",
  size = "md",
  variant = "default",
  creatable = false,
  createPrompt = "Créer",
  onCreateNew,
  renderOption,
  renderValue,
}: SelectProps<T>) {
  const generatedId = useId();
  const selectId = id || generatedId;

  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [highlightedIndex, setHighlightedIndex] = useState<number>(0);

  const containerRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLUListElement>(null);

  // Selected Option finding
  const selectedOption = useMemo(() => {
    return options.find((opt) => opt.value === value);
  }, [options, value]);

  // Filtered options based on search query
  const filteredOptions = useMemo(() => {
    if (!searchQuery.trim()) return options;
    const query = searchQuery.toLowerCase().trim();
    return options.filter((opt) => {
      const matchLabel = opt.label.toLowerCase().includes(query);
      const matchSub = opt.sublabel?.toLowerCase().includes(query);
      const matchBadge = opt.badge?.toLowerCase().includes(query);
      const matchDesc = opt.description?.toLowerCase().includes(query);
      return matchLabel || matchSub || matchBadge || matchDesc;
    });
  }, [options, searchQuery]);

  // Grouped options if groups exist
  const groupedOptions = useMemo(() => {
    const hasGroups = filteredOptions.some((opt) => opt.group);
    if (!hasGroups) return null;

    const groups: Record<string, SelectOption<T>[]> = {};
    for (const opt of filteredOptions) {
      const groupName = opt.group || "Autres";
      if (!groups[groupName]) groups[groupName] = [];
      groups[groupName].push(opt);
    }
    return groups;
  }, [filteredOptions]);

  // Handle open state & focus search input
  useEffect(() => {
    if (isOpen) {
      setHighlightedIndex(0);
      if (searchable) {
        setTimeout(() => {
          searchInputRef.current?.focus();
        }, 50);
      }
    } else {
      setSearchQuery("");
    }
  }, [isOpen, searchable]);

  // Click outside listener
  useEffect(() => {
    function handleClickOutside(event: MouseEvent | TouchEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      document.addEventListener("touchstart", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("touchstart", handleClickOutside);
    };
  }, [isOpen]);

  // Keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (disabled) return;

    if (!isOpen) {
      if (e.key === "Enter" || e.key === "ArrowDown" || e.key === " ") {
        e.preventDefault();
        setIsOpen(true);
      }
      return;
    }

    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        setHighlightedIndex((prev) =>
          prev < filteredOptions.length - 1 ? prev + 1 : 0
        );
        break;
      case "ArrowUp":
        e.preventDefault();
        setHighlightedIndex((prev) =>
          prev > 0 ? prev - 1 : filteredOptions.length - 1
        );
        break;
      case "Enter":
        e.preventDefault();
        if (filteredOptions[highlightedIndex]) {
          handleSelect(filteredOptions[highlightedIndex]);
        } else if (creatable && searchQuery.trim() && onCreateNew) {
          onCreateNew(searchQuery.trim());
          setIsOpen(false);
        }
        break;
      case "Escape":
        e.preventDefault();
        setIsOpen(false);
        break;
      case "Tab":
        setIsOpen(false);
        break;
    }
  };

  const handleSelect = (option: SelectOption<T>) => {
    if (option.disabled) return;
    onChange(option.value);
    setIsOpen(false);
  };

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation();
    onChange("" as unknown as T);
  };

  const heightClass = size === "sm" ? "h-9 text-xs" : "h-11 text-sm";

  return (
    <div ref={containerRef} className={`space-y-1.5 w-full relative ${className}`}>
      {/* Label */}
      {label && (
        <label
          htmlFor={selectId}
          className="block text-xs font-semibold text-neutral-800 uppercase tracking-wider"
        >
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}

      {/* Trigger Button */}
      <div
        id={selectId}
        role="combobox"
        aria-expanded={isOpen}
        aria-haspopup="listbox"
        tabIndex={disabled ? -1 : 0}
        onKeyDown={handleKeyDown}
        onClick={() => !disabled && setIsOpen((prev) => !prev)}
        className={`w-full flex items-center justify-between gap-2 cursor-pointer transition-colors duration-150 select-none ${
          variant === "ghost"
            ? "bg-transparent border-0 shadow-none px-0 py-0.5 text-neutral-900"
            : `${heightClass} px-3.5 bg-white border rounded-xl ${
                error
                  ? "border-red-400 focus:border-red-600 focus:ring-2 focus:ring-red-500/20"
                  : isOpen
                  ? "border-primary-500 ring-2 ring-primary-500/20 shadow-xs"
                  : "border-neutral-200/90 hover:border-neutral-300 shadow-2xs"
              }`
        } ${disabled ? "opacity-50 cursor-not-allowed bg-neutral-50" : ""}`}
      >
        {/* Left Side: Selected Value or Placeholder */}
        <div className="flex items-center gap-2.5 min-w-0 flex-1 truncate">
          {selectedOption ? (
            renderValue ? (
              renderValue(selectedOption)
            ) : (
              <div className="flex items-center gap-2 truncate">
                {selectedOption.avatarInitials && (
                  <span className="w-5 h-5 rounded-full bg-neutral-200 text-neutral-700 font-bold text-xs flex items-center justify-center shrink-0">
                    {selectedOption.avatarInitials}
                  </span>
                )}
                {selectedOption.icon && (
                  <selectedOption.icon className="w-4 h-4 text-neutral-500 shrink-0" />
                )}
                <span className="font-medium text-neutral-900 truncate">
                  {selectedOption.label}
                </span>
                {selectedOption.sublabel && (
                  <span className="text-xs text-neutral-500 truncate hidden sm:inline">
                    {selectedOption.sublabel}
                  </span>
                )}
                {selectedOption.badge && (
                  <Badge
                    variant={selectedOption.badgeVariant || "neutral"}
                    size="sm"
                    className="shrink-0"
                  >
                    {selectedOption.badge}
                  </Badge>
                )}
              </div>
            )
          ) : (
            <span className="text-neutral-400 truncate">{placeholder}</span>
          )}
        </div>

        {/* Right Side: Clear icon & Chevron */}
        <div className="flex items-center gap-1.5 shrink-0 text-neutral-400">
          {clearable && selectedOption && !disabled && (
            <button
              type="button"
              onClick={handleClear}
              className="p-1 hover:text-neutral-700 rounded-md transition-colors"
              title="Effacer la sélection"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
          <ChevronDown
            className={`w-4 h-4 transition-transform duration-200 ${
              isOpen ? "rotate-180 text-primary-600" : ""
            }`}
          />
        </div>
      </div>

      {/* Helper & Error Texts */}
      {error ? (
        <p className="text-xs text-red-600 font-medium">{error}</p>
      ) : helper ? (
        <p className="text-xs text-neutral-500">{helper}</p>
      ) : null}

      {/* Dropdown Menu Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.15, ease: "easeOut" }}
            className={`absolute z-50 left-0 right-0 ${
              variant === "ghost" ? "top-full mt-2" : "top-full mt-1.5"
            } min-w-[220px] bg-white border border-neutral-200/90 rounded-2xl shadow-xl overflow-hidden backdrop-blur-md`}
          >
            {/* Live Search Input */}
            {searchable && (
              <div className="p-2 border-b border-neutral-100 bg-neutral-50/50">
                <div className="relative">
                  <Search className="w-4 h-4 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    ref={searchInputRef}
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder={searchPlaceholder}
                    className="w-full pl-9 pr-8 py-2 bg-white border border-neutral-200 rounded-xl text-xs text-neutral-900 placeholder:text-neutral-400 focus:outline-hidden focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500"
                  />
                  {searchQuery && (
                    <button
                      type="button"
                      onClick={() => setSearchQuery("")}
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 p-0.5 text-neutral-400 hover:text-neutral-600"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  )}
                </div>
              </div>
            )}

            {/* Options List */}
            <ul
              ref={listRef}
              role="listbox"
              tabIndex={-1}
              className="max-h-60 overflow-y-auto p-1.5 space-y-1 text-xs"
            >
              {filteredOptions.length === 0 ? (
                <div className="py-6 px-4 text-center">
                  <p className="text-neutral-500 font-medium">
                    Aucun résultat trouvé pour &laquo;&nbsp;{searchQuery}&nbsp;&raquo;
                  </p>
                  {creatable && searchQuery.trim() && onCreateNew && (
                    <button
                      type="button"
                      onClick={() => {
                        onCreateNew(searchQuery.trim());
                        setIsOpen(false);
                      }}
                      className="mt-3 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-primary-50 text-primary-700 hover:bg-primary-100 font-semibold text-xs transition-colors"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>
                        {createPrompt} &laquo;&nbsp;{searchQuery.trim()}&nbsp;&raquo;
                      </span>
                    </button>
                  )}
                </div>
              ) : groupedOptions ? (
                Object.entries(groupedOptions).map(([groupTitle, groupOpts]) => (
                  <div key={groupTitle} className="space-y-1">
                    <div className="px-3 py-1.5 text-xs font-semibold text-neutral-400 uppercase tracking-wider">
                      {groupTitle}
                    </div>
                    {groupOpts.map((opt) => {
                      const isSelected = opt.value === value;
                      return (
                        <li
                          key={String(opt.value)}
                          role="option"
                          aria-selected={isSelected}
                          onClick={() => handleSelect(opt)}
                          className={`flex items-center justify-between gap-3 px-3 py-2 rounded-xl cursor-pointer transition-colors ${
                            isSelected
                              ? "bg-primary-50 text-primary-900 font-semibold"
                              : "text-neutral-700 hover:bg-neutral-100"
                          } ${opt.disabled ? "opacity-40 cursor-not-allowed" : ""}`}
                        >
                          <div className="flex items-center gap-2.5 truncate flex-1">
                            {opt.avatarInitials && (
                              <span className="w-6 h-6 rounded-full bg-neutral-200 text-neutral-700 font-bold text-xs flex items-center justify-center shrink-0">
                                {opt.avatarInitials}
                              </span>
                            )}
                            {opt.icon && (
                              <opt.icon className="w-4 h-4 text-neutral-400 shrink-0" />
                            )}
                            <div className="truncate">
                              <div className="truncate">{opt.label}</div>
                              {opt.sublabel && (
                                <div className="text-xs text-neutral-500 font-normal truncate">
                                  {opt.sublabel}
                                </div>
                              )}
                            </div>
                          </div>

                          <div className="flex items-center gap-2 shrink-0">
                            {opt.badge && (
                              <Badge
                                variant={opt.badgeVariant || "neutral"}
                                size="sm"
                              >
                                {opt.badge}
                              </Badge>
                            )}
                            {isSelected && (
                              <Check className="w-4 h-4 text-primary-600 stroke-[2.5]" />
                            )}
                          </div>
                        </li>
                      );
                    })}
                  </div>
                ))
              ) : (
                filteredOptions.map((opt) => {
                  const isSelected = opt.value === value;

                  return (
                    <li
                      key={String(opt.value)}
                      role="option"
                      aria-selected={isSelected}
                      onClick={() => handleSelect(opt)}
                      className={`flex items-center justify-between gap-3 px-3 py-2 rounded-xl cursor-pointer transition-colors ${
                        isSelected
                          ? "bg-primary-50 text-primary-900 font-semibold"
                          : "text-neutral-700 hover:bg-neutral-100"
                      } ${opt.disabled ? "opacity-40 cursor-not-allowed" : ""}`}
                    >
                      {renderOption ? (
                        renderOption(opt, isSelected)
                      ) : (
                        <>
                          <div className="flex items-center gap-2.5 truncate flex-1">
                            {opt.avatarInitials && (
                              <span className="w-6 h-6 rounded-full bg-neutral-200 text-neutral-700 font-bold text-xs flex items-center justify-center shrink-0">
                                {opt.avatarInitials}
                              </span>
                            )}
                            {opt.icon && (
                              <opt.icon className="w-4 h-4 text-neutral-400 shrink-0" />
                            )}
                            <div className="truncate">
                              <div className="truncate font-medium">{opt.label}</div>
                              {opt.sublabel && (
                                <div className="text-xs text-neutral-500 font-normal truncate">
                                  {opt.sublabel}
                                </div>
                              )}
                            </div>
                          </div>

                          <div className="flex items-center gap-2 shrink-0">
                            {opt.badge && (
                              <Badge
                                variant={opt.badgeVariant || "neutral"}
                                size="sm"
                              >
                                {opt.badge}
                              </Badge>
                            )}
                            {isSelected && (
                              <Check className="w-4 h-4 text-primary-600 stroke-[2.5]" />
                            )}
                          </div>
                        </>
                      )}
                    </li>
                  );
                })
              )}
              {creatable &&
                searchQuery.trim() &&
                onCreateNew &&
                filteredOptions.length > 0 &&
                !options.some(
                  (o) => o.label.toLowerCase() === searchQuery.trim().toLowerCase()
                ) && (
                  <li className="pt-1 mt-1 border-t border-neutral-100 list-none">
                    <button
                      type="button"
                      onClick={() => {
                        onCreateNew(searchQuery.trim());
                        setIsOpen(false);
                      }}
                      className="w-full flex items-center gap-2 px-3 py-2 rounded-xl bg-primary-50 text-primary-700 hover:bg-primary-100 font-semibold text-xs transition-colors cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5 shrink-0" />
                      <span className="truncate">
                        {createPrompt} &laquo;&nbsp;{searchQuery.trim()}&nbsp;&raquo;
                      </span>
                    </button>
                  </li>
                )}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default Select;
