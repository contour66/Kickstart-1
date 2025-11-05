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
    <div className="py-12 md:py-16 bg-white">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 text-center mb-8">
          Product Specifications
        </h2>

        <div className="max-w-3xl mx-auto bg-gray-50 rounded-lg shadow-md p-8">
          <div className="space-y-4">
            {specs.set_type && (
              <div className="flex justify-between items-center py-4 border-b border-gray-200">
                <span className="text-lg font-semibold text-gray-700">Set Type:</span>
                <span className="text-lg text-gray-900">{specs.set_type}</span>
              </div>
            )}

            {!specs.set_type && (
              <p className="text-gray-600 text-center">
                No specifications available for this product.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
