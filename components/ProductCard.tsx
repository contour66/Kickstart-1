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
    <div
      className="group bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300 flex flex-col"
      {...(product.$ ? product.$ : {})}
    >
      <Link
        href={product.url || `/product/${product.uid}`}
        className="block"
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
      </Link>

      <div className="p-4 flex flex-col flex-grow">
        <Link
          href={product.url || `/product/${product.uid}`}
          className="block mb-auto"
        >
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

          <div className="mb-4">
            <span
              className="text-xl font-bold text-gray-900"
              {...(product.$ ? product.$.price : {})}
            >
              ${product.price.toFixed(2)}
            </span>
          </div>
        </Link>

        {product.call_to_action?.title && (product.call_to_action?.href || product.call_to_action?.url) && (
          <Link
            href={product.call_to_action.href || product.call_to_action.url || '#'}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white text-center font-semibold px-4 py-2 rounded-lg transition-colors"
            {...(product.$ ? product.$.call_to_action : {})}
          >
            {product.call_to_action.title}
          </Link>
        )}
      </div>
    </div>
  );
}
