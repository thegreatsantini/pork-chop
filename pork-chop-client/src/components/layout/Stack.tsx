import type { HTMLAttributes } from 'react'

type StackGap = 'sm' | 'md' | 'lg' | 'xl'

interface StackProps extends HTMLAttributes<HTMLDivElement> {
    gap?: StackGap
}

export function Stack({ children, gap = 'md', className, ...props }: StackProps) {
    return (
        <div className={`sizzle-stack sizzle-stack--${gap} ${className ?? ''}`} {...props}>
            {children}
        </div>
    )
}
