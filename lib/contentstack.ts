// Importing Contentstack SDK and specific types for region and query operations
import contentstack, { QueryOperation } from "@contentstack/delivery-sdk";

// Importing Contentstack Live Preview utilities and stack SDK 
import ContentstackLivePreview, { IStackSdk } from "@contentstack/live-preview-utils";

// Importing type definitions
import {
  Page,
  Homepage,
  ProductListingPage,
  Product,
} from "./types";

// helper functions from private package to retrieve Contentstack endpoints in a convienient way
import { getContentstackEndpoints, getRegionForString } from "@timbenniks/contentstack-endpoints";

// Set the region by string value from environment variables
const region = getRegionForString(process.env.NEXT_PUBLIC_CONTENTSTACK_REGION as string)
// object with all endpoints for region.
const endpoints = getContentstackEndpoints(region, true)

export const stack = contentstack.stack({
  // Setting the API key from environment variables
  apiKey: process.env.NEXT_PUBLIC_CONTENTSTACK_API_KEY as string,

  // Setting the delivery token from environment variables
  deliveryToken: process.env.NEXT_PUBLIC_CONTENTSTACK_DELIVERY_TOKEN as string,

  // Setting the environment based on environment variables
  environment: process.env.NEXT_PUBLIC_CONTENTSTACK_ENVIRONMENT as string,

  // Setting the region
  // if the region doesnt exist, fall back to a custom region given by the env vars
  // for internal testing purposes at Contentstack we look for a custom region in the env vars, you do not have to do this.
  region: region ? region : process.env.NEXT_PUBLIC_CONTENTSTACK_REGION as any,

  // Setting the host for content delivery based on the region or environment variables
  // This is done for internal testing purposes at Contentstack, you can omit this if you have set a region above.
  host: process.env.NEXT_PUBLIC_CONTENTSTACK_CONTENT_DELIVERY || endpoints && endpoints.contentDelivery,

  live_preview: {
    // Enabling live preview if specified in environment variables
    enable: process.env.NEXT_PUBLIC_CONTENTSTACK_PREVIEW === 'true',

    // Setting the preview token from environment variables
    preview_token: process.env.NEXT_PUBLIC_CONTENTSTACK_PREVIEW_TOKEN,

    // Setting the host for live preview based on the region
    // for internal testing purposes at Contentstack we look for a custom host in the env vars, you do not have to do this.
    host: process.env.NEXT_PUBLIC_CONTENTSTACK_PREVIEW_HOST || endpoints && endpoints.preview
  }
});

// Initialize live preview functionality
export function initLivePreview() {
  ContentstackLivePreview.init({
    ssr: false, // Disabling server-side rendering for live preview
    enable: process.env.NEXT_PUBLIC_CONTENTSTACK_PREVIEW === 'true', // Enabling live preview if specified in environment variables
    mode: "builder", // Setting the mode to "builder" for visual builder
    stackSdk: stack.config as IStackSdk, // Passing the stack configuration
    stackDetails: {
      apiKey: process.env.NEXT_PUBLIC_CONTENTSTACK_API_KEY as string, // Setting the API key from environment variables
      environment: process.env.NEXT_PUBLIC_CONTENTSTACK_ENVIRONMENT as string, // Setting the environment from environment variables
    },
    clientUrlParams: {
      // Setting the client URL parameters for live preview
      // for internal testing purposes at Contentstack we look for a custom host in the env vars, you do not have to do this.
      host: process.env.NEXT_PUBLIC_CONTENTSTACK_CONTENT_APPLICATION || endpoints && endpoints.application
    },
    editButton: {
      enable: true, // Enabling the edit button for live preview
      exclude: ["outsideLivePreviewPortal"] // Excluding the edit button from the live preview portal
    },
  });
}
// Function to fetch page data based on the URL
export async function getPage(url: string) {
  const result = await stack
    .contentType("page") // Specifying the content type as "page"
    .entry() // Accessing the entry
    .query() // Creating a query
    .where("url", QueryOperation.EQUALS, url) // Filtering entries by URL
    .find<Page>(); // Executing the query and expecting a result of type Page

  if (result.entries) {
    const entry = result.entries[0]; // Getting the first entry from the result

    if (process.env.NEXT_PUBLIC_CONTENTSTACK_PREVIEW === 'true') {
      contentstack.Utils.addEditableTags(entry, 'page', true); // Adding editable tags for live preview if enabled
    }

    return entry; // Returning the fetched entry
  }
}

