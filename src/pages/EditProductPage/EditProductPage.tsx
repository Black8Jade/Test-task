import { useEffect, useState, ChangeEvent, FormEvent } from "react";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { useParams, useNavigate } from "react-router-dom";
import { fetchProducts, updateProduct } from "../../store/productsSlice";
import type { Product } from "../../types/Product";
import "./EditProductPage.scss";
import { Paperclip } from "lucide-react";

const EditProductPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const { list, status } = useAppSelector((state) => state.products);

  const product = list.find((p) => p.id === Number(id));

  const [form, setForm] = useState<Omit<Product, "id">>({
    title: "",
    description: "",
    image: "",
    price: 0,
    category: "",
  });

  useEffect(() => {
    if (list.length === 0 && status === "idle") {
      dispatch(fetchProducts());
    }
  }, [list.length, status, dispatch]);

  useEffect(() => {
    if (product) {
      const { id, ...rest } = product;
      setForm({ ...rest });
    }
  }, [product]);

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: name === "price" ? Number(value) : value,
    }));
  };

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setForm((prev) => ({ ...prev, image: imageUrl }));
    }
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (product) {
      dispatch(updateProduct({ ...product, ...form }));
      navigate("/products");
    }
  };

  if (status === "loading") return <div>Загрузка...</div>;
  if (!product) return <div>Товар не найден</div>;

  return (
    <div className="create-page">
      <h2>Редактировать карточку товара</h2>
      <form onSubmit={handleSubmit}>
        <label>
          Название:
          <input
            name="title"
            value={form.title}
            onChange={handleChange}
            required
          />
        </label>

        <label>
          Описание:
          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            required
          />
        </label>

        <label>
          Цена:
          <input
            name="price"
            value={form.price}
            onChange={handleChange}
            required
            type="number"
            step="0.01"
          />
        </label>

        <label>
          Категория:
          <input
            name="category"
            value={form.category}
            onChange={handleChange}
            required
          />
        </label>

        <label className="file-label">
          <span className="file-label-text">
            <span className="icon">
              <Paperclip size={16} />
            </span>
            Заменить изображение
          </span>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            style={{ display: "none" }}
          />
        </label>

        {form.image && (
          <div className="image-preview">
            <img src={form.image} alt="preview" />
          </div>
        )}

        <button type="submit">Сохранить</button>
      </form>
    </div>
  );
};

export default EditProductPage;
