import ProductCard from "./ProductCard";

export default function ProductGrid({
  products,
  enableHover = false,
}) {
  if (!products || products.length === 0) {
    return (
      <div className="no-products">
        <h3>No products found</h3>
        <p>
          Try searching for another beauty product.
        </p>
      </div>
    );
  }

  return (
    <div className="product-grid">
      {products.map((product) => (
        <ProductCard
          key={product.id}
          product={product}
          enableHover={enableHover}
        />
      ))}
    </div>
  );
}