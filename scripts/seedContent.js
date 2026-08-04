import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

// Load env vars
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, '../.env') });

import Content from '../api/models/Content.js';

const contentData = [
  {
    type: 'home',
    data: {
      layout: [
        { id: 'hero', name: '1. Hero Section', visible: true },
        { id: 'banners', name: '2. Promo Banners', visible: true },
        { id: 'categories', name: '3. Categories Showcase', visible: true },
        { id: 'howItWorks', name: '4. How It Works', visible: true },
        { id: 'why', name: '5. Why Choose Us', visible: true },
        { id: 'featured', name: '6. Featured Catalog', visible: true },
        { id: 'testimonials', name: '7. Testimonials (Global)', visible: true },
        { id: 'faq', name: '8. FAQ (Global)', visible: true },
        { id: 'cta', name: '9. CTA Section', visible: true }
      ],
      heroTitle: 'Magical Furniture for Little Dreamers',
      heroSubtitle: "Custom-crafted, safe, and beautifully designed furniture for your child's perfect room.",
      heroImage1: '/images/bunk-bed-1.jpg',
      heroImage2: '/images/almary-1.jpg',
      heroImage3: '/images/car-bed-1.jpg',
      
      banners: [
        { id: 1, title: "Summer Special: 15% Off All Custom Beds", buttonText: "Claim Offer", image: '/images/bunk-bed-2.jpg' }
      ],

      categoriesTitle: 'Explore by Category',
      categoriesSubtitle: 'From magical car beds to functional study desks...',
      categories: [
        { id: 1, name: 'Beds', desc: 'Bunk beds, car beds...', image: '/images/single-bed-1.jpg' },
        { id: 2, name: 'Desks', desc: 'Ergonomic study desks...', image: '/images/almary-1.jpg' },
      ],

      howItWorksTitle: 'How It Works',
      howItWorksSubtitle: 'Getting your dream furniture is easier than you think',
      howItWorks: [
        { id: 1, step: '01', icon: 'Palette', title: 'Browse or Design', desc: "Explore our collection or upload your own design idea for a fully custom piece." },
        { id: 2, step: '02', icon: 'MessageCircle', title: 'Discuss & Customize', desc: "We'll work with you on dimensions, colors, materials, and every little detail." },
        { id: 3, step: '03', icon: 'Truck', title: 'We Build & Deliver', desc: 'Your custom furniture is handcrafted with care and delivered to your door.' },
      ],

      whyChooseUsTitle: 'Why Parents Choose Us',
      whyChooseUsSubtitle: 'We don\'t just build furniture; we build safe, magical spaces...',
      whyChooseUs: [
        { id: 1, title: 'Premium Materials', desc: 'High-quality, solid wood construction.', icon: 'ShieldCheck' },
        { id: 2, title: 'Child Safe', desc: 'Non-toxic paints and rounded edges.', icon: 'Heart' },
      ],

      ctaTitle: 'Have a Unique Idea?',
      ctaSubtitle: 'Send us your design or reference picture, and we\'ll bring it to life with premium craftsmanship. Every piece is custom-made just for you.',
      ctaButton: 'Request Custom Build'
    }
  },
  {
    type: 'about',
    data: {
      title: 'Crafting Joy For Little Dreamers',
      subtitle: 'Where safety meets imagination...',
      story: 'S&S Kids was born from a simple idea: creating furniture that kids love and parents trust. We believe every child deserves a magical space.',
      image1: '/images/bunk-bed-1.jpg',
      image2: '/images/almary-1.jpg',
      image3: '/images/bunk-bed-2.jpg'
    }
  },
  {
    type: 'contact',
    data: {
      heroBadge: 'Get In Touch',
      heroTitle: 'Let\'s Build Something',
      heroAccent: 'Amazing',
      heroSubtitle: 'Tell us about your dream furniture. Fill in the details below and our expert designers will get back to you within 24 hours.',
      floatingTitle: 'We\'re Online!',
      floatingTime: 'Response time: ~15 mins',
      methods: [
        { id: 1, title: 'Call Us', detail: '+92 300 1234567', sub: 'Mon-Sat, 9am-7pm', icon: 'Phone' },
        { id: 2, title: 'WhatsApp', detail: '+92 300 1234567', sub: 'Quick response guaranteed', icon: 'MessageCircle' },
        { id: 3, title: 'Email', detail: 'info@sskids.com', sub: 'We\'ll reply within 24hrs', icon: 'Mail' }
      ]
    }
  },
  {
    type: 'testimonials',
    data: [
      { id: 1, name: 'Sarah Ahmed', role: 'Mother of two', rating: 5, content: 'The custom bunk bed is absolutely magical! My kids love it.' },
      { id: 2, name: 'Fatima R.', role: 'Interior Designer', rating: 5, content: 'Excellent craftsmanship and great attention to detail.' }
    ]
  },
  {
    type: 'faq',
    data: {
      mainTitle: 'Frequently Asked Questions',
      mainSubtitle: 'Everything you need to know about our custom order process.',
      faqs: [
        { id: 1, question: 'Do you deliver outside Lahore?', answer: 'Yes, we deliver nationwide across Pakistan.' },
        { id: 2, question: 'How long does a custom order take?', answer: 'Usually 2-3 weeks depending on the complexity of the design.' }
      ]
    }
  }
];

const seedContent = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB Connected...');

    // Delete existing pages from this array
    for (const item of contentData) {
      await Content.deleteOne({ type: item.type });
      await Content.create(item);
      console.log(`Seeded type: ${item.type}`);
    }

    console.log('Content pages seeded successfully.');
    process.exit();
  } catch (error) {
    console.error('Error seeding content data:', error);
    process.exit(1);
  }
};

seedContent();
