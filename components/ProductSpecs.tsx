"use client";

import { ProductSpecsBlock } from "@/lib/types";

interface ProductSpecsProps {
  specsBlock: ProductSpecsBlock;
}

export default function ProductSpecs({ specsBlock }: ProductSpecsProps) {
  const specs = specsBlock.specs;

  if (!specs) {
    return null;
  }

  return (
    <div className="py-12 md:py-16 bg-gradient-to-b from-gray-50 to-white">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-black text-gray-900 text-center mb-10 uppercase tracking-wide">
          <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
            Product Specifications
          </span>
        </h2>

        <div className="max-w-3xl mx-auto bg-white rounded-xl shadow-xl p-8 border-t-4 border-purple-600">
          <div className="space-y-6">
            {specs.set_type && (
              <div className="flex justify-between items-center py-6 px-4 bg-gradient-to-r from-gray-50 to-purple-50 rounded-lg border border-purple-200">
                <span className="text-lg font-bold text-gray-800 uppercase tracking-wide">Set Type:</span>
                <span className="text-xl font-black text-purple-700 bg-white px-6 py-2 rounded-full shadow-md">
                  {specs.set_type}
                </span>
              </div>
            )}

            {!specs.set_type && (
              <p className="text-gray-600 text-center italic">
                No specifications available for this product.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
