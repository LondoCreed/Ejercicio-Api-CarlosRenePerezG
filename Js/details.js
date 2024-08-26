
const queryString = window.location.search // obtengo la cadena de consulta que se mando en el boton con ?
const urlParametros = new URLSearchParams(queryString ) //Tomo la cadena y la transformo para obtener lso aprametros de la misma
const departamentoId = urlParametros.get('id')// consigo el parametro ID de la cadena
const url = 'https://api-colombia.com/api/v1' // Defino el link de la api para reutilizar en las rutas




if (!departamentoId) {
    document.getElementById('infoDepartamento').innerHTML = '<p>Departamento no encontrado.</p>'//Manejamos el caso de no obtener una id
} else {
    fetch(url + `/Department/${departamentoId}`)// ingresando al departamento mediante el id
        .then(response => response.json()) // pasamos datos a json para utilizar
        .then(datos => {
            const infoDepartamento = document.getElementById('infoDepartamento')//Pocisiconamos en el contenedor deseado
            infoDepartamento.innerHTML = `
                <h2>${datos.name}</h2>
                <p>Descripción: ${datos.description}</p>
                <p>Capital: ${datos.cityCapital.name}</p>
                <p>Habitantes: ${datos.population}</p>
                <p>Superficie: ${datos.surface}</p>
            `// se desplegan los datos detallados del departamento
            
            const ciudadesUrl = url + `/Department/${departamentoId}/cities` // ingresando a las ciudades mediante el id del departamento
            const areasNaturalesUrl = url + `/Department/${departamentoId}/naturalareas`// ingresando a areas naturales mediante el id depto


            //PromiseAll para poder ejecutar dos promesas al tiempo, dentro trasnformamos datos a json y hacemos funcion flecha
            Promise.all([
                fetch(ciudadesUrl).then(response => response.json()),
                fetch(areasNaturalesUrl).then(response => response.json())
            ])
            .then(([ciudadesDatos, aNaturalDatos]) => {
                const tarjetasContainer = document.getElementById('tarjetasContainer')

                let tarjetasCiudades = [] // arrays vacios para utilizat en los filtros, cuando se llenen
                let tarjetasAreas = []
    

                // Desplegar ciudades
                if (ciudadesDatos.length > 0) {
                    ciudadesDatos.forEach(item => {
                        const tarjeta = document.createElement('div')
                        tarjeta.className = 'col-md-4 mb-4'
                        tarjeta.innerHTML = `
                            <div class="card">
                                <img src="" class="card-img-top" alt="">
                                <div class="card-body">
                                    <img src="../Rss/CC.webp" class="card-img-top" alt="imagenes">
                                    <h5 class="card-title">${item.name || 'Nombre no disponible'}</h5>
                                    <p class="card-text">Esta es una ciudad</p>
                                </div>
                            </div>
                        `//Creamos las tarjetas para ciudades y las desplegamos
                        tarjetasCiudades.push(tarjeta)
                        tarjetasContainer.appendChild(tarjeta)
                    })
                }
                
                // Desplegar áreas naturales
                const naturalAreas = aNaturalDatos[0].naturalAreas; //tomo la data del then y la acccedo en la posicion deseada
                console.log(naturalAreas)
                if (naturalAreas && naturalAreas.length > 0) { // comprobamos que tenga algo
                    // Utilize Set para evitar elementos duplicados
                    const AreasSinRepetir = Array.from(new Set(naturalAreas.map(item => item.name))).map(name => {
                            return naturalAreas.find(item => item.name === name)
                        }) //eliminamos duplicados con set y mapeamos los resultados sin duplicar, uso el find para devolver el objeto
                        console.log(AreasSinRepetir)
                        
                        AreasSinRepetir.forEach(item => {
                        const tarjeta = document.createElement('div');
                        tarjeta.className = 'col-md-4 mb-4'
                        tarjeta.innerHTML = `
                            <div class="card">
                                <img src="" class="card-img-top" alt="">
                                <div class="card-body">
                                    <img src="../Rss/An.webp" class="card-img-top" alt="imagenes">
                                    <h5 class="card-title">${item.name || 'Nombre no disponible'}</h5>
                                    <p class="card-text">Esta es un Area Natural</p>
                                </div>
                            </div>
                        `//Creamos las tarjetas para Areas naturales y las desplegamos
                        tarjetasAreas.push(tarjeta)
                        tarjetasContainer.appendChild(tarjeta);
                    })
                }
                if (tarjetasCiudades.length === 0 && tarjetasAreas.length === 0) {
                    tarjetasContainer.innerHTML = '<p>No hay ciudades ni áreas naturales para mostrar.</p>';
                }
           
                // Filtros
                const filtroTipo = document.getElementById('filtroTipo') // Posicionamos en el filtro desplegable
                const filtroTexto = document.getElementById('filtroTexto') // Posicionamos en el filtro de texto

                function aplicarFiltros() {
                    const tipo = filtroTipo.value.toLowerCase() //Normalizar
                    const texto = filtroTexto.value.toLowerCase() //Normalizar

                    tarjetasContainer.innerHTML = ''

                    if (tipo === 'todos' || tipo === 'ciudades') {
                        tarjetasCiudades.forEach(tarjeta => {
                            const nombre = tarjeta.querySelector('.card-title').textContent.toLowerCase()
                            if (nombre.includes(texto)) {
                                tarjetasContainer.appendChild(tarjeta)
                            }
                        });
                    }

                    if (tipo === 'todos' || tipo === 'areas') {
                        tarjetasAreas.forEach(tarjeta => {
                            const nombre = tarjeta.querySelector('.card-title').textContent.toLowerCase();
                            if (nombre.includes(texto)) {
                                tarjetasContainer.appendChild(tarjeta)
                            }
                        });
                    }

                    if (tarjetasContainer.children.length === 0) {
                        tarjetasContainer.innerHTML = '<p>No se encontraron resultados.</p>'
                    }
                }

                filtroTipo.addEventListener('change', aplicarFiltros)// evento para aplicar filtro en el desplegable
                filtroTexto.addEventListener('input', aplicarFiltros)// evento para aplicar filtro en el buscador de texto
            })
            .catch(error => {
                console.error('Error al cargar los datos:', error)
                document.getElementById('tarjetasContainer').innerHTML = '<p>Error al cargar los datos.</p>'
            })
        })
        .catch(error => {
            console.error('Error al cargar la información del departamento:', error)
            document.getElementById('infoDepartamento').innerHTML = '<p>Error al cargar la información del departamento.</p>'
        })
}


