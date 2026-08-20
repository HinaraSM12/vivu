export function createFixedId(value: string): () => string {
  return () => value;
}
