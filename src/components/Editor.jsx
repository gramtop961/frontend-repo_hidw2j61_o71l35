import React, { useMemo, useRef, useState, useEffect } from 'react';
import { Download, Eraser, MousePointer2, Move, Plus, Shapes, Type, ArrowRight, MinusCircle, Copy, Trash2 } from 'lucide-react';

// Element Types
// rect, ellipse, text, arrow

const defaultStyle = {
  fill: 'rgba(255,255,255,0.14)',
  stroke: 'rgba(255,255,255,0.6)',
  strokeWidth: 2,
  fontSize: 18,
};

function uid() {
  return Math.random().toString(36).slice(2, 9);
}

export default function Editor() {
  const svgRef = useRef(null);
  const [elements, setElements] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const [tool, setTool] = useState('select');
  const [grid, setGrid] = useState(true);

  const selected = useMemo(() => elements.find(e => e.id === selectedId) || null, [elements, selectedId]);

  // Pointer interactions: drag move
  useEffect(() => {
    function onMove(e) {
      if (!dragRef.current.active) return;
      const { type, id, offsetX, offsetY } = dragRef.current;
      const pt = getSvgPoint(e);
      setElements(prev => prev.map(el => {
        if (el.id !== id) return el;
        if (type === 'move') {
          return { ...el, x: pt.x - offsetX, y: pt.y - offsetY };
        }
        if (type === 'arrow-a') {
          return { ...el, x: pt.x, y: pt.y };
        }
        if (type === 'arrow-b') {
          return { ...el, x2: pt.x, y2: pt.y };
        }
        return el;
      }));
    }
    function onUp() {
      dragRef.current = { active: false };
    }
    window.addEventListener('pointermove', onMove);
    window.addEventListener('pointerup', onUp);
    return () => {
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerup', onUp);
    };
  }, []);

  const dragRef = useRef({ active: false });

  function getSvgPoint(e) {
    const svg = svgRef.current;
    const pt = svg.createSVGPoint();
    pt.x = e.clientX; pt.y = e.clientY;
    const screenCTM = svg.getScreenCTM();
    const inv = screenCTM.inverse();
    const loc = pt.matrixTransform(inv);
    // Snap to grid if enabled
    const snap = grid ? 4 : 1;
    return { x: Math.round(loc.x / snap) * snap, y: Math.round(loc.y / snap) * snap };
  }

  function addElement(kind) {
    const id = uid();
    if (kind === 'rect') {
      setElements(prev => [...prev, { id, type: 'rect', x: 200, y: 160, w: 200, h: 120, ...defaultStyle, rx: 16 }]);
    } else if (kind === 'ellipse') {
      setElements(prev => [...prev, { id, type: 'ellipse', x: 360, y: 280, rx: 90, ry: 60, ...defaultStyle }]);
    } else if (kind === 'text') {
      setElements(prev => [...prev, { id, type: 'text', x: 260, y: 240, text: 'Label', ...defaultStyle, fill: 'white' }]);
    } else if (kind === 'arrow') {
      setElements(prev => [...prev, { id, type: 'arrow', x: 180, y: 180, x2: 360, y2: 260, ...defaultStyle }]);
    }
    setSelectedId(id);
    setTool('select');
  }

  function onCanvasPointerDown(e) {
    // For drawing future tools; currently select-only
    if (e.target === svgRef.current) {
      setSelectedId(null);
    }
  }

  function startDrag(id, type, e) {
    e.stopPropagation();
    const pt = getSvgPoint(e);
    const el = elements.find(x => x.id === id);
    const offsetX = pt.x - (type === 'move' ? el.x : 0);
    const offsetY = pt.y - (type === 'move' ? el.y : 0);
    dragRef.current = { active: true, type, id, offsetX, offsetY };
    setSelectedId(id);
  }

  function duplicateSelected() {
    if (!selected) return;
    const id = uid();
    const copy = { ...selected, id, x: (selected.x || 0) + 24, y: (selected.y || 0) + 24, x2: selected.x2 ? selected.x2 + 24 : undefined, y2: selected.y2 ? selected.y2 + 24 : undefined };
    setElements(prev => [...prev, copy]);
    setSelectedId(id);
  }

  function deleteSelected() {
    if (!selected) return;
    setElements(prev => prev.filter(e => e.id !== selected.id));
    setSelectedId(null);
  }

  function updateSelected(patch) {
    if (!selected) return;
    setElements(prev => prev.map(el => (el.id === selected.id ? { ...el, ...patch } : el)));
  }

  async function exportPNG() {
    const svgEl = svgRef.current;
    const serializer = new XMLSerializer();
    const source = serializer.serializeToString(svgEl);
    const svgBlob = new Blob([source], { type: 'image/svg+xml;charset=utf-8' });
    const url = URL.createObjectURL(svgBlob);

    const img = new Image();
    const width = svgEl.viewBox.baseVal.width || svgEl.clientWidth;
    const height = svgEl.viewBox.baseVal.height || svgEl.clientHeight;

    await new Promise((resolve, reject) => {
      img.onload = () => resolve();
      img.onerror = reject;
      img.src = url;
    });

    const canvas = document.createElement('canvas');
    canvas.width = width; canvas.height = height;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(img, 0, 0);
    URL.revokeObjectURL(url);

    const a = document.createElement('a');
    a.download = 'figure.png';
    a.href = canvas.toDataURL('image/png');
    a.click();
  }

  return (
    <section id="editor" className="relative w-full bg-slate-950 py-20 text-white">
      <div className="mx-auto max-w-7xl px-6">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-semibold">Canvas Editor</h2>
            <p className="text-white/70">Build graphical abstracts with glassmorphic widgets.</p>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={() => setGrid(g => !g)} className="rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm backdrop-blur-md">{grid ? 'Hide Grid' : 'Show Grid'}</button>
            <button onClick={exportPNG} className="inline-flex items-center gap-2 rounded-xl border border-cyan-300/20 bg-cyan-400/10 px-3 py-2 text-sm text-cyan-200 backdrop-blur-md"><Download className="h-4 w-4"/> Export PNG</button>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 lg:grid-cols-[220px_1fr_260px]">
          {/* Tools */}
          <div className="h-full rounded-2xl border border-white/10 bg-white/5 p-3 backdrop-blur-xl">
            <div className="mb-3 text-xs uppercase tracking-wide text-white/60">Tools</div>
            <div className="grid grid-cols-2 gap-2">
              <ToolButton active={tool==='select'} onClick={() => setTool('select')} icon={<MousePointer2 className="h-4 w-4"/>} label="Select"/>
              <ToolButton onClick={() => addElement('rect')} icon={<Shapes className="h-4 w-4"/>} label="Rect"/>
              <ToolButton onClick={() => addElement('ellipse')} icon={<Plus className="h-4 w-4"/>} label="Ellipse"/>
              <ToolButton onClick={() => addElement('text')} icon={<Type className="h-4 w-4"/>} label="Text"/>
              <ToolButton onClick={() => addElement('arrow')} icon={<ArrowRight className="h-4 w-4"/>} label="Arrow"/>
              <ToolButton onClick={duplicateSelected} icon={<Copy className="h-4 w-4"/>} label="Duplicate"/>
              <ToolButton onClick={deleteSelected} icon={<Trash2 className="h-4 w-4"/>} label="Delete"/>
              <ToolButton onClick={() => setElements([])} icon={<Eraser className="h-4 w-4"/>} label="Clear"/>
            </div>
          </div>

          {/* Canvas */}
          <div className="relative min-h-[520px] rounded-2xl border border-white/10 bg-gradient-to-b from-slate-900/70 to-slate-900/30 p-3 shadow-2xl backdrop-blur-2xl">
            <div className="pointer-events-none absolute inset-0 rounded-2xl ring-1 ring-white/5" />
            <svg
              ref={svgRef}
              onPointerDown={onCanvasPointerDown}
              viewBox="0 0 1200 800"
              className="h-[60vh] w-full rounded-xl bg-[radial-gradient(transparent_1px,rgba(255,255,255,0.04)_1px)] [background-size:16px_16px]"
            >
              <defs>
                <marker id="arrowHead" markerWidth="8" markerHeight="8" refX="8" refY="4" orient="auto-start-reverse">
                  <path d="M0,0 L8,4 L0,8 z" fill="rgba(255,255,255,0.8)" />
                </marker>
                <filter id="glass" x="-20%" y="-20%" width="140%" height="140%">
                  <feGaussianBlur in="SourceGraphic" stdDeviation="0.3" />
                </filter>
              </defs>

              {/* Optional grid lines */}
              {grid && (
                <g>
                  {Array.from({ length: 1200 / 40 + 1 }, (_, i) => (
                    <line key={'v'+i} x1={i * 40} y1={0} x2={i * 40} y2={800} stroke="rgba(255,255,255,0.03)" />
                  ))}
                  {Array.from({ length: 800 / 40 + 1 }, (_, i) => (
                    <line key={'h'+i} x1={0} y1={i * 40} x2={1200} y2={i * 40} stroke="rgba(255,255,255,0.03)" />
                  ))}
                </g>
              )}

              {elements.map((el) => {
                const isSel = selectedId === el.id;
                if (el.type === 'rect') {
                  return (
                    <g key={el.id} onPointerDown={(e) => startDrag(el.id, 'move', e)}>
                      <rect x={el.x} y={el.y} width={el.w} height={el.h} rx={el.rx || 0}
                        fill={el.fill} stroke={el.stroke} strokeWidth={el.strokeWidth}
                        style={{ filter: 'url(#glass)' }} />
                      {isSel && (
                        <rect x={el.x-6} y={el.y-6} width={el.w+12} height={el.h+12} fill="none" stroke="rgba(56,189,248,0.6)" strokeDasharray="6 6" />
                      )}
                    </g>
                  );
                }
                if (el.type === 'ellipse') {
                  return (
                    <g key={el.id} onPointerDown={(e) => startDrag(el.id, 'move', e)}>
                      <ellipse cx={el.x} cy={el.y} rx={el.rx} ry={el.ry}
                        fill={el.fill} stroke={el.stroke} strokeWidth={el.strokeWidth}
                        style={{ filter: 'url(#glass)' }} />
                      {isSel && (
                        <ellipse cx={el.x} cy={el.y} rx={(el.rx||0)+10} ry={(el.ry||0)+10} fill="none" stroke="rgba(56,189,248,0.6)" strokeDasharray="6 6" />
                      )}
                    </g>
                  );
                }
                if (el.type === 'text') {
                  return (
                    <g key={el.id} onPointerDown={(e) => startDrag(el.id, 'move', e)}>
                      <text x={el.x} y={el.y} fontSize={el.fontSize} fill={el.fill} style={{ userSelect: 'none' }}>
                        {el.text}
                      </text>
                      {isSel && (
                        <rect x={el.x-8} y={el.y-(el.fontSize||18)-8} width={(el.text?.length||5)*(el.fontSize||18)*0.6+16} height={(el.fontSize||18)+16} fill="none" stroke="rgba(56,189,248,0.6)" strokeDasharray="6 6" />
                      )}
                    </g>
                  );
                }
                if (el.type === 'arrow') {
                  return (
                    <g key={el.id}>
                      <line x1={el.x} y1={el.y} x2={el.x2} y2={el.y2} stroke={el.stroke} strokeWidth={el.strokeWidth} markerEnd="url(#arrowHead)" />
                      {/* drag handles */}
                      <circle cx={el.x} cy={el.y} r={8} fill="rgba(59,130,246,0.35)" stroke="rgba(255,255,255,0.8)" onPointerDown={(e)=>startDrag(el.id,'arrow-a',e)} />
                      <circle cx={el.x2} cy={el.y2} r={8} fill="rgba(20,184,166,0.35)" stroke="rgba(255,255,255,0.8)" onPointerDown={(e)=>startDrag(el.id,'arrow-b',e)} />
                    </g>
                  );
                }
                return null;
              })}
            </svg>
          </div>

          {/* Inspector */}
          <div className="h-full rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur-xl">
            <div className="mb-3 text-xs uppercase tracking-wide text-white/60">Inspector</div>
            {!selected && <div className="text-sm text-white/60">Select an element to edit its properties.</div>}
            {selected && (
              <div className="space-y-4">
                <Row label="Type"><span className="rounded-md bg-white/10 px-2 py-1 text-xs">{selected.type}</span></Row>
                {'w' in selected && (
                  <Row label="Size">
                    <NumberInput label="W" value={selected.w} onChange={(v)=>updateSelected({ w: v })} />
                    <NumberInput label="H" value={selected.h} onChange={(v)=>updateSelected({ h: v })} />
                  </Row>
                )}
                {'rx' in selected && (
                  <Row label="Radius"><NumberInput value={selected.rx} onChange={(v)=>updateSelected({ rx: v })} /></Row>
                )}
                {selected.type==='ellipse' && (
                  <Row label="Radii">
                    <NumberInput label="RX" value={selected.rx} onChange={(v)=>updateSelected({ rx: v })} />
                    <NumberInput label="RY" value={selected.ry} onChange={(v)=>updateSelected({ ry: v })} />
                  </Row>
                )}
                {selected.type==='text' && (
                  <>
                    <Row label="Text">
                      <input className="w-full rounded-md border border-white/10 bg-white/10 px-2 py-1 text-sm outline-none" value={selected.text} onChange={(e)=>updateSelected({ text: e.target.value })} />
                    </Row>
                    <Row label="Font Size"><NumberInput value={selected.fontSize} onChange={(v)=>updateSelected({ fontSize: v })} /></Row>
                  </>
                )}
                <Row label="Fill">
                  <input type="color" className="h-8 w-full cursor-pointer rounded-md border border-white/10 bg-transparent" value= { rgbaToHex(selected.fill)} onChange={(e)=>updateSelected({ fill: e.target.value })} />
                </Row>
                <Row label="Stroke">
                  <input type="color" className="h-8 w-full cursor-pointer rounded-md border border-white/10 bg-transparent" value={rgbaToHex(selected.stroke)} onChange={(e)=>updateSelected({ stroke: e.target.value })} />
                </Row>
                <Row label="Stroke W"><NumberInput value={selected.strokeWidth} onChange={(v)=>updateSelected({ strokeWidth: v })} /></Row>
                <div className="flex gap-2 pt-2">
                  <button onClick={duplicateSelected} className="flex-1 rounded-lg border border-white/10 bg-white/10 px-3 py-2 text-sm">Duplicate</button>
                  <button onClick={deleteSelected} className="flex-1 rounded-lg border border-red-400/30 bg-red-400/10 px-3 py-2 text-sm text-red-200">Delete</button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

function ToolButton({ icon, label, onClick, active }) {
  return (
    <button onClick={onClick} className={`flex flex-col items-center gap-1 rounded-xl border px-3 py-3 text-xs backdrop-blur-md transition ${active ? 'border-cyan-300/30 bg-cyan-400/10 text-cyan-200' : 'border-white/10 bg-white/5 text-white/80 hover:bg-white/10'}`}>
      {icon}
      {label}
    </button>
  );
}

function Row({ label, children }) {
  return (
    <div className="grid grid-cols-3 items-center gap-2">
      <div className="col-span-1 text-xs text-white/60">{label}</div>
      <div className="col-span-2 flex items-center gap-2">{children}</div>
    </div>
  );
}

function NumberInput({ value, onChange, label }) {
  return (
    <label className="flex items-center gap-2">
      {label && <span className="text-xs text-white/50">{label}</span>}
      <input
        type="number"
        className="w-20 rounded-md border border-white/10 bg-white/10 px-2 py-1 text-sm outline-none"
        value={Number.isFinite(value) ? value : 0}
        onChange={(e)=>onChange(Number(e.target.value))}
      />
    </label>
  );
}

// Utility to transform rgba string to hex for input[type=color]
function rgbaToHex(rgba) {
  if (!rgba) return '#ffffff';
  if (rgba.startsWith('#')) return rgba;
  const m = rgba.match(/rgba?\((\d+),\s?(\d+),\s?(\d+)/i);
  if (!m) return '#ffffff';
  const r = parseInt(m[1], 10).toString(16).padStart(2, '0');
  const g = parseInt(m[2], 10).toString(16).padStart(2, '0');
  const b = parseInt(m[3], 10).toString(16).padStart(2, '0');
  return `#${r}${g}${b}`;
}
