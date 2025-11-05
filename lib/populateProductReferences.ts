import { stack } from "./contentstack";
import { Product } from "./types";

/**
 * Populates product references in a product listing page
 * ContentStack's includeReference() doesn't populate references inside modular blocks/groups,
 * so we need to fetch products separately if they're just stubs
 */
export async function populateProductReferences(pageComponents: any[]): Promise<any[]> {
  if (!pageComponents || pageComponents.length === 0) {
    return pageComponents;
  }

  const populatedComponents = await Promise.all(
    pageComponents.map(async (component) => {
      // Check if this is a product block
      if (component.product?.product) {
        const products = component.product.product;

        // Check if products are just stubs (only have uid, no title/price)
        const needsPopulation = products.some((p: any) => p.uid && !p.title);

        if (needsPopulation) {
          console.log("🔄 Products are stubs, fetching full product data...");

          // Fetch full product data for each stub
          const populatedProducts = await Promise.all(
            products.map(async (productStub: any) => {
              if (!productStub.uid) return productStub;

              try {
                const fullProduct = await stack
                  .contentType("product")
                  .entry(productStub.uid)
                  .includeReference() // Include references within the product (e.g., authors)
                  .fetch();

                console.log(`✅ Fetched full product: ${fullProduct?.title || productStub.uid}`);
                return fullProduct as Product;
              } catch (err) {
                console.error(`❌ Error fetching product ${productStub.uid}:`, err);
                return productStub;
              }
            })
          );

          return {
            ...component,
            product: {
              ...component.product,
              product: populatedProducts
            }
          };
        }
      }

      return component;
    })
  );

  return populatedComponents;
}
