const inicio = document.getElementById("inicio");
const seccionProyectos = document.getElementById("seccionProyectos");
const editor = document.getElementById("editor");
const vistaProyecto = document.getElementById("vistaProyecto");
const portafolioImagenes = document.getElementById("portafolioImagenes");
const volver = document.getElementById("volver");

let seccionActual = "";
let proyectoActual = null;
let seleccionGuardada = null;
let colorActual = "#202020";
let fuenteActual = "Arial";

let proyectos = JSON.parse(localStorage.getItem("proyectosFRL")) || [];
let carpetas = JSON.parse(localStorage.getItem("carpetasFRL")) || [];

const nombres = {
    tareas: "Tareas",
    trabajos: "Trabajos",
    metas: "Metas",
    portafolio: "Portafolio",
    higiene: "Higiene"
};

const frases = [
    "¿Qué tienes en mente hoy? Tu próxima idea puede comenzar aquí.",
    "Cada gran proyecto comienza con una pequeña idea.",
    "Organiza tus pensamientos y convierte tus ideas en realidad.",
    "Hoy es un buen día para crear algo nuevo."
];

const frasesSecciones = [
    "¿Cuál será tu próxima idea?",
    "Organiza tus pensamientos y comienza.",
    "Cada pequeño paso cuenta.",
    "Hoy puedes crear algo increíble."
];

const fuentes = [
    "Arial",
    "Georgia",
    "Times New Roman",
    "Courier New",
    "Impact",
    "Comic Sans MS",
    "Trebuchet MS",
    "Arial Black",
    "Brush Script MT",
    "Palatino Linotype",
    "Verdana",
    "cursive",
    "fantasy",
    "monospace"
];


// GUARDAR DATOS

function guardarDatos() {
    localStorage.setItem("proyectosFRL", JSON.stringify(proyectos));
    localStorage.setItem("carpetasFRL", JSON.stringify(carpetas));
}

function fraseAleatoria(lista) {
    return lista[Math.floor(Math.random() * lista.length)];
}


// CAMBIAR PANTALLAS

function ocultarPantallas() {
    document.querySelectorAll(".pantalla").forEach(pantalla => {
        pantalla.classList.remove("activa");
        pantalla.hidden = true;
    });
}

function mostrarPantalla(pantalla) {
    ocultarPantallas();
    pantalla.hidden = false;
    pantalla.classList.add("activa");
    volver.hidden = pantalla === inicio;
}


// INICIO

document.getElementById("fraseBienvenida").textContent =
    fraseAleatoria(frases);

document.querySelectorAll(".opcion").forEach(boton => {
    boton.addEventListener("click", () => {
        abrirSeccion(boton.dataset.seccion);
    });
});

function abrirSeccion(nombre) {

    seccionActual = nombre;

    if (nombre === "portafolio") {
        mostrarCarpetas();
        mostrarPantalla(portafolioImagenes);
        return;
    }

    document.getElementById("nombreSeccion").textContent = nombres[nombre];

    document.getElementById("fraseSeccion").textContent =
        fraseAleatoria(frasesSecciones);

    mostrarProyectos();
    mostrarPantalla(seccionProyectos);
}


// CREAR PROYECTO

document.getElementById("crearProyecto").onclick = () => {

    proyectoActual = {
        id: Date.now(),
        seccion: seccionActual,
        titulo: "",
        contenido: []
    };

    abrirEditor();
};

function abrirEditor() {

    document.getElementById("tituloProyecto").value =
        proyectoActual.titulo;

    document.getElementById("buscarNota").value = "";

    dibujarContenido();

    editor.classList.remove("minimizado");

    mostrarPantalla(editor);
}


// GUARDAR PROYECTO

document.getElementById("guardarProyecto").onclick = () => {

    const titulo = document.getElementById("tituloProyecto").value.trim();

    if (!titulo) {
        alert("Escribe un título para tu proyecto.");
        return;
    }

    proyectoActual.titulo = titulo;

    const indice = proyectos.findIndex(
        p => p.id === proyectoActual.id
    );

    if (indice === -1) {
        proyectos.push(proyectoActual);
    } else {
        proyectos[indice] = proyectoActual;
    }

    guardarDatos();

    mostrarProyectos();
    mostrarPantalla(seccionProyectos);

    alert("¡Proyecto guardado correctamente!");
};


