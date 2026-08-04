function SectionHeading({ title, subtitle, align = 'center', light = false }) {
  const alignClass = {
    center: 'text-center',
    left: 'text-left',
    right: 'text-right',
  };

  return (
    <div className={`mb-12 ${alignClass[align]}`}>
      <h2
        className={`text-3xl md:text-4xl font-bold font-heading ${
          light ? 'text-text-on-primary' : 'text-text'
        }`}
      >
        {title}
      </h2>
      {subtitle && (
        <p
          className={`mt-4 text-lg max-w-2xl ${
            align === 'center' ? 'mx-auto' : ''
          } ${light ? 'text-text-on-primary/70' : 'text-text-light'}`}
        >
          {subtitle}
        </p>
      )}
    </div>
  );
}

export default SectionHeading;
