// Cluster.tsx
import type { HTMLAttributes } from 'react'

type ClusterGap = 'sm' | 'md' | 'lg'
type ClusterJustify = 'start' | 'end' | 'center' | 'between'

interface ClusterProps extends HTMLAttributes<HTMLDivElement> {
    gap?: ClusterGap
    justify?: ClusterJustify
}

export function Cluster({ children, gap = 'sm', justify, className, ...props }: ClusterProps) {
    const justifyClass = justify ? `sizzle-cluster--${justify}` : ''

    return (
        <div
            className={`sizzle-cluster sizzle-cluster--${gap} ${justifyClass} ${className ?? ''}`}
            {...props}
        >
            {children}
        </div>
    )
}