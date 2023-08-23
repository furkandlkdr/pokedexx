let pokemons = [];
const POKE_CONT = document.getElementById('poke_cont')
const URL = 'https://pokeapi.co/api/v2/pokemon'
const POKEMONS_NUMBER = 151
const search = document.getElementById("search")
const form = document.getElementById("form")

function clickEvent(type){
    type = type.toString().toLowerCase();
    getPokemonByType(type);
    console.log(type);
}

const fetchPokemons = async() => {
    for (let count = 1; count <= POKEMONS_NUMBER; count++){
        await getAllPokemons(count);
    }
    pokemons.forEach(pokemon => createPokemonCart(pokemon))
};

const removePokemon = () => {
    const pokemonEls = document.getElementsByClassName('pokemon');
    let removablePokemon = [];
    for (let count = 0; count < pokemonEls.length; count++){
        const pokemonEl = pokemonEls[count]
        removablePokemon = [...removablePokemon, pokemonEl]
    }
    removablePokemon.forEach(remPoke => remPoke.remove())
}

const getPokemonByType = async(type) => {
    type = type.toLowerCase()
    //const pokeTypes = pokemon.types.map((el) => el.type.name).slice(0, 1);
    const searchPokemons = pokemons.filter((poke) => poke.types[0].type.name=== type);
    console.log(searchPokemons)
    removePokemon();
    searchPokemons.forEach((pokemon) => createPokemonCart(pokemon))
}

const getPokemon = async(id) => {
    const searchPokemons = pokemons.filter((poke) => poke.name.startsWith(id))
    removePokemon();
    searchPokemons.forEach((pokemon) => createPokemonCart(pokemon));
}

const getAllPokemons = async(id) => {
    const res = await fetch(`${URL}/${id}`);
    const pokemon = await res.json();
    pokemons = [...pokemons, pokemon]
};
fetchPokemons();

function emoji_types(type){
    type = type.toString().toLowerCase();
    switch (type) {
        case "normal":
            return "⚫︎";
        case "fire":
            return "&#128293;";
        case "water":
            return "&#128167;";
        case "grass":
            return "&#127793;";
        case "flying":
            return "🕊️";
        case "fighting":
            return "&#129354;";
        case "poison":
            return "&#9762;";
        case "electric":
            return "&#9889;";
        case "ground":
            return "&#128507;";
        case "rock":
            return "&#128511;";
        case "psychic":
            return "&#128302;";
        case "ice":
            return "&#10052;";
        case "bug":
            return "🐞";
        case "ghost":
            return "👻";
        case "dragon":
            return "&#128009;";
        case "dark":
            return "🌙";
        case "fairy":
            return "&#10024;";
    }
};

function ftReset(event){
    pokemons = [];
    removePokemon();
    fetchPokemons();
}

function createPokemonCart(pokemon){
    const pokemonEl = document.createElement("div");
    pokemonEl.classList.add("pokemon");
    
    let poke_types = pokemon.types.map((el) => el.type.name).slice(0, 1);
    poke_types = poke_types.map(el => emoji_types(el));
    const name = pokemon.name[0].toUpperCase() + pokemon.name.slice(1);
    const poke_stat = pokemon.stats.map((el) => el.stat.name)
    const stats = pokemon.stats.slice(0,3);
    const base_value = pokemon.stats.map((el) => el.base_stat);
    const base_stat = base_value.slice(0, 3);
    const stat = stats.map((s) => {
        // {"base_stat":45,"effort":0,"stat":{"name":"hp","url":"https://pokeapi.co/api/v2/stat/1/"}}
        const { base_stat , stat } = s
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
        <small class="type"><span>${poke_types}</span></small>
    </div>
    <div class="stats">
        <h2>Stats</h2>
            <div class="flex">
                <ul>${stat}</ul>
                <ul>${base}</ul>
            </div>
    </div>`;
    pokemonEl.innerHTML = pokeInnerHTML;
    POKE_CONT.appendChild(pokemonEl);
}

form.addEventListener("submit", e =>{
    e.preventDefault();
    const searchTerm = search.value.toLowerCase();
    if (searchTerm) {
        getPokemon(searchTerm);
        search.value = "";
    }else if (searchTerm === ""){
        pokemons = [];
        removePokemon();
        fetchPokemons();
    }
});