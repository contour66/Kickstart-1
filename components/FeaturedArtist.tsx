"use client";

import Image from "next/image";
import { Author } from "@/lib/types";

interface FeaturedArtistProps {
  artist: Author;
}

export default function FeaturedArtist({ artist }: FeaturedArtistProps) {
  return (
    <div
      className="py-16 md:py-24 bg-gradient-to-br from-gray-900 via-purple-900 to-black relative overflow-hidden"
      {...(artist.$ ? artist.$ : {})}
    >
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0" style={{
          backgroundImage: 'repeating-linear-gradient(45deg, transparent, transparent 10px, rgba(255,255,255,.05) 10px, rgba(255,255,255,.05) 20px)'
        }}></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <h2 className="text-4xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 text-center mb-12 uppercase tracking-wider">
          Featured Artist
        </h2>

        <div className="max-w-5xl mx-auto bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl shadow-2xl overflow-hidden border-2 border-purple-500/30">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 p-10">
            {/* Artist Image */}
            {artist.picture?.url && (
              <div className="md:col-span-1 flex justify-center items-start">
                <div className="relative w-56 h-56 rounded-full overflow-hidden shadow-2xl ring-4 ring-purple-500/50 ring-offset-4 ring-offset-gray-900">
                  <Image
                    src={artist.picture.url}
                    alt={artist.title}
                    fill
                    className="object-cover hover:scale-110 transition-transform duration-500"
                    sizes="224px"
                    {...(artist.picture.$ ? artist.picture.$ : {})}
                  />
                </div>
              </div>
            )}

            {/* Artist Info */}
            <div className={`${artist.picture?.url ? "md:col-span-2" : "md:col-span-3"} space-y-6 flex flex-col justify-center`}>
              <h3
                className="text-3xl md:text-5xl font-black text-white uppercase tracking-tight"
                style={{ textShadow: '2px 2px 4px rgba(0,0,0,0.5)' }}
                {...(artist.$ ? artist.$.title : {})}
              >
                {artist.title}
              </h3>

              {artist.bio && (
                <p
                  className="text-lg md:text-xl text-gray-300 leading-relaxed whitespace-pre-wrap"
                  {...(artist.$ ? artist.$.bio : {})}
                >
                  {artist.bio}
                </p>
              )}

              {/* Decorative element */}
              <div className="flex items-center gap-2 pt-4">
                <div className="h-1 w-12 bg-gradient-to-r from-purple-500 to-pink-500"></div>
                <div className="h-1 w-12 bg-gradient-to-r from-pink-500 to-red-500"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
