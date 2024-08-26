const introduccion = document.getElementById('intro'); // Posicionamos en el div contenedor
const departamentosContainer = document.getElementById('departamentosTarjetas'); // Posicionamos en el div contenedor

// Obtener la descripción de Colombia
fetch('https://api-colombia.com/api/v1/Country/Colombia')
  .then(res => res.json())
  .then(elemento => {
    const desCol = document.createElement('h5');
    desCol.className = 'text-justify';
    desCol.innerHTML = `${elemento.description}`;
    introduccion.appendChild(desCol);
    
  })
  .catch(error => {
    console.error('Error al obtener la descripción:', error);
  });

// Obtener y mostrar los departamentos
let departamentos = [];

fetch('https://api-colombia.com/api/v1/Department')
  .then(response => response.json())
  .then(data => {
    departamentos = data; // Guardamos los datos en una variable global
    mostrarDepartamentos(departamentos); // Mostrar los departamentos inicialmente
  })
  .catch(error => console.error('Error al cargar los departamentos:', error));

// Función para mostrar departamentos en tarjetas
function mostrarDepartamentos(departamentos) {
  departamentosContainer.innerHTML = ''; // Limpiar el contenedor

  departamentos.forEach(departamento => {
    const tarjeta = document.createElement('div');
    tarjeta.className = 'col-md-4 bg-secondary p-3';
    tarjeta.innerHTML = `
      <div class="card">
        <img src="../Rss/2077.webp" class="card-img-top" alt="imagenes">
        <div class="card-body bg-secondary-subtle">
          <h5 class="card-title">${departamento.name}</h5>
          <p class="card-text">Habitantes: ${departamento.population}</p>
          <a href="../details.html?id=${departamento.id}" class="btn btn-details">Ver detalles</a>
        </div>
      </div>
    `;
    departamentosContainer.appendChild(tarjeta);
  });
}

// Función para aplicar los filtros
function aplicarFiltros() {
  const filtroNombre = document.getElementById('filtroNombre').value.toLowerCase();
  const filtroHabitantes = document.getElementById('filtroHabitantes').value;

  let departamentosFiltrados = departamentos;

  // Filtrar por nombre
  if (filtroNombre) {
    departamentosFiltrados = departamentosFiltrados.filter(departamento =>
      departamento.name.toLowerCase().includes(filtroNombre)
    );
  }

  // Filtrar por número de habitantes
  if (filtroHabitantes === 'masDeUnMillon') {
    departamentosFiltrados = departamentosFiltrados.filter(departamento =>
      departamento.population > 1000000
    );
  } else if (filtroHabitantes === 'menosDeUnMillon') {
    departamentosFiltrados = departamentosFiltrados.filter(departamento =>
      departamento.population <= 1000000
    );
  }

  mostrarDepartamentos(departamentosFiltrados);
}

// Agregar event listeners a los filtros
document.getElementById('filtroNombre').addEventListener('input', aplicarFiltros);
document.getElementById('filtroHabitantes').addEventListener('change', aplicarFiltros);
