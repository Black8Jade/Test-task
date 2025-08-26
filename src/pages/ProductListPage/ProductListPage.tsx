import { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import {
  fetchProducts,
  deleteProduct,
  toggleLike,
} from '../../store/productsSlice';
import './ProductListPage.scss';

const ProductListPage = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const products = useAppSelector((state) => state.products.list) || [];
  const favorites = useAppSelector((state) => state.products.favorites) || [];

  const [filter, setFilter] = useState<'all' | 'favorites'>('all');
  const [search, setSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    dispatch(fetchProducts());
  }, [dispatch]);

  let filtered =
    filter === 'favorites'
      ? products.filter((p) => favorites.includes(p.id))
      : products;

  if (search.trim()) {
    const query = search.trim().toLowerCase();
    filtered = filtered.filter(
      (p) =>
        p.title.toLowerCase().includes(query) ||
        p.description.toLowerCase().includes(query)
    );
  }

  const totalPages = Math.ceil(filtered.length / itemsPerPage) || 1;
  const start = (currentPage - 1) * itemsPerPage;
  const paginated = filtered.slice(start, start + itemsPerPage);

  return (
    <div className="product-page">
      <div className="page-header">
        <h2>Товары</h2>
        <div className="controls">
          <button onClick={() => setFilter('all')}>Все</button>
          <button onClick={() => setFilter('favorites')}>Избранное</button>
          <Link to="/create-product" className="create-button">
            Создать карточку товара
          </Link>
        </div>
      </div>

      <div className="search-block">
        <input
          type="text"
          placeholder="Поиск..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div className="product-grid">
        {paginated.length > 0 ? (
          paginated.map((product) => (
            <div
              key={product.id}
              className="product-card"
              onClick={(e) => {
                if ((e.target as HTMLElement).tagName === 'BUTTON') return;
                navigate(`/products/${product.id}`);
              }}
            >
              <img src={product.image} alt={product.title} />
              <h4>{product.title}</h4>
              <p className="price">{product.price} $</p>

              <div className="card-buttons">
                <button
                  className="delete-button"
                  onClick={() => dispatch(deleteProduct(product.id))}
                >
                  🗑️
                </button>
              </div>

              <div className="card-actions">
                <button
                  className="like-button"
                  onClick={() => dispatch(toggleLike(product.id))}
                >
                  {favorites.includes(product.id) ? '❤️' : '🤍'}
                </button>
              </div>
            </div>
          ))
        ) : (
          <p>Нет товаров</p>
        )}
      </div>

      <div className="pagination">
        {Array.from({ length: totalPages }, (_, i) => (
          <button
            key={i}
            onClick={() => setCurrentPage(i + 1)}
            className={currentPage === i + 1 ? 'active' : ''}
          >
            {i + 1}
          </button>
        ))}
      </div>
    </div>
  );
};

export default ProductListPage;

