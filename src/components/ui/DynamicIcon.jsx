/**
 * DynamicIcon — A lightweight component that renders Lucide icons by name.
 * 
 * WHY THIS EXISTS:
 * Using `import * as LucideIcons from 'lucide-react'` imports ALL 500+ icons
 * into the JavaScript bundle (~200KB+), making the page very slow.
 * This file only imports the icons that are actually used or could be
 * set from the admin panel, keeping the bundle small and fast.
 */
import {
  // Navigation & UI
  ShoppingBag, ShoppingCart, MessageCircle, MessageSquare,
  ZoomIn, Sparkles, X, ChevronDown, ChevronRight, Circle,
  Sun, Moon, Home, LayoutGrid, Info, Plus, Minus,
  // Common feature icons (used in "How It Works", "Why Choose Us")
  Palette, Truck, Shield, Star, Heart, Award, Clock,
  CheckCircle, ThumbsUp, Users, Wrench, Hammer, Brush,
  Sofa, Bed, Package, Settings, Eye, Phone, Mail,
  MapPin, ArrowRight, ArrowLeft,
  Smile, Baby, Lock, Leaf, Gem, Crown, Zap, Target,
  Lightbulb, Paintbrush, Ruler, Box, Layers, Gift,
} from 'lucide-react';

// Map of icon name (string) -> component
const iconMap = {
  ShoppingBag, ShoppingCart, MessageCircle, MessageSquare,
  ZoomIn, Sparkles, X, ChevronDown, ChevronRight, Circle,
  Sun, Moon, Home, LayoutGrid, Info, Plus, Minus,
  Palette, Truck, Shield, Star, Heart, Award, Clock,
  CheckCircle, ThumbsUp, Users, Wrench, Hammer, Brush,
  Sofa, Bed, Package, Settings, Eye, Phone, Mail,
  MapPin, ArrowRight, ArrowLeft,
  Smile, Baby, Lock, Leaf, Gem, Crown, Zap, Target,
  Lightbulb, Paintbrush, Ruler, Box, Layers, Gift,
};

/**
 * Renders a Lucide icon by its string name.
 * @param {string} name - The icon name (e.g. "Shield", "Truck")
 * @param {string} className - Tailwind classes for styling
 * @param {React.Component} fallback - Fallback icon component if name not found
 */
export default function DynamicIcon({ name, className = "w-8 h-8", fallback: Fallback = Sparkles }) {
  const IconComponent = iconMap[name];
  if (IconComponent) {
    return <IconComponent className={className} />;
  }
  return <Fallback className={className} />;
}

// Named exports for direct use
export { iconMap };
