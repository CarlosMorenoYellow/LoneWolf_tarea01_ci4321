// Page scaffolding only: toggle, canvas swap and source panel.
import './style.css';
import { run as runFF } from './Figures/figures.ff';

const stage = document.getElementById('stage')!;
const shapeButton = document.getElementById('btn-shape')!;
const colorButton = document.getElementById('btn-color')!;

const canvas = document.createElement('canvas');
stage.replaceChildren(canvas);
runFF(canvas, shapeButton, colorButton);