import './style.css'
import { fetchData } from "./api";
import type { AllPokemonList } from "./pokemon-types";
import type { PokemonDetail } from "./pokemon-types";

const page_size = 20
let current_page = 1
let pokemonList: AllPokemonList = { results : []};
const detailCache = new Map<string, PokemonDetail>();
const next_button = document.getElementById('next') as HTMLButtonElement;
const prev_button = document.getElementById('prev') as HTMLButtonElement;
const container = document.getElementById('cards-container')!;
const pagenum = document.getElementById('page-number')!;


async function handleNext() {
  current_page += 1
  await loadPage()
}

async function handlePrev() {
  if (current_page > 1) {
    current_page -= 1
    await loadPage();
  }
}

async function getDescription(pokemonList: AllPokemonList): Promise<PokemonDetail[]> {
  const arr = await Promise.all(pokemonList.results.map(async (pokemon) =>
    {
      if (detailCache.has(pokemon.url)) {
        return detailCache.get(pokemon.url)!
      } else {
        const res = await fetchData<PokemonDetail>(pokemon.url)
        detailCache.set(pokemon.url, res);
        return res;
      }
    }
  ))
  return arr;
}

next_button.addEventListener("click", handleNext);
prev_button.addEventListener("click", handlePrev);

function playSound(details: PokemonDetail) {
  const audioUrl = details.cries.latest ?? details.cries.legacy;
  if (!audioUrl) {
    alert("No cry available for this Pokémon.");
    return;
  }
  const audio = new Audio(audioUrl);
  audio.play().catch(() => {
    console.log("Audio playback failed.");
  });
}

function renderPokemon(details: PokemonDetail[]) {
  container.innerHTML = "";
  for (const pokemon of details) {
    const card = document.createElement("div");
    card.className = "pokemon-card";

    const types = pokemon.types
      .map(t => t.type.name)
      .join(", ");

    const imageUrl =
      pokemon.sprites.other?.["official-artwork"]?.front_default ??
      pokemon.sprites.front_default ??
      "";

    card.innerHTML = `
      <h2>${pokemon.name}</h2>
      <img src="${imageUrl}" alt="${pokemon.name}" />
      <p>Height: ${pokemon.height}</p>
      <p>Weight: ${pokemon.weight}</p>
      <p>Types: ${types}</p>
    `;

    card.addEventListener("click", () => playSound(pokemon))

    container.appendChild(card);
  }
}


async function loadPage() {
  const offset = (current_page - 1) * page_size
  container.innerHTML = "<p>Loading...</p>";
  pagenum.textContent = `${current_page}`;

  try {
    pokemonList = await fetchData<AllPokemonList>(`https://pokeapi.co/api/v2/pokemon?limit=${page_size}&offset=${offset}`);
    const description = await getDescription(pokemonList);
    console.log(description);
    renderPokemon(description);
  } catch (error) {
    console.error(error);
    container.innerHTML = `
      <div class="error">
        <p>Failed to load pokemon cardzz.</p>
      </div>
    `;
  }
}

loadPage();
