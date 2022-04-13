import React from "react";
import { fetchPokedex, Pokedex } from "./pokedex";
import Guess from "./Guess.component";

const App: React.FC = () => {
  const [pokedex, setPokedex] = React.useState<Pokedex>({});

  React.useEffect(() => {
    async function fetchData(): Promise<void> {
      const pokedex = await fetchPokedex();
      console.log(pokedex);
      setPokedex(pokedex);
    }
    fetchData();
  }, []);

  return (
    <div className="App">
      <Guess pokedex={pokedex} />
    </div>
  );
};

export default App;
