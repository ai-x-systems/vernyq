import { getCurrentBrand } from "@/lib/get-current-brand";
import { getAdminProductList } from "@/features/catalog/services/product.service";
import { formatCentsAsUsd } from "@/lib/utils";
import { StockToggle } from "./stock-toggle";

export const dynamic = "force-dynamic";

export default async function AdminProductsPage() {
  const brand = await getCurrentBrand();
  const products = await getAdminProductList(brand.id);

  return (
    <div>
      <h1 className="text-h2 text-[var(--brand-ink)]">Products</h1>
      <p className="text-body-sm mt-2 text-[var(--brand-steel)]">
        In-stock status controls the storefront badge, the Add to Cart button, and the
        product schema markup search engines see. Defaults to off until you confirm real
        supplier stock.
      </p>

      <div className="mt-6 overflow-x-auto rounded-[0.5rem] border border-[var(--brand-line)] bg-white">
        <table className="w-full text-body-sm">
          <thead>
            <tr className="border-b border-[var(--brand-line)] text-left text-[var(--brand-steel)]">
              <th className="px-4 py-3 font-medium">Product</th>
              <th className="px-4 py-3 font-medium">Status</th>
              <th className="px-4 py-3 font-medium">Price</th>
              <th className="px-4 py-3 font-medium">Stock</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr key={product.id} className="border-b border-[var(--brand-line)] last:border-0">
                <td className="px-4 py-3 text-[var(--brand-ink)]">{product.name}</td>
                <td className="px-4 py-3 text-[var(--brand-ink)]">{product.status}</td>
                <td className="px-4 py-3 text-[var(--brand-ink)]">{formatCentsAsUsd(product.priceCents)}</td>
                <td className="px-4 py-3">
                  <StockToggle productId={product.id} inStock={product.inStock} />
                </td>
              </tr>
            ))}
            {products.length === 0 && (
              <tr>
                <td colSpan={4} className="px-4 py-10 text-center text-[var(--brand-steel)]">
                  No products yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
