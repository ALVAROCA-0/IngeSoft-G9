import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getUser, updateCookie } from "../../shared_funcs/cookies";
import '../../styles/misEspacios.css';

var userInfo = undefined;

function MisEspacios() {
    async function LoadSpaces() {
        var failed = false;
        const spaces = await fetch(`/spaces/${userInfo.id}`, { method: 'GET' })
        .then((res) => {
            if (res.ok) {
                return res.json();
            } else {
                failed = true;
                return {};
            }
        })
        .then((obj) => {
            return obj.spaces;
        })
        .catch((e)=> { failed = true });
        if (failed) {
            return;
        }
        if (spaces.length > 0) {
            setEmpty(false);
            const elems = spaces.map((space) => (
                <div className="container space" key={space.id}>
                    <h2>{space.name}</h2>
                    <div>
                        <p><strong>Capacidad: </strong>{space.capacity}</p>
                        <p><strong>Ubicación: </strong>{space.location}</p>
                        <p><strong>type: </strong>{space.type}</p>
                        <p className="desc">{space.description?space.description:"Sin descripción"}</p>
                    </div>
                    <button type="submit" onClick={NavHndlFactory(`/mis_espacios/${space.id}`)}>Editar</button>
                </div>
            ));
            setSpacesElems(elems);
        }
    }
    var [empty, setEmpty] = useState(true);
    var [spacesElems, setSpacesElems] = useState([]);
    const navigate = useNavigate();
    userInfo = getUser();
    useEffect(()=> {
        if (!userInfo) {
            navigate('/');
            return;
        }
        if (!['admin','arrendador'].includes(userInfo.rol)) {
            updateCookie('user', '/', 30);
            navigate('/pantalla_principal');
            return;
        }
        LoadSpaces();
    }, []);
    const NavHndlFactory = (to) => {
        return (() => {
            if (to !== "/") {
                updateCookie('user','/',30);
            }
            navigate(to);
        });
    }
    return (
        <div className="container" id="mis-espacios" style={{width:empty?"80vw":"fit-content"}}>
                <h1>Mis espacios</h1>
                <hr/>
                {
                    empty && <div>
                        <h3>Parece que esta vacio...</h3>
                        <button
                        onClick={NavHndlFactory('/crear_espacio')}
                        type="submit"
                        style={{width:"40%"}}
                        >Crea tu propio espacio!</button>
                    </div>
                }
                <div id="spaces">
                    {
                        spacesElems
                    }
                </div>
            <button className="btn-volver" onClick={NavHndlFactory("/pantalla_principal")}>volver</button>
        </div>
    );
}

export default MisEspacios;