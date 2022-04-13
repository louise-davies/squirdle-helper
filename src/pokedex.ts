// const pokedexUrl = "https://squirdle.fireblend.com/data/pokedex.json";
const pokedexUrl = "./pokedex.json";
// gen, type1, type2, height, weight
export type PokedexEntry = [number, string, string, number, number];
export type Pokedex = { [pokemon: string]: PokedexEntry };
let pokedex: Pokedex = {};

export const fetchPokedex = async (): Promise<Pokedex> => {
  if (Object.keys(pokedex).length === 0) {
    const response = await fetch(pokedexUrl);
    const data: Pokedex = await response.json();
    pokedex = data;
  }
  return pokedex;
};

fetchPokedex();
