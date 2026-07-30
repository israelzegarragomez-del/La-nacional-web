/* ============================================================
   CONFIGURACIÓN DE DISPONIBILIDAD - La Nacional · La Mar
   Edita solo este objeto para cambiar días y horarios abiertos.
   ============================================================ */
const CONFIG_RESERVAS = {
  // 0 = domingo, 1 = lunes ... 6 = sábado
  diasCerrados: [0], // domingo cerrado, según lo indicado

  // Turnos por defecto (aplica a todos los días abiertos salvo excepción)
  turnosPorDefecto: [
    "13:00", "13:30", "14:00", "14:30",
    "19:30", "20:00", "20:30", "21:00", "21:30"
  ],

  // Excepciones puntuales: turnos distintos para un día específico
  // ej: viernes y sábado con turno extra de cierre
  turnosExcepcion: {
    5: ["13:00","13:30","14:00","14:30","19:30","20:00","20:30","21:00","21:30","22:00"], // viernes
    6: ["13:00","13:30","14:00","14:30","19:30","20:00","20:30","21:00","21:30","22:00"]  // sábado
  },

  // Días bloqueados puntuales (feriados, aforo completo, etc.) formato YYYY-MM-DD
  fechasBloqueadas: [],

  // Cuántos días hacia adelante se puede reservar
  ventanaDiasReserva: 30
};

/* ============================================================
   LÓGICA - no necesita edición manual
   ============================================================ */
function formatearFechaISO(fecha) {
  return fecha.toISOString().split("T")[0];
}

function estaCerrado(fecha) {
  const diaSemana = fecha.getDay();
  const fechaISO = formatearFechaISO(fecha);
  return (
    CONFIG_RESERVAS.diasCerrados.includes(diaSemana) ||
    CONFIG_RESERVAS.fechasBloqueadas.includes(fechaISO)
  );
}

function obtenerTurnos(fecha) {
  const diaSemana = fecha.getDay();
  if (estaCerrado(fecha)) return [];
  return CONFIG_RESERVAS.turnosExcepcion[diaSemana] || CONFIG_RESERVAS.turnosPorDefecto;
}

// Genera la lista de fechas habilitadas para el selector (calendario)
function obtenerFechasDisponibles() {
  const fechas = [];
  const hoy = new Date();
  for (let i = 0; i < CONFIG_RESERVAS.ventanaDiasReserva; i++) {
    const fecha = new Date(hoy);
    fecha.setDate(hoy.getDate() + i);
    if (!estaCerrado(fecha)) {
      fechas.push(formatearFechaISO(fecha));
    }
  }
  return fechas;
}

/* ============================================================
   INTEGRACIÓN CON EL FORMULARIO
   Conecta un <input type="date"> y un <select> de horarios.
   Cuando el cliente elige fecha, se recalculan los turnos.
   ============================================================ */
function inicializarFormularioReservas(idInputFecha, idSelectHora) {
  const inputFecha = document.getElementById(idInputFecha);
  const selectHora = document.getElementById(idSelectHora);
  if (!inputFecha || !selectHora) return;

  const fechasValidas = obtenerFechasDisponibles();
  inputFecha.min = fechasValidas[0];
  inputFecha.max = fechasValidas[fechasValidas.length - 1];

  function actualizarHorarios() {
    if (!inputFecha.value) return;
    const fechaElegida = new Date(inputFecha.value + "T00:00:00");
    selectHora.innerHTML = "";

    if (estaCerrado(fechaElegida)) {
      selectHora.disabled = true;
      const opcion = document.createElement("option");
      opcion.textContent = "No hay reservas disponibles ese día";
      selectHora.appendChild(opcion);
      alert("Ese día el restaurante no recibe reservas. Por favor elige otra fecha.");
      return;
    }

    selectHora.disabled = false;
    obtenerTurnos(fechaElegida).forEach(hora => {
      const opcion = document.createElement("option");
      opcion.value = hora;
      opcion.textContent = hora;
      selectHora.appendChild(opcion);
    });
  }

  // 'change' es el evento que disparan de forma confiable todos los navegadores
  // al elegir una fecha en el calendario nativo (algunos no disparan 'input').
  inputFecha.addEventListener("change", actualizarHorarios);
  inputFecha.addEventListener("input", actualizarHorarios);
}
