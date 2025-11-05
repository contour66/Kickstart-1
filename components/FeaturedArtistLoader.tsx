"use client";

import { useEffect, useState } from "react";
import { getAuthorByUid } from "@/lib/contentstack";
import { Author } from "@/lib/types";
import FeaturedArtist from "./FeaturedArtist";

interface FeaturedArtistLoaderProps {
  authorUid: string;
}

/**
 * Component that fetches and displays author data
 * Used when author reference is not populated and needs separate fetch
 */
export default function FeaturedArtistLoader({ authorUid }: FeaturedArtistLoaderProps) {
  const [author, setAuthor] = useState<Author | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    async function fetchAuthor() {
      try {
        setLoading(true);
        const authorData = await getAuthorByUid(authorUid);
        if (authorData) {
          setAuthor(authorData);
        } else {
          setError(true);
        }
      } catch (err) {
        console.error(`Failed to fetch author ${authorUid}:`, err);
        setError(true);
      } finally {
        setLoading(false);
      }
    }

    fetchAuthor();
  }, [authorUid]);

  if (loading) {
    return (
      <div className="py-12 md:py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 text-center mb-8">
            Featured Artist
          </h2>
          <div className="flex justify-center">
            <div className="text-center text-gray-600">
              Loading artist information...
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !author) {
    return (
      <div className="py-12 md:py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 text-center mb-8">
            Featured Artist
          </h2>
          <p className="text-center text-gray-600">
            Unable to load artist information.
          </p>
        </div>
      </div>
    );
  }

  return <FeaturedArtist artist={author} />;
}
