import styles from './Button.module.css';

export type ButtonProps = {
  disabled?: boolean,
  wide?: boolean,
  children?: React.ReactNode,
  onClick?: () => void,
};

export function Button({ disabled = false, wide = false, children, onClick }: ButtonProps) {
  return (
    <button className={`${styles.btn} ${wide ? styles.wide : ''}`} disabled={disabled} onClick={onClick}>
      {children}
    </button>
  );
}
