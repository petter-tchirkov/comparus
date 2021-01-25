export function chooseRandomIndex<T>(choices: T[], condition: (item: T) => boolean): number {
  const indexes = choices
    .map((item, index) => ({ item, index }))
    .filter(({ item }) => condition(item))
    .map(({ index }) => index);
  return indexes[Math.floor(Math.random() * indexes.length)];
}
