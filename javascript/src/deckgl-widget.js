import "../styles/default.css";

import Viz from "./viz";
import {
  createControlGroups,
  createTooltip,
  addControl,
  addLegend,
  addInteractiveControl } from "./controls";
import {
  createDeckGLProperties,
  logVersions,
  fixLayerProperties,
  /*convertColor*/ } from "./utils";
import addJSONEditor from "./json-editor";

// import { parse, compile } from "expression-eval";

if (!global._deckWidget) {
  global._deckWidget = {
    addInteractiveControl,
    sources: [ ]
    /*
    , convertColor
    , parse
    , compile
    */
  };
}

function addSource({ id, data, convertData }) {
  const viz = this;
  if (convertData) data = HTMLWidgets.dataframeToD3(data);
  viz.addSource({ id, data });
}

function addLayer(layer) {
  const viz = this;
  if (layer.convertData) layer.data = HTMLWidgets.dataframeToD3(layer.data);
  viz.addLayer(layer);
}

function setViewState(viewState) {
  const viz = this;
  viz.deckGL.setProps({ initialViewState: viewState });
}

// TODO: Must be global, so that they can be extended by other libs
const funcs = {
  addLayer,
  addSource,
  addControl,
  addLegend,
  addJSONEditor,
  setViewState
};

export default function(widgetElement, width, height) {
  let deckGL = null;
  let viz = null;

  // Used to debug
  const globalStorage = _deckWidget[widgetElement.id] = { };

  function renderValue(widgetData) {
    widgetData.container = widgetElement.id;
    const sources = widgetData.sources || [ ];
    const layers = widgetData.layers || [ ];
    const calls = widgetData.calls || [ ];
    console.log(widgetData);
    logVersions();

    const deckGLProperties = createDeckGLProperties(widgetData);
    deckGL = new deck.DeckGL(deckGLProperties);
    createControlGroups(widgetElement);
    createTooltip(widgetElement);
    viz = globalStorage.viz = Viz({ deckGL, widgetElement });
    //sources.forEach(source => viz.addSource(source));
    sources.concat(_deckWidget.sources).forEach(source => viz.addSource(source));
    // viz.setLayers(layers);
    calls.forEach(({ funcName, args }) => funcs[funcName].call(viz, args));
    viz.render();
  }

  function resize(width, height) {
    // not implemented yet
  }

  if (HTMLWidgets.shinyMode) {
      Shiny.addCustomMessageHandler('proxythis--'+widgetElement.id, function(obj) {
      const widgetData = obj.x;
      /*
      fixLayerProperties(widgetData.layers);
      console.log(widgetData);
      viz.setLayers(widgetData.layers);
      */
      viz.setLayers([ ]);
      widgetData.calls.forEach(({ funcName, args }) => funcs[funcName].call(viz, args));
      fixLayerProperties(viz.layers);
      viz.render();
    });
  }

  return { renderValue, resize };
}

/*
const parseSources = (sources) => sources.map(({ id, data, df }) => {
  if (df) data = HTMLWidgets.dataframeToD3(data);

  return { id, data };
});
*/
