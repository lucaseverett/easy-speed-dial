import { del, entries, get, set } from "idb-keyval";

export default {
  storage: {
    local: {
      async get(keys) {
        const result = {};
        if (
          keys === null ||
          typeof keys === "undefined" ||
          (typeof keys === "object" &&
            Object.keys(keys).length === 0 &&
            !Array.isArray(keys))
        ) {
          // Handle keys as null, undefined, or empty object (retrieve all)
          const allEntries = await entries();
          for (const [k, v] of allEntries) {
            result[k] = v;
          }
          return result;
        }

        if (typeof keys === "string") {
          // Handle keys as a single string
          const value = await get(keys);
          if (typeof value !== "undefined") {
            result[keys] = value;
          }
          return result;
        }

        if (Array.isArray(keys)) {
          // Handle keys as an array of strings
          if (keys.length === 0) {
            return {};
          }
          for (const k of keys) {
            if (typeof k === "string") {
              const value = await get(k);
              if (typeof value !== "undefined") {
                result[k] = value;
              }
            }
          }
          return result;
        }

        if (typeof keys === "object") {
          // Handle keys as an object (retrieve items with defaults)
          for (const k in keys) {
            if (Object.prototype.hasOwnProperty.call(keys, k)) {
              const defaultValue = keys[k];
              const storedValue = await get(k);
              result[k] =
                typeof storedValue !== "undefined" ? storedValue : defaultValue;
            }
          }
          return result;
        }
        // If keys is an invalid type, WebExtension API typically returns an empty object or throws an error. For simplicity, returning empty object.
        console.warn(
          "Invalid 'keys' argument for browser.storage.local.get:",
          keys,
        );
        return {};
      },
      async set(items) {
        if (typeof items !== "object" || items === null) {
          const error = new Error("Parameter 'items' must be an object.");
          console.error("browser.storage.local.set:", error);
          return Promise.reject(error);
        }

        const changesObject = {};
        const setPromises = [];

        for (const key in items) {
          if (Object.prototype.hasOwnProperty.call(items, key)) {
            const newValue = items[key];

            // Create a promise for each key operation (get old value, then set new value)
            const operationPromise = get(key) // get from idb-keyval
              .then((oldValue) => {
                // Using JSON.stringify for comparison to handle objects/arrays correctly, as direct comparison (oldValue !== newValue) might be true for identical objects.
                const oldValueString =
                  typeof oldValue !== "undefined"
                    ? JSON.stringify(oldValue)
                    : undefined;
                const newValueString =
                  typeof newValue !== "undefined"
                    ? JSON.stringify(newValue)
                    : undefined;

                if (oldValueString !== newValueString) {
                  changesObject[key] = { newValue: newValue }; // Store the actual newValue, not stringified
                  if (typeof oldValue !== "undefined") {
                    changesObject[key].oldValue = oldValue; // Store the actual oldValue
                  }
                }
                return set(key, newValue); // set from idb-keyval
              });
            setPromises.push(operationPromise);
          }
        }

        await Promise.all(setPromises);

        // Promise resolves to undefined implicitly
      },
      async remove(keys) {
        let keysToRemove = [];
        if (typeof keys === "string") {
          keysToRemove = [keys];
        } else if (Array.isArray(keys)) {
          // Filter out non-string items, as the API expects an array of strings or a single string.
          keysToRemove = keys.filter((k) => typeof k === "string");
        } else {
          const error = new Error(
            "Invalid 'keys' argument. Must be a string or array of strings.",
          );
          console.error("browser.storage.local.remove:", error);
          return Promise.reject(error);
        }

        if (keysToRemove.length === 0) {
          // If keys was an empty array, or became empty after filtering, it's a no-op.
          return Promise.resolve();
        }

        const changesObject = {};
        const removalPromises = [];

        for (const key of keysToRemove) {
          const operationPromise = get(key) // get from idb-keyval
            .then((oldValue) => {
              if (typeof oldValue !== "undefined") {
                changesObject[key] = { oldValue: oldValue };
                return del(key); // del from idb-keyval
              }
              // If key didn't exist, no need to call del or record a change.
              return Promise.resolve();
            });
          removalPromises.push(operationPromise);
        }

        await Promise.all(removalPromises);

        // Promise resolves to undefined implicitly
      },
    },
  },
};
