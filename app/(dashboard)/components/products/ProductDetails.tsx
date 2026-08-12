"use client";

import Link from "next/link";
import {
  Package,
  Pencil,
  ArrowLeft,
  DollarSign,
  Barcode,
  Ruler,
  Calendar,
  FileText,
} from "lucide-react";

interface Product {
  id: string;
  name: string;
  description?: string | null;
  sku?: string | null;
  unit?: string | null;
  price: string | number;
  active: boolean;
  createdAt: string | Date;
  updatedAt: string | Date;

  _count?: {
    quotationItems?: number;
  };
}

interface Props {
  product: Product;
}

export default function ProductDetails({ product }: Props) {
  return (
    <div className="space-y-6">
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
            <Package className="text-blue-600" size={28} />
          </div>

          <div>
            <h1
              className="
              text-2xl
              font-bold
              text-slate-900
            "
            >
              {product.name}
            </h1>

            <div className="flex items-center gap-2 mt-1">
              <span
                className={`
                  rounded-full
                  px-3
                  py-1
                  text-xs
                  font-medium
                  ${
                    product.active ?
                      "bg-green-100 text-green-700"
                    : "bg-red-100 text-red-700"
                  }
                `}
              >
                {product.active ? "ACTIVE" : "INACTIVE"}
              </span>
            </div>
          </div>
        </div>

        <div className="flex gap-3">
          <Link
            href="/super-admin/products"
            className="
              inline-flex
              items-center
              gap-2
              rounded-lg
              border
              px-4
              py-2
              hover:bg-slate-50
              text-red-500
            "
          >
            <ArrowLeft size={18} />
            Back
          </Link>

          <Link
            href={`/super-admin/products/${product.id}/edit`}
            className="
              inline-flex
              items-center
              gap-2
              rounded-lg
              bg-blue-600
              px-4
              py-2
              text-white
              hover:bg-blue-700
            "
          >
            <Pencil size={18} />
            Edit
          </Link>
        </div>
      </div>

      {/* Information */}

      <div
        className="
        grid
        gap-6
        lg:grid-cols-2
      "
      >
        <div
          className="
          rounded-xl
          border
          bg-white
          p-6
        "
        >
          <h2
            className="
            mb-6
            text-lg
            font-semibold
            text-slate-600
          "
          >
            Product Information
          </h2>

          <div className="space-y-5">
            <InfoRow
              icon={<Package size={18} />}
              label="Product Name"
              value={product.name}
            />

            <InfoRow
              icon={<Barcode size={18} />}
              label="SKU"
              value={product.sku}
            />

            <InfoRow
              icon={<Ruler size={18} />}
              label="Unit"
              value={product.unit}
            />

            <InfoRow
              icon={<DollarSign size={18} />}
              label="Price"
              value={`$${Number(product.price).toFixed(2)}`}
            />
          </div>
        </div>

        <div
          className="
          rounded-xl
          border
          bg-white
          p-6
        "
        >
          <h2
            className="
            mb-6
            text-lg
            font-semibold
            text-slate-600
          "
          >
            Additional Information
          </h2>

          <div className="space-y-5">
            <InfoRow
              icon={<Calendar size={18} />}
              label="Created"
              value={new Date(product.createdAt).toLocaleDateString()}
            />

            <InfoRow
              icon={<Calendar size={18} />}
              label="Last Updated"
              value={new Date(product.updatedAt).toLocaleDateString()}
            />

            <div className="flex gap-3">
              <FileText size={18} className="mt-1 text-slate-400" />

              <div>
                <p
                  className="
                  text-sm
                  font-medium
                  text-slate-500
                "
                >
                  Description
                </p>

                <p
                  className="
                  mt-2
                  text-slate-700
                "
                >
                  {product.description || "No description provided."}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Statistics */}

      <div
        className="
        grid
        gap-4
        md:grid-cols-3
      "
      >
        <StatCard
          title="Quotation Usage"
          value={product._count?.quotationItems?.toString() || "0"}
        />

        <StatCard title="Invoices" value="0" />

        <StatCard title="Revenue" value="$0.00" />
      </div>
    </div>
  );
}

function InfoRow({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value?: string | null;
}) {
  return (
    <div className="flex gap-3">
      <div className="mt-1 text-slate-400">{icon}</div>

      <div>
        <p
          className="
          text-sm
          font-medium
          text-slate-500
        "
        >
          {label}
        </p>

        <p
          className="
          mt-1
          text-slate-900
        "
        >
          {value || "-"}
        </p>
      </div>
    </div>
  );
}

function StatCard({ title, value }: { title: string; value: string }) {
  return (
    <div
      className="
      rounded-xl
      border
      bg-white
      p-5
    "
    >
      <p
        className="
        text-sm
        text-slate-500
      "
      >
        {title}
      </p>

      <h3
        className="
        mt-2
        text-2xl
        font-bold
      "
      >
        {value}
      </h3>
    </div>
  );
}