//Area de pruebas

/* 
    const areasNaturalesUrl = url + `/CategoryNaturalArea`
    fetch(areasNaturalesUrl)
    .then(response => response.json())
    .then(areasNaturalesData => {
        console.log('Respuesta:', areasNaturalesData);
    })
    



    const areasNaturales2Url = url + `/Department/${departamentoId}/naturalareas`;

    fetch(areasNaturales2Url)
        .then(response => response.json())
        .then(areasNaturalesData => {
            console.log('Respuesta:', areasNaturalesData);
        }) */
        














































/* const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);
const departamentoId = urlParams.get('id');
const url = 'https://api-colombia.com/api/v1' 

if (!departamentoId) {
    document.getElementById('infoDepartamento').innerHTML = '<p>Departamento no encontrado.</p>';
} else {
    fetch(url + `/Department/${departamentoId}`)
        .then(response => response.json())
        .then(datos => {
            // Mostrar información del departamento
            const infoDepartamento = document.getElementById('infoDepartamento');
            infoDepartamento.innerHTML = `
                <h2>${datos.name}</h2>
                <p>Descripción: ${datos.description}</p>
                <p>Capital: ${datos.cityCapital.name}</p>
                <p>Habitantes: ${datos.population}</p>
                <p>Superficie: ${datos.surface}</p>
            `
            
            // Obtener ciudades y desplegue
            const ciudadesUrl = url + `/Department/${departamentoId}/cities`

            fetch(ciudadesUrl)
            .then(responseC => responseC.json())
            .then(ciudadesData  => {
            console.log(ciudadesData )
            const tarjetasContainer = document.getElementById('tarjetasContainer');
                
                if (ciudadesData.length === 0) {
                    tarjetasContainer.innerHTML = '<p>No hay ciudades ni áreas naturales para mostrar.</p>';
                } else {
                    ciudadesData.forEach(item => {
                        const tarjeta = document.createElement('div');
                        tarjeta.className = 'col-md-4 mb-4';
                        tarjeta.innerHTML = `
                            <div class="card">
                                <img src="" class="card-img-top" alt="">
                                <div class="card-body">
                                    <h5 class="card-title">${item.name || 'Nombre no disponible'}</h5>
                                    <p class="card-text">Ciudad</p>
                                </div>
                            </div>
                        `;
                        tarjetasContainer.appendChild(tarjeta);
                    });
                }
            })
            .catch(error => {
                console.error('Error al cargar ciudades:', error);
                document.getElementById('tarjetasContainer').innerHTML = '<p>Error al cargar las ciudades.</p>'
            });

            // Obtener Areas naturales y desplegue  tengo un error
            const areasNaturalesUrl = url + `/Department/${departamentoId}/naturalareas`;
            fetch(areasNaturalesUrl)
                .then(responseN => responseN.json())
                .then(areasNaturalesData => {
                    console.log('Áreas Naturales:', areasNaturalesData);
                    const tarjetasContainer = document.getElementById('tarjetasContainer');
                    
                    if (areasNaturalesData.length === 0) {
                        tarjetasContainer.innerHTML += '<p>No hay áreas naturales para mostrar.</p>';
                    } else {
                        areasNaturalesData.forEach(item => {
                            const tarjeta = document.createElement('div');
                            tarjeta.className = 'col-md-4 mb-4';
                            tarjeta.innerHTML = `
                                <div class="card">
                                    <img src="" class="card-img-top" alt="">
                                    <div class="card-body">
                                        <h5 class="card-title">${item.name || 'Nombre no disponible'}</h5>
                                        <p class="card-text">${item.description || 'Descripción no disponible'}</p>
                                    </div>
                                </div>
                            `;
                            tarjetasContainer.appendChild(tarjeta);
                        });
                    }
                })
                .catch(error => {
                    console.error('Error al cargar áreas naturales:', error);
                    document.getElementById('tarjetasContainer').innerHTML += '<p>Error al cargar las áreas naturales.</p>';
                });

        });
} */