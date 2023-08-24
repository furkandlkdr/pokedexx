const pokemons = [];
const POKE_CONT = document.getElementById('poke_cont')
const URL = 'https://pokeapi.co/api/v2/pokemon';
const POKEMONS_NUMBER = 151;
const search = document.getElementById("search");
const form = document.getElementById("form");
const localData = JSON.parse(localStorage.getItem("pokemons"));
//Button click event
function clickEvent(type) {
    if (type != "buttonDiv") {
        type = type.toString().toLowerCase();
        getPokemonByType(type);
        console.log(type);
    }
}
//Fetch from api or fetch from localData
async function fetchPokemons() {
    for (let count = 1; count <= POKEMONS_NUMBER; count++) {
        const pokemonEl = document.createElement("div");
        pokemonEl.setAttribute("id", `poke-${count}`);
        POKE_CONT.appendChild(pokemonEl);

        const pokeId = count;
        const local = localData?.find((p) => p.id === pokeId);
        if (local) {
            const pokemon = {
                id: pokeId,
                name: local.name,
                types: local.types,
                stats: local.stats,
            };
            pokemons.push(pokemon);
        } else {
            const res = await fetch(`${URL}/${pokeId}`);
            const { id, name, types, stats } = await res.json();
            const pokemon = {
                id,
                name,
                types,
                stats,
            };
            pokemons.push(pokemon);
        }
    }
    if (pokemons.length === POKEMONS_NUMBER) localStorage.setItem("pokemons", JSON.stringify(pokemons))
    pokemons.forEach(element => {
        createPokemonCart(element)
    });
}
//Search by type
const getPokemonByType = async (type) => {
    const searchPokemons = pokemons.filter((poke) => poke.types[0].type.name === type);

    console.log(searchPokemons)
    POKE_CONT.innerHTML = "";
    searchPokemons.forEach((pokemon) => {
        const pokemonEl = document.createElement("div");
        pokemonEl.setAttribute("id", `poke-${pokemon.id}`);
        POKE_CONT.appendChild(pokemonEl);
        createPokemonCart(pokemon);
    });
}
//Search by name 
const getPokemon = async (id) => {
    const searchPokemons = pokemons.filter((poke) => poke.name.startsWith(id))
    POKE_CONT.innerHTML = "";
    console.log(searchPokemons)
    searchPokemons.forEach((pokemon) => {
        const pokemonEl = document.createElement("div");
        pokemonEl.setAttribute("id", `poke-${pokemon.id}`);
        POKE_CONT.appendChild(pokemonEl);
        createPokemonCart(pokemon);
    });
}
fetchPokemons();
//Convert type string to emoji
function emoji_types(type) {
    type = type.toString().toLowerCase();
    const types = {
        normal: "⚫︎",
        fire: "&#128293;",
        water: "&#128167;",
        grass: "&#127793;",
        flying: "🕊️",
        fighting: "&#129354;",
        poison: "&#9762;",
        electric: "&#9889;",
        ground: "&#128507;",
        rock: "&#128511;",
        psychic: "&#128302;",
        ice: "&#10052;",
        bug: "🐞",
        ghost: "👻",
        dragon: "&#128009;",
        dark: "🌙",
        fairy: "&#10024;"
    };
    return types[type] || "";
};
//Create given id's pokemon
function createPokemonCart(pokemon) {
    const pokemonEl = document.querySelector("#poke-" + pokemon.id)
    pokemonEl.classList.add("pokemon");

    let poke_types = pokemon.types.map((el) => el.type.name).slice(0, 1);
    poke_types = poke_types.map(el => emoji_types(el));

    const name = pokemon.name[0].toUpperCase() + pokemon.name.slice(1);
    const stats = pokemon.stats.slice(0, 3);

    const base_value = pokemon.stats.map((el) => el.base_stat);
    const base_stat = base_value.slice(0, 3);
    const stat = stats.map((s) => {
        // {"base_stat":45,"effort":0,"stat":{"name":"hp","url":"https://pokeapi.co/api/v2/stat/1/"}}
        const { base_stat, stat } = s
        const { name } = stat // {"name":"hp","url":"https://pokeapi.co/api/v2/stat/1/"}
        return `<li class="names">${name}: ${base_stat}</li>`;
    }).join("");
    const base = base_stat.map((base) => {
        return `<li class="base>${base}</li>`
    }).join("");
    const pokeInnerHTML = `<div class="img-container">
        <img src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/home/${pokemon.id}.png"
        alt="${name}"/>
    </div>
    <div class="info">
        <span class="number">#${pokemon.id.toString().padStart(3, "0")}</span>
        <h3 class="name">${name}</h3>
        <small class="type"><span>(${poke_types})</span></small>
    </div>
    <div class="stats">
        <h2>Stats</h2>
            <div class="flex">
                <ul>${stat}</ul>
                <ul>${base}</ul>
            </div>
    </div>`;
    pokemonEl.innerHTML = pokeInnerHTML;
}
//When reset button is clicked we need to wipe the page and reflesh
const ftReset = async (event) => {
    POKE_CONT.innerHTML = "";
    pokemons.forEach((pokemon) => {
        const pokemonEl = document.createElement("div");
        pokemonEl.setAttribute("id", `poke-${pokemon.id}`);
        POKE_CONT.appendChild(pokemonEl);
        createPokemonCart(pokemon);
    });
}
//When form submits, we need to search for name
form.addEventListener("submit", event => {
    event.preventDefault();
    const searchTerm = search.value.toLowerCase();
    if (searchTerm) {
        getPokemon(searchTerm);
        search.value = "";
    } else if (searchTerm === "") {
        POKE_CONT.innerHTML = "";
        pokemons.forEach((pokemon) => {
            const pokemonEl = document.createElement("div");
            pokemonEl.setAttribute("id", `poke-${pokemon.id}`);
            POKE_CONT.appendChild(pokemonEl);
            createPokemonCart(pokemon);
        });
    }
});