import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Pencil } from "lucide-react";

import { prisma } from "@/lib/prisma";
import ProductForm from "../../../../components/products/ProductForm";

interface PageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function EditProductPage({ params }: PageProps) {
  const { id } = await params;

  const product = await prisma.product.findUnique({
    where: {
      id,
    },
  });

  if (!product) {
    notFound();
  }

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

        <span className="font-medium text-slate-700">Edit</span>
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
          <Pencil size={28} className="text-blue-600" />
        </div>

        <div>
          <h1
            className="
              text-3xl
              font-bold
              text-slate-900
            "
          >
            Edit Product
          </h1>

          <p className="mt-1 text-slate-500">
            Update product details and pricing.
          </p>
        </div>
      </div>

      {/* Form */}

      <ProductForm
        initialData={{
          id: product.id,
          name: product.name,
          description: product.description,
          sku: product.sku,
          unit: product.unit,
          price: product.price.toString(),
          active: product.active,
        }}
      />
    </div>
  );
}
