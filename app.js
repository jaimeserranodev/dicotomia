
Copiar

/* ═══════════════════════════════════════════════════════
   DICOTOMÍA DE CONTROL — app.js
   Vanilla JS, sin dependencias
═══════════════════════════════════════════════════════ */
 
const STORAGE_KEY = 'dicotomia_v1';
 
function cargarDatos() {
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY)) || { soltar: [], accion: [] }; }
  catch { return { soltar: [], accion: [] }; }
}
function guardarDatos(datos) { localStorage.setItem(STORAGE_KEY, JSON.stringify(datos)); }
 
const FRASES = [
  'No todo requiere tu energía.',
  'Soltar también es avanzar.',
  'Hay cosas que no puedes controlar, y eso está bien.',
  'Puedes dejar esto aquí.',
  'La paz empieza cuando dejas de luchar contra lo inevitable.',
  'No es rendirse. Es elegir tus batallas.',
  'Lo que no depende de ti, no merece tu descanso.',
  'Exhala. Esto ya no es tuyo.',
];
function fraseCalmante() { return FRASES[Math.floor(Math.random() * FRASES.length)]; }
 
let estado = { problema: '', accion: '' };
let screenActual = 'inicio';
let screenAnteriorHistorial = 'inicio';
 
function irA(id) {
  if (id === 'historial') screenAnteriorHistorial = screenActual;
  const anterior = document.getElementById('screen-' + screenActual);
  const siguiente = document.getElementById('screen-' + id);
  if (!siguiente || screenActual === id) return;
  anterior.classList.add('leaving');
  siguiente.classList.add('active');
  anterior.addEventListener('transitionend', () => {
    anterior.classList.remove('active', 'leaving');
  }, { once: true });
  screenActual = id;
  siguiente.scrollTop = 0;
}
 
document.addEventListener('DOMContentLoaded', () => {
  const ahora = new Date();
  document.getElementById('fecha-input').value = ahora.toISOString().split('T')[0];
  const hh = String(ahora.getHours()).padStart(2, '0');
  const mm = String(Math.ceil(ahora.getMinutes() / 15) * 15 % 60).padStart(2, '0');
  document.getElementById('hora-input').value = `${hh}:${mm}`;
 
  document.getElementById('btn-continuar').addEventListener('click', () => {
    const val = document.getElementById('problema-input').value.trim();
    if (!val) { shakeInput('problema-input'); return; }
    estado.problema = val;
    document.getElementById('decision-preview').textContent = `"${val}"`;
    irA('decision');
  });
 
  document.getElementById('problema-input').addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); document.getElementById('btn-continuar').click(); }
  });
 
  document.getElementById('btn-ver-historial').addEventListener('click', () => { renderHistorial(); irA('historial'); });
  document.getElementById('back-decision').addEventListener('click', () => irA('inicio'));
 
  document.getElementById('btn-no').addEventListener('click', () => {
    document.getElementById('frase-calmante').textContent = fraseCalmante();
    irA('soltar');
  });
 
  document.getElementById('btn-si').addEventListener('click', () => irA('accion'));
  document.getElementById('back-soltar').addEventListener('click', () => irA('decision'));
 
  document.getElementById('btn-soltar').addEventListener('click', () => {
    const datos = cargarDatos();
    datos.soltar.unshift({ id: Date.now(), problema: estado.problema, fecha: new Date().toISOString() });
    guardarDatos(datos);
    document.getElementById('confirm-title').innerHTML = 'Ya está<br>soltado.';
    document.getElementById('confirm-sub').textContent = 'Lo has dejado ir. Eso también es avanzar.';
    irA('confirmacion');
  });
 
  document.getElementById('back-accion').addEventListener('click', () => irA('decision'));
 
  document.querySelectorAll('.micro-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const txt = btn.dataset.text || '';
      const inp = document.getElementById('accion-input');
      inp.value = txt; inp.focus();
      inp.selectionStart = inp.selectionEnd = txt.length;
      document.querySelectorAll('.micro-btn').forEach(b => b.classList.remove('selected'));
      btn.classList.add('selected');
    });
  });
 
  document.getElementById('btn-agendar-paso1').addEventListener('click', () => {
    const val = document.getElementById('accion-input').value.trim();
    if (!val) { shakeInput('accion-input'); return; }
    estado.accion = val;
    irA('agendar');
  });
 
  document.getElementById('back-agendar').addEventListener('click', () => irA('accion'));
 
  document.getElementById('btn-agendar-final').addEventListener('click', () => {
    const fecha = document.getElementById('fecha-input').value;
    const hora  = document.getElementById('hora-input').value;
    if (!fecha || !hora) { alert('Por favor elige fecha y hora.'); return; }
    const datos = cargarDatos();
    datos.accion.unshift({ id: Date.now(), problema: estado.problema, accion: estado.accion, fecha, hora, estado: 'pendiente' });
    guardarDatos(datos);
    abrirCalendario(estado.problema, estado.accion, fecha, hora);
    document.getElementById('confirm-title').innerHTML = 'Ya está<br>agendado.';
    document.getElementById('confirm-sub').textContent = `"${estado.accion}" — ${formatFecha(fecha)} a las ${hora}`;
    irA('confirmacion');
  });
 
  document.getElementById('btn-reiniciar').addEventListener('click', () => {
    estado = { problema: '', accion: '' };
    document.getElementById('problema-input').value = '';
    document.getElementById('accion-input').value = '';
    document.querySelectorAll('.micro-btn').forEach(b => b.classList.remove('selected'));
    irA('inicio');
  });
 
  document.getElementById('btn-historial-desde-confirm').addEventListener('click', () => { renderHistorial(); irA('historial'); });
  document.getElementById('back-historial').addEventListener('click', () => irA(screenAnteriorHistorial || 'inicio'));
 
  document.getElementById('btn-limpiar').addEventListener('click', () => {
    if (confirm('¿Borrar todo el historial?')) { guardarDatos({ soltar: [], accion: [] }); renderHistorial(); }
  });
 
  document.querySelectorAll('.tab').forEach(tab => {
    tab.addEventListener('click', () => {
      document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
      document.querySelectorAll('.tab-content').forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      document.getElementById('tab-' + tab.dataset.tab).classList.add('active');
    });
  });
 
  if ('serviceWorker' in navigator) navigator.serviceWorker.register('service-worker.js').catch(() => {});
});
 
