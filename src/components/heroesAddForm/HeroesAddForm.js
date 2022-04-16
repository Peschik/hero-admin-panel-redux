import { useDispatch, useSelector } from "react-redux";
import { useState, useRef } from "react";
import { v4 as uuidv4 } from "uuid";
import { useHttp } from "../../hooks/http.hook";
import { heroCreated } from "../heroesList/heroesSlice";

const HeroesAddForm = () => {
  const [heroName, setHeroName] = useState("");
  const [heroDescription, setHeroDescription] = useState("");
  const [heroElement, setHeroElement] = useState("");

  const { filters, filtersLoadingStatus } = useSelector(
    (state) => state.filters
  );
  const dispatch = useDispatch();
  const { request } = useHttp();

  const elementRef = useRef();

  const onSubmitHero = (e) => {
    e.preventDefault();
    const newHero = {
      id: uuidv4(),
      name: heroName,
      description: heroDescription,
      element: heroElement,
    };
    request("http://localhost:3001/heroes", "POST", JSON.stringify(newHero))
      .then((res) => {
        console.log(res, "Отправка успешна");
      })
      .then(dispatch(heroCreated(newHero)))
      .catch(() => console.log("error"))
      .finally(resetForm());
  };
  const renderFilters = (filters, status) => {
    if (status === "loading") {
      return <option>Загрузка</option>;
    } else if (status === "error") {
      return <option>Ошибка</option>;
    }
    if (filters && filters.length > 0) {
      return filters.map(({ name, label }) => {
        if (name === "all") {
          return;
        }
        return (
          <option key={name} value={name}>
            {label}
          </option>
        );
      });
    }
  };
  const resetForm = () => {
    setHeroName("");
    setHeroDescription("");
    setHeroElement("");
    elementRef.current.value = "Я владею элементом...";
  };
  return (
    <form onSubmit={onSubmitHero} className="border p-4 shadow-lg rounded">
      <div className="mb-3">
        <label htmlFor="name" className="form-label fs-4">
          Имя нового героя
        </label>
        <input
          required
          type="text"
          name="name"
          value={heroName}
          onChange={(e) => setHeroName(e.target.value)}
          className="form-control"
          id="name"
          placeholder="Как меня зовут?"
        />
      </div>

      <div className="mb-3">
        <label htmlFor="text" className="form-label fs-4">
          Описание
        </label>
        <textarea
          value={heroDescription}
          onChange={(e) => setHeroDescription(e.target.value)}
          required
          name="description"
          className="form-control"
          id="text"
          placeholder="Что я умею?"
          style={{ height: "130px" }}
        />
      </div>

      <div className="mb-3">
        <label htmlFor="element" className="form-label">
          Выбрать элемент героя
        </label>
        <select
          onChange={(e) => setHeroElement(e.target.value)}
          required
          className="form-select"
          id="element"
          name="element"
          ref={elementRef}
        >
          <option>Я владею элементом...</option>
          {renderFilters(filters, filtersLoadingStatus)}
        </select>
      </div>

      <button type="submit" className="btn btn-primary">
        Создать
      </button>
    </form>
  );
};

export default HeroesAddForm;
