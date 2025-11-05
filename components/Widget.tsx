"use client";

import Link from "next/link";
import { WidgetBlock } from "@/lib/types";

interface WidgetProps {
  widget: WidgetBlock;
}

export default function Widget({ widget }: WidgetProps) {
  return (
    <div
      className="py-12 md:py-16 bg-gray-50"
      {...(widget.$ ? widget.$ : {})}
    >
      <div className="container mx-auto px-4">
        {widget.title_h2 && (
          <h2
            className="text-3xl md:text-4xl font-bold text-gray-900 text-center mb-8"
            {...(widget.$ ? widget.$.title_h2 : {})}
          >
            {widget.title_h2}
          </h2>
        )}

        {widget.related_products && widget.related_products.title && (
          <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-md p-6">
            <div className="text-center">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">
                {widget.related_products.title}
              </h3>
              {widget.related_products.url && (
                <Link
                  href={widget.related_products.url}
                  className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded-lg transition-colors"
                  {...(widget.$ ? widget.$.related_products : {})}
                >
                  View Products
                </Link>
              )}
            </div>
          </div>
        )}

        {widget.type && (
          <div className="max-w-4xl mx-auto text-center mt-4">
            <p className="text-lg text-gray-600">Type: {widget.type}</p>
          </div>
        )}
      </div>
    </div>
  );
}
