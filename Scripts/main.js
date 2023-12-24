const pokemons = [];
const POKE_CONT = document.getElementById('poke_cont')
const URL = 'https://pokeapi.co/api/v2/pokemon';
const POKEMONS_NUMBER = 151;
const search = document.getElementById("search");
const form = document.getElementById("form");
const BUTTON_DIV = document.getElementById("buttonDiv");
const buttons = BUTTON_DIV.querySelectorAll("button");
const localData = JSON.parse(localStorage.getItem("pokemons")) ? JSON.parse(localStorage.getItem("pokemons")) : null;
//Button click event
function clickEvent(event) {
    if (event.id != "buttonDiv") {
        buttons.forEach((button) => {
            button.classList.remove("selected-type");
        });
        event.classList.add("selected-type");
        
        const type = event.id.toString().toLowerCase();
        getPokemonByType(type);        
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
            createPokemonCart(pokemon);
        } else {
            const res = await fetch(`${URL}/${pokeId}`);
            const response = await res.json();
            const { id, name, types, stats } = response;
            const pokemon = {
                id,
                name,
                types,
                stats,
            };
            pokemons.push(pokemon);
            createPokemonCart(pokemon);
        }
    }
    if (pokemons.length === POKEMONS_NUMBER) localStorage.setItem("pokemons", JSON.stringify(pokemons))
    // pokemons.forEach(element => {
    //     createPokemonCart(element)
    // });
}
//Search by type
const getPokemonByType = async (type) => {
    const searchPokemons = pokemons.filter((poke) => {
        return poke.types.length > 1 ? poke.types[0].type.name === type || poke.types[1].type.name === type : poke.types[0].type.name === type;
    });
    POKE_CONT.innerHTML = "";
    searchPokemons.forEach((pokemon) => {
        const pokemonEl = document.createElement("div");
        pokemonEl.setAttribute("id", `poke-${pokemon.id}`);
        POKE_CONT.appendChild(pokemonEl);
        createPokemonCart(pokemon);
    });
}
//Search by name 
const getPokemon = async (name) => {
    const searchPokemons = pokemons.filter((poke) => poke.name.startsWith(name));
    POKE_CONT.innerHTML = "";
    searchPokemons.forEach((pokemon) => {
        const pokemonEl = document.createElement("div");
        pokemonEl.setAttribute("id", `poke-${pokemon.id}`);
        POKE_CONT.appendChild(pokemonEl);
        createPokemonCart(pokemon);
    });
    if (searchPokemons.length === 0) return 0;
    return 1;
}
fetchPokemons();
//Convert type string to emoji
function emoji_types(type) {
    type = type.toString().toLowerCase();
    const types = {
        normal: "⚪",
        fire: "🔥",
        water: "💧",
        grass: "☘️",
        flying: "🕊️",
        fighting: "🥊",
        poison: "☢️",
        electric: "⚡",
        ground: "🗻",
        rock: "🪨",
        psychic: "🪄",
        ice: "🧊",
        bug: "🐞",
        ghost: "👻",
        dragon: "🐉",
        dark: "🌙",
        fairy: "✨",
    };
    return types[type] || "";
};
function cartColoring(type){
    const types = {
        normal: "#75515B",
        fire: "#AB1F23",
        water: "#1552E2",
        grass: "#147B3D",
        flying: "#1C4B27",
        fighting: "#994025",
        poison: "#5E2D88",
        electric: "#E3E32B",
        ground: "#A9702C",
        rock: "#48180B",
        psychic: "#A42A6C",
        ice: "#87D1F5",
        bug: "#1C4B27",
        ghost: "#33336B",
        dragon: "#448B95",
        dark: "#040706",
        fairy: "#971944"
    };
    return types[type[0]] || "";
}
//Create given id's pokemon
function createPokemonCart(pokemon) {
    const pokemonEl = document.querySelector("#poke-" + pokemon.id);
    pokemonEl.classList.add("pokemon");

    let poke_types = pokemon.types.map((el) => el.type.name).slice(0, 2);
    pokemonEl.style.borderTop = `8px solid ${cartColoring(poke_types)}`;
    pokemonEl.style.borderBottom  = `8px solid ${cartColoring(poke_types)}`;
    poke_types = poke_types.map(el => emoji_types(el));

    const name = pokemon.name[0].toUpperCase() + pokemon.name.slice(1);
    const stats = pokemon.stats.slice(0, 3);
    const base_value = pokemon.stats.map((el) => el.base_stat);
    const base_stat = base_value.slice(0, 3);

    const stat = stats.map((s) => {
        // {"base_stat": 45, "effort": 0, "stat": { "name": "hp","url": "https://pokeapi.co/api/v2/stat/1/"}}
        return `<li class="names">${s.stat.name}: ${s.base_stat}</li>`;
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
        <small class="type"><span>${poke_types.join(" ")}</span></small>
    </div>
    <div class="stats">
        <h2>Stats</h2>
            <div class="flex">
                <ul>${stat}</ul>
            </div>
    </div>`;
    pokemonEl.innerHTML = pokeInnerHTML;
}
//When reset button is clicked we need to wipe the page and reflesh
const ftReset = async (event) => {
    POKE_CONT.innerHTML = "";
    buttons.forEach((button) => {
        button.classList.remove("selected-type");
    });
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
    const searchTerm = search.value.toLowerCase().trim();
    if (searchTerm) {
        const hasPokemon = getPokemon(searchTerm).result;
        search.value = "";
        console.log(hasPokemon)
        if (!hasPokemon) {
            POKE_CONT.innerHTML = "";
            const warningEl = document.createElement("div");
            warningEl.classList.add("warning");
            warningEl.setAttribute("id", "!!!");
            POKE_CONT.appendChild(warningEl);
            warningEl.innerHTML = `<h1>There is no pokemon like "${searchTerm}"!</h1>`;
        }
    } else if (searchTerm === "") {
        POKE_CONT.innerHTML = "";
        pokemons.forEach((pokemon) => {
            const pokemonEl = document.createElement("div");
            pokemonEl.setAttribute("id", `poke-${pokemon.id}`);
            POKE_CONT.appendChild(pokemonEl);
            createPokemonCart(pokemon);
        });
    } 
    buttons.forEach((button) => {
        button.classList.remove("selected-type");
    });
});