function shakeInput(id) {
  const el = document.getElementById(id);
  el.style.animation = 'none'; el.offsetHeight;
  el.style.animation = 'shake 0.35s ease';
  el.addEventListener('animationend', () => { el.style.animation = ''; }, { once: true });
  if (!document.getElementById('shake-style')) {
    const s = document.createElement('style'); s.id = 'shake-style';
    s.textContent = `@keyframes shake{0%,100%{transform:translateX(0)}20%{transform:translateX(-6px)}40%{transform:translateX(6px)}60%{transform:translateX(-4px)}80%{transform:translateX(4px)}}`;
    document.head.appendChild(s);
  }
}
 
function formatFecha(isoDate) {
  const [y, m, d] = isoDate.split('-');
  const meses = ['ene','feb','mar','abr','may','jun','jul','ago','sep','oct','nov','dic'];
  return `${parseInt(d)} ${meses[parseInt(m)-1]} ${y}`;
}
 
function abrirCalendario(titulo, descripcion, fecha, hora) {
  const [y, m, d] = fecha.split('-');
  const [hh, mm] = hora.split(':');
  const dtStart = `${y}${m}${d}T${hh}${mm}00`;
  const finH = String(parseInt(hh) + 1).padStart(2, '0');
  const dtEnd = `${y}${m}${d}T${finH}${mm}00`;
  const ics = ['BEGIN:VCALENDAR','VERSION:2.0','PRODID:-//Dicotomía//ES','BEGIN:VEVENT',
    `SUMMARY:${titulo}`,`DESCRIPTION:${descripcion}`,`DTSTART:${dtStart}`,`DTEND:${dtEnd}`,
    'BEGIN:VALARM','TRIGGER:-PT15M','ACTION:DISPLAY','DESCRIPTION:Recordatorio','END:VALARM',
    'END:VEVENT','END:VCALENDAR'].join('\r\n');
  const blob = new Blob([ics], { type: 'text/calendar;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a'); a.href = url; a.download = 'evento.ics'; a.click();
  setTimeout(() => URL.revokeObjectURL(url), 2000);
}
 
function renderHistorial() {
  const datos = cargarDatos();
  const listSoltar = document.getElementById('list-soltar');
  const emptySoltar = document.getElementById('empty-soltar');
  listSoltar.innerHTML = '';
  if (datos.soltar.length === 0) {
    emptySoltar.classList.add('visible');
  } else {
    emptySoltar.classList.remove('visible');
    datos.soltar.forEach(item => {
      const card = document.createElement('div');
      card.className = 'item-card';
      card.innerHTML = `<p class="item-problema">🍃 ${escapeHtml(item.problema)}</p><p class="item-meta">${formatFecha(item.fecha.split('T')[0])}</p>`;
      listSoltar.appendChild(card);
    });
  }
  const listAccion = document.getElementById('list-accion');
  const emptyAccion = document.getElementById('empty-accion');
  listAccion.innerHTML = '';
  if (datos.accion.length === 0) {
    emptyAccion.classList.add('visible');
  } else {
    emptyAccion.classList.remove('visible');
    datos.accion.forEach(item => {
      const card = document.createElement('div');
      card.className = 'item-card';
      card.innerHTML = `
        <p class="item-problema">${escapeHtml(item.problema)}</p>
        <p class="item-accion">→ ${escapeHtml(item.accion)}</p>
        <div class="item-footer">
          <span class="item-meta">${formatFecha(item.fecha)} · ${item.hora}</span>
          <div style="display:flex;align-items:center;gap:8px;">
            <span class="estado-badge estado-${item.estado}">${item.estado === 'hecho' ? '✓ Hecho' : '○ Pendiente'}</span>
            <button class="btn-toggle-estado" data-id="${item.id}">${item.estado === 'hecho' ? 'Deshacer' : 'Marcar hecho'}</button>
          </div>
        </div>`;
      listAccion.appendChild(card);
    });
    listAccion.querySelectorAll('.btn-toggle-estado').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = parseInt(btn.dataset.id);
        const d = cargarDatos();
        const item = d.accion.find(i => i.id === id);
        if (item) { item.estado = item.estado === 'hecho' ? 'pendiente' : 'hecho'; guardarDatos(d); renderHistorial(); }
      });
    });
  }
}
 
function escapeHtml(str) {
  return str.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
}
