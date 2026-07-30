/* ============================================================
   VERIFICACIÓN DE LICENCIA - La Nacional · La Mar
   Consulta un archivo remoto en GitHub para saber si la cuenta
   del dueño del negocio está al día. Si no lo está, bloquea el
   sitio con un aviso. No afecta a los clientes de ninguna otra
   forma: es invisible mientras el pago esté al día.
   ============================================================ */
(function verificarLicencia() {
  const URL_LICENCIA = "https://raw.githubusercontent.com/israelzegarragomez-del/la-nacional.licencia/refs/heads/main/licencia.json";

  fetch(URL_LICENCIA, { cache: "no-store" })
    .then(function (respuesta) { return respuesta.json(); })
    .then(function (datos) {
      const hoy = new Date();
      const fechaVencimiento = new Date(datos.vence + "T23:59:59");
      const vencido = datos.estado !== "activo" || hoy > fechaVencimiento;

      if (vencido) {
        document.documentElement.innerHTML =
          '<div style="min-height:100vh;display:flex;align-items:center;justify-content:center;' +
          'background:#0d0d0d;color:#e8e0d0;font-family:Georgia,serif;text-align:center;padding:40px;">' +
          '<div>' +
          '<h1 style="font-size:22px;font-weight:normal;letter-spacing:1px;margin-bottom:12px;">' +
          'Sitio temporalmente fuera de servicio</h1>' +
          '<p style="font-size:14px;color:#a89a80;">Contacta al administrador del sitio para más información.</p>' +
          '</div></div>';
      }
    })
    .catch(function () {
      // Si falla la consulta (sin internet, GitHub caído, etc.) el sitio
      // sigue funcionando con normalidad — nunca bloqueamos por un error de red.
    });
})();
