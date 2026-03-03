import styles from './status-badge.module.css'

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
