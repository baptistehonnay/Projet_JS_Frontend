import Phaser from "phaser";
import GameScene from "./GameScene.js";
import {getUserPreferences} from "../OptionsPage.js";
import { RedirectUrl } from "../Router.js";


const hideExternalElements = () => {
  let navbar = document.querySelector("#navbar");
  let footer = document.querySelector("#footer");
  navbar.className += " d-none";
  footer.className += " d-none";
}

var beatmapID;

const GamePage = async (data) => {
  beatmapID = data;
  if(!beatmapID) {
    RedirectUrl("/list");
    return;
  }
  hideExternalElements();
  let phaserGame = `
  <div id="divAudio"></div>
  <div id="gameDiv" class="d-flex justify-content-center my-0">
    <!-- Modal -->
    <div class="modal fade" id="gameModal" data-backdrop="static">
      <div class="modal-dialog">
          <div class="modal-content">
            <div class="modal-header"> </div>
            <div class="modal-body">
              <div id="contentGameModal" class="row text-center"></div>
            </div>
            <div class="modal-footer"> </div>
          </div>
      </div>
    </div>
  <div>
  <div class="alert alert-danger mt-2 d-none" id="messageBoard"></div><span id="errorMessage"></span>`;

  let page = document.querySelector("#page");
  page.innerHTML = phaserGame;
  let divAudio = document.querySelector("#divAudio");

  let userPreferences = getUserPreferences();

  let config = {
    type: Phaser.AUTO,
    height: window.innerHeight,
    width: window.innerWidth,
    backgroundColor: '#eeeeee',
    scene: [GameScene],
    //  parent DOM element into which the canvas created by the renderer will be injected.
    parent: "gameDiv",
  };
  let ret = await fetch("/api/beatmaps/"+beatmapID)
  .then((response) => {
    if (!response.ok) throw new Error("Error code : " + response.status + " : " + response.statusText);
    return response.json();
  })
  .then((data) => {
    divAudio.innerHTML = `<audio id="audio" crossOrigin="anonymous" src="${data.musicData}"/>`;
    let audioElement = document.querySelector("#audio");
    let volumeBgm = userPreferences.volume.master * userPreferences.volume.bgm;
    audioElement.volume = volumeBgm;

    let scene = new GameScene(data.noteList, audioElement, userPreferences, data.musicDuration, beatmapID);
    
    let config = {
      type: Phaser.AUTO,
      height: window.innerHeight,
      width: window.innerWidth,
      backgroundColor: '#eeeeee',
      scene: [scene],
      parent: "gameDiv",
    };
    let game = new Phaser.Game(config);
    //game.noteList = data.noteList;
    //game.musicData = data.musicData;
    return game;
  })
  .catch((err) => onError(err));
  return ret;
};

const onError = (err) => {
  let messageBoard = document.querySelector("#messageBoard");
  let errorMessage = err.message;
  messageBoard.innerText = errorMessage;
  // show the messageBoard div (add relevant Bootstrap class)
  messageBoard.classList.add("d-block");  
};

export default GamePage;
