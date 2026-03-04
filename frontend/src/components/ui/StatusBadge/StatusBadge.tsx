import styles from './StatusBadge.module.css'

interface StatusBadgeProps {
    status: 'PENDENTE' | 'ASSINADO'
}

export function StatusBadge({ status }: StatusBadgeProps) {
    return (
        <span className={`${styles.badge} ${styles[status.toLowerCase()]}`}>
            {status}
        </span>
    )
}
