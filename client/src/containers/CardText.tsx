import { useDispatch } from '../state/State';
import { lookupAction } from '../state/actions';

export type CardTextProps = {
  card: number,
  children?: React.ReactNode,
};

export function CardText({ card, children }: CardTextProps) {
  const dispatch = useDispatch();
  return (
    <div
      onMouseOver={() => dispatch(lookupAction(card))}
      onMouseLeave={() => dispatch(lookupAction(0))}
    >
      {children}
    </div>
  )
}
