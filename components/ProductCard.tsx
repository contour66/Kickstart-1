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
      className="group bg-gradient-to-br from-white to-gray-50 rounded-2xl shadow-xl overflow-hidden hover:shadow-2xl hover:scale-105 transition-all duration-300 flex flex-col border-2 border-purple-200/50"
      {...(product.$ ? product.$ : {})}
    >
      <Link
        href={product.url || `/product/${product.uid}`}
        className="block"
      >
        <div className="relative aspect-square overflow-hidden bg-gradient-to-br from-gray-300 to-gray-400">
          {firstImage?.url ? (
            <Image
              src={firstImage.url}
              alt={product.title}
              fill
              className="object-cover group-hover:scale-110 transition-transform duration-500"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              {...(firstImage.$ ? firstImage.$ : {})}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-400">
              No Image
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        </div>
      </Link>

      <div className="p-6 flex flex-col flex-grow">
        <Link
          href={product.url || `/product/${product.uid}`}
          className="block mb-auto"
        >
          <h3
            className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600 mb-3 line-clamp-2 uppercase tracking-tight"
            {...(product.$ ? product.$.title : {})}
          >
            {product.title}
          </h3>

          {product.description && (
            <p
              className="text-sm text-gray-700 mb-4 line-clamp-2 leading-relaxed"
              {...(product.$ ? product.$.description : {})}
            >
              {product.description}
            </p>
          )}

          <div className="mb-4 pt-3 border-t-2 border-purple-200">
            <span
              className="text-3xl font-black bg-gradient-to-r from-yellow-500 to-orange-600 bg-clip-text text-transparent"
              {...(product.$ ? product.$.price : {})}
            >
              ${product.price.toFixed(2)}
            </span>
          </div>
        </Link>

        {product.call_to_action?.title && (product.call_to_action?.href || product.call_to_action?.url) && (
          <Link
            href={product.call_to_action.href || product.call_to_action.url || '#'}
            className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white text-center font-black px-6 py-3 rounded-lg transition-all uppercase tracking-wider shadow-lg"
            {...(product.$ ? product.$.call_to_action : {})}
          >
            {product.call_to_action.title}
          </Link>
        )}
      </div>
    </div>
  );
}