// MOSTRAR PROYECTOS

function mostrarProyectos() {

    const lista = document.getElementById("listaProyectos");
    lista.innerHTML = "";

    const filtrados = proyectos.filter(
        p => p.seccion === seccionActual
    );

    if (filtrados.length === 0) {
        lista.textContent = "Todavía no tienes proyectos. ¡Crea el primero!";
        return;
    }

    filtrados.forEach(proyecto => {

        const tarjeta = document.createElement("div");
        tarjeta.className = "tarjeta-proyecto";

        const titulo = document.createElement("h3");
        titulo.textContent = proyecto.titulo;

        const mirar = document.createElement("button");
        mirar.textContent = "Mirar";
        mirar.onclick = () => mirarProyecto(proyecto.id);

        const editar = document.createElement("button");
        editar.textContent = "Editar";
        editar.onclick = () => editarProyecto(proyecto.id);

        const eliminar = document.createElement("button");
        eliminar.textContent = "Eliminar";
        eliminar.onclick = () => eliminarProyecto(proyecto.id);

        tarjeta.append(titulo, mirar, editar, eliminar);

        lista.appendChild(tarjeta);
    });
}


// EDITAR PROYECTO

function editarProyecto(id) {

    proyectoActual = proyectos.find(p => p.id === id);

    if (!proyectoActual) return;

    abrirEditor();
}


// MIRAR PROYECTO

function mirarProyecto(id) {

    const proyecto = proyectos.find(p => p.id === id);

    if (!proyecto) return;

    document.getElementById("tituloVista").textContent =
        proyecto.titulo;

    const contenido = document.getElementById("contenidoVista");
    contenido.innerHTML = "";

    proyecto.contenido.forEach(elemento => {

        if (elemento.tipo === "nota") {

            const tarjeta = document.createElement("div");
            tarjeta.className = "nota";

            const titulo = document.createElement("h2");
            titulo.textContent = elemento.titulo || "Nota sin título";

            const texto = document.createElement("div");
            texto.innerHTML = elemento.html || "";

            tarjeta.append(titulo, texto);
            contenido.appendChild(tarjeta);
        }

        if (elemento.tipo === "imagen") {

            const imagen = document.createElement("img");
            imagen.src = elemento.datos;
            imagen.className = "imagen-proyecto";

            contenido.appendChild(imagen);
        }
    });

    mostrarPantalla(vistaProyecto);
}


// ELIMINAR PROYECTO

function eliminarProyecto(id) {

    if (!confirm("¿Quieres eliminar este proyecto?")) return;

    proyectos = proyectos.filter(p => p.id !== id);

    guardarDatos();
    mostrarProyectos();
}


// CREAR NOTAS

document.getElementById("agregarNota").onclick = () => {

    proyectoActual.contenido.push({
        tipo: "nota",
        titulo: "",
        html: ""
    });

    dibujarContenido();

    const notas = document.querySelectorAll(".titulo-nota");
    notas[notas.length - 1]?.focus();
};


// DIBUJAR NOTAS E IMÁGENES

function dibujarContenido() {

    const contenedor = document.getElementById("contenidoProyecto");
    contenedor.innerHTML = "";

    proyectoActual.contenido.forEach((elemento, indice) => {

        if (elemento.tipo === "nota") {

            const tarjeta = document.createElement("div");
            tarjeta.className = "nota";
            tarjeta.dataset.indice = indice;

            // TÍTULO DE LA NOTA

            const titulo = document.createElement("input");
            titulo.className = "titulo-nota";
            titulo.placeholder = "Escribe el título de esta nota...";
            titulo.value = elemento.titulo || "";

            titulo.addEventListener("input", () => {
                elemento.titulo = titulo.value;
            });

            // CONTENIDO DE LA NOTA

            const texto = document.createElement("div");
            texto.contentEditable = "true";
            texto.className = "texto-enriquecido";
            texto.innerHTML = elemento.html || "";
            texto.setAttribute(
                "data-placeholder",
                "Escribe el contenido de tu nota aquí..."
            );

            texto.addEventListener("input", () => {
                elemento.html = texto.innerHTML;
            });

            texto.addEventListener("focus", () => {
                if (document.getElementById("equiparColor").checked) {
                    aplicarEnCursor("foreColor", colorActual);
                }
            });

            // ELIMINAR NOTA

            const eliminar = document.createElement("button");
            eliminar.textContent = "Eliminar nota";

            eliminar.onclick = () => {

                if (!confirm("¿Eliminar esta nota?")) return;

                proyectoActual.contenido.splice(indice, 1);
                dibujarContenido();
            };

            tarjeta.append(titulo, texto, eliminar);
            contenedor.appendChild(tarjeta);
        }


        if (elemento.tipo === "imagen") {

            const tarjeta = document.createElement("div");
            tarjeta.className = "nota";

            const imagen = document.createElement("img");
            imagen.src = elemento.datos;
            imagen.className = "imagen-proyecto";

            const eliminar = document.createElement("button");
            eliminar.textContent = "Eliminar imagen";

            eliminar.onclick = () => {
                proyectoActual.contenido.splice(indice, 1);
                dibujarContenido();
            };

            tarjeta.append(imagen, eliminar);
            contenedor.appendChild(tarjeta);
        }

    });
}


