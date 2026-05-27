export function reconcile<T extends { id?: string }>(
  observableArray: T[],
  newData: T[],
  keyFn: (item: T) => string = (item) => item.id || "",
) {
  const existingMap = new Map(
    observableArray.map((item) => [keyFn(item), item]),
  );
  const newMap = new Map(newData.map((item) => [keyFn(item), item]));

  for (let i = observableArray.length - 1; i >= 0; i--) {
    const key = keyFn(observableArray[i]);
    if (!newMap.has(key)) {
      observableArray.splice(i, 1);
    }
  }

  newData.forEach((newItem: T, index: number) => {
    const key = keyFn(newItem);
    const existing = existingMap.get(key);

    if (existing) {
      Object.assign(existing, newItem);
      const currentIndex = observableArray.indexOf(existing);
      if (currentIndex !== index) {
        observableArray.splice(currentIndex, 1);
        observableArray.splice(index, 0, existing);
      }
    } else {
      observableArray.splice(index, 0, newItem);
    }
  });
}
