import DynamicIcon from '../ui/DynamicIcon';
import { Star } from 'lucide-react';

function WhyChooseUs({ title, subtitle, featuresData }) {
  const features = featuresData || [
    {
      title: 'Premium Materials',
      desc: 'We use high-quality, solid wood and child-safe finishes to ensure durability and safety.',
      icon: 'ShieldCheck',
    },
    {
      title: 'Custom Designs',
      desc: 'Bring your own Pinterest ideas or reference pictures. If you can dream it, we can build it.',
      icon: 'Palette',
    },
    {
      title: 'Child Safe',
      desc: 'Rounded edges, non-toxic paints, and sturdy construction for your peace of mind.',
      icon: 'Heart',
    },
    {
      title: 'Expert Craftsmanship',
      desc: 'Handcrafted by experienced artisans who specialize in kids furniture.',
      icon: 'Hammer',
    },
  ];

  const renderIcon = (iconName) => {
    return <DynamicIcon name={iconName} className="w-8 h-8 text-primary" fallback={Star} />;
  };

  return (
    <section className="py-24 bg-primary text-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-4xl font-bold mb-4 font-heading">{title || 'Why Parents Choose Us'}</h2>
          <p className="text-lg text-white/90">
            {subtitle || "We don't just build furniture; we build safe, magical spaces for your little ones to grow and thrive."}
          </p>
        </div>

        {/* Mobile Marquee (Infinite Slider) */}
        <div className="md:hidden flex overflow-hidden -mx-4 pb-4">
          <div className="flex animate-marquee gap-4 px-4 w-max hover:[animation-play-state:paused]">
            {[...features, ...features].map((feature, index) => (
              <div key={index} className="bg-white/10 p-5 rounded-3xl border border-white/20 backdrop-blur-sm flex-none w-[70vw] sm:w-[45vw]">
                <div className="mb-4 bg-white w-12 h-12 rounded-xl flex items-center justify-center shadow-sm">
                  {renderIcon(feature.icon)}
                </div>
                <h3 className="text-lg font-bold text-white mb-2 font-heading">{feature.title}</h3>
                <p className="text-sm text-white/80 leading-relaxed">
                  {feature.description || feature.desc}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Desktop Grid */}
        <div className="hidden md:grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature) => (
            <div key={feature.title} className="bg-white/10 p-8 rounded-3xl border border-white/20 hover:bg-white/20 transition-all duration-300 backdrop-blur-sm">
              <div className="mb-6 bg-white w-16 h-16 rounded-2xl flex items-center justify-center shadow-sm">
                {renderIcon(feature.icon)}
              </div>
              <h3 className="text-xl font-bold text-white mb-3 font-heading">{feature.title}</h3>
              <p className="text-white/80 leading-relaxed">
                {feature.description || feature.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default WhyChooseUs;
