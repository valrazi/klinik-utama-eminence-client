"use client";

import { Icon, Input, InputGroup, InputLeftElement } from "@chakra-ui/react";
import { useCallback, useMemo } from "react";
import debounce from "lodash/debounce";

import { IoSearch } from "react-icons/io5";

/**
 * DebouncedSearchInput
 * @param {function} onSearch - function that receives the debounced search value
 * @param {string} placeholder - placeholder text
 * @param {number} delay - debounce delay in ms (default: 300ms)
 * @param {object} rest - any other Input props
 */
export default function DebouncedSearchInput({
  onSearch,
  placeholder = "Search...",
  delay = 300,
  ...rest
}) {
  // Create a debounced version of onSearch
  const debouncedSearch = useMemo(() => {
    return debounce(onSearch, delay);
  }, [onSearch, delay]);

  // Cleanup debounce on unmount
  const handleChange = useCallback((e) => {
    debouncedSearch(e.target.value);
  }, [debouncedSearch]);

  return (
    <InputGroup startElement={<IoSearch/>} width={'1/3'}>
      <Input
        border={'1px solid gray'}
        rounded={'lg'}
        placeholder={placeholder}
        onChange={handleChange}
        {...rest}
      />
    </InputGroup>
  );
}
