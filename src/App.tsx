import React from "react";
import { fetchPokedex, Pokedex, PokedexEntry } from "./pokedex";
import Guess, { GuessType } from "./Guess.component";
import { Box, Button } from "@mui/material";

function mode(array: string[] | number[]): string | number {
  if (array.length === 0) return "";
  const modeMap: { [type: string | number]: number } = {};
  let maxEl = array[0],
    maxCount = 1;
  for (let i = 0; i < array.length; i++) {
    const el = array[i];
    if (!modeMap[el]) modeMap[el] = 1;
    else modeMap[el]++;
    if (modeMap[el] > maxCount) {
      maxEl = el;
      maxCount = modeMap[el];
    }
  }
  return maxEl || "None";
}

function median(numbers: number[]): number {
  const sorted = numbers.slice().sort((a, b) => a - b);
  const middle = Math.floor(sorted.length / 2);

  if (sorted.length % 2 === 0) {
    return (sorted[middle - 1] + sorted[middle]) / 2;
  }

  return sorted[middle];
}

const App: React.FC = () => {
  const [pokedex, setPokedex] = React.useState<Pokedex>({});
  const [guesses, setGuesses] = React.useState<GuessType[]>([
    {
      pokemon: "",
      gen: "unselected",
      type1: "unselected",
      type2: "unselected",
      height: "unselected",
      weight: "unselected",
    },
  ]);

  React.useEffect(() => {
    async function fetchData(): Promise<void> {
      const pokedex = await fetchPokedex();
      setPokedex(pokedex);
    }
    fetchData();
  }, []);

  const possibilities = Object.entries(pokedex).filter(
    ([pokemon, dexEntry]) => {
      return guesses.every((guess) => {
        // if no pokemon selected yet for a guess just skip
        if (!guess.pokemon) {
          return true;
        }
        const [guessGen, guessType1, guessType2, guessHeight, guessWeight] =
          pokedex[guess.pokemon];
        const [gen, type1, type2, height, weight] = dexEntry;
        if (
          !(
            (guess.gen === "correct" && gen === guessGen) ||
            (guess.gen === "lower" && gen < guessGen) ||
            (guess.gen === "higher" && gen > guessGen) ||
            guess.gen === "unselected"
          )
        ) {
          return false;
        }
        if (
          !(
            (guess.type1 === "correct" && type1 === guessType1) ||
            (guess.type1 === "swap" && type2 === guessType1) ||
            (guess.type1 === "wrong" && type1 !== guessType1) ||
            guess.type1 === "unselected"
          )
        ) {
          return false;
        }
        if (
          !(
            (guess.type2 === "correct" && type2 === guessType2) ||
            (guess.type2 === "swap" && type1 === guessType2) ||
            (guess.type2 === "wrong" && type2 !== guessType2) ||
            guess.type2 === "unselected"
          )
        ) {
          return false;
        }
        if (
          !(
            (guess.height === "correct" && height === guessHeight) ||
            (guess.height === "lower" && height < guessHeight) ||
            (guess.height === "higher" && height > guessHeight) ||
            guess.height === "unselected"
          )
        ) {
          return false;
        }
        if (
          !(
            (guess.weight === "correct" && weight === guessWeight) ||
            (guess.weight === "lower" && weight < guessWeight) ||
            (guess.weight === "higher" && weight > guessWeight) ||
            guess.weight === "unselected"
          )
        ) {
          return false;
        }
        return true;
      });
    }
  );

  const modeType1 = mode(
    possibilities.map(([string, pokedexEntry]) => pokedexEntry[1])
  );
  const modeType2 = mode(
    possibilities.map(([string, pokedexEntry]) => pokedexEntry[2])
  );
  const medianHeight = median(
    possibilities.map(([string, pokedexEntry]) => pokedexEntry[3])
  );
  const medianWeight = median(
    possibilities.map(([string, pokedexEntry]) => pokedexEntry[4])
  );

  return (
    <div className="App">
      <Box display="flex">
        <Box display="flex" flexDirection="column">
          {guesses.map((guess, index) => (
            <Guess
              key={index}
              pokedex={pokedex}
              guess={guess}
              onGuessChange={(guess) => {
                const newGuesses = guesses.slice();
                newGuesses[index] = guess;
                setGuesses(newGuesses);
              }}
            />
          ))}
          <Button
            onClick={() =>
              setGuesses([
                ...guesses,
                {
                  pokemon: "",
                  gen: "unselected",
                  type1: "unselected",
                  type2: "unselected",
                  height: "unselected",
                  weight: "unselected",
                },
              ])
            }
          >
            Add guess
          </Button>
        </Box>
        <Box display="flex" flexDirection="column">
          <div>Possibilities</div>
          {possibilities.map(([pokemon, dexEntry]) => {
            return (
              <div key={pokemon}>
                {pokemon}, {dexEntry[0]}, {dexEntry[1]}, {dexEntry[2] || "None"}
                , {dexEntry[3]}, {dexEntry[4]}
              </div>
            );
          })}
        </Box>
        <Box display="flex" flexDirection="column">
          <div>Suggestions</div>
          <div>Type 1</div>
          <div>Most common: {modeType1}</div>
          <div>Type 2</div>
          <div>Most common: {modeType2}</div>
          <div>Height</div>
          <div>Median: {medianHeight}</div>
          <div>Weight</div>
          <div>Median: {medianWeight}</div>
          <div>Suggested Guess</div>
          <div>Median: {medianWeight}</div>
        </Box>
      </Box>
    </div>
  );
};

export default App;
