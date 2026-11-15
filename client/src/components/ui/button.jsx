import { cva } from 'class-variance-authority';

export const buttonVariants = cva(
  'inline-flex items-center justify-center gap-2 font-medium transition rounded-full disabled:opacity-50 disabled:pointer-events-none',
  {
    variants: {
      variant: {
        default: 'bg-foreground text-background hover:bg-foreground/90',
        outline: 'border border-foreground/20 text-foreground hover:bg-white/5',
        ghost: 'text-foreground/80 hover:bg-white/5',
        heroSecondary: 'liquid-glass text-foreground hover:bg-white/5',
      },
      size: { default: 'px-5 py-2.5 text-sm', sm: 'px-4 py-2 text-sm', lg: 'px-[29px] py-[24px] text-base' },
    },
    defaultVariants: { variant: 'default', size: 'default' },
  }
);

export function Button({ variant, size, className = '', ...props }) {
  return <button className={`${buttonVariants({ variant, size })} ${className}`} {...props} />;
}
