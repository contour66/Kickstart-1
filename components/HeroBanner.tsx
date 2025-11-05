"use client";

import Image from "next/image";
import Link from "next/link";
import { HeroBanner as HeroBannerType } from "@/lib/types";

interface HeroBannerProps {
  banner: HeroBannerType;
}

export default function HeroBanner({ banner }: HeroBannerProps) {
  const alignmentClasses = {
    Left: "text-left",
    Center: "text-center",
    Right: "text-right",
  };

  const contentAlignment =
    alignmentClasses[banner.content_title_alignment || "Left"];
  const imageAlignment =
    alignmentClasses[banner.banner_image_alignment || "Center"];

  const bgColor = banner.background_color?.color || "transparent";
  const textColor = banner.text_color?.color || "#000000";

  return (
    <div
      className="relative w-full overflow-hidden bg-gradient-to-br from-gray-900 via-purple-900 to-black"
      style={{
        backgroundColor: bgColor !== "transparent" ? bgColor : undefined,
        color: textColor
      }}
      {...(banner.$ ? banner.$ : {})}
    >
      {/* Background pattern overlay */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0" style={{
          backgroundImage: 'repeating-linear-gradient(45deg, transparent, transparent 10px, rgba(255,255,255,.05) 10px, rgba(255,255,255,.05) 20px)'
        }}></div>
      </div>

      <div
        className={`${
          banner.is_banner_image_full_width_ ? "w-full" : "container mx-auto"
        } px-4 py-16 md:py-28 relative z-10`}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          {/* Content Section */}
          <div className={`${contentAlignment} space-y-8`}>
            <h1
              className="text-5xl md:text-6xl lg:text-7xl font-black leading-tight uppercase tracking-tight"
              style={{
                textShadow: '3px 3px 6px rgba(0,0,0,0.7)',
                color: textColor === "#000000" ? "white" : textColor
              }}
              {...(banner.$ ? banner.$.title : {})}
            >
              <span className="bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 bg-clip-text text-transparent">
                {banner.title}
              </span>
            </h1>

            {banner.banner_description && (
              <p
                className="text-xl md:text-2xl font-medium leading-relaxed"
                style={{
                  textShadow: '2px 2px 4px rgba(0,0,0,0.5)',
                  color: textColor === "#000000" ? "#E5E7EB" : textColor
                }}
                {...(banner.$ ? banner.$.banner_description : {})}
              >
                {banner.banner_description}
              </p>
            )}

            {(banner.call_to_action?.href || banner.call_to_action?.url) && (
              <div className={contentAlignment}>
                <Link
                  href={banner.call_to_action.href || banner.call_to_action.url || '#'}
                  className="inline-block bg-gradient-to-r from-purple-600 via-pink-600 to-red-600 hover:from-purple-700 hover:via-pink-700 hover:to-red-700 text-white font-black px-12 py-5 rounded-xl transition-all transform hover:scale-110 shadow-2xl text-xl uppercase tracking-wider"
                  {...(banner.$ ? banner.$.call_to_action : {})}
                >
                  {banner.call_to_action.title || "Learn More"}
                </Link>
              </div>
            )}
          </div>

          {/* Image Section */}
          {banner.banner_image?.url && (
            <div className={imageAlignment}>
              <div className="relative w-full aspect-video rounded-2xl overflow-hidden shadow-2xl ring-4 ring-purple-500/50 ring-offset-4 ring-offset-gray-900 transform hover:scale-105 transition-transform duration-500">
                <Image
                  src={banner.banner_image.url}
                  alt={banner.title}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 50vw"
                  priority
                  {...(banner.banner_image.$ ? banner.banner_image.$ : {})}
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
