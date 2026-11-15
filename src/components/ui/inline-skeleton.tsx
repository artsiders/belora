import React from "react";

export interface InlineSkeletonProps {
  className?: string;
  width?: string;
  height?: string;
}

export function InlineSkeleton({
  className = "",
  width = "w-24",
  height = "h-7",
}: InlineSkeletonProps) {
  return (
    <span
      className={`inline-block rounded-md bg-neutral-200 animate-pulse my-0.5 ${width} ${height} ${className}`}
      aria-hidden="true"
    />
  );
}

export default InlineSkeleton;
