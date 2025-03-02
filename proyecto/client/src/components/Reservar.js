import React from 'react';
import { renderToStaticMarkup } from "react-dom/server"
import search from '../imgs/search.png'
import checkM from '../imgs/checkmark.png'
import xMark from '../imgs/x-mark.png'
import '../styles/Reservar.css';

var availableSpaceIDs = [5,4,3,2,1]

function space(sID, name, capacity, price, description) {
  return (
    <div className='space'>
      <div className='space-name'>
        <h3>{name}</h3>
      </div>
      <div className='space-info'>
        <div className='data'>
        <label>
          Capacidad:
        </label>
          <p>{capacity}</p>
        </div>
        <div className='data'>
        <label>
          Precio:
        </label>
          <p>{price}</p>
        </div>
      </div>
      <div className='space-desc'>
        {
          Boolean(description) &&
          <div className='data'>
            <label>
              Descripción:
            </label>
              <p>{description}</p>
            </div>
        }
        </div>
        <div className='btns'>
          <button className='accept' type='button'>
            <img src={checkM}/>
          </button>
          <button className='reject' type='button'>
            <img src={xMark}/>
          </button>
        </div>
    </div>
  );
}

var spaces = undefined;

function removeSpace (id) {
  let rmSpace = document.getElementById(id);
  rmSpace.classList.add("remove");
  rmSpace.addEventListener("animationend",(e)=>{ if(e.animationName === "shrink") rmSpace.remove() });
}

function spacesOnLoad(event) {
  if (!spaces) {
    spaces = document.getElementById("spaces");
    loadSpaces();
  }
}

function loadSpaces() {
  if (spaces.hasChildNodes()) {
    console.log(spaces.firstChild)
    while (spaces.firstChild) {
      spaces.removeChild(spaces.lastChild);
    }
  }
  
  let newSpace = ()=>{
    let sID = `space-${availableSpaceIDs.pop()}`;
    const newElement = document.createElement("div");
    newElement.id = sID;
    newElement.className = "space-wrapper";
    newElement.innerHTML += renderToStaticMarkup(space(sID,"Test name 2", 10, 150, "no desc"))
    newElement.querySelector(".reject").addEventListener("click",(e) =>{removeSpace(sID);})
    spaces.appendChild(newElement)};
  for (let i=0;i<5;i++) {
    setTimeout(newSpace, 250*i)
  }
}

const Reservar = () => {
  return (
    <div className="reservar">
      <div className='nav-bar'>
        <div>info</div>
        <div className='search-div'>
          <input type='search' placeholder='Tipo (Aula)'></input>
          <button type='button'>
            <img src={search} alt="Logo" onLoad={spacesOnLoad}/>
          </button>
        </div>
        <div>user</div>
      </div>
      <div className='page-body'>
        <div className='filters'>
          <h2>Filtros</h2>
          <label>Fecha</label>
          <input type='date' className='i-date'></input>
          <input type='date' className='i-date'></input>
          <label>Hora</label>
          <input type='time' className='i-date'></input>
          <input type='time' className='i-date'></input>
          <label>Capacidad mínima</label>
          <input type='number' className='i-date'></input>
          <label>Precio</label>
          <ul>
            <li><input type="checkbox"/> 0$ a 20$</li>
            <li><input type="checkbox"/> 20$ a 50$</li>
            <li><input type="checkbox"/> 50$ a 100$</li>
            <li><input type="checkbox"/> mayor a 100$</li>
          </ul>
        </div>
        <div id='spaces'>
        </div>
      </div>
      <div className='footer'>
          <p>Icons by <a href='https://icons8.com' target='_blank'>Icons 8</a></p>
      </div>
    </div>
  );
};

export default Reservar;
