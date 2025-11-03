// Description: Type definitions for the Contentstack API

// PublishDetails object - Represents the details of publish functionality
export interface PublishDetails {
  environment: string;
  locale: string;
  time: string;
  user: string;
}

// File object - Represents a file in Contentstack
export interface File {
  uid: string;
  created_at: string;
  updated_at: string;
  created_by: string;
  updated_by: string;
  content_type: string;
  file_size: string;
  tags: string[];
  filename: string;
  url: string;
  ACL: any[] | object;
  is_dir: boolean;
  parent_uid: string;
  _version: number;
  title: string;
  _metadata?: object;
  publish_details: PublishDetails;
  $: any;
}

// Link object - Represents a hyperlink in Contentstack
export interface Link {
  title: string;
  href: string;
}

// Taxonomy object - Represents a taxonomy in Contentstack
export interface Taxonomy {
  taxonomy_uid: string;
  max_terms?: number;
  mandatory: boolean;
  non_localizable: boolean;
}

// Block Global Field - Represents a modular block in Contentstack
export interface Block {
  _version?: number;
  _metadata?: any;
  $?: any;
  title?: string;
  copy?: string;
  image?: File | null;
  layout?: "image_left" | "image_right";
}

export interface Blocks {
  block: Block;
}

// Page object - Represents a page in Contentstack
export interface Page {
  uid: string;
  $: any;
  _version?: number;
  title: string;
  url?: string;
  description?: string;
  image?: File | null;
  rich_text?: string;
  blocks?: Blocks[];
}

// ============ Global Fields ============

// SEO Global Field
export interface SEO {
  meta_title?: string;
  meta_description?: string;
  keywords?: string;
  enable_search_indexing?: boolean;
}

// Social Share Global Field
export interface SocialMediaShare {
  title?: string;
  icon?: File;
  url?: Link;
}

export interface SocialShare {
  social_media_share?: SocialMediaShare[];
}

// Section Global Field
export interface Section {
  title_h2?: string;
  description?: string;
  call_to_action?: Link;
  image?: File;
  is_image_right_aligned?: boolean;
  $?: any;
}

// Section with Buckets Global Field
export interface Bucket {
  title_h3?: string;
  image?: File;
  image_alignment?: "Left" | "Right";
  description?: string;
  icon?: File;
  call_to_action?: Link;
}

export interface SectionWithBuckets {
  title_h2?: string;
  description?: string;
  tabular_buckets?: boolean;
  buckets?: Bucket[];
  $?: any;
}

// Section with Cards Global Field
export interface Card {
  card_title_h3?: string;
  description?: string;
  call_to_action?: Link;
  image?: File;
}

export interface SectionWithCards {
  section_title?: string;
  section_description?: string;
  cards?: Card[];
  $?: any;
}

// Section with HTML Code Global Field
export interface SectionWithHtmlCode {
  title?: string;
  description?: string;
  html_code?: string;
  is_html_code_left_aligned_?: boolean;
  $?: any;
}

// ============ Content Models ============

// Author Model
export interface Author {
  uid: string;
  title: string;
  picture: File;
  bio?: string;
  $?: any;
}

// Product Model
export interface Product {
  uid: string;
  title: string;
  url?: string;
  description?: string;
  featured_image: File[];
  price: number;
  call_to_action?: Link;
  $?: any;
  _version?: number;
  _metadata?: any;
}

// Hero Banner Model
export interface HeroBanner {
  uid?: string;
  title: string;
  banner_image?: File;
  background_color?: any;
  text_color?: any;
  banner_description?: string;
  call_to_action?: Link;
  is_banner_image_full_width_?: boolean;
  banner_image_alignment?: "Left" | "Center" | "Right";
  content_title_alignment?: "Left" | "Center" | "Right";
  $?: any;
}

// Contact Model
export interface Contact {
  uid: string;
  title: string;
  address?: string;
  contact_number?: number[];
  email_address?: string;
  $?: any;
}

// Our Team Model (referenced in homepage)
export interface OurTeam {
  uid?: string;
  title?: string;
  $?: any;
}

// Blog Landing Page Model
export interface BlogLandingPage {
  uid: string;
  title: string;
  url?: string;
  author: Author[];
  date?: string;
  featured_image: File;
  body?: any;
  related_post?: BlogLandingPage[];
  is_archived?: boolean;
  comments?: {
    comment?: string;
    call_to_action?: Link;
  };
  social_share?: SocialShare;
  seo?: SEO;
  $?: any;
}

// Page Components for Homepage and Product Listing Page
export interface HeroBannerBlock {
  hero_banner?: HeroBanner[];
  $?: any;
}

export interface ProductBlock {
  product?: Product[];
  $?: any;
}

export interface FromBlogBlock {
  title_h2?: string;
  featured_blogs?: BlogLandingPage[];
  view_articles?: Link;
  $?: any;
}

export interface WidgetBlock {
  title_h2?: string;
  type?: "Blog Archive" | "Related Posts";
  related_products?: ProductListingPage;
  $?: any;
}

export interface ContactUsBlock {
  reference?: Contact[];
  $?: any;
}

export interface OurTeamBlock {
  our_team?: OurTeam;
  $?: any;
}

export type PageComponent =
  | { hero_banner: HeroBannerBlock }
  | { section_with_buckets: SectionWithBuckets }
  | { section: Section }
  | { section_with_cards: SectionWithCards }
  | { section_with_html_code: SectionWithHtmlCode }
  | { our_team: OurTeamBlock }
  | { from_blog: FromBlogBlock }
  | { widget: WidgetBlock }
  | { contact_us: ContactUsBlock }
  | { product: ProductBlock };

// Homepage Model
export interface Homepage {
  uid: string;
  title: string;
  url?: string;
  page_components?: PageComponent[];
  seo?: SEO;
  $?: any;
  _version?: number;
}

// Product Listing Page Model
export interface ProductListingPage {
  uid: string;
  title: string;
  url?: string;
  page_components?: PageComponent[];
  seo?: SEO;
  $?: any;
  _version?: number;
}