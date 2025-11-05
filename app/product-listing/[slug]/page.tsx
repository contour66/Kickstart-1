"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import ContentstackLivePreview, {
  VB_EmptyBlockParentClass,
} from "@contentstack/live-preview-utils";
import { initLivePreview, getProductListingPage } from "@/lib/contentstack";
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
 * The `ProductListingPageView` component displays a product listing page with various components
 * including hero banners, product grids, and widgets.
 *
 * @component
 * @returns {JSX.Element} The rendered product listing page.
 */
export default function ProductListingPageView() {
  const params = useParams();
  const slug = params?.slug as string;
  const [page, setPage] = useState<ProductListingPage>();
  const [error, setError] = useState<string | null>(null);

  const getContent = async () => {
    if (!slug) return;
    try {
      console.log("=== Product Listing Page Debug ===");
      console.log("Slug:", slug);

      // Try different URL formats
      const urlVariations = [
        `/${slug}`,           // /music-instruments
        slug,                 // music-instruments
        `/${slug}/`,          // /music-instruments/
      ];

      console.log("Trying URL variations:", urlVariations);

      let data = null;
      for (const url of urlVariations) {
        console.log("Trying URL:", url);
        data = await getProductListingPage(url);
        if (data) {
          console.log("Success with URL:", url);
          break;
        }
      }

      console.log("Final data received:", data);
      console.log("Page components:", data?.page_components);

      if (data) {
        setPage(data);
        setError(null);
      } else {
        setError(`No product listing page found for slug: "${slug}". Please check the URL field in ContentStack. Tried: ${urlVariations.join(', ')}`);
      }
    } catch (err) {
      console.error("Error fetching product listing page:", err);
      setError(`Failed to load product listing page content: ${err instanceof Error ? err.message : 'Unknown error'}`);
    }
  };

  useEffect(() => {
    initLivePreview();
    ContentstackLivePreview.onEntryChange(getContent);
    getContent();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [slug]);

  const renderPageComponent = (component: PageComponent, index: number) => {
    console.log(`Rendering component ${index}:`, component);

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
        return (
          <div
            key={index}
            className="py-12 md:py-16 bg-white"
            {...(component.product?.$ || {})}
          >
            <div className="container mx-auto px-4">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 text-center mb-12">
                Products
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

      // Widget Block
      if ("widget" in component) {
        return <Widget key={index} widget={component.widget} />;
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

  // Handle no slug case
  if (!slug) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-semibold text-gray-700">Invalid URL</h2>
          <p className="text-gray-500 mt-2">No slug provided in the URL</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center max-w-2xl mx-auto p-8">
          <h1 className="text-3xl font-bold text-red-600 mb-4">
            Product Listing Page Error
          </h1>
          <p className="text-lg text-gray-700 mb-6">{error}</p>
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 text-left">
            <h3 className="font-semibold text-gray-900 mb-2">Quick Fix:</h3>
            <ol className="list-decimal list-inside space-y-2 text-gray-700">
              <li>Go to ContentStack CMS</li>
              <li>Navigate to Content → Product Listing Page</li>
              <li>Create or publish an entry</li>
              <li>Refresh this page</li>
            </ol>
          </div>
        </div>
      </div>
    );
  }

  if (!page) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-semibold text-gray-700">
            Loading product listing page...
          </h2>
          <p className="text-gray-500 mt-2">
            Fetching content from ContentStack
          </p>
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-white">
      <div
        className={`${
          !page.page_components || page.page_components.length === 0
            ? VB_EmptyBlockParentClass
            : ""
        }`}
        {...(page.$ && page.$.page_components ? page.$.page_components : {})}
      >
        {page.page_components && page.page_components.length > 0 ? (
          page.page_components.map((component, index) =>
            renderPageComponent(component, index)
          )
        ) : (
          <div className="container mx-auto px-4 py-12 text-center">
            <p className="text-gray-600">
              No components have been added to this page yet.
            </p>
          </div>
        )}
      </div>
    </main>
  );
}
