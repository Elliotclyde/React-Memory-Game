import React, { useState, useRef } from "react";

import "./App.css";

function Card({ handleClick, extraClass }) {
  return (
    <div className={"card bounce " + extraClass} onClick={handleClick}></div>
  );
}

function Titlebar({ haswon, restart }) {
  if (haswon) {
    return (
      <div className="header">
        <h1 className="title">Yay you won!</h1>
        <button className="restart" onClick={() => restart()}>
          Play again?
        </button>
      </div>
    );
  } else {
    return <h1 className="title">A Parks and Recreation memory game</h1>;
  }
}
function Match({didMatch}) {
  if(didMatch){
  return (
    <div className="match">
      <div className="match-message">Match!</div>
    </div>
  )}else{return(<div></div>)}
}

function Board(props) {
  console.log(props);
  return (
    <div className="board">
      <Match didMatch={props.match}/>
      <Titlebar haswon={props.found.length === 6} restart={props.restart} />
      <div className="line">
        {Array(4)
          .fill(null)
          .map((n, i) => (
            <Card
              handleClick={e => props.handleClick(i)}
              extraClass={
                props.selected.includes(i) ||
                props.found.includes(props.characters[i])
                  ? props.characters[i] + " back"
                  : "front"
              }
              key={i}
            />
          ))}
      </div>

      <div className="line">
        {Array(4)
          .fill(null)
          .map(function(n, i) {
            const newI = i + 4;
            return (
              <Card
                handleClick={e => props.handleClick(newI)}
                extraClass={
                  props.selected.includes(newI) ||
                  props.found.includes(props.characters[newI])
                    ? props.characters[newI] + " back"
                    : "front"
                }
                key={newI}
              />
            );
          })}
      </div>
      <div className="line">
        {Array(4)
          .fill(null)
          .map(function(n, i) {
            const newI = i + 8;
            return (
              <Card
                handleClick={e => props.handleClick(newI)}
                extraClass={
                  props.selected.includes(newI) ||
                  props.found.includes(props.characters[newI])
                    ? props.characters[newI] + " back"
                    : "front"
                }
                key={newI}
              />
            );
          })}
      </div>
    </div>
  );
}

function Game() {
  const [state, setState] = useState({
    status: "idle",
    selected: [-1, -1],
    imageSelected: null,
    found: [],
    characters: getCharacterArray(),
    match:false
  });
  const stateRef = useRef(state);
  stateRef.current = state;
  function restart() {
    setState({
      status: "idle",
      selected: [-1, -1],
      imageSelected: null,
      found: [],
      characters: getCharacterArray(),
      match:false
    });
  }
  function handleClick(i) {
    switch (state.status) {
      case "idle":
        setState({
          status: "oneclicked",
          selected: [i, state.selected[1]],
          imageSelected: state.characters[i],
          found: state.found,
          characters: state.characters,
          match:false
        });
        break;
      case "oneclicked":
        if (state.selected[0] !== i) {
          let foundArray;
          let currentMatch=false;
          if (
            state.characters[i] === state.imageSelected &&
            !state.found.includes(state.characters[i])
          ) {
            foundArray = state.found.concat([state.characters[i]]);
            currentMatch=true;
          } else {
            foundArray = state.found;
          }
          setState({
            status: "twoclicked",
            selected: [state.selected[0], i],
            imageSelected: state.characters[i],
            found: foundArray,
            characters: state.characters,
            match:currentMatch
          });

          setTimeout(() => {
            setState({
              found: stateRef.current.found,
              status: "idle",
              selected: [-1, -1],
              imageSelected: null,
              characters: state.characters,
              match:stateRef.current.match
            });
          }, 500);
        }
        break;
      case "twoclicked":
        break;
      default:
        return;
    }
  }
  return (
    <div className="game">
      <Board
        characters={state.characters}
        restart={restart}
        handleClick={handleClick}
        {...state}
      />
    </div>
  );
}

function getCharacterArray() {
  const ordered = [
    "leslie",
    "leslie",
    "ron",
    "ron",
    "april",
    "april",
    "donna",
    "donna",
    "anne",
    "anne",
    "tom",
    "tom"
  ];
  const shuffled = ordered.sort(() => Math.random() - 0.5);
  return shuffled;
}

function Music() {
  const [state, setState] = useState("showing");
  const audio = new Audio("audio/song.mp3");
  const currentAudio = useRef(audio);
  function toggleHidden() {
    state === "showing" ? setState("hidden") : setState("showing");
  }
  audio.loop = true;
  return (
    <div className={"music-controller " + state}>
      <button
        className={"music-button start " + state}
        onClick={() => currentAudio.current.play()}
      >
        Start music
      </button>
      <button
        className={"music-button " + state}
        onClick={() => currentAudio.current.pause()}
      >
        Stop music
      </button>
      <button
        className={"music-hide-show " + state}
        onClick={() => toggleHidden()}
      >
        {state === "showing" ? "Hide music options" : "Show music options"}
      </button>
    </div>
  );
}

function App() {
  return (
    <div className="App">
      <React.Fragment>
        <Game />
        <Music />
      </React.Fragment>
    </div>
  );
}
export default App;
