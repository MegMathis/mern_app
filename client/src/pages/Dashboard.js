import { useState } from "react";
import axios from "axios";

function Dashboard(props) {
  const [errorMessage, setErrorMessage] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    category: "",
    ingredients: "",
    instructions: "",
  });

  const handleInputChange = (e) => {
    const prop = e.target.name;
    setFormData({
      ...formData,
      [prop]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post("/api/drink", formData);

      props.setUser(res.data.user);
      setFormData({
        name: "",
        category: "",
        ingredients: "",
        instructions: "",
      });
    } catch (err) {
      setErrorMessage(err.response.data.error);
    }
  };

  return (
    <main>
      <h1>Welcome, {props.user.username}!</h1>

      <form onSubmit={handleSubmit}>
        <h2>Add a drink</h2>

        {errorMessage && <p className="error">{errorMessage}</p>}

        <input
          name="name"
          type="text"
          onChange={handleInputChange}
          value={formData.name}
          placeholder="Enter the Drink Name"
        />
        <input
          name="category"
          type="text"
          onChange={handleInputChange}
          value={formData.category}
          placeholder="Enter the Drink Category"
        />
        <input
          type="text"
          name="ingredients"
          onChange={handleInputChange}
          value={formData.ingredients}
          placeholder="Enter the Drink Ingredients"
        />
        <textarea
          name="instructions"
          onChange={handleInputChange}
          value={formData.instructions}
          cols="30"
          rows="10"
          placeholder="Enter the mix instructions"
        ></textarea>
        <button>Save Drink</button>
      </form>

      {props.user && props.user.favorites.length && (
        <p>Here are your stored favorite drinks:</p>
      )}

      <div className="favorites">
        {props.user.favorites.map((fav) => (
          <div key={fav._id} className="fav">
            <p>{fav.name}</p>
            <p>Category: {fav.category}</p>
            <p>Ingredients: {fav.ingredients}</p>
            <p>Instructions: {fav.instructions}</p>
            <button>Remove from favorites</button>
          </div>
        ))}
      </div>
    </main>
  );
}

export default Dashboard;
