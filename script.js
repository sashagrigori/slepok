// Слепок — интерактив лендинга: интро, бегущие строки, «праздник», отзывы, карта, форма
const $ = (s, r = document) => r.querySelector(s), $$ = (s, r = document) => [...r.querySelectorAll(s)];
const root = document.documentElement;
const K = 1 / 1.05; // the prototype frame in Figma is 1512 wide; the layout is 1440

// intro of the first screen
addEventListener("load", () => requestAnimationFrame(() => root.classList.add("ready")));
setTimeout(() => root.classList.add("ready"), 2500);

// word cloud
const WORDS = ["экспериментальная керамика", "вдохновение", "поддержка", "смелые идеи", "уютная атмосфера", "опытные мастера", "яркие впечатления", "мастер-классы", "лепка", "праздники", "веселье", "ошибаемся и развлекаемся", "пробуем новое"];
$("#cloudText").textContent = Array(5).fill(WORDS.join("      +      ")).join("      +      ");

// running lines: one set of items, doubled, shifted by half
$$(".ticker").forEach(t => {
  const one = t.dataset.word.split("|").map(w => `<span>${w}</span><i><img src="img/star-line.svg" alt=""></i>`).join("");
  const set = Array(14).fill(one).join("");
  t.innerHTML = `<div class="tk">${set}${set}</div>`;
});
// running lines crawl at a calm, equal speed whatever the phrase length
const speed = () => $$(".tk").forEach(tk => tk.style.animationDuration = (tk.scrollWidth / 2 / 60) + "s");
addEventListener("load", speed); speed();
$$(".tg-row").forEach(p => p.textContent = "давай слепим вместе ".repeat(40));

// celebration: once the section is in view the cards fall one by one (delays in CSS)
const party = $("#party");
new IntersectionObserver((es, o) => es.forEach(e => { if (e.isIntersecting) { party.classList.add("in"); o.disconnect(); } }), { threshold: .35 }).observe(party);

// photos: a horizontally scrollable row, as in the prototype (overflow: horizontal); the mouse can drag it
const strip = $("#photos");
let drag = null;
strip.addEventListener("pointerdown", e => { if (e.pointerType !== "mouse") return; drag = { x: e.clientX, left: strip.scrollLeft, moved: false }; strip.classList.add("grab"); });
addEventListener("pointermove", e => { if (!drag) return; const z = parseFloat(getComputedStyle(root).getPropertyValue("--z")) || 1;
  const dx = (e.clientX - drag.x) / z; if (Math.abs(dx) > 3) drag.moved = true; strip.scrollLeft = drag.left - dx; });
addEventListener("pointerup", () => { drag = null; strip.classList.remove("grab"); });
strip.addEventListener("dragstart", e => e.preventDefault());

// reviews: a pile from the Figma stack that spreads into a row when the section is reached
const PILE = [[693.5, 11.37], [730.3, 0], [750.9, -6.11], [785, 3.91]], ROW = [[193.5, -4], [544.5, 3], [895.5, -2.5], [1246.5, 4]];
const pile = $("#pile"), notes = $$(".rev", pile);
const lay = spread => notes.forEach((n, i) => { const [cx, r] = (spread ? ROW : PILE)[i]; n.style.transform = `translateX(${cx - 165.5}px) rotate(${r}deg)`; n.style.zIndex = i; });
lay(false);
new IntersectionObserver(es => es.forEach(e => { const on = e.isIntersecting; pile.classList.toggle("spread", on); lay(on); }), { threshold: .45 }).observe(pile);

