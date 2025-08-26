import { Routes, Route, Navigate } from "react-router-dom";
import ProductListPage from "./pages/ProductListPage/ProductListPage";
import ProductDetailPage from "./pages/ProductDetailPage/ProductDetailPage";
import CreateProductPage from "./pages/CreateProductPage/CreateProductPage";
import EditProductPage from "./pages/EditProductPage/EditProductPage";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/products" />} />
      <Route path="/products" element={<ProductListPage />} />
      <Route path="/products/:id" element={<ProductDetailPage />} />
      <Route path="/create-product" element={<CreateProductPage />} />
      <Route path="/products/:id/edit" element={<EditProductPage />} />
    </Routes>
  );
}

export default App;


