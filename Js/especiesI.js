
const url = 'https://api-colombia.com/api/v1'

// Función para cargar las especies invasoras y mostrarlas en la tabla
function desplegarEspeciesInv() {
    fetch(url + `/InvasiveSpecie`)
        .then(response => response.json())
        .then(especies => {
            const tabla = document.getElementById('especiesTabla')
            especies.forEach(especie => {
                const fila = document.createElement('tr')
               

                // Asignar color a la fila según el nivel de riesgo
                if (especie.riskLevel === 1) {
                    fila.classList.add('fondo-azul');
                } else if (especie.riskLevel === 2) {
                    fila.classList.add('fondo-verde')
                }

                // Crear las celdas con la información de la especie
                fila.innerHTML = `
                    <td>${especie.name || 'Nombre no disponible'}</td>
                    <td>${especie.scientificName || 'Nombre científico no disponible'}</td>
                    <td>${especie.impact || 'Impacto no disponible'}</td>
                    <td>${especie.manage || 'Manejo no disponible'}</td>
                    <td class = "numero">${especie.riskLevel || 0}</td>
                    <td><img src="${especie.urlImage}"></td>
                `
                console.log(especie);
                
                // Añadir la fila a la tabla
                tabla.appendChild(fila)
            })
        })
        .catch(error => {
            console.error('Error al cargar las especies invasoras:', error)
            document.getElementById('tablaContainer').innerHTML = '<p>Error al cargar las especies invasoras.</p>'
        })
}

// Llamar a la función para cargar las especies al cargar la página
document.addEventListener('DOMContentLoaded', desplegarEspeciesInv)
