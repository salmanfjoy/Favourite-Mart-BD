import React, { useState } from 'react';
import { 
  Plus, 
  Search, 
  Edit3, 
  Trash2, 
  Package, 
  Image as ImageIcon, 
  Upload,
  Check, 
  X, 
  RefreshCw, 
  AlertTriangle,
  ExternalLink,
  Tag,
  SlidersHorizontal,
  Info
} from 'lucide-react';
import { Product } from '../../types';
import { CATEGORIES } from '../../data/mockData';
import { SafeImage } from '../SafeImage';

interface AdminProductsTabProps {
  products: Product[];
  onAddProduct: (productData: Partial<Product>) => Promise<void>;
  onUpdateProduct: (productData: Partial<Product>) => Promise<void>;
  onDeleteProduct: (productId: string) => Promise<void>;
  onSyncDefaultProducts: () => Promise<void>;
  isSyncing?: boolean;
}

export const AdminProductsTab: React.FC<AdminProductsTabProps> = ({
  products,
  onAddProduct,
  onUpdateProduct,
  onDeleteProduct,
  onSyncDefaultProducts,
  isSyncing = false,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [stockFilter, setStockFilter] = useState<'all' | 'low' | 'out'>('all');
  
  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isDeletingId, setIsDeletingId] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState('');

  // Form inputs
  const [name, setName] = useState('');
  const [category, setCategory] = useState('tech');
  const [price, setPrice] = useState('');
  const [originalPrice, setOriginalPrice] = useState('');
  const [image, setImage] = useState('');
  const [imageMode, setImageMode] = useState<'url' | 'upload'>('url');
  const [stockCount, setStockCount] = useState('50');
  const [inStock, setInStock] = useState(true);
  const [brand, setBrand] = useState('Favourite Mart BD');
  const [description, setDescription] = useState('');

  // Filter products
  const filteredProducts = products.filter((p) => {
    const q = searchQuery.toLowerCase().trim();
    const matchesSearch = 
      p.name.toLowerCase().includes(q) ||
      (p.brand && p.brand.toLowerCase().includes(q)) ||
      (p.category && p.category.toLowerCase().includes(q));

    const matchesCat = selectedCategory === 'all' || p.category === selectedCategory;

    let matchesStock = true;
    const count = p.stockCount ?? 50;
    if (stockFilter === 'low') {
      matchesStock = count < 5;
    } else if (stockFilter === 'out') {
      matchesStock = !p.inStock || count === 0;
    }

    return matchesSearch && matchesCat && matchesStock;
  });

  const lowStockCount = products.filter((p) => (p.stockCount ?? 50) < 5).length;
  const outOfStockCount = products.filter((p) => !p.inStock || (p.stockCount ?? 50) === 0).length;

  const openAddModal = () => {
    setEditingProduct(null);
    setName('');
    setCategory('tech');
    setPrice('');
    setOriginalPrice('');
    setImage('https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=600&q=80');
    setImageMode('url');
    setStockCount('50');
    setInStock(true);
    setBrand('Favourite Mart BD');
    setDescription('');
    setFormError('');
    setIsModalOpen(true);
  };

  const openEditModal = (p: Product) => {
    setEditingProduct(p);
    setName(p.name);
    setCategory(p.category || 'tech');
    setPrice(String(p.price));
    setOriginalPrice(p.originalPrice ? String(p.originalPrice) : '');
    setImage(p.image);
    setImageMode('url');
    setStockCount(String(p.stockCount ?? 50));
    setInStock(p.inStock !== false);
    setBrand(p.brand || 'Favourite Mart BD');
    setDescription(p.description || '');
    setFormError('');
    setIsModalOpen(true);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      setFormError('Image file must be smaller than 2MB');
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      if (reader.result) {
        setImage(reader.result as string);
        setFormError('');
      }
    };
    reader.readAsDataURL(file);
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setFormError('Please enter a product name');
      return;
    }
    const parsedPrice = parseFloat(price);
    if (isNaN(parsedPrice) || parsedPrice <= 0) {
      setFormError('Please enter a valid price in BDT');
      return;
    }
    if (!image.trim()) {
      setFormError('Please provide an image URL or upload an image file');
      return;
    }

    const catObj = CATEGORIES.find((c) => c.slug === category);
    const categoryLabel = catObj ? catObj.name : category;
    const parsedStock = parseInt(stockCount, 10) || 0;

    const payload: Partial<Product> = {
      name: name.trim(),
      category,
      categoryLabel,
      price: parsedPrice,
      originalPrice: originalPrice ? parseFloat(originalPrice) : undefined,
      image: image.trim(),
      stockCount: parsedStock,
      inStock: inStock && (parsedStock > 0),
      brand: brand.trim() || 'Favourite Mart BD',
      description: description.trim(),
      rating: editingProduct?.rating || 5.0,
      reviewsCount: editingProduct?.reviewsCount || 1,
    };

    if (editingProduct) {
      payload.id = editingProduct.id;
    }

    setSubmitting(true);
    setFormError('');
    try {
      if (editingProduct) {
        await onUpdateProduct(payload);
      } else {
        await onAddProduct(payload);
      }
      setIsModalOpen(false);
    } catch (err: any) {
      setFormError(err.message || 'Failed to save product. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const confirmDelete = async () => {
    if (!isDeletingId) return;
    setSubmitting(true);
    try {
      await onDeleteProduct(isDeletingId);
      setIsDeletingId(null);
    } catch (err: any) {
      alert('Could not delete product: ' + (err.message || 'Unknown error'));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-5">
      {/* Top Banner & Action */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-[#083344] flex items-center gap-2">
            <Package className="w-5 h-5 text-[#00829B]" />
            Products Inventory ({products.length})
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Add, edit, manage stock, and monitor low inventory warnings
          </p>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap">
          <button
            onClick={openAddModal}
            className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-bold bg-[#00829B] hover:bg-[#006477] text-white shadow-sm transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            Add New Product
          </button>

          {products.length === 0 && (
            <button
              onClick={onSyncDefaultProducts}
              disabled={isSyncing}
              className="inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl text-xs font-bold bg-slate-100 hover:bg-slate-200 text-slate-700 transition-all cursor-pointer"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin' : ''}`} />
              {isSyncing ? 'Syncing Catalog...' : 'Load Store Catalog'}
            </button>
          )}
        </div>
      </div>

      {/* Stock Summary Badges & Quick Filters */}
      <div className="flex items-center gap-2 flex-wrap text-xs">
        <button
          onClick={() => setStockFilter('all')}
          className={`px-3 py-1.5 rounded-xl font-bold transition-all cursor-pointer ${
            stockFilter === 'all'
              ? 'bg-slate-900 text-white shadow-xs'
              : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
          }`}
        >
          All Items ({products.length})
        </button>

        <button
          onClick={() => setStockFilter('low')}
          className={`px-3 py-1.5 rounded-xl font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
            stockFilter === 'low'
              ? 'bg-amber-500 text-white shadow-xs'
              : 'bg-white text-amber-700 border border-amber-200 hover:bg-amber-50'
          }`}
        >
          <AlertTriangle className="w-3.5 h-3.5" />
          Low Stock (&lt; 5) ({lowStockCount})
        </button>

        <button
          onClick={() => setStockFilter('out')}
          className={`px-3 py-1.5 rounded-xl font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
            stockFilter === 'out'
              ? 'bg-rose-600 text-white shadow-xs'
              : 'bg-white text-rose-700 border border-rose-200 hover:bg-rose-50'
          }`}
        >
          <X className="w-3.5 h-3.5" />
          Out of Stock ({outOfStockCount})
        </button>
      </div>

      {/* Search and Category Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-grow">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search products by name, brand, or category..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9.5 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-[#00829B]"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Category Dropdown */}
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="bg-white border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-700 focus:outline-none focus:border-[#00829B] cursor-pointer"
        >
          <option value="all">All Categories</option>
          {CATEGORIES.map((c) => (
            <option key={c.slug} value={c.slug}>
              {c.name}
            </option>
          ))}
        </select>
      </div>

      {/* Products Table */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
        {filteredProducts.length === 0 ? (
          <div className="p-12 text-center text-slate-500">
            <Package className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <h4 className="text-sm font-bold text-slate-700">No products found</h4>
            <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
              {searchQuery || selectedCategory !== 'all' || stockFilter !== 'all'
                ? 'Try adjusting your search query or filters to find products.'
                : 'Click "Add New Product" to populate your catalog.'}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-100">
                <tr>
                  <th className="py-3 px-4">Thumbnail</th>
                  <th className="py-3 px-4">Product Name</th>
                  <th className="py-3 px-4">Category</th>
                  <th className="py-3 px-4">Price (BDT)</th>
                  <th className="py-3 px-4">Stock Quantity</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {filteredProducts.map((prod) => {
                  const count = prod.stockCount ?? 50;
                  const isLowStock = count < 5;
                  const isOutOfStock = !prod.inStock || count === 0;

                  return (
                    <tr 
                      key={prod.id} 
                      className={`transition-colors ${
                        isLowStock ? 'bg-amber-50/40 hover:bg-amber-50/70' : 'hover:bg-slate-50/70'
                      }`}
                    >
                      {/* Image Thumbnail */}
                      <td className="py-3 px-4">
                        <SafeImage
                          src={prod.image}
                          alt={prod.name}
                          className="w-11 h-11 rounded-lg object-cover bg-slate-100 border border-slate-200 flex-shrink-0"
                        />
                      </td>

                      {/* Name */}
                      <td className="py-3 px-4 max-w-xs">
                        <div className="font-bold text-slate-900 line-clamp-1" title={prod.name}>
                          {prod.name}
                        </div>
                        <div className="text-[11px] text-slate-400 flex items-center gap-1.5 mt-0.5">
                          <span>{prod.brand || 'Favourite Mart BD'}</span>
                          <span>•</span>
                          <span className="font-mono">ID: {prod.id.slice(0, 8)}</span>
                        </div>
                      </td>

                      {/* Category */}
                      <td className="py-3 px-4">
                        <span className="inline-flex items-center px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 text-[11px] font-medium capitalize">
                          {prod.categoryLabel || prod.category}
                        </span>
                      </td>

                      {/* Price */}
                      <td className="py-3 px-4">
                        <div className="font-extrabold text-[#083344] text-xs sm:text-sm">
                          ৳{prod.price?.toLocaleString()}
                        </div>
                        {prod.originalPrice && prod.originalPrice > prod.price && (
                          <div className="text-[10px] text-slate-400 line-through">
                            ৳{prod.originalPrice.toLocaleString()}
                          </div>
                        )}
                      </td>

                      {/* Stock Quantity with < 5 Warning */}
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className={`font-mono font-bold text-xs ${
                            isOutOfStock 
                              ? 'text-rose-600' 
                              : isLowStock 
                              ? 'text-amber-600' 
                              : 'text-slate-800'
                          }`}>
                            {count} pcs
                          </span>

                          {isOutOfStock ? (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-50 text-rose-700 border border-rose-200">
                              Out of stock
                            </span>
                          ) : isLowStock ? (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800 border border-amber-300 animate-pulse">
                              <AlertTriangle className="w-3 h-3" />
                              Low Stock (&lt;5)
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium bg-emerald-50 text-emerald-700">
                              In Stock
                            </span>
                          )}
                        </div>
                      </td>

                      {/* Edit and Delete Buttons */}
                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => openEditModal(prod)}
                            title="Edit Product"
                            className="p-1.5 rounded-lg text-slate-600 hover:text-[#00829B] hover:bg-slate-100 transition-colors cursor-pointer"
                          >
                            <Edit3 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => setIsDeletingId(prod.id)}
                            title="Delete Product"
                            className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Add / Edit Product Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-slate-100">
            <div className="sticky top-0 bg-white px-6 py-4 border-b border-slate-100 flex items-center justify-between z-10">
              <h3 className="text-base font-bold text-[#083344]">
                {editingProduct ? 'Edit Product' : 'Add New Product'}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleFormSubmit} className="p-6 space-y-4">
              {formError && (
                <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 flex-shrink-0" />
                  <span>{formError}</span>
                </div>
              )}

              {/* Product Name */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Product Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Wireless Smart Watch Series 9"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-[#00829B]"
                />
              </div>

              {/* Category & Brand */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Category *
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-[#00829B] cursor-pointer"
                  >
                    {CATEGORIES.map((c) => (
                      <option key={c.slug} value={c.slug}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Brand
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Favourite Mart BD"
                    value={brand}
                    onChange={(e) => setBrand(e.target.value)}
                    className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-[#00829B]"
                  />
                </div>
              </div>

              {/* Price & Original Price */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Price (BDT ৳) *
                  </label>
                  <input
                    type="number"
                    required
                    min="1"
                    step="1"
                    placeholder="1250"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-[#00829B]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Original Price (Optional)
                  </label>
                  <input
                    type="number"
                    min="0"
                    step="1"
                    placeholder="1800"
                    value={originalPrice}
                    onChange={(e) => setOriginalPrice(e.target.value)}
                    className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-[#00829B]"
                  />
                </div>
              </div>

              {/* Stock Quantity & Status */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-3.5 bg-slate-50 rounded-xl border border-slate-100">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Stock Quantity (pcs) *
                  </label>
                  <input
                    type="number"
                    min="0"
                    required
                    value={stockCount}
                    onChange={(e) => setStockCount(e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-xs text-slate-900 focus:outline-none focus:border-[#00829B]"
                  />
                  {parseInt(stockCount, 10) < 5 && (
                    <p className="text-[10px] text-amber-600 font-semibold mt-1">
                      ⚠️ Stock is below 5 (will trigger low stock warning)
                    </p>
                  )}
                </div>

                <div className="flex flex-col justify-center">
                  <label className="text-xs font-bold text-slate-700 mb-1">In Stock Toggle</label>
                  <label className="inline-flex items-center gap-2 cursor-pointer mt-1">
                    <input
                      type="checkbox"
                      checked={inStock}
                      onChange={(e) => setInStock(e.target.checked)}
                      className="w-4 h-4 text-[#00829B] rounded focus:ring-0 cursor-pointer"
                    />
                    <span className="text-xs font-medium text-slate-700">
                      {inStock ? 'Available for purchase' : 'Mark Out of Stock'}
                    </span>
                  </label>
                </div>
              </div>

              {/* Image Input: Upload file or URL */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-bold text-slate-700">
                    Product Image *
                  </label>
                  <div className="flex items-center gap-2 text-[11px]">
                    <button
                      type="button"
                      onClick={() => setImageMode('url')}
                      className={`font-semibold cursor-pointer ${imageMode === 'url' ? 'text-[#00829B] underline' : 'text-slate-400'}`}
                    >
                      Image URL
                    </button>
                    <span className="text-slate-300">|</span>
                    <button
                      type="button"
                      onClick={() => setImageMode('upload')}
                      className={`font-semibold cursor-pointer ${imageMode === 'upload' ? 'text-[#00829B] underline' : 'text-slate-400'}`}
                    >
                      Upload File
                    </button>
                  </div>
                </div>

                {imageMode === 'url' ? (
                  <div className="flex gap-2">
                    <input
                      type="url"
                      placeholder="https://images.unsplash.com/..."
                      value={image}
                      onChange={(e) => setImage(e.target.value)}
                      className="flex-grow px-3.5 py-2.5 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-[#00829B]"
                    />
                    {image && (
                      <SafeImage
                        src={image}
                        alt="Preview"
                        className="w-10 h-10 rounded-lg object-cover border border-slate-200 flex-shrink-0"
                      />
                    )}
                  </div>
                ) : (
                  <div className="space-y-2">
                    <label className="flex flex-col items-center justify-center border-2 border-dashed border-slate-200 rounded-xl p-4 cursor-pointer hover:border-[#00829B] transition-colors bg-slate-50">
                      <Upload className="w-5 h-5 text-slate-400 mb-1" />
                      <span className="text-xs font-semibold text-slate-600">Click to choose image file</span>
                      <span className="text-[10px] text-slate-400">PNG, JPG, WebP up to 2MB</span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleFileUpload}
                        className="hidden"
                      />
                    </label>
                    {image && (
                      <div className="flex items-center gap-3 p-2 bg-slate-100 rounded-xl">
                        <img
                          src={image}
                          alt="Uploaded Preview"
                          className="w-12 h-12 rounded-lg object-cover border border-slate-200"
                        />
                        <div className="text-xs text-slate-600">
                          <p className="font-bold text-slate-800">Image Loaded</p>
                          <p className="text-[10px] text-slate-400">Ready to save</p>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Description */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Description
                </label>
                <textarea
                  rows={3}
                  placeholder="Short product overview, features, specifications..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-[#00829B] resize-none"
                />
              </div>

              {/* Actions */}
              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-5 py-2.5 rounded-xl text-xs font-bold bg-[#00829B] hover:bg-[#006477] text-white shadow-sm transition-all cursor-pointer disabled:opacity-60 flex items-center gap-2"
                >
                  {submitting && <RefreshCw className="w-3.5 h-3.5 animate-spin" />}
                  {editingProduct ? 'Save Changes' : 'Create Product'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      {isDeletingId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 shadow-2xl border border-slate-100 text-center">
            <div className="w-12 h-12 rounded-full bg-rose-50 text-rose-600 flex items-center justify-center mx-auto mb-4">
              <Trash2 className="w-6 h-6" />
            </div>
            <h4 className="text-base font-bold text-slate-900">Delete this product?</h4>
            <p className="text-xs text-slate-500 mt-1">
              This action will remove the product permanently from your catalog.
            </p>
            <div className="mt-6 flex items-center justify-center gap-3">
              <button
                onClick={() => setIsDeletingId(null)}
                className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                disabled={submitting}
                className="px-4 py-2 text-xs font-bold bg-rose-600 hover:bg-rose-700 text-white rounded-xl cursor-pointer shadow-sm disabled:opacity-60"
              >
                {submitting ? 'Deleting...' : 'Delete Permanently'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
