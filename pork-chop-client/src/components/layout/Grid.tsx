import type { HTMLAttributes } from 'react'

type GridGap = 'sm' | 'md' | 'lg'
type GridCol = '2col' | '3col' | '4col'

interface GridProps extends HTMLAttributes<HTMLDivElement> {
    gap?: GridGap
    columns?: GridCol
}

export function Grid({ children, gap = 'sm', columns, className, ...props }: GridProps) {
    const columnClass = columns ? `sizzle-grid--${columns}` : ''

    return (
        <div
            className={`sizzle-grid sizzle-grid--${gap} ${columnClass} ${className ?? ''}`}
            {...props}
        >
            {children}
        </div>
    )
}