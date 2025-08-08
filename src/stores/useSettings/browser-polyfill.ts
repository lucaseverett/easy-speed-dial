import { del, entries, get, set } from "idb-keyval";

type StorageItems = Record<string, unknown>;
type StorageKeys = string | string[] | StorageItems | null | undefined;

export default {
  storage: {
    local: {
      async get(keys: StorageKeys): Promise<StorageItems> {
        const result: StorageItems = {};
        if (
          keys === null ||
          typeof keys === "undefined" ||
          (typeof keys === "object" &&
            Object.keys(keys).length === 0 &&
            !Array.isArray(keys))
        ) {
          // If keys is null, undefined, or an empty object, retrieve all stored items.
          const allEntries = await entries();
          for (const [k, v] of allEntries) {
            if (typeof k === "string") {
              result[k] = v;
            }
          }
          return result;
        }

        if (typeof keys === "string") {
          // If keys is a string, retrieve the value for that key.
          const value = await get(keys);
          if (typeof value !== "undefined") {
            result[keys] = value;
          }
          return result;
        }

        if (Array.isArray(keys)) {
          // If keys is an array of strings, retrieve values for each key.
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
          // If keys is an object, retrieve each key and use the provided value as a default if not found.
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
        // For invalid key types, mimic WebExtension API by returning an empty object.
        console.warn(
          "Invalid 'keys' argument for browser.storage.local.get:",
          keys,
        );
        return {};
      },
      async set(items: StorageItems): Promise<void> {
        if (typeof items !== "object" || items === null) {
          const error = new Error("Parameter 'items' must be an object.");
          console.error("browser.storage.local.set:", error);
          return Promise.reject(error);
        }

        const changesObject: StorageItems = {};
        const setPromises: Promise<void>[] = [];

        for (const key in items) {
          if (Object.prototype.hasOwnProperty.call(items, key)) {
            const newValue = items[key];

            // Create a promise for each key operation (retrieve old value, then store new value)
            const operationPromise = get(key) // Retrieve value from idb-keyval.
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
                    (
                      changesObject[key] as {
                        newValue: unknown;
                        oldValue?: unknown;
                      }
                    ).oldValue = oldValue; // Store the actual oldValue
                  }
                }
                return set(key, newValue); // Store value using idb-keyval.
              });
            setPromises.push(operationPromise);
          }
        }

        await Promise.all(setPromises);

        // The returned promise resolves to undefined (matches WebExtension API).
      },
      async remove(keys: string | string[]): Promise<void> {
        let keysToRemove: string[] = [];
        if (typeof keys === "string") {
          keysToRemove = [keys];
        } else if (Array.isArray(keys)) {
          // Only keep string items, as the API expects an array of strings or a single string.
          keysToRemove = keys.filter((k) => typeof k === "string");
        } else {
          const error = new Error(
            "Invalid 'keys' argument. Must be a string or array of strings.",
          );
          console.error("browser.storage.local.remove:", error);
          return Promise.reject(error);
        }

        if (keysToRemove.length === 0) {
          // If there are no keys to remove, do nothing.
          return Promise.resolve();
        }

        const changesObject: StorageItems = {};
        const removalPromises: Promise<void>[] = [];

        for (const key of keysToRemove) {
          const operationPromise = get(key) // Retrieve value from idb-keyval.
            .then((oldValue) => {
              if (typeof oldValue !== "undefined") {
                changesObject[key] = { oldValue: oldValue };
                return del(key); // Delete value using idb-keyval.
              }
              // If the key does not exist, skip deletion and change recording.
              return Promise.resolve();
            });
          removalPromises.push(operationPromise);
        }

        await Promise.all(removalPromises);

        // The returned promise resolves to undefined (matches WebExtension API).
      },
    },
  },
};
