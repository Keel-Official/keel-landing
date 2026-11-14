// `server-only` throws when imported outside a React Server Components build. Jest is
// not one, so the unit tests read the server modules through this empty stand-in.
export {};
