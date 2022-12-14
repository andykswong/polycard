import styles from './Card.module.css';

export type CardSlotProps = {
  icon?: string | null,
};

export function CardSlot({ icon }: CardSlotProps) {
  return (
    <div className={styles.slot}>
      {icon && <img draggable={false} src={`${process.env.PUBLIC_URL}/img/${icon}.png`} alt="" className={styles.slotIcon} />}
    </div>
  );
}
