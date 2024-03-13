// 排除object中多个字段
export function excludeFieldsFromObject(user, keys) {
  return Object.fromEntries(
    Object.entries(user).filter(([key]) => !keys.includes(key)),
  );
}

// 排除object array中多个字段
export function excludeFieldsFromObjectsArray(objectsArray, keys) {
  return objectsArray.map((object) =>
    Object.fromEntries(
      Object.entries(object).filter(([key]) => !keys.includes(key)),
    ),
  );
}
