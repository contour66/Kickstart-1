"use client";

import Image from "next/image";
import Link from "next/link";
import { Product } from "@/lib/types";

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const firstImage = product.featured_image?.[0];

  return (
    <Link
      href={product.url || `/product/${product.uid}`}
      className="group block bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300"
      {...(product.$ ? product.$ : {})}
    >
      <div className="relative aspect-square overflow-hidden bg-gray-100">
        {firstImage?.url ? (
          <Image
            src={firstImage.url}
            alt={product.title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            {...(firstImage.$ ? firstImage.$ : {})}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-400">
            No Image
          </div>
        )}
      </div>

      <div className="p-4">
        <h3
          className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2"
          {...(product.$ ? product.$.title : {})}
        >
          {product.title}
        </h3>

        {product.description && (
          <p
            className="text-sm text-gray-600 mb-3 line-clamp-2"
            {...(product.$ ? product.$.description : {})}
          >
            {product.description}
          </p>
        )}

        <div className="flex items-center justify-between">
          <span
            className="text-xl font-bold text-gray-900"
            {...(product.$ ? product.$.price : {})}
          >
            ${product.price.toFixed(2)}
          </span>

          {product.call_to_action?.title && (
            <span className="text-sm text-blue-600 group-hover:text-blue-800 font-medium">
              {product.call_to_action.title} →
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}