// map, coordinates as in Figma (1512 frame)
const RECTS = [[21,458.85,149.509,56.581,-3.26,147,48.3],[63.51,66.05,64.082,151.4,83.72,147,48.3],[363.32,128.97,84.437,146.46,-74.08,138.525,48.3],[328.65,278.72,72.924,106.088,-74.08,96.544,48.3],
  [302.4,189,68.885,91.925,-74.08,81.816,48.3],[126,410.55,42,24.15,0,42,24.15],[74.55,427.35,42,24.15,0,42,24.15],[39.11,343.24,85.488,54.823,-4.69,81.816,48.3],
  [59.81,224.7,22.793,23.589,167.42,18.9,19.95],[66.67,255.44,22.793,23.589,167.42,18.9,19.95],[72.84,283.11,22.793,23.589,167.42,18.9,19.95],[79.02,310.78,22.793,23.589,167.42,18.9,19.95],
  [273,306.6,15.75,15.75,0,15.75,15.75],[290.85,308.7,15.75,15.75,0,15.75,15.75],[290.85,283.5,15.75,15.75,0,15.75,15.75],[51.89,285.64,22.564,22.564,167.42,18.9,18.9],[58.07,313.31,22.793,23.589,167.42,18.9,19.95],
  [593.47,439.95,20.825,26.2,103.86,23.1,15.75],[585.14,464.93,20.825,26.2,103.86,23.1,15.75],[574.28,491.45,20.825,26.2,103.86,23.1,15.75],[447.3,649.95,22.755,19.505,11.83,19.95,15.75],
  [565.95,516.43,20.825,26.2,103.86,23.1,15.75],[469.48,656.74,22.755,19.505,11.83,19.95,15.75],
  [40.74,596,101.262,53.833,-3.26,98.675,48.3],[421.29,397.33,77.475,108.968,108.76,98.675,48.3],[435.82,527.04,49.533,58.917,17.44,36.081,50.422],[491.4,536.55,67.1,74.046,18.03,50.575,61.406],
  [405.3,100.04,51.293,29.48,-75.89,18.255,48.3],[491.4,472.81,43.176,43.194,-167.22,36.081,36.105],[522.9,226.8,43.176,43.194,-167.22,36.081,36.105],[347.38,713.37,61.96,57.906,-56.53,36.081,50.422],
  [372.94,647.04,79.197,76.292,-55.93,50.575,61.406],[308.64,650.31,49.025,49.016,118.82,36.081,36.105],[95.86,741.1,51.839,38.09,-87.68,36.081,50.422],[89.52,666.75,63.896,53.629,-87.09,50.575,61.406],
  [29.4,707,37.546,37.524,87.66,36.081,36.105],[330.72,585.9,36.951,41.666,118.82,34.924,22.961],[298.59,732.7,27.759,37.871,98.3,34.924,22.961],[461.18,286.54,66.091,107.79,-162.79,37.867,101.113],
  [510.3,94.5,66.091,107.79,-162.79,37.867,101.113],[293.3,396.07,72.022,106.639,12.53,52.075,97.668,"#161616"]];
const ROADS = [["map-v3",189.33,-42,158.749,890.971,"-0.13% 0.62% -0.57% -5.34%"],["map-v4",443.92,-8.4,233.954,811.885,"0 -5.21% -1.16% -4.01%"],["map-v",361.06,-0.53,172.344,536.628,"0 -7.62% -0.91% -7.07%"],
  ["map-v5",510.3,457.8,233.625,359.1,"-3.11% 0 -0.88% -3.82%"],["map-v1",-1.05,537.6,746.55,166.95,"-7.86% 0"]];
const STREETS = [[108.47,524.51,114.443,33.242,-3.7,"обжиговая"],[393.75,312.56,79.391,106.573,-71.55,"глиняная",1],[604.8,554.23,53.841,63.671,-57.16,"шоссе"]];
const px = v => (v * K).toFixed(2) + "px";
const box = (l, t, w, h) => `left:${px(l)};top:${px(t)};width:${px(w)};height:${px(h)}`;
$("#map").innerHTML =
  ROADS.map(([f, l, t, w, h, inset]) => `<div class="v" style="${box(l, t, w, h)}"><div style="position:absolute;inset:${inset}"><img src="img/${f}.svg" alt="" style="width:100%;height:100%"></div></div>`).join("") +
  RECTS.map(([l, t, w, h, r, iw, ih, c]) => `<div class="m" style="${box(l, t, w, h)}"><div style="width:${px(iw)};height:${px(ih)};rotate:${r}deg;background:${c || "#ebebeb"}"></div></div>`).join("") +
  // the second label is a two-line text box in Figma (the second line is empty), so its word sits half a line higher
  STREETS.map(([l, t, w, h, r, s, two]) => `<div class="m" style="${box(l, t, w, h)}"><span class="st" style="rotate:${r}deg${two ? ";padding-bottom:25px" : ""}">${s}</span></div>`).join("") +
  `<img class="pin" src="img/map-pin.svg" alt="" style="left:${px(289.8)};top:${px(304.5)};width:${px(114.45)};height:${px(114.45)}">`;

