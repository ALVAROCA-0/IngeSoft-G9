import { useNavigate, useParams } from "react-router-dom";
import { getUser, updateCookie } from "../../shared_funcs/cookies";
import '../../styles/editarEspacio.css';
import { useEffect } from "react";

function EditarEspacio() {
    const spaceID = useParams().id;
    const navigate = useNavigate();
    const userData = getUser();

    const NavHndlFactory = (to) => {
        return (() => {
            if (to !== "/") {
                updateCookie('user','/',30);
            }
            navigate(to);
        });
    }
    var back = NavHndlFactory("/mis_espacios");
    let spaceInfo = undefined;
    
    async function editarEspacio(event) {
        event.preventDefault();
        if (!window.confirm(`¿Esta seguro(a) que desea editar "${spaceInfo.name}"?`)) return;
        
        const obligatory = ['name', 'capacity', 'location', 'type'];
        let formData = {};
        for (var [key, value] of new FormData(document.getElementById('form')).entries()) {
            if (obligatory.includes(key) && !value) {
                console.error(`The obligatory field ${key} is empty ${typeof value}`);
                return;
            } 
            formData[key] = value;
        }

        try {
            formData.capacity = Number(formData.capacity);
        } catch (err) {
            console.log('Capacity must be a number');
            return;
        }

        formData.owner_id = userData.id

        var status = await fetch(`/spaces/${spaceID}/update`, {
            method:"PATCH",
            headers:{
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData)
        }).then((res)=> {
            return res.status;
        }).catch((e)=> {
            return 500;
        });

        if (status === 200) {
            alert(`El espacio ${spaceInfo.name} ha sido modificado correctamente!`);
            back();
        } else if (status === 400) {
            alert("Ingrese de nuevo");
            updateCookie("user","/",-1);
            navigate("/");
        } else if (status === 404) {
            alert("Este espacio no existe");
            back();
        } else if (status === 403) {
            alert("Este espacio no es su propiedad");
            back();
        } else if (status === 500) {
            alert("Ocurrio un fallo durante la modificación del espacio");
        }
    }
    
    async function eliminarEspacio() {
        if (!window.confirm(`¿Esta seguro(a) que desea eliminar "${spaceInfo.name}"?`)) return;
        var status = await fetch(`/spaces/${spaceID}/remove`, {
            method:"DELETE",
            headers:{
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ owner_id:userData.id })
        }).then((res)=> {
            return res.status;
        }).catch((e)=> {
            return 500;
        });
        if (status === 204) {
            alert("Espacio eliminado correctamente!");
            back();
        } else if (status === 400) {
            alert("Ingrese de nuevo");
            updateCookie("user","/",-1);
            navigate("/");
        } else if (status === 404) {
            alert("Este espacio no existe");
            back();
        } else if (status === 403) {
            alert("Este espacio no es su propiedad");
            back();
        } else if (status === 500) {
            alert("Ocurrio un error al eliminar el espacio");
        }
    }

    useEffect( () => {
        (async () => {
            var failed = false;
            spaceInfo = await fetch(`/spaces/search/${spaceID}`,
                { method:"GET" }).then((res) => {
                    failed = !res.ok;
                    if (failed) {
                        return {};
                    }
                    return res.json();
                }).then((obj)=> {
                    return obj.data;
                }).catch((e)=>{
                    failed = true;
                });

            if (failed) {
                navigate('/mis_espacios')
            }
            for (const key in spaceInfo) {   
                var elem = document.getElementById(key);
                if (elem) {
                    elem.value = spaceInfo[key];
                }
            }
        })();
    });

    return (
        <div>
            <div className="container" id="editar-espacio">
                <h1>Editar Espacio</h1>
                <hr></hr>
                <form id="form" onSubmit={editarEspacio}>
                    <label>
                    <strong>Nombre:</strong>
                        <input id="name" type="string"/>
                    </label>
                    <label>
                        <strong>Capacidad:</strong>
                        <input id="capacity" type="number"/>
                    </label>
                    <label>
                        <strong>Ubicación:</strong>
                        <input id="location" type="string"/>
                    </label>
                    <label>
                        <strong>Tipo: </strong>
                    <select id="type">
                        <option value='conferencia'>Sala de conferencias</option>
                        <option value='reunion'>Sala de reuniones</option>
                        <option value="aula">Aula</option>
                        <option value="auditorio">Auditorio</option>
                        </select>
                    </label>
                    <div id="desc">
                    <label><strong>Descripción: </strong></label>
                    <textarea 
                        name='description'
                        id='description'
                        type='text' wrap='soft'
                        placeholder='Descripción'
                        onInput={ (e) => {
                            const elem = document.getElementById("description")
                            elem.style.height = '';
                            elem.style.height = 109 + elem.scrollHeight - 125 + 'px';
                        }}
                    />
                    </div>
                    <button id="del" type="button" onClick={()=>eliminarEspacio()}>Borrar espacio</button>
                    <button id="edit" type="submit">Confirmar cambios</button>
                </form>
            </div>
            <button
                className="btn-volver"
                onClick={back}
            >Volver</button>
        </div>
    );
}

export default EditarEspacio;