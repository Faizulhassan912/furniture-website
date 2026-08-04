import { Link } from 'react-router-dom';

const variants = {
  primary:
    'bg-primary hover:bg-primary-dark text-text-on-primary shadow-md hover:shadow-lg',
  secondary:
    'bg-accent hover:bg-accent-dark text-text-on-accent shadow-md hover:shadow-lg',
  outline:
    'border-2 border-primary text-primary hover:bg-primary hover:text-text-on-primary',
};

const sizes = {
  sm: 'px-4 py-2 text-sm',
  md: 'px-6 py-3 text-base',
  lg: 'px-8 py-4 text-lg',
};

function Button({
  children,
  variant = 'primary',
  size = 'md',
  href,
  onClick,
  type = 'button',
  className = '',
  ...props
}) {
  const baseClasses = `inline-flex items-center justify-center font-semibold rounded-full transition-all duration-300 cursor-pointer hover:-translate-y-0.5 ${variants[variant]} ${sizes[size]} ${className}`;

  if (href) {
    return (
      <Link to={href} className={baseClasses} {...props}>
        {children}
      </Link>
    );
  }

  return (
    <button type={type} onClick={onClick} className={baseClasses} {...props}>
      {children}
    </button>
  );
}

export default Button;
