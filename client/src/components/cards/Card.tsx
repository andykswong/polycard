import styles from './Card.module.css';

export type CardProps = {
  icon: string,
  color: string,
  value: string,
  bottomValue?: string,
  reverseBottom?: boolean,
};

export function Card({ color, icon, value, bottomValue = value, reverseBottom = true }: CardProps) {
  return (
    <div className={styles.card} style={{ color: `var(--color-${color})` }}>
      <p className={styles.topValue}>{value}</p>
      <img
        src={`./img/${icon}.png`} alt=""
        className={`${styles.cardIcon}`}
        style={{ filter: `var(--filter-${color})` }}
        draggable={false}
      />
      <p className={`${styles.bottomValue} ${reverseBottom ? styles.reverse : ''}`}>{bottomValue}</p>
    </div>
  );
}
