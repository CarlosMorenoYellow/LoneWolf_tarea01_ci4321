//importa estilos para los elementos de la pagina y la funcion run.
import './style.css';
import { run as runFF } from './Figures/figures.ff';

//conseguir elementos html para usarlos en run
const stage = document.getElementById('stage')!;
const shapeButton = document.getElementById('btn-shape')!;
const colorButton = document.getElementById('btn-color')!;

const canvas = document.createElement('canvas');
stage.replaceChildren(canvas);

//Correr Lab
runFF(canvas, shapeButton, colorButton);