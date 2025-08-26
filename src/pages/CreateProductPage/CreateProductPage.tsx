import { useState, ChangeEvent, FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch } from '../../store/hooks';
import { addProduct } from '../../store/productsSlice';
import './CreateProductPage.scss';
import { Paperclip } from 'lucide-react';
import type { Product } from '../../types/Product';

const CreateProductPage = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const [form, setForm] = useState<Omit<Product, 'id'>>({
    title: '',
    description: '',
    price: '',
    category: '',
    image: '',
  });

  const [errors, setErrors] = useState<Partial<Record<keyof typeof form, string>>>({});

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      setForm((prev) => ({ ...prev, image: reader.result as string }));
    };
    reader.readAsDataURL(file);
  };

  const validate = () => {
    const newErrors: typeof errors = {};
    if (!form.title.trim()) newErrors.title = '*Поле обязательное для заполнения';
    if (!form.description.trim()) newErrors.description = '*Поле обязательное для заполнения';
    if (!form.price || isNaN(Number(form.price))) newErrors.price = '*Поле обязательное для заполнения';
    if (!form.category.trim()) newErrors.category = '*Поле обязательное для заполнения';
    if (!form.image) newErrors.image = '*Прикрепите изображение';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    const newProduct: Product = {
      ...form,
      id: Date.now(),
      price: parseFloat(form.price as unknown as string),
    };

    dispatch(addProduct(newProduct));
    navigate('/products');
  };

  return (
    <div className="create-page">
      <h2>Создать карточку товара</h2>
      <form onSubmit={handleSubmit}>
        <label>
          Название:
          <input name="title" value={form.title} onChange={handleChange} />
          {errors.title && <span className="error-message">{errors.title}</span>}
        </label>

        <label>
          Описание:
          <textarea name="description" value={form.description} onChange={handleChange} />
          {errors.description && <span className="error-message">{errors.description}</span>}
        </label>

        <label>
          Цена:
          <input name="price" value={form.price} onChange={handleChange} />
          {errors.price && <span className="error-message">{errors.price}</span>}
        </label>

        <label>
          Категория:
          <input name="category" value={form.category} onChange={handleChange} />
          {errors.category && <span className="error-message">{errors.category}</span>}
        </label>

        <label className="file-label">
          <span className="file-label-text">
            <span className="icon"><Paperclip size={18} /></span>
            Прикрепить изображение:
          </span>
          <input type="file" accept="image/*" onChange={handleFileChange} hidden />
          {errors.image && <span className="error-message">{errors.image}</span>}
        </label>

        {form.image && (
          <div className="image-preview">
            <img src={form.image} alt="preview" />
          </div>
        )}

        <button type="submit">Создать</button>
      </form>
    </div>
  );
};

export default CreateProductPage;
