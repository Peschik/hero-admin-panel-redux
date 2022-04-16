import { useHttp } from "../../hooks/http.hook";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { createSelector } from "reselect";
import { fetchHeroes, heroDeleted } from "./heroesSlice";
import HeroesListItem from "../heroesListItem/HeroesListItem";
import Spinner from "../spinner/Spinner";
import { useCallback } from "react";
import { CSSTransition, TransitionGroup } from "react-transition-group";
import "./heroesList.scss";

const HeroesList = () => {
  const filteredHeroesSelector = createSelector(
    (state) => state.filters.activeFilter,
    (state) => state.heroes.heroes,
    (filterBy, heroes) => {
      if (filterBy === "all") {
        return heroes;
      } else {
        return heroes.filter((item) => item.element === filterBy);
      }
    }
  );
  const filteredHeroes = useSelector(filteredHeroesSelector);
  const heroesLoadingStatus = useSelector(
    (state) => state.heroes.heroesLoadingStatus
  );
  const { heroes } = useSelector((state) => state);
  const dispatch = useDispatch();
  const { request } = useHttp();

  useEffect(() => {
    dispatch(fetchHeroes());
    // eslint-disable-next-line
  }, []);

  const onDeleteHero = useCallback(
    (id) => {
      request(`http://localhost:3001/heroes/${id}`, "DELETE")
        .then((data) => console.log(data), "deleted")
        .then(dispatch(heroDeleted(id)))
        .catch((err) => console.log(err));
    },
    [request]
  );

  if (heroesLoadingStatus === "loading") {
    return <Spinner />;
  } else if (heroesLoadingStatus === "error") {
    return <h5 className="text-center mt-5">Ошибка загрузки</h5>;
  }

  const renderHeroesList = (arr) => {
    if (arr.length === 0) {
      return (
        <CSSTransition timeout={0} classNames="hero">
          <h5 className="text-center mt-5">Героев пока нет</h5>
        </CSSTransition>
      );
    }

    return arr.map(({ id, ...props }) => {
      return (
        <CSSTransition key={id} timeout={500} classNames="hero">
          <HeroesListItem
            key={id}
            onDeleteHero={() => onDeleteHero(id)}
            {...props}
          />
        </CSSTransition>
      );
    });
  };

  const elements = filteredHeroes
    ? renderHeroesList(filteredHeroes)
    : renderHeroesList(heroes);
  return (
    <>
      <TransitionGroup component="ul">{elements}</TransitionGroup>
    </>
  );
};

export default HeroesList;