// Function to fetch homepage data
export async function getHomepage() {
  const query: any = stack
    .contentType("homepage")
    .entry()
    .query();

  // Include all references to fetch hero banners, products, etc.
  if (query.includeReference) {
    query.includeReference();
  }

  const result = await query.find();

  if (result.entries && result.entries.length > 0) {
    const entry = result.entries[0] as Homepage;

    if (process.env.NEXT_PUBLIC_CONTENTSTACK_PREVIEW === 'true') {
      contentstack.Utils.addEditableTags(entry, 'homepage', true);
    }

    return entry;
  }
}

// Function to fetch product listing page by URL
export async function getProductListingPage(url: string) {
  console.log("=== getProductListingPage Debug ===");
  console.log("1. Called with URL:", url);
  console.log("2. Environment:", process.env.NEXT_PUBLIC_CONTENTSTACK_ENVIRONMENT);
  console.log("3. Preview enabled:", process.env.NEXT_PUBLIC_CONTENTSTACK_PREVIEW);

  const query: any = stack
    .contentType("product_listing_page")
    .entry()
    .query()
    .where("url", QueryOperation.EQUALS, url);

  // Include all references to fetch hero banners, products, etc.
  if (query.includeReference) {
    console.log("4. Including references");
    query.includeReference();
  }

  console.log("5. Executing query...");
  const result = await query.find();

  console.log("6. Query result received");
  console.log("   - Total entries found:", result.entries?.length || 0);

  if (result.entries && result.entries.length > 0) {
    console.log("   - First entry UID:", result.entries[0].uid);
    console.log("   - First entry title:", result.entries[0].title);
    console.log("   - First entry URL:", result.entries[0].url);
    console.log("   - Page components count:", result.entries[0].page_components?.length || 0);

    if (result.entries[0].page_components) {
      console.log("   - Page component types:", result.entries[0].page_components.map((c: any, i: number) => {
        const keys = Object.keys(c);
        return `${i}: ${keys.join(', ')}`;
      }));
    }

    const entry = result.entries[0] as ProductListingPage;

    if (process.env.NEXT_PUBLIC_CONTENTSTACK_PREVIEW === 'true') {
      contentstack.Utils.addEditableTags(entry, 'product_listing_page', true);
    }

    console.log("7. Returning entry");
    return entry;
  }

  console.log("7. No entries found - trying to fetch all PLPs to see what URLs exist...");

  // Debug: Fetch all PLPs to see what URLs exist
  const allQuery: any = stack
    .contentType("product_listing_page")
    .entry()
    .query();

  const allResult = await allQuery.find();
  console.log("   - All PLPs found:", allResult.entries?.length || 0);
  if (allResult.entries) {
    allResult.entries.forEach((e: any, i: number) => {
      console.log(`   - PLP ${i}: uid=${e.uid}, title=${e.title}, url=${e.url}`);
    });
  }

  return undefined;
}

// Function to fetch all product listing pages
export async function getAllProductListingPages() {
  const result = await stack
    .contentType("product_listing_page")
    .entry()
    .query()
    .find<ProductListingPage>();

  if (result.entries) {
    return result.entries;
  }

  return [];
}

// Function to fetch a single product by URL
export async function getProduct(url: string) {
  const result = await stack
    .contentType("product")
    .entry()
    .query()
    .where("url", QueryOperation.EQUALS, url)
    .find<Product>();

  if (result.entries && result.entries.length > 0) {
    const entry = result.entries[0];

    if (process.env.NEXT_PUBLIC_CONTENTSTACK_PREVIEW === 'true') {
      contentstack.Utils.addEditableTags(entry, 'product', true);
    }

    return entry;
  }
}

// Function to fetch a single product by UID
export async function getProductByUid(uid: string) {
  console.log("=== getProductByUid Debug ===");
  console.log("Fetching product with UID:", uid);

  const query: any = stack
    .contentType("product")
    .entry(uid);

  // Include all references (author, section_with_cards, etc.)
  if (query.includeReference) {
    console.log("Including references for modular blocks");
    query.includeReference();
  }

  const entry = await query.fetch<Product>();

  if (entry) {
    console.log("Product fetched successfully");
    console.log("Title:", entry.title);
    console.log("Modular blocks count:", entry.modular_blocks?.length || 0);

    if (entry.modular_blocks) {
      console.log("Modular block types:", entry.modular_blocks.map((b: any, i: number) => {
        const keys = Object.keys(b);
        return `${i}: ${keys.join(', ')}`;
      }));
    }

    if (process.env.NEXT_PUBLIC_CONTENTSTACK_PREVIEW === 'true') {
      contentstack.Utils.addEditableTags(entry, 'product', true);
    }

    return entry;
  }

  console.log("Product not found");
  return undefined;
}

// Function to fetch all products
export async function getAllProducts() {
  const result = await stack
    .contentType("product")
    .entry()
    .query()
    .find<Product>();

  if (result.entries) {
    return result.entries;
  }

  return [];
}