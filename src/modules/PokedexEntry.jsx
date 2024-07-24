import axios from "axios";
import { useEffect, useState } from "react";

import "./PokedexEntry.css";
import "./RotatingAnimation.css";
const POKEBALL_SPRITE_URL =
  "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/poke-ball.png";

const colours = {
  normal: "#A8A77A",
  fire: "#EE8130",
  water: "#6390F0",
  electric: "#F7D02C",
  grass: "#7AC74C",
  ice: "#96D9D6",
  fighting: "#C22E28",
  poison: "#A33EA1",
  ground: "#E2BF65",
  flying: "#A98FF3",
  psychic: "#F95587",
  bug: "#A6B91A",
  rock: "#B6A136",
  ghost: "#735797",
  dragon: "#6F35FC",
  dark: "#705746",
  steel: "#B7B7CE",
  fairy: "#D685AD",
  stellar: "40B5A5",
};

function PokedexEntry({ pokedata, setter }) {
  const [descriptions, setDescriptions] = useState(null);
  const cry = new Audio(pokedata.cries.latest);
  const [descriptionIndex, setDescriptionIndex] = useState(0);
  const [currDescription, setCurrDescription] = useState("");
  const [flip, setFlip] = useState(false);
  cry.volume = 0.1;

  useEffect(() => {
    axios.get(pokedata.species.url).then((response) => {
      const filtered = response.data.flavor_text_entries.filter(
        (entry) => entry.language.name == "en"
      );
      let unrepeated = {};
      filtered.forEach((e) => {
        const formatedText = e.flavor_text.replace("\f", "\n");
        if (unrepeated[formatedText]) {
          unrepeated[formatedText].push(e.version.name);
        } else {
          unrepeated[formatedText] = [e.version.name];
        }
      });
      setDescriptions(unrepeated);
      setCurrDescription(Object.keys(unrepeated)[0]);
    });
  }, []);

  return descriptions ? (
    <div className="entry-container">
      <div className="top-half">
        <div className="sprite-container">
          <button className="flip-button" onClick={() => setFlip(!flip)}>
            ↻
          </button>
          <div onClick={() => cry.play()} style={{ top: "0" }}>
            <img
              style={{ width: "100%" }}
              src={
                flip
                  ? pokedata.sprites.back_default
                  : pokedata.sprites.front_default
              }
            />
          </div>
        </div>
        <div className="data-container">
          <div className="name">
            <div className="id">
              <img style={{ height: "70px" }} src={POKEBALL_SPRITE_URL} />
              {pokedata.id < 1000 && "0"}
              {pokedata.id < 100 && "0"}
              {pokedata.id < 10 && "0"}
              {pokedata.id}
            </div>
            <p>{pokedata.name.toUpperCase()}</p>
          </div>
          <div className="type-container">
            {pokedata.types.map((t, i) => (
              <div
                key={i}
                className="type"
                style={{ backgroundColor: colours[t.type.name] }}
              >
                {t.type.name}
              </div>
            ))}
          </div>
          <div className="stats-container">
            <div className="stats">
              <div>HT</div>
              <div>{pokedata.height / 10} m</div>
            </div>
            <div className="stats">
              <div>WT</div>
              <div>{pokedata.weight / 10} kg</div>
            </div>
          </div>
        </div>
      </div>
      <div className="description-container">
        <div className="description-text">{currDescription}</div>
        <div className="description-origin">
          {descriptions[currDescription].map((game, i) => {
            return <div key={i}>{game}</div>;
          })}
        </div>
        <div className="description-buttons">
          <div>
            <button onClick={() => setter(null)}>X</button>
          </div>
          <div>
            <button
              onClick={() => {
                const texts = Object.keys(descriptions);
                const newIndex =
                  (descriptionIndex + texts.length - 1) % texts.length;
                const text = texts[newIndex];
                setCurrDescription(text);
                setDescriptionIndex(newIndex);
              }}
            >
              {"<"}
            </button>
            <button
              onClick={() => {
                const texts = Object.keys(descriptions);
                const newIndex = (descriptionIndex + 1) % texts.length;
                const text = texts[newIndex];
                setCurrDescription(text);
                setDescriptionIndex(newIndex);
              }}
            >
              {">"}
            </button>
          </div>
        </div>
      </div>
    </div>
  ) : (
    <div className="entry-container">
      <div className="loading">
        cargando pokemon...
        <img src={POKEBALL_SPRITE_URL} className="rotating-pokeball" />
      </div>
    </div>
  );
}
export default PokedexEntry;
