// File: src/components/ui/card.jsx

import React from "react";

export function Card({ children, className = "", ...props }) {
  return (
    <div className={`border rounded-2xl bg-white shadow-sm ${className}`} {...props}>
      {children}
    </div>
  );
}

export function CardContent({ children, className = "" }) {
  return <div className={`p-4 ${className}`}>{children}</div>;
}
