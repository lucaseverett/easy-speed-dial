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
          const allEntries = await entries();
          for (const [k, v] of allEntries) {
            if (typeof k === "string") {
              result[k] = v;
            }
          }
          return result;
        }

        if (typeof keys === "string") {
          const value = await get(keys);
          if (typeof value !== "undefined") {
            result[keys] = value;
          }
          return result;
        }

        if (Array.isArray(keys)) {
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

            const operationPromise = get(key).then((oldValue) => {
              // Treat structurally equal objects as unchanged.
              const oldValueString =
                typeof oldValue !== "undefined"
                  ? JSON.stringify(oldValue)
                  : undefined;
              const newValueString =
                typeof newValue !== "undefined"
                  ? JSON.stringify(newValue)
                  : undefined;

              if (oldValueString !== newValueString) {
                changesObject[key] = { newValue: newValue };
                if (typeof oldValue !== "undefined") {
                  (
                    changesObject[key] as {
                      newValue: unknown;
                      oldValue?: unknown;
                    }
                  ).oldValue = oldValue;
                }
              }
              return set(key, newValue);
            });
            setPromises.push(operationPromise);
          }
        }

        await Promise.all(setPromises);
      },
      async remove(keys: string | string[]): Promise<void> {
        let keysToRemove: string[] = [];
        if (typeof keys === "string") {
          keysToRemove = [keys];
        } else if (Array.isArray(keys)) {
          keysToRemove = keys.filter((k) => typeof k === "string");
        } else {
          const error = new Error(
            "Invalid 'keys' argument. Must be a string or array of strings.",
          );
          console.error("browser.storage.local.remove:", error);
          return Promise.reject(error);
        }

        if (keysToRemove.length === 0) {
          return Promise.resolve();
        }

        const changesObject: StorageItems = {};
        const removalPromises: Promise<void>[] = [];

        for (const key of keysToRemove) {
          const operationPromise = get(key).then((oldValue) => {
            if (typeof oldValue !== "undefined") {
              changesObject[key] = { oldValue: oldValue };
              return del(key);
            }
            return Promise.resolve();
          });
          removalPromises.push(operationPromise);
        }

        await Promise.all(removalPromises);
      },
    },
  },
};
