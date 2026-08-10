import { useState, useEffect } from 'react';

// No local products fallback anymore

export function useProducts(filters = {}) {
  const [products, setProducts] = useState([]);
  const [total, setTotal] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      // Build query string
      const params = new URLSearchParams();
      if (filters.search) params.append('search', filters.search);
      if (filters.category) params.append('category', filters.category);
      if (filters.minPrice) params.append('minPrice', filters.minPrice);
      if (filters.maxPrice) params.append('maxPrice', filters.maxPrice);
      if (filters.page) params.append('page', filters.page);
      if (filters.limit) params.append('limit', filters.limit);
      
      const queryString = params.toString() ? `?${params.toString()}` : '';
      const res = await fetch(`/api/products${queryString}`);
      if (!res.ok) {
        throw new Error('Failed to fetch products');
      }
      const data = await res.json();
      
      if (data && data.products) {
        // Paginated response
        if (filters.page > 1) {
          setProducts(prev => [...prev, ...data.products]);
        } else {
          setProducts(data.products);
        }
        setTotal(data.total);
        setHasMore(data.page < data.totalPages);
      } else if (data && Array.isArray(data)) {
        // Fallback for non-paginated requests
        setProducts(data);
        setTotal(data.length);
        setHasMore(false);
      } else {
        setProducts([]);
        setTotal(0);
        setHasMore(false);
      }
    } catch (err) {
      console.error('Error fetching products from API, using fallback data:', err);
    } finally {
      setLoading(false);
    }
  };

  // Re-fetch when filters change (using stringify to deep compare easily)
  useEffect(() => {
    fetchProducts();
  }, [JSON.stringify(filters)]);

  return { products, loading, error, total, hasMore, refetch: fetchProducts };
}

