import products from "../data/products.json";
import type { Product } from "./types";

export const allProducts = products as Product[];

export function getProduct(handle: string): Product | undefined {
  return allProducts.find((p) => p.handle === handle);
}

export function relatedProducts(handle: string, limit = 4): Product[] {
  return allProducts.filter((p) => p.handle !== handle).slice(0, limit);
}
