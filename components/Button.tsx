
import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline';
  loading?: boolean;
}

export const Button: React.FC<ButtonProps> = ({ 
  children, 
  variant = 'primary', 
  loading, 
  className = '', 
  ...props 
}) => {
  const baseStyles = "relative px-6 py-3 font-bold transition-all duration-300 disabled:opacity-50 flex items-center justify-center gap-2 overflow-hidden group";
  
  const variants = {
    primary: "bg-fluo text-black hover:bg-white jedi-glow active:scale-95",
    secondary: "bg-zinc-900 text-zinc-400 hover:text-fluo border border-zinc-800 hover:border-fluo/50",
    outline: "border border-fluo text-fluo bg-transparent hover:bg-fluo/10"
  };

  return (
    <button 
      className={`${baseStyles} ${variants[variant]} ${className}`}
      disabled={loading || props.disabled}
      {...props}
    >
      {/* Decorative inner corners for buttons */}
      <span className="absolute top-0 left-0 w-1 h-1 bg-current opacity-20"></span>
      <span className="absolute bottom-0 right-0 w-1 h-1 bg-current opacity-20"></span>
      
      {loading && (
        <svg className="animate-spin h-5 w-5 text-current" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
      )}
      <span className="relative z-10 hud-text text-sm">
        {children}
      </span>
    </button>
  );
};
