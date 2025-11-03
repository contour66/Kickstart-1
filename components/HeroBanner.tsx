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
      className="relative w-full overflow-hidden"
      style={{ backgroundColor: bgColor, color: textColor }}
      {...(banner.$ ? banner.$ : {})}
    >
      <div
        className={`${
          banner.is_banner_image_full_width_ ? "w-full" : "container mx-auto"
        } px-4 py-12 md:py-20`}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          {/* Content Section */}
          <div className={`${contentAlignment} space-y-6`}>
            <h1
              className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight"
              {...(banner.$ ? banner.$.title : {})}
            >
              {banner.title}
            </h1>

            {banner.banner_description && (
              <p
                className="text-lg md:text-xl opacity-90"
                {...(banner.$ ? banner.$.banner_description : {})}
              >
                {banner.banner_description}
              </p>
            )}

            {banner.call_to_action?.href && (
              <div className={contentAlignment}>
                <Link
                  href={banner.call_to_action.href}
                  className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-semibold px-8 py-3 rounded-lg transition-colors duration-300"
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
              <div className="relative w-full aspect-video rounded-lg overflow-hidden shadow-2xl">
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
