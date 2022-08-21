import { Heroes } from '../model/card';
import { selectHeroAction } from '../state/actions';
import { useAppState, useDispatch } from '../state/State';
import { Hero } from './Hero';

import styles from './HeroSelector.module.css';

export function HeroSelector() {
  const { hero, ownedTokens } = useAppState();
  const dispatch = useDispatch();

  return (
    <div className={styles.selector}>
      {
        Heroes.map(id => {
          const owned = !!ownedTokens[id];
          return (
            <div
              key={id}
              className={`${styles.heroCard} ${owned ? styles.selectable : ''} ${hero === id ? styles.selected : ''}`}
              onClick={() => {
                if (owned && hero !== id) {
                  dispatch(selectHeroAction(id));
                }
              }}
            >
              <Hero id={id} />
            </div>
          );
        })
      }
    </div>
  )
}
