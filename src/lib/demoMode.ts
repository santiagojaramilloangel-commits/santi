/**
 * Client-visible demo flag. The server sets `NEXT_PUBLIC_DEMO_MODE` at build
 * time when no provider key is present; the API route also returns
 * `{ demo: true }` so runtime empty env still works in `next start`.
 */
export function readPublicDemoFlag(): boolean {
  return process.env.NEXT_PUBLIC_DEMO_MODE === "1";
}
