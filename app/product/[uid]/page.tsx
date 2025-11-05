"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import ContentstackLivePreview from "@contentstack/live-preview-utils";
import { getProductByUid, initLivePreview } from "@/lib/contentstack";
import { Product, ProductModularBlock } from "@/lib/types";
import FeaturedArtist from "@/components/FeaturedArtist";
import FeaturedArtistLoader from "@/components/FeaturedArtistLoader";
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
        const reference = block.featured_artist?.reference;
        // Check if reference is an array and has data
        if (Array.isArray(reference) && reference.length > 0) {
          const firstRef = reference[0];
          // Check if it's a full Author object (has title field) or just a reference stub
          if ('title' in firstRef) {
            // Reference is fully populated - render directly
            return <FeaturedArtist key={index} artist={firstRef} />;
          } else {
            // Reference is a stub - fetch author data separately
            console.log('Featured artist reference is a stub. Fetching author data for UID:', firstRef.uid);
            return <FeaturedArtistLoader key={index} authorUid={firstRef.uid} />;
          }
        }
        return null;
      }

      // Product Specs Block
      if ("product_specs" in block) {
        return <ProductSpecs key={index} specsBlock={block.product_specs} />;
      }

      // Similar Items Block - data is directly in the block, not wrapped
      if ("similar_items" in block) {
        const similarItems = block.similar_items;
        // Create a SectionWithCards-compatible object
        const sectionData = {
          section_title: similarItems.section_title,
          section_description: similarItems.section_description,
          cards: similarItems.cards,
        };
        return similarItems.cards && similarItems.cards.length > 0 ? (
          <div key={index}>
            <SectionWithCardsComponent section={sectionData} />
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
    <main className="min-h-screen bg-gradient-to-b from-white via-gray-50 to-white">
      {/* Breadcrumb */}
      <div className="bg-gradient-to-r from-gray-900 to-purple-900 py-4 border-b-4 border-purple-500">
        <div className="container mx-auto px-4">
          <nav className="flex items-center space-x-2 text-sm text-gray-300">
            <Link href="/" className="hover:text-purple-400 transition-colors font-semibold">
              Home
            </Link>
            <span className="text-purple-400">→</span>
            <span className="text-white font-bold">{product.title}</span>
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
              <div className="relative aspect-square bg-gradient-to-br from-gray-200 to-gray-300 rounded-2xl overflow-hidden shadow-2xl ring-4 ring-purple-500/20 ring-offset-4">
                <Image
                  src={mainImage.url}
                  alt={product.title}
                  fill
                  className="object-cover hover:scale-105 transition-transform duration-500"
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
                    className={`relative aspect-square bg-gray-100 rounded-xl overflow-hidden border-3 transition-all transform hover:scale-105 ${
                      selectedImage === index
                        ? "border-purple-600 ring-2 ring-purple-400 shadow-lg"
                        : "border-transparent hover:border-purple-300"
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
                className="text-4xl md:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-600 via-pink-600 to-red-600 mb-6 uppercase tracking-tight"
                {...(product.$ && product.$.title)}
              >
                {product.title}
              </h1>

              <div className="flex items-baseline gap-4 mb-6">
                <span
                  className="text-5xl md:text-6xl font-black text-gray-900 bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent"
                  {...(product.$ && product.$.price)}
                >
                  ${product.price.toFixed(2)}
                </span>
              </div>
            </div>

            {product.description && (
              <div
                className="prose max-w-none text-gray-800 border-l-4 border-purple-600 bg-gradient-to-r from-purple-50 to-transparent pl-6 py-6"
                {...(product.$ && product.$.description)}
              >
                <p className="text-lg md:text-xl leading-relaxed whitespace-pre-wrap">
                  {product.description}
                </p>
              </div>
            )}

            {/* Call to Action Button */}
            {product.call_to_action?.title && (product.call_to_action?.href || product.call_to_action?.url) && (
              <div className="space-y-4">
                <Link
                  href={product.call_to_action.href || product.call_to_action.url || '#'}
                  className="block w-full bg-gradient-to-r from-purple-600 via-pink-600 to-red-600 hover:from-purple-700 hover:via-pink-700 hover:to-red-700 text-white text-center font-black px-8 py-5 rounded-xl transition-all transform hover:scale-105 shadow-2xl text-xl uppercase tracking-wide"
                  {...(product.$ && product.$.call_to_action)}
                >
                  {product.call_to_action.title}
                </Link>
              </div>
            )}

            {/* Additional Product Info */}
            <div className="bg-gradient-to-br from-gray-900 to-purple-900 p-8 rounded-xl space-y-4 shadow-xl border-2 border-purple-500/30">
              <h3 className="font-black text-xl text-white mb-6 uppercase tracking-wide border-b-2 border-purple-500 pb-3">
                Product Details
              </h3>
              <div className="flex justify-between text-sm">
                <span className="text-gray-300 font-semibold">Product ID:</span>
                <span className="font-bold text-purple-300">{product.uid}</span>
              </div>
              {product.url && (
                <div className="flex justify-between text-sm">
                  <span className="text-gray-300 font-semibold">URL:</span>
                  <span className="font-bold text-purple-300">
                    {product.url}
                  </span>
                </div>
              )}
              <div className="flex justify-between text-sm">
                <span className="text-gray-300 font-semibold">Availability:</span>
                <span className="font-black text-green-400 bg-green-900/30 px-4 py-1 rounded-full">
                  ✓ In Stock
                </span>
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