// BUSCADOR DE NOTAS

function buscarNota() {

    const busqueda = document.getElementById("buscarNota")
        .value.trim().toLowerCase();

    if (!busqueda) {
        alert("Escribe el título de una nota para buscarla.");
        return;
    }

    const notas = document.querySelectorAll(".nota");

    for (const tarjeta of notas) {

        const titulo = tarjeta.querySelector(".titulo-nota");

        if (!titulo) continue;

        if (titulo.value.toLowerCase().includes(busqueda)) {

            tarjeta.scrollIntoView({
                behavior: "smooth",
                block: "center"
            });

            titulo.focus();
            titulo.select();

            return;
        }
    }

    alert("No encontramos una nota con ese título.");
}

document.getElementById("botonBuscar").onclick = buscarNota;

document.getElementById("buscarNota").addEventListener("keydown", evento => {

    if (evento.key === "Enter") {
        evento.preventDefault();
        buscarNota();
    }
});


// RECORDAR LA SELECCIÓN DEL TEXTO

document.addEventListener("selectionchange", () => {

    const seleccion = window.getSelection();

    if (!seleccion || seleccion.rangeCount === 0) return;

    const nodo = seleccion.anchorNode;

    const elemento = nodo?.nodeType === 3
        ? nodo.parentElement
        : nodo;

    if (elemento?.closest(".texto-enriquecido")) {
        seleccionGuardada = seleccion.getRangeAt(0).cloneRange();
    }
});

function restaurarSeleccion() {

    if (!seleccionGuardada) return false;

    try {

        const seleccion = window.getSelection();

        seleccion.removeAllRanges();
        seleccion.addRange(seleccionGuardada);

        return true;

    } catch {
        return false;
    }
}


// APLICAR COLOR O TIPOGRAFÍA

function aplicarFormato(comando, valor) {

    if (!restaurarSeleccion()) {
        return false;
    }

    const seleccion = window.getSelection();
    const nodo = seleccion.anchorNode;

    const elemento = nodo?.nodeType === 3
        ? nodo.parentElement
        : nodo;

    if (!elemento?.closest(".texto-enriquecido")) {
        return false;
    }

    document.execCommand("styleWithCSS", false, true);
    document.execCommand(comando, false, valor);

    const editorActivo = elemento.closest(".texto-enriquecido");

    editorActivo.dispatchEvent(new Event("input", {
        bubbles: true
    }));

    return true;
}


// APLICAR FORMATO EN LA POSICIÓN DEL CURSOR

function aplicarEnCursor(comando, valor) {

    const seleccion = window.getSelection();

    if (!seleccion || seleccion.rangeCount === 0) return;

    const nodo = seleccion.anchorNode;

    const elemento = nodo?.nodeType === 3
        ? nodo.parentElement
        : nodo;

    if (!elemento?.closest(".texto-enriquecido")) return;

    document.execCommand("styleWithCSS", false, true);
    document.execCommand(comando, false, valor);
}


// CAMBIAR COLOR

document.getElementById("colorTexto").addEventListener("input", evento => {

    colorActual = evento.target.value;

    aplicarFormato("foreColor", colorActual);
});


// PALETA DE COLORES OSCUROS

document.querySelectorAll(".color-opcion").forEach(boton => {

    boton.addEventListener("click", () => {

        colorActual = boton.dataset.color;

        document.getElementById("colorTexto").value = colorActual;

        aplicarFormato("foreColor", colorActual);
    });
});


