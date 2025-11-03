"use client";

import Image from "next/image";
import Link from "next/link";
import DOMPurify from "dompurify";
import {
  Section,
  SectionWithBuckets,
  SectionWithCards,
  SectionWithHtmlCode,
} from "@/lib/types";

// Section Component
export function SectionComponent({ section }: { section: Section }) {
  return (
    <div
      className="py-12 md:py-16 bg-white"
      {...(section.$ ? section.$ : {})}
    >
      <div className="container mx-auto px-4">
        <div
          className={`grid grid-cols-1 md:grid-cols-2 gap-8 items-center ${
            section.is_image_right_aligned ? "md:flex-row-reverse" : ""
          }`}
        >
          <div className="space-y-4">
            {section.title_h2 && (
              <h2
                className="text-3xl md:text-4xl font-bold text-gray-900"
                {...(section.$ ? section.$.title_h2 : {})}
              >
                {section.title_h2}
              </h2>
            )}

            {section.description && (
              <p
                className="text-lg text-gray-600"
                {...(section.$ ? section.$.description : {})}
              >
                {section.description}
              </p>
            )}

            {section.call_to_action?.href && (
              <Link
                href={section.call_to_action.href}
                className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded-lg transition-colors"
                {...(section.$ ? section.$.call_to_action : {})}
              >
                {section.call_to_action.title}
              </Link>
            )}
          </div>

          {section.image?.url && (
            <div className="relative aspect-video rounded-lg overflow-hidden shadow-lg">
              <Image
                src={section.image.url}
                alt={section.title_h2 || "Section image"}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 50vw"
                {...(section.image.$ ? section.image.$ : {})}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// Section with Buckets Component
export function SectionWithBucketsComponent({
  section,
}: {
  section: SectionWithBuckets;
}) {
  return (
    <div
      className="py-12 md:py-16 bg-gray-50"
      {...(section.$ ? section.$ : {})}
    >
      <div className="container mx-auto px-4">
        {section.title_h2 && (
          <h2
            className="text-3xl md:text-4xl font-bold text-gray-900 text-center mb-4"
            {...(section.$ ? section.$.title_h2 : {})}
          >
            {section.title_h2}
          </h2>
        )}

        {section.description && (
          <p
            className="text-lg text-gray-600 text-center mb-12 max-w-3xl mx-auto"
            {...(section.$ ? section.$.description : {})}
          >
            {section.description}
          </p>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {section.buckets?.map((bucket, index) => (
            <div
              key={index}
              className="bg-white p-6 rounded-lg shadow-md hover:shadow-xl transition-shadow"
            >
              {bucket.icon?.url && (
                <div className="w-16 h-16 mb-4">
                  <Image
                    src={bucket.icon.url}
                    alt={bucket.title_h3 || "Icon"}
                    width={64}
                    height={64}
                    className="object-contain"
                  />
                </div>
              )}

              {bucket.image?.url && (
                <div className="relative aspect-video mb-4 rounded-lg overflow-hidden">
                  <Image
                    src={bucket.image.url}
                    alt={bucket.title_h3 || "Bucket image"}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 33vw"
                  />
                </div>
              )}

              {bucket.title_h3 && (
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  {bucket.title_h3}
                </h3>
              )}

              {bucket.description && (
                <p className="text-gray-600 mb-4">{bucket.description}</p>
              )}

              {bucket.call_to_action?.href && (
                <Link
                  href={bucket.call_to_action.href}
                  className="text-blue-600 hover:text-blue-800 font-medium"
                >
                  {bucket.call_to_action.title} →
                </Link>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// Section with Cards Component
export function SectionWithCardsComponent({
  section,
}: {
  section: SectionWithCards;
}) {
  return (
    <div
      className="py-12 md:py-16 bg-white"
      {...(section.$ ? section.$ : {})}
    >
      <div className="container mx-auto px-4">
        {section.section_title && (
          <h2
            className="text-3xl md:text-4xl font-bold text-gray-900 text-center mb-4"
            {...(section.$ ? section.$.section_title : {})}
          >
            {section.section_title}
          </h2>
        )}

        {section.section_description && (
          <p
            className="text-lg text-gray-600 text-center mb-12 max-w-3xl mx-auto"
            {...(section.$ ? section.$.section_description : {})}
          >
            {section.section_description}
          </p>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {section.cards?.map((card, index) => (
            <div
              key={index}
              className="bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-shadow"
            >
              {card.image?.url && (
                <div className="relative aspect-video">
                  <Image
                    src={card.image.url}
                    alt={card.card_title_h3 || "Card image"}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 33vw"
                  />
                </div>
              )}

              <div className="p-6">
                {card.card_title_h3 && (
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">
                    {card.card_title_h3}
                  </h3>
                )}

                {card.description && (
                  <p className="text-gray-600 mb-4">{card.description}</p>
                )}

                {card.call_to_action?.href && (
                  <Link
                    href={card.call_to_action.href}
                    className="text-blue-600 hover:text-blue-800 font-medium"
                  >
                    {card.call_to_action.title} →
                  </Link>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// Section with HTML Code Component
export function SectionWithHtmlCodeComponent({
  section,
}: {
  section: SectionWithHtmlCode;
}) {
  const sanitizedHTML = section.html_code
    ? DOMPurify.sanitize(section.html_code)
    : "";

  return (
    <div
      className="py-12 md:py-16 bg-gray-50"
      {...(section.$ ? section.$ : {})}
    >
      <div className="container mx-auto px-4">
        {section.title && (
          <h2
            className="text-3xl md:text-4xl font-bold text-gray-900 mb-4"
            {...(section.$ ? section.$.title : {})}
          >
            {section.title}
          </h2>
        )}

        {section.description && (
          <p
            className="text-lg text-gray-600 mb-8"
            {...(section.$ ? section.$.description : {})}
          >
            {section.description}
          </p>
        )}

        {sanitizedHTML && (
          <div
            className={`prose max-w-none ${
              section.is_html_code_left_aligned_ ? "text-left" : "text-center"
            }`}
            dangerouslySetInnerHTML={{ __html: sanitizedHTML }}
          />
        )}
      </div>
    </div>
  );
}
