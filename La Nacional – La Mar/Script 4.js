/* ============================================================
   WIDGET DE CHAT - La Nacional · La Mar
   Solo agrega este script en tu Index.html. No necesita ninguna
   clave API aquí: todo pasa por /api/chat en tu propio dominio.
   ============================================================ */
(function () {
  const estilos = document.createElement("style");
  estilos.textContent = `
    #chatBurbuja{position:fixed;bottom:96px;right:18px;width:56px;height:56px;border-radius:50%;background:#8a5a3a;color:#fff;border:none;cursor:pointer;z-index:900;display:flex;align-items:center;justify-content:center;font-size:24px;}
    #chatVentana{position:fixed;bottom:160px;right:18px;width:320px;max-width:90vw;height:420px;background:#141210;border:1px solid #3a332a;border-radius:12px;display:none;flex-direction:column;overflow:hidden;z-index:900;font-family:Georgia,serif;}
    #chatVentana.abierta{display:flex;}
    #chatMensajes{flex:1;overflow-y:auto;padding:14px;font-size:14px;color:#e8e0d0;}
    .chatMsg{margin-bottom:10px;line-height:1.5;}
    .chatMsg.usuario{color:#d4af7a;}
    #chatForm{display:flex;border-top:1px solid #3a332a;}
    #chatInput{flex:1;background:transparent;border:none;color:#fff;padding:10px;font-size:14px;}
    #chatForm button{background:#8a5a3a;color:#fff;border:none;padding:0 16px;cursor:pointer;}
  `;
  document.head.appendChild(estilos);

  const burbuja = document.createElement("button");
  burbuja.id = "chatBurbuja";
  burbuja.setAttribute("aria-label", "Abrir chat");
  burbuja.textContent = "💬".replace("💬", ""); // sin emoji: usar icono simple
  burbuja.innerHTML = "&#9993;";

  const ventana = document.createElement("div");
  ventana.id = "chatVentana";
  ventana.innerHTML = `
    <div id="chatMensajes"></div>
    <form id="chatForm">
      <input id="chatInput" type="text" placeholder="Escribe tu pregunta..." autocomplete="off">
      <button type="submit">Enviar</button>
    </form>
  `;

  document.body.appendChild(burbuja);
  document.body.appendChild(ventana);

  const historial = [];

  function agregarMensaje(texto, esUsuario) {
    const div = document.createElement("div");
    div.className = "chatMsg" + (esUsuario ? " usuario" : "");
    div.textContent = texto;
    document.getElementById("chatMensajes").appendChild(div);
    document.getElementById("chatMensajes").scrollTop = 999999;
  }

  burbuja.addEventListener("click", function () {
    ventana.classList.toggle("abierta");
    if (historial.length === 0) {
      agregarMensaje("Hola, soy el asistente de La Nacional · La Mar. ¿En qué te ayudo?", false);
    }
  });

  document.getElementById("chatForm").addEventListener("submit", async function (evento) {
    evento.preventDefault();
    const input = document.getElementById("chatInput");
    const texto = input.value.trim();
    if (!texto) return;

    agregarMensaje(texto, true);
    historial.push({ role: "user", content: texto });
    input.value = "";

    try {
      const respuesta = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mensajes: historial }),
      });
      const datos = await respuesta.json();

      if (datos.respuesta) {
        agregarMensaje(datos.respuesta, false);
        historial.push({ role: "assistant", content: datos.respuesta });
      } else {
        agregarMensaje("Hubo un problema al responder. Intenta de nuevo en un momento.", false);
      }
    } catch (error) {
      agregarMensaje("No se pudo conectar. Revisa tu conexión e intenta de nuevo.", false);
    }
  });
})();