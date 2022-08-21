import styles from './Card.module.css';

export type CardSlotProps = {
  icon?: string | null,
};

export function CardSlot({ icon }: CardSlotProps) {
  return (
    <div className={styles.slot}>
      {icon && <img src={`./img/${icon}.png`} alt="" className={styles.slotIcon} />}
    </div>
  );
}
