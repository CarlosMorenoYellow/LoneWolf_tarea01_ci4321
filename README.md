# Laboratorio 1

## Integrantes del equipo:

- Carlos Gabriel Moreno Salazar

## Requerimientos

- Node.js 18 or mas tarde
- npm
- Un navegador con soporte para WebGL2

## Run

1. Instalar las dependencias necesarias.

   ```
   npm install
   ```

2. Arranca el servidor de desarrollo

   ```
   npm run dev
   ```

3. Accede `http://localhost:5173` en el buscador.

## Uso

- Para cambiar figuras le das al boton de "Figuras" en la parte inferior
- Para cambiar colores le das al boton de "Color" en la parte inferior

## Troubleshooting

- **Pagina en blanco o "WebGL2 is not available."** Activa hardware acceleration en el buscador o intenta usar otro.
- **"Port 5173 is in use."** Deten/mata el proceso que este usando el puerto 5173 o corre `npx vite --port <Port>` para correr el laboratorio en otro puerto libre.