// form
const modal = $("#modal"), form = $("#form"), thanks = $("#thanks"), sel = $("#select"), selVal = $("#selVal");
const open = service => { form.reset(); $$(".field", form).forEach(f => f.classList.remove("bad"));
  selVal.textContent = service || "вид услуги"; sel.classList.remove("open");
  thanks.hidden = true; form.hidden = false; modal.hidden = false; document.body.style.overflow = "hidden"; };
const close = () => { modal.hidden = true; document.body.style.overflow = ""; };
document.addEventListener("click", e => { const t = e.target.closest("[data-form]"); if (!t) return; e.preventDefault(); open(t.dataset.form); });
$$("[data-close]").forEach(b => b.addEventListener("click", close));
modal.addEventListener("click", e => { if (e.target === modal) close(); });
addEventListener("keydown", e => { if (e.key === "Escape" && !modal.hidden) close(); });
$(".sel-btn").addEventListener("click", () => sel.classList.toggle("open"));
$$(".sel-list li").forEach(li => li.addEventListener("click", () => { selVal.textContent = li.textContent; sel.classList.remove("open"); }));
const phone = $("#phone");
phone.addEventListener("input", () => { let d = phone.value.replace(/\D/g, ""); if (d.startsWith("7") || d.startsWith("8")) d = d.slice(1); d = d.slice(0, 10);
  const p = [d.slice(0, 3), d.slice(3, 6), d.slice(6, 8), d.slice(8, 10)];
  phone.value = d ? `+7 (${p[0]}${d.length > 3 ? ") " + p[1] : ""}${d.length > 6 ? "-" + p[2] : ""}${d.length > 8 ? "-" + p[3] : ""}` : ""; });
form.addEventListener("submit", e => { e.preventDefault();
  const name = form.elements.name, ok1 = name.value.trim().length > 1, ok2 = phone.value.replace(/\D/g, "").length === 11;
  name.classList.toggle("bad", !ok1); phone.classList.toggle("bad", !ok2);
  if (ok1 && ok2) { form.hidden = true; thanks.hidden = false; } });

// certificate: the floating pieces drift a little after the cursor
const art = $$(".cert-art img"), DEPTH = [10, 6, 16, 12];
$("#cert").addEventListener("mousemove", e => { const r = e.currentTarget.getBoundingClientRect(), dx = (e.clientX - r.left) / r.width - .5, dy = (e.clientY - r.top) / r.height - .5;
  art.forEach((im, i) => im.style.transform = `translate(${dx * DEPTH[i]}px,${dy * DEPTH[i]}px)`); });
$("#cert").addEventListener("mouseleave", () => art.forEach(im => im.style.transform = ""));

// no hanging short words at line ends
const SHORT = /(^|[\s(«])(в|во|на|с|со|к|ко|у|о|об|и|а|но|по|от|до|за|из|не|ни|для|под|при|или|что|как|мы|ты)\s/gi;
const walk = n => { if (n.nodeType === 3) { n.nodeValue = n.nodeValue.replace(SHORT, "$1$2 ").replace(SHORT, "$1$2 ").replace(/\s—/g, " —"); } else if (!/^(SCRIPT|STYLE)$/.test(n.nodeName) && !n.closest?.(".tk,.tg-row,#cloudText")) n.childNodes.forEach(walk); };
walk(document.body);

// phone menu
const burger = $("[data-menu]");
burger.addEventListener("click", () => root.classList.toggle("menu-open"));
$$(".top-nav a").forEach(a => a.addEventListener("click", () => root.classList.remove("menu-open")));
