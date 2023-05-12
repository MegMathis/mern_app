import { useState, useEffect } from "react";
import axios from "axios";

function Landing(props) {
  const [drinks, setDrinks] = useState([]);
  const [filteredDrinks, setFilteredDrinks] = useState([]);

  useEffect(() => {
    axios.get("/api/drinks").then((res) => {
      if (props.user) {
        const drink_ids = props.user.favorites.map((fav) => fav._id);
        const filtered = res.data.map((drink) => {
          return {
            ...drink,
            favorited: drink_ids.includes(drink._id),
          };
        });

        setDrinks(filtered);
      } else setDrinks(res.data);
    });
  }, [props.user]);

  const saveFavorite = async (drink_id) => {
    const res = await axios.put("/api/drink/" + drink_id);

    props.setUser(res.data.user);
  };

  const searchDrinks = (e) => {
    const value = e.target.value;
    if (value.length) {
      const filtered = drinks.filter((drink) => {
        return drink.name.toLowerCase().includes(value.toLowerCase());
      });

      setFilteredDrinks(filtered);
    } else setFilteredDrinks([]);
  };

  const outputDrink = (drink) => {
    return (
      <div key={drink._id} className="drink">
        <h4>{drink.name}</h4>
        <p>Category: {drink.category}</p>
        <p>Ingredients: {drink.ingredients}</p>
        <p>Instructions: {drink.instructions}</p>
        <p>Added By: {drink.user.username}</p>
        {props.user &&
          (drink.favorited ? (
            <button disabled>Favorited</button>
          ) : (
            <button onClick={() => saveFavorite(drink._id)}>
              Favorite This Drink
            </button>
          ))}
      </div>
    );
  };

  return (
    <main>
      <section className="hero">
        <h1>Pick Your Poison</h1>
        <p>The best drink sharing app on the market!</p>
      </section>

      <div className="search-wrap">
        <input
          onChange={searchDrinks}
          className="search-input"
          type="text"
          placeholder="Search for a drink"
        />
      </div>

      <section className="drinks">
        {filteredDrinks.length
          ? filteredDrinks.map(outputDrink)
          : drinks.map(outputDrink)}
      </section>
    </main>
  );
}

export default Landing;
