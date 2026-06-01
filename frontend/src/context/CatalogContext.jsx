import { createContext, useContext } from "react";
import useCatalog from "../hooks/useCatalog";

const CatalogContext = createContext(null);

export function CatalogProvider({ children }) {
  const catalog = useCatalog();
  return (
    <CatalogContext.Provider value={catalog}>{children}</CatalogContext.Provider>
  );
}

export function useCatalogContext() {
  const ctx = useContext(CatalogContext);
  if (!ctx) {
    throw new Error("useCatalogContext must be used within CatalogProvider");
  }
  return ctx;
}
