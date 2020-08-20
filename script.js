let arrayStorage = [];
const lista = document.getElementById("myUL");

let wage = document.getElementById("inputNombre");
wage.addEventListener("keydown", function(e) {
    if (e.keyCode === 13) {
        let maxId = arrayStorage.reduce(function(maxId, item) {
            return Math.max(maxId, item.id)
        }, Number.MIN_VALUE);
        let elemento = {
            'id': maxId + 1,
            'title': wage.value,
            'completed': false
        };
        crearNuevaTarea(elemento);

    }
});

function Close(evt) {
    let li = this.parentElement;
    li.remove();
    borrarStorage(li.id);
}

function Check(evt) {
    if (evt.target.parentNode.classList.contains('checked')) {
        evt.target.parentNode.classList.remove('checked');
        evt.target.parentNode.classList.add('unchecked');
    } else {
        evt.target.parentNode.classList.add('checked');
        evt.target.parentNode.classList.remove('unchecked');
    }
    checkStorage(evt.target.parentNode.id);
}

async function getData(url) {
    const response = await fetch(url);

    return response.json()
}

(async function() {
    let tareasGuardadas = window.localStorage.misTareas;
    if (!tareasGuardadas) {
        let dataset;
        let random = Math.floor(Math.random() * (+190 - +0)) + +0;
        let url = 'https://jsonplaceholder.typicode.com/todos?_start=' + random + '&_limit=10';
        const data = await getData(url);
        let dataMapped = data.map(function(val) {
            return {
                id: val.id,
                title: val.title,
                completed: val.completed
            };
        });
        arrayStorage = dataMapped;
        localStorage.misTareas = JSON.stringify(arrayStorage);
        construirTareas(arrayStorage);
        persistir(arrayStorage);
    } else {
        let arr = JSON.parse(tareasGuardadas);
        arrayStorage = arr;
        construirTareas(arr);
        calcularRestantes();
    }
    document.getElementById('todos').innerHTML += '<i class="fa fa-trash" aria-hidden="true"></i>'
})();


function crearNuevaTarea(tarea) {
    document.getElementById("inputNombre").value = "";
    dibujarLi(tarea);
    arrayStorage.push(tarea);
    persistir();
}

function construirTareas(arr) {
    document.getElementById("inputNombre").value = "";
    for (let i = 0; i < arr.length; i++) {
        dibujarLi(arr[i]);
    }
}

function dibujarLi(tarea) {
    let li = document.createElement("li");
    li.id = tarea.id;

    let span1 = document.createElement("SPAN");
    span1.className = "check";
    span1.innerHTML = '<i class="fa fa-check" aria-hidden="true"></i>';
    li.appendChild(span1);

    let span2 = document.createElement("SPAN");
    span2.classList.add("textitoTarea");
    span2.innerHTML = tarea.title;
    li.appendChild(span2);

    if (tarea.completed) {
        li.classList.toggle('checked');
    } else {
        li.classList.toggle('unchecked');
    }
    lista.appendChild(li);

    let span3 = document.createElement("SPAN");
    span3.className = "close";
    span3.innerHTML = '<i class="fa fa-trash" aria-hidden="true"></i>';
    li.appendChild(span3);
    span2.addEventListener('dblclick', editar);
    span3.addEventListener('click', Close);
    span1.addEventListener('click', Check);
}

function calcularRestantes() {
    let restantes = document.querySelectorAll('.unchecked').length;
    if (document.querySelectorAll(".unchecked").length === 1) {
        document.getElementById('quedan').innerHTML = "Queda " + restantes + " tarea por completar";
    } else {
        document.getElementById('quedan').innerHTML = "Quedan " + restantes + " tareas por completar";
    }
}

(function() {
    document.getElementById('todos').onclick = function() {
        var x = document.getElementsByClassName('checked');
        while (x[0]) {
            let index = arrayStorage.findIndex(item => item.id == x[0].id);
            arrayStorage.splice(index, 1);
            x[0].parentNode.removeChild(x[0]);
        }
        persistir();
    }
})();

function editar(event) {
    event.target.contentEditable = 'true';
    event.target.focus();
    event.target.addEventListener('keydown', function(event) {
        var esc = event.which == 27,
            nl = event.which == 13,
            el = event.target,
            input = el.nodeName != 'INPUT' && el.nodeName != 'TEXTAREA';
        if (input) {
            if (esc) {
                document.execCommand('undo');
                el.blur();
            } else if (nl) {
                el.blur();
                el.contentEditable = 'false';
                editStorage(el.parentNode.id, el.innerText);
                event.preventDefault();
            }
        }
    }, true)
}

function checkStorage(id) {
    const index = arrayStorage.findIndex(function(obj) {
        return obj.id == id
    });
    arrayStorage[index].completed = !arrayStorage[index].completed;
    persistir();
}

function borrarStorage(id) {
    let index = arrayStorage.findIndex(item => item.id == id);
    arrayStorage.splice(index, 1);
    persistir();
}

function persistir(arr) {
    localStorage.misTareas = JSON.stringify(arrayStorage);
    calcularRestantes();
}

function pushStorage(tarea) {
    arrayStorage.push(tarea);
    persistir();
}

function editStorage(id, text) {
    const index = arrayStorage.findIndex(item => item.id == id);
    arrayStorage[index].title = text;
    persistir();
}