import Link from "next/link";
import { Package, Plus } from "lucide-react";

import ProductTable from "../../components/products/ProductTable";

export default function ProductsPage() {
  return (
    <div className="space-y-6">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-slate-500">
        <Link href="/super-admin" className="hover:text-blue-600">
          Dashboard
        </Link>

        <span>/</span>

        <span className="font-medium text-slate-700">Products</span>
      </div>

      {/* Header */}
      <div
        className="
        flex
        flex-col
        gap-4
        rounded-xl
        border
        bg-white
        p-6
        md:flex-row
        md:items-center
        md:justify-between
      "
      >
        <div className="flex items-center gap-4">
          <div
            className="
            flex
            h-14
            w-14
            items-center
            justify-center
            rounded-xl
            bg-blue-100
          "
          >
            <Package size={28} className="text-blue-600" />
          </div>

          <div>
            <h1
              className="
              text-3xl
              font-bold
              text-slate-900
            "
            >
              Products
            </h1>

            <p
              className="
              mt-1
              text-slate-500
            "
            >
              Manage your company products and pricing.
            </p>
          </div>
        </div>

        <Link
          href="/super-admin/products/new"
          className="
            inline-flex
            items-center
            gap-2
            rounded-lg
            bg-blue-600
            px-5
            py-2.5
            text-white
            hover:bg-blue-700
          "
        >
          <Plus size={18} />
          Add Product
        </Link>
      </div>

      {/* Products Table */}

      <ProductTable />
    </div>
  );
}
