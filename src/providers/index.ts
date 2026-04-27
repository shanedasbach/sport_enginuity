import type { ProviderAdapter, DataProvider } from "../core/types.js";

const registry = new Map<DataProvider, ProviderAdapter>();

export function registerAdapter(adapter: ProviderAdapter): void {
  registry.set(adapter.provider, adapter);
}

export function getAdapter(provider: DataProvider): ProviderAdapter | null {
  return registry.get(provider) ?? null;
}

export function listAdapters(): ProviderAdapter[] {
  return Array.from(registry.values());
}

export function clearAdapters(): void {
  registry.clear();
}

export { BalldontlieAdapter } from "./balldontlie/adapter.js";
