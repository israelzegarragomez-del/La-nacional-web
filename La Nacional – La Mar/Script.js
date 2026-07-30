/* =========================================================
   LA NACIONAL – LA MAR — script.js (vanilla JS)
   ========================================================= */
(function(){
"use strict";

/* ---------- Utilidad: URL de imagen Unsplash ---------- */
function img(id, w){ return `https://images.unsplash.com/${id}?q=80&w=${w||900}&auto=format&fit=crop`; }

/* ===================== 1. LOADER ===================== */
window.addEventListener("load", function(){
  var line = document.getElementById("loaderLine");
  line.classList.add("animate");
  setTimeout(function(){
    document.getElementById("loader").classList.add("done");
    document.body.style.overflow = "";
  }, 2000);
});
document.body.style.overflow = "hidden";
setTimeout(function(){ document.body.style.overflow = ""; }, 2100);

/* ===================== 2. CURSOR PERSONALIZADO ===================== */
var dot = document.getElementById("cursorDot");
var ring = document.getElementById("cursorRing");
var mx=0,my=0, rx=0, ry=0;
window.addEventListener("mousemove", function(e){
  mx = e.clientX; my = e.clientY;
  dot.style.transform = "translate("+mx+"px,"+my+"px) translate(-50%,-50%)";
});
(function loopRing(){
  rx += (mx-rx)*0.16; ry += (my-ry)*0.16;
  ring.style.transform = "translate("+rx+"px,"+ry+"px) translate(-50%,-50%)";
  requestAnimationFrame(loopRing);
})();
document.addEventListener("mouseover", function(e){
  if(e.target.closest("a,button,.dish-card,.exp-item,.m-item,input,textarea")){
    ring.classList.add("hovered");
  }
});
document.addEventListener("mouseout", function(e){
  if(e.target.closest("a,button,.dish-card,.exp-item,.m-item,input,textarea")){
    ring.classList.remove("hovered");
  }
});

/* ===================== 3. NAV: scroll state, burger, active link ===================== */
var mainNav = document.getElementById("mainNav");
var navLinks = document.querySelectorAll(".nav-links a");
var navBurger = document.getElementById("navBurger");
var navLinksWrap = document.getElementById("navLinks");

navBurger.addEventListener("click", function(){
  navLinksWrap.classList.toggle("open");
});
navLinks.forEach(function(l){ l.addEventListener("click", function(){ navLinksWrap.classList.remove("open"); }); });

var sections = document.querySelectorAll("section[id], .hero[id]");
function onScroll(){
  mainNav.classList.toggle("scrolled", window.scrollY > 60);

  var y = window.scrollY + 140;
  sections.forEach(function(sec){
    if(y >= sec.offsetTop && y < sec.offsetTop+sec.offsetHeight){
      navLinks.forEach(function(l){ l.classList.remove("active"); });
      var active = document.querySelector('.nav-links a[href="#'+sec.id+'"]');
      if(active) active.classList.add("active");
    }
  });

  /* Parallax hero */
  var hero = document.getElementById("heroBg");
  if(hero) hero.style.transform = "translateY(" + (window.scrollY*0.28) + "px)";

  /* Botones flotantes */
  var pct = window.scrollY / (document.body.scrollHeight - window.innerHeight);
  document.getElementById("reservarFloat").classList.toggle("show", pct > 0.4);
  document.getElementById("backTop").classList.toggle("show", window.scrollY > 700);
}
window.addEventListener("scroll", onScroll, {passive:true});
onScroll();

document.getElementById("backTop").addEventListener("click", function(){
  window.scrollTo({top:0, behavior:"smooth"});
});
document.getElementById("reservarFloat").addEventListener("click", function(){
  document.getElementById("reservas").scrollIntoView({behavior:"smooth"});
});

/* ===================== 4. THEME TOGGLE ===================== */
var themeToggle = document.getElementById("themeToggle");
var savedTheme = null;
try{ savedTheme = window.__lnTheme || null; }catch(e){}
function applyTheme(t){
  if(t === "light"){ document.documentElement.setAttribute("data-theme","light"); }
  else{ document.documentElement.removeAttribute("data-theme"); }
  window.__lnTheme = t;
}
applyTheme(savedTheme || "dark");
themeToggle.addEventListener("click", function(){
  var isLight = document.documentElement.getAttribute("data-theme") === "light";
  applyTheme(isLight ? "dark" : "light");
});

/* ===================== 5. RIPPLE EFFECT ===================== */
document.querySelectorAll(".ripple").forEach(function(btn){
  btn.addEventListener("click", function(e){
    var r = document.createElement("span");
    r.className = "ripple-effect";
    var rect = btn.getBoundingClientRect();
    var size = Math.max(rect.width, rect.height);
    r.style.width = r.style.height = size+"px";
    r.style.left = (e.clientX - rect.left - size/2)+"px";
    r.style.top = (e.clientY - rect.top - size/2)+"px";
    btn.appendChild(r);
    setTimeout(function(){ r.remove(); }, 650);
  });
});

/* ===================== 6. HERO PARTICLES ===================== */
var particlesWrap = document.getElementById("heroParticles");
for(var i=0;i<26;i++){
  var p = document.createElement("span");
  p.style.left = Math.random()*100+"%";
  p.style.animationDuration = (8+Math.random()*10)+"s";
  p.style.animationDelay = (Math.random()*10)+"s";
  p.style.opacity = (0.2+Math.random()*0.4);
  particlesWrap.appendChild(p);
}

/* ===================== 7. SCROLL REVEAL (IntersectionObserver) ===================== */
var revealObserver = new IntersectionObserver(function(entries){
  entries.forEach(function(en){
    if(en.isIntersecting){ en.target.classList.add("in"); revealObserver.unobserve(en.target); }
  });
}, {threshold:0.15});
function observeReveals(root){
  (root||document).querySelectorAll(".reveal,.reveal-left,.reveal-right,.story-line,.esp-card,.exp-item,.porque-card").forEach(function(el){
    revealObserver.observe(el);
  });
}
observeReveals();

/* Story lines: stagger */
document.querySelectorAll(".story-line").forEach(function(el,i){
  el.style.transitionDelay = (i*0.12)+"s";
});

/* ===================== 8. CONTADORES ANIMADOS ===================== */
function animateCount(el){
  var target = parseFloat(el.dataset.count);
  var decimals = parseInt(el.dataset.decimal || "0");
  var suffix = el.dataset.suffix || "";
  var start = 0, dur = 1600, t0 = null;
  function step(ts){
    if(!t0) t0 = ts;
    var p = Math.min((ts-t0)/dur, 1);
    var eased = 1 - Math.pow(1-p, 3);
    var val = start + (target-start)*eased;
    el.textContent = (decimals ? val.toFixed(decimals) : Math.floor(val).toLocaleString("es-PE")) + suffix;
    if(p < 1) requestAnimationFrame(step);
  }
  requestAnimationFrame(step);
}
var countObserver = new IntersectionObserver(function(entries){
  entries.forEach(function(en){
    if(en.isIntersecting){ animateCount(en.target); countObserver.unobserve(en.target); }
  });
}, {threshold:0.5});
document.querySelectorAll("[data-count]").forEach(function(el){ countObserver.observe(el); });

/* ===================== 9. DATA: CARTA ===================== */
var CARTA = {
  entradas: [
    {n:"Causa Limeña de Cangrejo", d:"Papa amarilla, cangrejo fresco, palta y mayonesa de rocoto.", p:"38", img:img("photo-1546069901-ba9599a7e63c")},
    {n:"Anticuchos de Corazón", d:"Brasa de carbón, ají panca, choclo y papa dorada.", p:"34", img:img("photo-1544025162-d76694265947")},
    {n:"Papa a la Huancaína", d:"Salsa de ají amarillo, queso fresco, huevo y aceituna.", p:"29", img:img("photo-1512058564366-18510be2db19")}
  ],
  ceviches: [
    {n:"Ceviche Nacional de Corvina", d:"Leche de tigre clásica, camote, choclo y cancha.", p:"46", img:img("photo-1607330289024-1535c6b4e1c1")},
    {n:"Ceviche Mixto La Mar", d:"Pescado del día, pulpo, langostinos y calamar.", p:"58", img:img("photo-1553621042-f6e147245754")},
    {n:"Ceviche de Champiñones", d:"Versión vegetariana en leche de tigre de rocoto.", p:"36", img:img("photo-1512621776951-a57141f2eefd")}
  ],
  tiraditos: [
    {n:"Tiradito al Ají Amarillo", d:"Finas láminas de pescado, ají amarillo y limón.", p:"44", img:img("photo-1580476262798-bddd9f4b7369")},
    {n:"Tiradito Nikkei", d:"Salsa de soya, sésamo tostado y palta.", p:"48", img:img("photo-1553621042-f6e147245754")},
    {n:"Tiradito de Atún", d:"Atún sellado, aderezo de rocoto y cilantro.", p:"50", img:img("photo-1626082927389-6cd097cdc6ec")}
  ],
  fondos: [
    {n:"Arroz con Mariscos", d:"Mariscos frescos salteados en arroz al ají amarillo.", p:"56", img:img("photo-1512058564366-18510be2db19")},
    {n:"Ají de Gallina", d:"Gallina deshilachada en crema de ají amarillo y nuez.", p:"39", img:img("photo-1585032226651-759b368d7246")},
    {n:"Lomo Saltado", d:"Lomo fino salteado, papas fritas y arroz blanco.", p:"49", img:img("photo-1544025162-d76694265947")}
  ],
  carnes: [
    {n:"Lomo a la Parrilla", d:"Corte premium a la brasa con puré de camote.", p:"68", img:img("photo-1546833999-b9f581a1996d")},
    {n:"Costillas Braseadas", d:"Doce horas de cocción lenta con glaseado de chicha.", p:"64", img:img("photo-1544025162-d76694265947")},
    {n:"Pato al Ají Panca", d:"Pierna confitada, ají panca y frijol canario.", p:"58", img:img("photo-1432139555190-58524dae6a55")}
  ],
  pastas: [
    {n:"Tallarines Verdes", d:"Salsa de albahaca peruana, bistec y queso parmesano.", p:"42", img:img("photo-1621996346565-e3dbc353d2e5")},
    {n:"Risotto de Mariscos", d:"Arroz arbóreo cremoso con mariscos del día.", p:"52", img:img("photo-1476124369491-e7addf5db371")},
    {n:"Ravioles de Ricotta", d:"Relleno de ricotta y espinaca, mantequilla de salvia.", p:"44", img:img("photo-1621996346565-e3dbc353d2e5")}
  ],
  postres: [
    {n:"Suspiro a la Limeña", d:"Manjar blanco, merengue al oporto y canela.", p:"22", img:img("photo-1551024506-0bccd828d307")},
    {n:"Mazamorra Morada", d:"Maíz morado, frutas y especias andinas.", p:"20", img:img("photo-1488477181946-6428a0291777")},
    {n:"Tres Leches", d:"Bizcocho embebido en tres leches y merengue tostado.", p:"24", img:img("photo-1551024601-bec78aea704b")}
  ],
  bebidas: [
    {n:"Pisco Sour Clásico", d:"Pisco quebranta, limón, jarabe de goma y clara de huevo.", p:"32", img:img("photo-1470337458703-46ad1756a187")},
    {n:"Chicha Morada Artesanal", d:"Maíz morado, piña, membrillo y especias.", p:"18", img:img("photo-1544145945-f90425340c7e")},
    {n:"Copa de Vino Tinto", d:"Selección de viñedos peruanos e internacionales.", p:"34", img:img("photo-1510812431401-41d2bd2722f3")}
  ]
};

var cartaPanels = document.getElementById("cartaPanels");
Object.keys(CARTA).forEach(function(cat, idx){
  var panel = document.createElement("div");
  panel.className = "panel" + (idx===0 ? " active" : "");
  panel.id = "panel-"+cat;
  CARTA[cat].forEach(function(dish){
    panel.innerHTML += `
      <div class="dish-card">
        <div class="dish-img"><img src="${dish.img}" alt="${dish.n}" loading="lazy"><div class="dish-spot"></div></div>
        <div class="dish-body">
          <h4>${dish.n}</h4>
          <p>${dish.d}</p>
          <div class="dish-foot">
            <span class="dish-price">S/ ${dish.p}</span>
            <button class="dish-order ripple">Ordenar</button>
          </div>
        </div>
      </div>`;
  });
  cartaPanels.appendChild(panel);
});

document.querySelectorAll(".tab").forEach(function(tab){
  tab.addEventListener("click", function(){
    document.querySelectorAll(".tab").forEach(function(t){ t.classList.remove("active"); });
    tab.classList.add("active");
    document.querySelectorAll(".panel").forEach(function(p){ p.classList.remove("active"); });
    document.getElementById("panel-"+tab.dataset.cat).classList.add("active");
  });
});

/* Dish spotlight on hover */
document.addEventListener("mousemove", function(e){
  var card = e.target.closest && e.target.closest(".dish-img");
  if(card){
    var rect = card.getBoundingClientRect();
    var spot = card.querySelector(".dish-spot");
    if(spot){
      spot.style.setProperty("--mx", (e.clientX-rect.left)+"px");
      spot.style.setProperty("--my", (e.clientY-rect.top)+"px");
    }
  }
});

/* ===================== 10. ESPECIALIDADES ===================== */
var ESPECIALIDADES = [
  {n:"Ceviche Nacional de Corvina", d:"El plato insignia de la casa desde 2009.", p:"46", img:img("photo-1607330289024-1535c6b4e1c1",900)},
  {n:"Arroz con Mariscos", d:"Generoso, cremoso, con lo mejor del mar peruano.", p:"56", img:img("photo-1512058564366-18510be2db19",900)},
  {n:"Lomo a la Parrilla", d:"Corte premium madurado y brasa lenta.", p:"68", img:img("photo-1546833999-b9f581a1996d",900)}
];
var espGrid = document.getElementById("especialidadesGrid");
ESPECIALIDADES.forEach(function(d){
  var card = document.createElement("div");
  card.className = "esp-card";
  card.innerHTML = `
    <span class="esp-tag">Chef Recomendado</span>
    <img src="${d.img}" alt="${d.n}" loading="lazy">
    <div class="esp-overlay">
      <h4>${d.n}</h4>
      <p>${d.d}</p>
      <span class="esp-price">S/ ${d.p}</span>
    </div>`;
  espGrid.appendChild(card);
  revealObserver.observe(card);
});

/* ===================== 11. EXPERIENCIA GASTRONÓMICA (lightbox) ===================== */
var EXPERIENCIA = [
  img("photo-1414235077428-338989a2e8c0",1000),
  img("photo-1517248135467-4c7edcad34c4",700),
  img("photo-1577106263724-2c8e03bfe9cf",700),
  img("photo-1544148103-0773bf10d330",700),
  img("photo-1552566626-52f8b828add9",700),
  img("photo-1414235077428-338989a2e8c0",700)
];
var expGrid = document.getElementById("experienciaGrid");
EXPERIENCIA.forEach(function(src){
  var item = document.createElement("div");
  item.className = "exp-item";
  item.innerHTML = `<img src="${src}" alt="Experiencia gastronómica La Nacional" loading="lazy">`;
  item.addEventListener("click", function(){ openLightbox(src); });
  expGrid.appendChild(item);
  revealObserver.observe(item);
});

var lightbox = document.getElementById("lightbox");
var lightboxImg = document.getElementById("lightboxImg");
function openLightbox(src){
  lightboxImg.src = src;
  lightbox.classList.add("open");
  document.body.style.overflow = "hidden";
}
document.getElementById("lightboxClose").addEventListener("click", closeLightbox);
lightbox.addEventListener("click", function(e){ if(e.target === lightbox) closeLightbox(); });
function closeLightbox(){
  lightbox.classList.remove("open");
  document.body.style.overflow = "";
}

/* ===================== 12. GALERÍA MASONRY ===================== */
var GALERIA = [
  {src:img("photo-1414235077428-338989a2e8c0",700), cat:"ambiente"},
  {src:img("photo-1607330289024-1535c6b4e1c1",700), cat:"comida"},
  {src:img("photo-1544025162-d76694265947",700), cat:"comida"},
  {src:img("photo-1517248135467-4c7edcad34c4",900), cat:"ambiente"},
  {src:img("photo-1414235077428-338989a2e8c0",600), cat:"eventos"},
  {src:img("photo-1512058564366-18510be2db19",700), cat:"comida"},
  {src:img("photo-1577106263724-2c8e03bfe9cf",900), cat:"eventos"},
  {src:img("photo-1546833999-b9f581a1996d",700), cat:"comida"},
  {src:img("photo-1552566626-52f8b828add9",800), cat:"ambiente"}
];
var masonry = document.getElementById("masonryGrid");
GALERIA.forEach(function(g){
  var item = document.createElement("div");
  item.className = "m-item";
  item.dataset.cat = g.cat;
  item.innerHTML = `<img src="${g.src}" alt="Galería La Nacional - ${g.cat}" loading="lazy">`;
  item.addEventListener("click", function(){ openLightbox(g.src); });
  masonry.appendChild(item);
});
var masonryObserver = new IntersectionObserver(function(entries){
  entries.forEach(function(en){
    if(en.isIntersecting){ en.target.classList.add("show"); masonryObserver.unobserve(en.target); }
  });
}, {threshold:0.1});
document.querySelectorAll(".m-item").forEach(function(el){ masonryObserver.observe(el); });

document.querySelectorAll(".filter").forEach(function(btn){
  btn.addEventListener("click", function(){
    document.querySelectorAll(".filter").forEach(function(b){ b.classList.remove("active"); });
    btn.classList.add("active");
    var f = btn.dataset.filter;
    document.querySelectorAll(".m-item").forEach(function(item){
      var show = (f === "todo" || item.dataset.cat === f);
      item.classList.toggle("hide", !show);
      if(show){ item.classList.remove("show"); requestAnimationFrame(function(){ item.classList.add("show"); }); }
    });
  });
});

/* ===================== 13. OPINIONES (carousel) ===================== */
var REVIEWS = [
  {q:"La mejor comida peruana que probé en Miraflores.", n:"María Fernández", img:img("photo-1524504388940-b1c1722653e1",120)},
  {q:"Excelente atención y un ambiente increíble.", n:"Jorge Salinas", img:img("photo-1500648767791-00dcc994a43e",120)},
  {q:"Una experiencia gastronómica que vale totalmente la pena.", n:"Lucía Ramos", img:img("photo-1531123897727-8f129e1688ce",120)},
  {q:"El ceviche y la atención dejaron a toda mi familia encantada.", n:"Andrés Chávez", img:img("photo-1507003211169-0a1dd7228f2d",120)}
];
var track = document.getElementById("carouselTrack");
var dotsWrap = document.getElementById("carouselDots");
REVIEWS.forEach(function(r, i){
  track.innerHTML += `
    <div class="review">
      <div class="review-stars">★★★★★</div>
      <p class="quote">"${r.q}"</p>
      <div class="review-person"><img src="${r.img}" alt="${r.n}" loading="lazy"><span>${r.n}</span></div>
    </div>`;
  var d = document.createElement("button");
  if(i===0) d.className = "active";
  d.addEventListener("click", function(){ goToSlide(i); });
  dotsWrap.appendChild(d);
});
var slideIndex = 0;
function goToSlide(i){
  slideIndex = (i + REVIEWS.length) % REVIEWS.length;
  track.style.transform = "translateX(-"+(slideIndex*100)+"%)";
  dotsWrap.querySelectorAll("button").forEach(function(d,idx){ d.classList.toggle("active", idx===slideIndex); });
}
var carouselTimer = setInterval(function(){ goToSlide(slideIndex+1); }, 5500);
document.getElementById("carousel").addEventListener("mouseenter", function(){ clearInterval(carouselTimer); });
document.getElementById("carousel").addEventListener("mouseleave", function(){ carouselTimer = setInterval(function(){ goToSlide(slideIndex+1); }, 5500); });

/* ===================== 14. FORMULARIO DE RESERVAS (envío real vía Web3Forms) ===================== */
var form = document.getElementById("reservaForm");
var successOverlay = document.getElementById("successOverlay");
var submitBtn = document.getElementById("reservaSubmitBtn");
var formStatus = document.getElementById("formStatus");

/* Restringe fecha mínima a hoy */
var fechaInput = document.getElementById("rFecha");
fechaInput.min = new Date().toISOString().split("T")[0];

form.addEventListener("submit", function(e){
  e.preventDefault();
  formStatus.textContent = "";
  formStatus.classList.remove("ok");

  /* Validación de campos requeridos */
  var valid = true;
  var fields = form.querySelectorAll(".field");
  fields.forEach(function(f){
    var input = f.querySelector("input,textarea");
    if(!input || !input.hasAttribute("required")) return;
    var ok = input.checkValidity() && input.value.trim() !== "";
    f.classList.toggle("invalid", !ok);
    if(!ok) valid = false;
  });
  if(!valid) return;

  var accessKey = form.querySelector('input[name="access_key"]').value;
  if(!accessKey || accessKey === "PEGA_AQUI_TU_ACCESS_KEY"){
    formStatus.textContent = "Falta configurar la clave de envío (access_key) en el formulario. Revisa las instrucciones en script.js.";
    return;
  }

  submitBtn.setAttribute("disabled", "true");
  submitBtn.textContent = "Enviando...";

  var data = new FormData(form);

  fetch("https://api.web3forms.com/submit", {
    method: "POST",
    headers: { "Accept": "application/json" },
    body: data
  })
  .then(function(res){ return res.json(); })
  .then(function(result){
    submitBtn.removeAttribute("disabled");
    submitBtn.textContent = "Reservar Mesa";
    if(result.success){
      successOverlay.classList.add("show");
      form.reset();
    }else{
      formStatus.textContent = "No se pudo enviar la reserva: " + (result.message || "intente nuevamente.");
    }
  })
  .catch(function(){
    submitBtn.removeAttribute("disabled");
    submitBtn.textContent = "Reservar Mesa";
    formStatus.textContent = "Error de conexión. Verifique su internet e intente nuevamente, o escríbanos por WhatsApp.";
  });
});
document.getElementById("successClose").addEventListener("click", function(){
  successOverlay.classList.remove("show");
});

/* ===================== 15. RECOMENDACIÓN DEL CHEF (rota según el día) ===================== */
var CHEF_DISHES = [
  {n:"Ceviche Nacional de Corvina", d:"Corvina del día en leche de tigre clásica, camote glaseado, choclo serrano y cancha crocante. El plato que nos define."},
  {n:"Arroz con Mariscos", d:"Arroz cremoso al ají amarillo con langostinos, calamar y conchas frescas del día."},
  {n:"Lomo a la Parrilla con Camote", d:"Corte premium a la brasa de carbón, puré de camote ahumado y reducción de chicha morada."},
  {n:"Tiradito Nikkei", d:"Finas láminas de pescado bañadas en salsa de soya, sésamo tostado y un toque de rocoto."}
];
var todayDish = CHEF_DISHES[new Date().getDay() % CHEF_DISHES.length];
document.getElementById("chefDishName").textContent = todayDish.n;
document.getElementById("chefDishDesc").textContent = todayDish.d;

})();