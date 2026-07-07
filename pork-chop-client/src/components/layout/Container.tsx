// Container.tsx
import type { HTMLAttributes } from 'react'

type ContainerWidth = 'default' | 'narrow' | 'wide'

interface ContainerProps extends HTMLAttributes<HTMLDivElement> {
    width?: ContainerWidth
}

export function Container({ children, width = 'default', className, ...props }: ContainerProps) {
    const widthClass = width !== 'default' ? `sizzle-container--${width}` : ''

    return (
        <div className={`sizzle-container ${widthClass} ${className ?? ''}`} {...props}>
            {children}
        </div>
    )
}