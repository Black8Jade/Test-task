import { useParams, Link } from 'react-router-dom';
import { useAppSelector } from '../../store/hooks';
import { useEffect, useState } from 'react';
import './ProductDetailPage.scss';
import type { Product } from '../../types/Product';

const ProductDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const products = useAppSelector((state) => state.products.list);
  const [product, setProduct] = useState<Product | null>(null);

  useEffect(() => {
    if (!products) return;

    const found = products.find((p) => p.id === Number(id));
    if (found) {
      setProduct(found);
    } else if (id) {
      fetch(`https://fakestoreapi.com/products/${id}`)
        .then((res) => res.json())
        .then(setProduct)
        .catch(() => setProduct(null));
    }
  }, [id, products]);

  if (!product) return <div>Загрузка...</div>;

  return (
    <div className="product-detail">
      <h2>{product.title}</h2>
      <img src={product.image} alt={product.title} />
      <p><strong>Категория:</strong> {product.category}</p>
      <p><strong>Цена:</strong> ${product.price}</p>
      <p><strong>Описание:</strong> {product.description}</p>

      <div className="actions">
        <Link to="/products">← Назад</Link>
        <Link to={`/products/${product.id}/edit`} className="edit-button">
          Редактировать
        </Link>
      </div>
    </div>
  );
};

export default ProductDetailPage;

