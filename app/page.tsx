"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import ContentstackLivePreview, {
  VB_EmptyBlockParentClass,
} from "@contentstack/live-preview-utils";
import { getHomepage, initLivePreview } from "@/lib/contentstack";
import { Homepage, PageComponent } from "@/lib/types";
import HeroBanner from "@/components/HeroBanner";
import ProductCard from "@/components/ProductCard";
import {
  SectionComponent,
  SectionWithBucketsComponent,
  SectionWithCardsComponent,
  SectionWithHtmlCodeComponent,
} from "@/components/SectionRenderer";

/**
 * The `Home` component is the main homepage component for the ecommerce application.
 * It fetches and displays content from ContentStack homepage model, including:
 * - Hero banners
 * - Featured products
 * - Various content sections (buckets, cards, HTML)
 * - Blog posts
 * - Contact information
 *
 * @component
 * @returns {JSX.Element} The rendered homepage.
 */
export default function Home() {
  const [homepage, setHomepage] = useState<Homepage>();
  const [error, setError] = useState<string | null>(null);

  const getContent = async () => {
    try {
      const data = await getHomepage();
      if (data) {
        setHomepage(data);
        setError(null);
      } else {
        setError("No homepage content found. Please create a Homepage entry in ContentStack.");
      }
    } catch (err) {
      console.error("Error fetching homepage:", err);
      setError("Failed to load homepage content. Check your ContentStack configuration.");
    }
  };

  useEffect(() => {
    initLivePreview();
    ContentstackLivePreview.onEntryChange(getContent);
    getContent(); // Initial fetch
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 text-center mb-12">
              Featured Products
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

    // From Blog Block
    if ("from_blog" in component) {
      const fromBlog = component.from_blog;
      return (
        <div
          key={index}
          className="py-12 md:py-16 bg-gray-50"
          {...(fromBlog.$ || {})}
        >
          <div className="container mx-auto px-4">
            {fromBlog.title_h2 && (
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 text-center mb-12">
                {fromBlog.title_h2}
              </h2>
            )}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {fromBlog.featured_blogs?.map((blog) => (
                <div
                  key={blog.uid}
                  className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow"
                >
                  {blog.featured_image?.url && (
                    <div className="relative w-full h-48">
                      <Image
                        src={blog.featured_image.url}
                        alt={blog.title}
                        fill
                        className="object-cover"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      />
                    </div>
                  )}
                  <div className="p-6">
                    <h3 className="text-xl font-semibold mb-2">
                      {blog.title}
                    </h3>
                    {blog.date && (
                      <p className="text-sm text-gray-500 mb-4">{blog.date}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      );
    }

    // Contact Us Block
    if ("contact_us" in component) {
      const contact = component.contact_us.reference?.[0];
      return (
        <div
          key={index}
          className="py-12 md:py-16 bg-white"
          {...(component.contact_us.$ || {})}
        >
          <div className="container mx-auto px-4">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 text-center mb-12">
              Contact Us
            </h2>
            {contact && (
              <div className="max-w-2xl mx-auto bg-gray-50 p-8 rounded-lg">
                <h3 className="text-2xl font-semibold mb-4">{contact.title}</h3>
                {contact.address && (
                  <p className="mb-4">
                    <strong>Address:</strong> {contact.address}
                  </p>
                )}
                {contact.email_address && (
                  <p className="mb-4">
                    <strong>Email:</strong> {contact.email_address}
                  </p>
                )}
                {contact.contact_number && contact.contact_number.length > 0 && (
                  <p className="mb-4">
                    <strong>Phone:</strong> {contact.contact_number.join(", ")}
                  </p>
                )}
              </div>
            )}
          </div>
        </div>
      );
    }

    return null;
  };

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center max-w-2xl mx-auto p-8">
          <h1 className="text-3xl font-bold text-red-600 mb-4">Homepage Error</h1>
          <p className="text-lg text-gray-700 mb-6">{error}</p>
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 text-left">
            <h3 className="font-semibold text-gray-900 mb-2">Quick Fix:</h3>
            <ol className="list-decimal list-inside space-y-2 text-gray-700">
              <li>Go to ContentStack CMS</li>
              <li>Navigate to <strong>Content → Homepage</strong></li>
              <li>Click <strong>+ Add Entry</strong></li>
              <li>Fill in the Title field</li>
              <li>Click <strong>Save</strong> and then <strong>Publish</strong></li>
              <li>Refresh this page</li>
            </ol>
          </div>
        </div>
      </div>
    );
  }

  if (!homepage) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-semibold text-gray-700">Loading homepage...</h2>
          <p className="text-gray-500 mt-2">Fetching content from ContentStack</p>
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-white">
      <div
        className={`${
          !homepage.page_components || homepage.page_components.length === 0
            ? VB_EmptyBlockParentClass
            : ""
        }`}
        {...(homepage.$ && homepage.$.page_components)}
      >
        {homepage.page_components?.map((component, index) =>
          renderPageComponent(component, index)
        )}
      </div>
    </main>
  );
}
