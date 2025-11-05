"use client";

import Image from "next/image";
import { Author } from "@/lib/types";

interface FeaturedArtistProps {
  artist: Author;
}

export default function FeaturedArtist({ artist }: FeaturedArtistProps) {
  return (
    <div
      className="py-12 md:py-16 bg-gray-50"
      {...(artist.$ ? artist.$ : {})}
    >
      <div className="container mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 text-center mb-8">
          Featured Artist
        </h2>

        <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 p-8">
            {/* Artist Image */}
            {artist.picture?.url && (
              <div className="md:col-span-1 flex justify-center items-start">
                <div className="relative w-48 h-48 rounded-full overflow-hidden shadow-xl">
                  <Image
                    src={artist.picture.url}
                    alt={artist.title}
                    fill
                    className="object-cover"
                    sizes="192px"
                    {...(artist.picture.$ ? artist.picture.$ : {})}
                  />
                </div>
              </div>
            )}

            {/* Artist Info */}
            <div className={`${artist.picture?.url ? "md:col-span-2" : "md:col-span-3"} space-y-4`}>
              <h3
                className="text-2xl md:text-3xl font-bold text-gray-900"
                {...(artist.$ ? artist.$.title : {})}
              >
                {artist.title}
              </h3>

              {artist.bio && (
                <p
                  className="text-lg text-gray-700 leading-relaxed whitespace-pre-wrap"
                  {...(artist.$ ? artist.$.bio : {})}
                >
                  {artist.bio}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
