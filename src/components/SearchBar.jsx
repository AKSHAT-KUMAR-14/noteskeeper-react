import React from "react";

export default function SearchBar({value, onChange}) {
  return (
    <input
      className="search"
      placeholder="Search notes..."
      value={value}
      onChange={e=>onChange(e.target.value)}
    />
  );
}
