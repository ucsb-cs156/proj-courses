// See: https://www.youtube.com/watch?v=vRDGUUEg_n8 for an explanation
// This hook creates a drop in replacement for useState that syncs
// the state with local storage. It will take a key and an initial value,
// and return an array with the current value and a function to update it.

// The initial value is used only in the case that the key
// is not already in local storage.

import { useState } from "react";

const useLocalStorage = (key, initialValue) => {
  const [storedValue, setStoredValue] = useState(() => {
    if (typeof window === "undefined") {
      return initialValue;
    }
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.log(error);
      return initialValue;
    }
  });

  const setValue = (value) => {
    try {
      setStoredValue(value);
      if (typeof window === "undefined") {
        window.localStorage.setItem(key, JSON.stringify(value));
      }
    } catch (error) {
      console.log(error);
    }
  };

  return [storedValue, setValue];
};

export default useLocalStorage;
