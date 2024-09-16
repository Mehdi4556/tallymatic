import * as React from 'react';

import { cn } from '@/utils/cn';

const Kbd = React.forwardRef<HTMLElement, React.ComponentPropsWithoutRef<'kbd'>>(
  ({ children, className, ...props }, ref) => {
    return (
      <kbd
        {...props}
        ref={ref}
        className={cn(
          'bg-muted/30 text-background',
          'inline-flex h-5 w-fit min-w-[20px] items-center justify-center rounded-md border border-zinc-500 dark:border-zinc-400 px-1',
          'text-xs font-medium',
          className
        )}
      >
        {children}
      </kbd>
    );
  }
);

Kbd.displayName = 'Kbd';

export { Kbd };