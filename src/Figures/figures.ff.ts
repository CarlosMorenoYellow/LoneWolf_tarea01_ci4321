import { ATTRIB, createFixedFunction, LIGHTING } from '../vendor/ff/ff';
import type {Color} from '../vendor/ff/ff';

const CANVAS_SIZE = 480;
const CLEAR_COLOR: readonly [number, number, number, number] = [
  0x1b / 255,
  0x1e / 255,
  0x2b / 255,
  1,
];

type Shape = {
  vao: WebGLVertexArrayObject;
  mode: GLenum;
  count: number;
  indexed?: boolean;
};

function getContext(canvas: HTMLCanvasElement): WebGL2RenderingContext {
  const gl = canvas.getContext('webgl2');
  if (!gl) throw new Error('WebGL2 is not available.');
  return gl;
}

function createVAO(
  gl: WebGL2RenderingContext,
  positions: Float32Array,
  indices?: Uint16Array,
): WebGLVertexArrayObject {
  const vao = gl.createVertexArray();
  if (!vao) throw new Error('Could not create vertex array.');

  const positionBuffer = gl.createBuffer();
  if (!positionBuffer) throw new Error('Could not create position buffer.');

  gl.bindVertexArray(vao);
  gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, positions, gl.STATIC_DRAW);

  gl.enableVertexAttribArray(ATTRIB.POSITION);
  gl.vertexAttribPointer(ATTRIB.POSITION, 3, gl.FLOAT, false, 0, 0);

  if (indices) {
    const indexBuffer = gl.createBuffer();
    if (!indexBuffer) throw new Error('Could not create index buffer.');

    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, indices, gl.STATIC_DRAW);
  }

  gl.bindVertexArray(null);
  gl.bindBuffer(gl.ARRAY_BUFFER, null);

  return vao;
}

function createFanPositions(segments: number, radius: number): Float32Array {
  const positions: number[] = [0, 0, 0];

  for (let i = 0; i <= segments; i++) {
    const angle = (i / segments) * Math.PI * 2;
    positions.push(
      Math.cos(angle) * radius,
      Math.sin(angle) * radius,
      0,
    );
  }

  return new Float32Array(positions);
}

export function run(
  canvas: HTMLCanvasElement,
  shapeButton: HTMLElement,
  colorButton: HTMLElement,
): void {
  const gl = getContext(canvas);
  const ff = createFixedFunction(gl, { debug: true });

  ff.disable(LIGHTING);

  canvas.width = CANVAS_SIZE;
  canvas.height = CANVAS_SIZE;
  gl.viewport(0, 0, canvas.width, canvas.height);
  gl.clearColor(...CLEAR_COLOR);

  // Mismo triángulo del ejemplo, sin colores por vértice.
  // El orden top -> abajo-izquierda -> abajo-derecha es CCW.
  const triangleVAO = createVAO(
    gl,
    new Float32Array([
      0.0, 0.7, 0.0,
      -0.7, -0.6, 0.0,
      0.7, -0.6, 0.0,
    ]),
  );

  // Esquinas en sentido CCW. Los seis índices forman dos triángulos CCW.
  const squareVAO = createVAO(
    gl,
    new Float32Array([
      -0.6, -0.6, 0.0,
      0.6, -0.6, 0.0,
      0.6, 0.6, 0.0,
      -0.6, 0.6, 0.0,
    ]),
    new Uint16Array([0, 1, 2, 0, 2, 3]),
  );

  const hexagonVAO = createVAO(gl, createFanPositions(6, 0.7));
  const circleSegments = 48;
  const circleVAO = createVAO(gl, createFanPositions(circleSegments, 0.7));

  const shapes: Shape[] = [
    { vao: triangleVAO, mode: gl.TRIANGLES, count: 3 },
    { vao: squareVAO, mode: gl.TRIANGLES, count: 6, indexed: true },
    { vao: hexagonVAO, mode: gl.TRIANGLE_FAN, count: 8 },
    { vao: circleVAO, mode: gl.TRIANGLE_FAN, count: circleSegments + 2 },
  ];

  const colors: Color[] = [
    [1, 0, 0], // rojo
    [0, 1, 0], // verde
    [0, 0, 1], // azul
  ];

  let shapeIndex = 0;
  let colorIndex = 0;

  const btnShape = document.querySelector<HTMLButtonElement>('#btn-shape');
  const btnColor = document.querySelector<HTMLButtonElement>('#btn-color');
  const shapeNames = ['Triángulo', 'Cuadrado', 'Hexágono', 'Círculo'];
  const colorNames = ['Rojo', 'Verde', 'Azul'];

  function draw(): void {
    if (btnShape) { 
    btnShape.textContent = `Figura: ${shapeNames[shapeIndex]}`;
  }
  
  if (btnColor) {
    btnColor.textContent = `Color: ${colorNames[colorIndex]}`;
  }
    gl.clear(gl.COLOR_BUFFER_BIT);
    ff.setColor(colors[colorIndex]);

    const shape = shapes[shapeIndex];
    gl.bindVertexArray(shape.vao);

    if (shape.indexed) {
      ff.drawElements(shape.mode, shape.count, gl.UNSIGNED_SHORT, 0);
    } else {
      ff.drawArrays(shape.mode, 0, shape.count);
    }

    gl.bindVertexArray(null);
  }

  shapeButton.addEventListener('click', () => {
    shapeIndex = (shapeIndex + 1) % shapes.length;
    draw();
  });

  colorButton.addEventListener('click', () => {
    colorIndex = (colorIndex + 1) % colors.length;
    draw();
  });

  draw();
}

