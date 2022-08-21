import { useAppState } from '../state/State';

export function Tooltip() {
  const { tooltip: description } = useAppState();

  return (
    <p>{description || '\u00a0'}</p>
  );
}
