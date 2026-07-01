import { useState } from "react";
import css from "./SearchBox.module.css";

interface SearchBoxProps {
  search: string;
  onSearch: (newValue: string) => void;
}
export default function SearchBox({ search, onSearch }: SearchBoxProps) {
  const [value, setValue] = useState(search);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setValue(event.target.value);
    onSearch(event.target.value);
  };
  return (
    <input
      className={css.input}
      type="text"
      value={value}
      onChange={handleChange}
      placeholder="Search notes"
    />
  );
}
