# Fernando cumple 50 años como 50 soles y estas son 50 razones para celebrarlo

Un sitio de una sola página: cada vez que se carga muestra, al azar, una razón
para celebrar que Fernando cumple 50 años. El botón muestra otra.

Las razones viven en [`data/reasons.json`](data/reasons.json), un array de
cadenas. Para añadir más, basta con editar ese archivo.

## Desarrollo

No hay dependencias ni compilación. Pero `fetch` no funciona sobre `file://`,
así que hay que servirlo por HTTP en vez de abrir `index.html` directamente:

```sh
python3 -m http.server 8000
```

Y abrir <http://localhost:8000>.

## La foto

Al colocar una imagen en `assets/fernando.jpg` aparece automáticamente sobre las
razones. Mientras no exista, el hueco queda oculto.

## Despliegue

Se publica tal cual, sin compilar, en GitHub Pages: Settings → Pages → Deploy
from a branch → `main` / `/ (root)`. Todas las rutas son relativas, así que
funciona igual en la raíz de un dominio o en `/<nombre-del-repo>/`.
