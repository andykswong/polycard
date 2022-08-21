import styles from './Button.module.css';

export type ButtonProps = {
  wide?: boolean,
  children?: React.ReactNode,
  onClick?: () => void;
};

export function Button({ wide = false, children, onClick }: ButtonProps) {
  return (
    <button className={`${styles.btn} ${wide ? styles.wide : ''}`} onClick={onClick}>
      {children}
    </button>
  );
}
