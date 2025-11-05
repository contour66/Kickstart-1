"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import ContentstackLivePreview from "@contentstack/live-preview-utils";
import { getProductByUid, initLivePreview } from "@/lib/contentstack";
import { Product, ProductModularBlock } from "@/lib/types";
import FeaturedArtist from "@/components/FeaturedArtist";
import ProductSpecs from "@/components/ProductSpecs";
import { SectionWithCardsComponent } from "@/components/SectionRenderer";

/**
 * Product Detail Page (PDP) component
 * Displays detailed information about a single product
 */
export default function ProductDetailPage() {
  const params = useParams();
  const uid = params?.uid as string;
  const [product, setProduct] = useState<Product>();
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);

  const getContent = async () => {
    if (!uid) return;

    setLoading(true);
    const data = await getProductByUid(uid);
    setProduct(data);
    setLoading(false);
  };

  useEffect(() => {
    initLivePreview();
    ContentstackLivePreview.onEntryChange(getContent);
    getContent();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [uid]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-semibold text-gray-700">Loading...</h2>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-semibold text-gray-700">
            Product Not Found
          </h2>
          <p className="text-gray-500 mt-2">
            The product you&apos;re looking for doesn&apos;t exist.
          </p>
          <Link
            href="/"
            className="mt-4 inline-block bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded-lg transition-colors"
          >
            Go to Homepage
          </Link>
        </div>
      </div>
    );
  }

  const mainImage = product.featured_image?.[selectedImage];
  const hasMultipleImages = product.featured_image?.length > 1;

  const renderModularBlock = (block: ProductModularBlock, index: number) => {
    try {
      // Featured Artist Block
      if ("featured_artist" in block) {
        const artist = block.featured_artist?.reference;
        return artist ? (
          <FeaturedArtist key={index} artist={artist} />
        ) : null;
      }

      // Product Specs Block
      if ("product_specs" in block) {
        return <ProductSpecs key={index} specsBlock={block.product_specs} />;
      }

      // Similar Items Block (section_with_cards)
      if ("similar_items" in block) {
        const similarItems = block.similar_items?.section_with_cards;
        return similarItems ? (
          <div key={index}>
            <SectionWithCardsComponent section={similarItems} />
          </div>
        ) : null;
      }

      return null;
    } catch (err) {
      console.error(`Error rendering modular block ${index}:`, err);
      return (
        <div key={index} className="bg-red-50 border border-red-200 p-4 m-4 rounded">
          <p className="text-red-800">Error rendering block</p>
        </div>
      );
    }
  };

  return (
    <main className="min-h-screen bg-white">
      {/* Breadcrumb */}
      <div className="bg-gray-50 py-4 border-b">
        <div className="container mx-auto px-4">
          <nav className="flex items-center space-x-2 text-sm text-gray-600">
            <Link href="/" className="hover:text-blue-600">
              Home
            </Link>
            <span>/</span>
            <span className="text-gray-900">{product.title}</span>
          </nav>
        </div>
      </div>

      {/* Product Content */}
      <div className="container mx-auto px-4 py-12" {...(product.$ || {})}>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Product Images */}
          <div className="space-y-4">
            {/* Main Image */}
            {mainImage?.url && (
              <div className="relative aspect-square bg-gray-100 rounded-lg overflow-hidden">
                <Image
                  src={mainImage.url}
                  alt={product.title}
                  fill
                  className="object-cover"
                  priority
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  {...(mainImage.$ || {})}
                />
              </div>
            )}

            {/* Image Thumbnails */}
            {hasMultipleImages && (
              <div className="grid grid-cols-4 gap-4">
                {product.featured_image.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`relative aspect-square bg-gray-100 rounded-lg overflow-hidden border-2 transition-all ${
                      selectedImage === index
                        ? "border-blue-600"
                        : "border-transparent hover:border-gray-300"
                    }`}
                  >
                    <Image
                      src={image.url}
                      alt={`${product.title} - Image ${index + 1}`}
                      fill
                      className="object-cover"
                      sizes="(max-width: 1024px) 25vw, 12.5vw"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            <div>
              <h1
                className="text-4xl md:text-5xl font-bold text-gray-900 mb-4"
                {...(product.$ && product.$.title)}
              >
                {product.title}
              </h1>

              <div className="flex items-baseline gap-4">
                <span
                  className="text-4xl font-bold text-gray-900"
                  {...(product.$ && product.$.price)}
                >
                  ${product.price.toFixed(2)}
                </span>
              </div>
            </div>

            {product.description && (
              <div
                className="prose max-w-none text-gray-700 border-t border-b border-gray-200 py-6"
                {...(product.$ && product.$.description)}
              >
                <p className="text-lg whitespace-pre-wrap">
                  {product.description}
                </p>
              </div>
            )}

            {/* Call to Action Button */}
            {product.call_to_action?.title && (product.call_to_action?.href || product.call_to_action?.url) && (
              <div className="space-y-4">
                <Link
                  href={product.call_to_action.href || product.call_to_action.url || '#'}
                  className="block w-full bg-blue-600 hover:bg-blue-700 text-white text-center font-semibold px-8 py-4 rounded-lg transition-colors text-lg"
                  {...(product.$ && product.$.call_to_action)}
                >
                  {product.call_to_action.title}
                </Link>
              </div>
            )}

            {/* Additional Product Info */}
            <div className="bg-gray-50 p-6 rounded-lg space-y-3">
              <h3 className="font-semibold text-lg text-gray-900 mb-4">
                Product Details
              </h3>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Product ID:</span>
                <span className="font-medium text-gray-900">{product.uid}</span>
              </div>
              {product.url && (
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">URL:</span>
                  <span className="font-medium text-gray-900">
                    {product.url}
                  </span>
                </div>
              )}
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Availability:</span>
                <span className="font-medium text-green-600">In Stock</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modular Blocks */}
      {product.modular_blocks && product.modular_blocks.length > 0 && (
        <div className="border-t border-gray-200">
          {product.modular_blocks.map((block, index) =>
            renderModularBlock(block, index)
          )}
        </div>
      )}
    </main>
  );
}
