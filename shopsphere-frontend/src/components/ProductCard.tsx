// src/components/ProductCard.tsx
import { useLocale } from "../contexts/LocaleContext";

type Props = {
  title: string;
  price: number;
  image: string;
  onAddToCart?: () => void;
  disabled?: boolean;
};

const ProductCard = ({ title, price, image, onAddToCart, disabled }: Props) => {
  const { getDisplayPrice } = useLocale();

  return (
    <div className="bg-white p-4 rounded-lg shadow hover:shadow-lg transition">

      {image ? (
        <img
          src={image}
          alt={title}
          className="h-40 w-full object-cover rounded"
        />
      ) : (
        <div className="h-40 w-full bg-gray-200 rounded flex items-center justify-center text-gray-500 text-sm">
          No Image Available
        </div>
      )}

      <h3 className="mt-2 text-sm font-semibold line-clamp-2">
        {title}
      </h3>

      <p className="text-orange-600 font-bold mt-1">
        {getDisplayPrice(price)}
      </p>

      <button
        onClick={onAddToCart}
        disabled={disabled}
        className="bg-yellow-400 hover:bg-yellow-500 disabled:bg-gray-300 w-full mt-3 py-1 rounded transition"
      >
        Add to Cart
      </button>
    </div>
  );
};
export default ProductCard;