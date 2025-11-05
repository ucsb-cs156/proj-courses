export const removeKey = (obj) => {
  const { key, ...rest } = obj;
  return rest;
};