// EQUIPAR COLOR

document.getElementById("equiparColor").addEventListener("change", evento => {

    if (evento.target.checked) {

        aplicarEnCursor("foreColor", colorActual);

    }
});


// TIPOGRAFÍA

document.getElementById("tipoLetra").addEventListener("change", evento => {

    fuenteActual = evento.target.value;

    aplicarFormato("fontName", fuenteActual);
});


// ATAJOS DE TECLADO

document.addEventListener("keydown", evento => {

    if (!editor.classList.contains("activa")) return;

    if (!evento.ctrlKey || evento.altKey || evento.shiftKey) return;

    const objetivo = evento.target;

    if (objetivo.matches("input, select, textarea")) return;

    if (evento.key === "1") {

        evento.preventDefault();
        document.getElementById("colorTexto").click();
    }

    if (evento.key === "2") {

        evento.preventDefault();

        let indice = fuentes.indexOf(fuenteActual);

        indice = (indice + 1) % fuentes.length;

        fuenteActual = fuentes[indice];

        document.getElementById("tipoLetra").value = fuenteActual;

        aplicarFormato("fontName", fuenteActual);
    }

    if (evento.key === "3") {

        evento.preventDefault();
        document.getElementById("seleccionarImagen").click();
    }

});


// AGREGAR IMÁGENES

document.getElementById("seleccionarImagen").addEventListener("change", evento => {

    const archivo = evento.target.files[0];

    if (!archivo) return;

    if (!archivo.type.startsWith("image/")) {
        alert("Selecciona una imagen válida.");
        evento.target.value = "";
        return;
    }

    if (archivo.size > 2 * 1024 * 1024) {
        alert("La imagen debe pesar menos de 2 MB.");
        evento.target.value = "";
        return;
    }

    const lector = new FileReader();

    lector.onload = () => {

        proyectoActual.contenido.push({
            tipo: "imagen",
            datos: lector.result
        });

        dibujarContenido();
        evento.target.value = "";
    };

    lector.readAsDataURL(archivo);
});


// MINIMIZAR Y MAXIMIZAR

document.getElementById("minimizar").onclick = () => {
    editor.classList.add("minimizado");
};

document.getElementById("maximizar").onclick = () => {
    editor.classList.remove("minimizado");
};


// PORTAFOLIO

document.getElementById("crearCarpeta").onclick = () => {

    const nombre = prompt("Nombre de la carpeta:");

    if (!nombre || !nombre.trim()) return;

    carpetas.push({
        id: Date.now(),
        nombre: nombre.trim(),
        imagenes: []
    });

    guardarDatos();
    mostrarCarpetas();
};

function mostrarCarpetas() {

    const lista = document.getElementById("listaCarpetas");
    lista.innerHTML = "";

    carpetas.forEach(carpeta => {

        const tarjeta = document.createElement("div");
        tarjeta.className = "tarjeta-proyecto";

        const titulo = document.createElement("h3");
        titulo.textContent = "📁 " + carpeta.nombre;

        const boton = document.createElement("button");
        boton.textContent = "Agregar imagen";

        boton.onclick = () => {

            const imagen = document.createElement("input");
            imagen.type = "file";
            imagen.accept = "image/*";

            imagen.onchange = () => {

                const archivo = imagen.files[0];

                if (!archivo || !archivo.type.startsWith("image/")) return;

                if (archivo.size > 2 * 1024 * 1024) {
                    alert("La imagen debe pesar menos de 2 MB.");
                    return;
                }

                const lector = new FileReader();

                lector.onload = () => {

                    carpeta.imagenes.push(lector.result);

                    guardarDatos();

                    alert("Imagen guardada en la carpeta.");
                };

                lector.readAsDataURL(archivo);
            };

            imagen.click();
        };

        tarjeta.append(titulo, boton);
        lista.appendChild(tarjeta);
    });
}


// VOLVER

volver.onclick = () => {

    if (editor.classList.contains("activa") ||
        vistaProyecto.classList.contains("activa")) {

        mostrarProyectos();
        mostrarPantalla(seccionProyectos);

    } else {

        mostrarPantalla(inicio);
    }
};


// INICIAR

mostrarPantalla(inicio);