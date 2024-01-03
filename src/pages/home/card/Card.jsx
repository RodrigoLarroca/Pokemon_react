import React, { useEffect, useState } from "react";
import css from "./card.module.scss";
import axios from 'axios';
import { POKEMON_API_URL, SPECIES_API_URL, EVOLUTIONS_API_URL } from "../../../api/apiRest";

export default function Card({ card }) {

    const [itemPokemon, setItemPokemon] = useState({});
    const [especiePokemon, setEspeciePokemon] = useState({});
    const [evoluciones, setEvoluciones] = useState([]);

    useEffect(() => {
        const fetchDataPokemon = async () => {
            const api = await axios.get(`${POKEMON_API_URL}/${card.name}`);
            setItemPokemon(api.data);
        };
        fetchDataPokemon();
    }, [card]);

    useEffect(() => {
        const fetchDataEspecie = async () => {
            const URL = card.url.split("/");
            const api = await axios.get(`${SPECIES_API_URL}/${URL[6]}`);
            setEspeciePokemon({
                url_especie: api?.data?.evolution_chain,
                data: api?.data,
            });
        };
        fetchDataEspecie();
    }, [card]);

    useEffect(() => {
        async function getPokemonImage(id) {
            const response = await axios.get(`${POKEMON_API_URL}/${id}`);
            return response?.data?.sprites?.other["official-artwork"]?.front_default;
        }

        if (especiePokemon?.url_especie) {
            const fetchEvolutions = async () => {
                const arrayEvoluciones = [];
                const URL = especiePokemon?.url_especie?.url.split("/");
                const api = await axios.get(`${EVOLUTIONS_API_URL}/${URL[6]}`);
                const URL2 = api?.data?.chain?.species?.url?.split("/");
                const img1 = await getPokemonImage(URL2[6]);
                arrayEvoluciones.push({
                    img: img1,
                    name: api?.data?.chain?.species?.name,
                });

                if (api?.data?.chain?.evolves_to?.length !== 0) {
                    const DATA2 = api?.data?.chain?.evolves_to[0]?.species;
                    const ID = DATA2?.url?.split("/");
                    const img2 = await getPokemonImage(ID[6]);

                    arrayEvoluciones.push({
                        img: img2,
                        name: DATA2?.name,
                    });

                    if (api?.data?.chain.evolves_to[0].evolves_to.length !== 0) {
                        const DATA3 =
                            api?.data?.chain?.evolves_to[0]?.evolves_to[0]?.species;
                        const ID = DATA3?.url?.split("/");
                        const img3 = await getPokemonImage(ID[6]);

                        arrayEvoluciones.push({
                            img: img3,
                            name: DATA3?.name,
                        });
                    }
                }

                setEvoluciones(arrayEvoluciones);
            };

            fetchEvolutions();
        }
    }, [especiePokemon]);

    let pokeId = itemPokemon?.id?.toString();
    if (pokeId?.length === 1) {
        pokeId = "00" + pokeId;
    } else if (pokeId?.length === 2) {
        pokeId = "0" + pokeId;
    }

    return (
        <div className={css.card}>
            <img className={css.img_poke} src={itemPokemon?.sprites?.other["official-artwork"]?.front_default} alt="pokemon" />
            <div className={`bg-${especiePokemon?.data?.color?.name} ${css.sub_card}`}>
                <strong className={css.id_card}>#{pokeId}</strong>
                <strong className={css.name_card}>{itemPokemon.name}</strong>
                <strong className={css.altura_peso_poke}>
                    {itemPokemon.height}0 Cm | {itemPokemon.weight} Kg | {especiePokemon?.data?.habitat?.name}
                </strong>

                <div className={css.div_stats}>
                    {itemPokemon?.stats?.map((sta, index) => {
                        return (
                            <h6 key={index} className={css.item_stats} >
                                <span className={css.name}> {sta.stat.name}</span>
                                <progress value={sta.base_stat} max={110}></progress>
                                <span className={css.numero} >{sta.base_stat}</span>
                            </h6>
                        );
                    })}
                </div>

                <div>
                    <h5 className={css.tipo_poke}> Tipo </h5>
                    <div className={css.div_type_color}>
                        {itemPokemon?.types?.map((ti, index) => {
                            return (
                                <h6 key={index} className={`color-${ti.type.name} ${css.color_type}`}>
                                    {ti.type.name.charAt(0).toUpperCase() + ti.type.name.slice(1)}
                                </h6>
                            );
                        })}
                    </div>
                </div>

                <div className={css.div_evolucion}>
                    {evoluciones.map((evo, index) => {
                        return (
                            <div key={index} className={css.item_evo}>
                                <img src={evo.img} alt="evo" className={css.img} />
                                <h6> {evo.name} </h6>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}
