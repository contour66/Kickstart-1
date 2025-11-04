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
    const data = await getProductListingPage(`/${slug}`);
    setPlp(data);
    setLoading(false);
  };

  useEffect(() => {
    initLivePreview();
    ContentstackLivePreview.onEntryChange(getContent);
    getContent();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [slug]);

  const renderPageComponent = (component: PageComponent, index: number) => {
    // Hero Banner Block
    if ("hero_banner" in component) {
      const heroBanner = component.hero_banner.hero_banner;
      return heroBanner ? (
        <div key={index} {...(component.hero_banner.$ || {})}>
          <HeroBanner banner={heroBanner} />
        </div>
      ) : null;
    }

    // Product Block
    if ("product" in component) {
      const products = component.product.product;
      return (
        <div
          key={index}
          className="py-12 md:py-16 bg-white"
          {...(component.product.$ || {})}
        >
          <div className="container mx-auto px-4">
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
      const widget = component.widget;
      return (
        <div
          key={index}
          className="py-12 md:py-16 bg-gray-50"
          {...(widget.$ || {})}
        >
          <div className="container mx-auto px-4">
            {widget.title_h2 && (
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 text-center mb-12">
                {widget.title_h2}
              </h2>
            )}
            {widget.type && (
              <p className="text-center text-gray-600 mb-8">
                Type: {widget.type}
              </p>
            )}
          </div>
        </div>
      );
    }

    return null;
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
