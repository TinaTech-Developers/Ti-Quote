import Link from "next/link";
import { ArrowLeft, PackagePlus } from "lucide-react";

import ProductForm from "../../../components/products/ProductForm";

export default function NewProductPage() {
  return (
    <div className="space-y-6">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-slate-500">
        <Link href="/super-admin" className="hover:text-blue-600">
          Dashboard
        </Link>

        <span>/</span>

        <Link href="/super-admin/products" className="hover:text-blue-600">
          Products
        </Link>

        <span>/</span>

        <span className="font-medium text-slate-700">New Product</span>
      </div>

      {/* Header */}
      <div
        className="
          flex
          items-center
          gap-4
          rounded-xl
          border
          bg-white
          p-6
          shadow-sm
        "
      >
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
          <PackagePlus size={28} className="text-blue-600" />
        </div>

        <div>
          <h1
            className="
              text-3xl
              font-bold
              text-slate-900
            "
          >
            Add Product
          </h1>

          <p className="mt-1 text-slate-500">
            Create a new product for your company inventory.
          </p>
        </div>
      </div>

      {/* Form */}
      <ProductForm />
    </div>
  );
}
