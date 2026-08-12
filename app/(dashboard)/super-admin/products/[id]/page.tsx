import { notFound } from "next/navigation";

import {prisma} from "@/lib/prisma";
import ProductDetails from "../../../components/products/ProductDetails";

interface PageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function ProductPage({ params }: PageProps) {
  const { id } = await params;

  const product = await prisma.product.findUnique({
    where: {
      id,
    },

    include: {
      _count: {
        select: {
          quotationItems: true,
        },
      },
    },
  });

  if (!product) {
    notFound();
  }

  return (
    <div className="space-y-6">
      <ProductDetails
        product={{
          ...product,

          price: product.price.toString(),

          createdAt: product.createdAt,

          updatedAt: product.updatedAt,
        }}
      />
    </div>
  );
}
