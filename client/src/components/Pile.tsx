import styles from './Pile.module.css';

export type PileProps = {
  placeholder?: React.ReactNode,
  children?: React.ReactNode[],
};

export function Pile({ children, placeholder }: PileProps) {
  return (
    <div className={styles.pile}>
      {(!children || !children.length) && placeholder}
      {children && children.map((card, i) => (
        <div className={styles.card} key={i}>
          {card}
        </div>
      ))}
    </div>
  );
}
