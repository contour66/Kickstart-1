"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import ContentstackLivePreview, {
  VB_EmptyBlockParentClass,
} from "@contentstack/live-preview-utils";
import {
  getProductListingPage,
  initLivePreview,
} from "@/lib/contentstack";
import { ProductListingPage, PageComponent } from "@/lib/types";
import HeroBanner from "@/components/HeroBanner";
import ProductCard from "@/components/ProductCard";
import Widget from "@/components/Widget";
import {
  SectionComponent,
  SectionWithBucketsComponent,
  SectionWithCardsComponent,
  SectionWithHtmlCodeComponent,
} from "@/components/SectionRenderer";

/**
 * Product Listing Page component
 * Displays a list of products with optional hero banner and sections
 */
export default function ProductListingPageComponent() {
  const params = useParams();
  const slug = params?.slug as string;
  const [plp, setPlp] = useState<ProductListingPage>();
  const [loading, setLoading] = useState(true);

  const getContent = async () => {
    // Redirect to homepage if slug is empty or just "/"
    if (!slug || slug === "/" || slug === "") {
      if (typeof window !== "undefined") {
        window.location.href = "/";
      }
      return;
    }

    setLoading(true);

    try {
      console.log("=== [slug] Route Debug ===");
      console.log("Slug:", slug);
      console.log("Fetching URL:", `/${slug}`);

      const data = await getProductListingPage(`/${slug}`);

      console.log("Data received:", data);
      console.log("Page components:", data?.page_components);

      setPlp(data);
    } catch (err) {
      console.error("Error in [slug] route:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    initLivePreview();
    ContentstackLivePreview.onEntryChange(getContent);
    getContent();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [slug]);

  const renderPageComponent = (component: PageComponent, index: number) => {
    try {
      // Hero Banner Block
      if ("hero_banner" in component) {
        const heroBanner = component.hero_banner?.hero_banner;
        return heroBanner ? (
          <div key={index} {...(component.hero_banner?.$ || {})}>
            <HeroBanner banner={heroBanner} />
          </div>
        ) : null;
      }

      // Product Block
      if ("product" in component) {
        const products = component.product?.product;
        console.log("Rendering products:", products);

        // Log product details to check if references are populated
        if (products && products.length > 0) {
          products.forEach((product: any, idx: number) => {
            console.log(`Product ${idx}:`, {
              title: product.title,
              uid: product.uid,
              hasModularBlocks: !!product.modular_blocks,
              modularBlocksCount: product.modular_blocks?.length || 0
            });
            if (product.modular_blocks) {
              product.modular_blocks.forEach((block: any, blockIdx: number) => {
                console.log(`  Block ${blockIdx}:`, Object.keys(block));
              });
            }
          });
        }

        return (
          <div
            key={index}
            className="py-12 md:py-16 bg-gradient-to-b from-white to-gray-50"
            {...(component.product?.$ || {})}
          >
            <div className="container mx-auto px-4">
              <h2 className="text-4xl md:text-5xl font-black text-center mb-12 uppercase tracking-wide">
                <span className="bg-gradient-to-r from-purple-600 via-pink-600 to-red-600 bg-clip-text text-transparent">
                  Our Products
                </span>
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {products?.map((product, i) => (
                  <ProductCard key={product.uid || i} product={product} />
                ))}
              </div>
            </div>
          </div>
        );
      }

      // Section Block
      if ("section" in component) {
        return <SectionComponent key={index} section={component.section} />;
      }

      // Section with Buckets
      if ("section_with_buckets" in component) {
        return (
          <SectionWithBucketsComponent
            key={index}
            section={component.section_with_buckets}
          />
        );
      }

      // Section with Cards
      if ("section_with_cards" in component) {
        return (
          <SectionWithCardsComponent
            key={index}
            section={component.section_with_cards}
          />
        );
      }

      // Section with HTML Code
      if ("section_with_html_code" in component) {
        return (
          <SectionWithHtmlCodeComponent
            key={index}
            section={component.section_with_html_code}
          />
        );
      }

      // Widget Block - Related Products
      if ("widget" in component) {
        return <Widget key={index} widget={component.widget} />;
      }

      return null;
    } catch (err) {
      console.error(`Error rendering component ${index}:`, err);
      return (
        <div key={index} className="bg-red-50 border border-red-200 p-4 m-4 rounded">
          <p className="text-red-800">Error rendering component</p>
        </div>
      );
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-semibold text-gray-700">Loading...</h2>
        </div>
      </div>
    );
  }

  if (!plp) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-semibold text-gray-700">
            Product Listing Page Not Found
          </h2>
          <p className="text-gray-500 mt-2">
            The page you&apos;re looking for doesn&apos;t exist.
          </p>
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-white">
      {/* Page Title */}
      <div className="bg-gray-50 py-8 border-b">
        <div className="container mx-auto px-4">
          <h1
            className="text-4xl md:text-5xl font-bold text-gray-900"
            {...(plp.$ && plp.$.title)}
          >
            {plp.title}
          </h1>
        </div>
      </div>

      {/* Page Components */}
      <div
        className={`${
          !plp.page_components || plp.page_components.length === 0
            ? VB_EmptyBlockParentClass
            : ""
        }`}
        {...(plp.$ && plp.$.page_components)}
      >
        {plp.page_components?.map((component, index) =>
          renderPageComponent(component, index)
        )}
      </div>
    </main>
  );
}
