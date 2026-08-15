import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';

function CategoriesShowcase({ title, subtitle }) {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch('/api/categories');
        if (res.ok) {
          const data = await res.json();
          // Map MongoDB categories to match frontend structure, only showing active ones
          const formatted = data
            .filter(c => c.status === 'Active' && (c.parent === 'None' || !c.parent))
            .map(c => ({
              name: c.name,
              image: c.image || '/images/placeholder.jpg',
              description: c.description || '',
            }));
          setCategories(formatted);
        }
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };
    fetchCategories();
  }, []);
  return (
    <section className="py-20 bg-bg overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-4xl font-bold text-text mb-4">{title || 'Explore by Category'}</h2>
          <p className="text-lg text-text-light">
            {subtitle || "From magical car beds to functional study desks, find the perfect piece for your child's room."}
          </p>
        </div>

        <div className="flex overflow-x-auto gap-6 pb-8 snap-x snap-mandatory [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden -mx-4 px-4 sm:mx-0 sm:px-0">
          {categories.map((category) => (
            <Link 
              key={category.name} 
              to={`/collection?category=${encodeURIComponent(category.name)}`}
              className="group flex-none w-[65vw] sm:w-[22rem] snap-center sm:snap-start block"
              aria-label={`Explore ${category.name} category`}
            >
              <div className="relative aspect-[4/3] rounded-3xl overflow-hidden shadow-sm bg-bg-alt border border-border/50 mb-4 group-hover:shadow-md transition-shadow flex items-center justify-center p-4">
                <img 
                  src={category.image} 
                  alt={category.name}
                  width={600}
                  height={450}
                  loading="lazy"
                  decoding="async"
                  className="w-full h-full object-contain transition-transform duration-700 group-hover:scale-105"
                />
              </div>
              <div className="text-center px-2">
                <h3 className="text-2xl font-bold text-text group-hover:text-primary transition-colors font-heading">{category.name}</h3>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

export default CategoriesShowcase;
