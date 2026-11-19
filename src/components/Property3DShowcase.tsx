import {ChevronDown, ChevronUp, Layers, Sun, Sunset} from 'lucide-react';
import {useEffect, useRef, useState} from 'react';
import {
  mountPropertyScene,
  type CameraPresetId,
  type LightingPresetId,
  type PropertySceneController,
} from '../three/propertyScene';

const CAMERA_OPTIONS: Array<{id: CameraPresetId; label: string}> = [
  {id: 'overview', label: 'Visão Geral'},
  {id: 'leisure', label: 'Área de Lazer'},
  {id: 'garage', label: 'Garagem & Fachada'},
  {id: 'exploded', label: 'Vista Explodida'},
];

export function Property3DShowcase() {
  const mountRef = useRef<HTMLDivElement | null>(null);
  const controllerRef = useRef<PropertySceneController | null>(null);

  const [cameraPreset, setCameraPreset] = useState<CameraPresetId>('overview');
  const [lightingMood, setLightingMood] = useState<LightingPresetId>('day');
  const [dockCollapsed, setDockCollapsed] = useState(false);
  const [webglUnavailable, setWebglUnavailable] = useState(false);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const controller = mountPropertyScene(container, () => {
      setWebglUnavailable(true);
    });
    controllerRef.current = controller;

    return () => {
      controller.dispose();
      controllerRef.current = null;
    };
  }, []);

  const handleCameraChange = (preset: CameraPresetId) => {
    setCameraPreset(preset);
    controllerRef.current?.setCameraPreset(preset);
  };

  const handleLightingChange = (mood: LightingPresetId) => {
    setLightingMood(mood);
    controllerRef.current?.setLightingPreset(mood);
  };

  return (
    <section
      id="maquete-3d"
      data-camera-preset={cameraPreset}
      data-lighting={lightingMood}
      className="border-y border-white/10 bg-[#1F2226] py-16 text-white lg:py-20"
    >
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col justify-between gap-4 pb-8 md:flex-row md:items-end">
          <div>
            <p className="text-xs font-semibold tracking-[0.15em] text-[#E5C454]">
              Maquete Interativa 3D
            </p>
            <h2
              className="mt-2 font-serif text-3xl font-bold tracking-tight text-white sm:text-4xl"
              style={{textWrap: 'balance'}}
            >
              Explore a volumetria e implantação dos espaços
            </h2>
          </div>
          <p className="max-w-md text-sm leading-relaxed text-neutral-300">
            Gire, aproxime ou alterne os ângulos de câmera para visualizar a integração entre garagem
            coberta, cozinha, piscina com hidromassagem e espaço gourmet.
          </p>
        </div>

        <div className="relative h-[500px] w-full overflow-hidden rounded-lg border border-white/15 bg-[#1A1C20] sm:h-[580px]">
          {webglUnavailable ? (
            <div className="flex h-full w-full flex-col items-center justify-center p-6 text-center">
              <img
                src="/images/area-lazer-piscina.jpeg"
                alt="Área de lazer com piscina e espaço gourmet"
                className="max-h-72 rounded-md object-contain"
              />
              <p className="mt-4 text-sm text-neutral-300">
                Visualização 3D indisponível neste dispositivo. Utilize a galeria de fotos acima para
                explorar todos os detalhes.
              </p>
            </div>
          ) : (
            <div
              ref={mountRef}
              data-testid="property-3d-canvas"
              className="h-full w-full cursor-grab active:cursor-grabbing"
              aria-label="Maquete arquitetônica interativa em 3D"
            />
          )}

          {/* Top-left unobtrusive spec label */}
          <div className="pointer-events-none absolute left-4 top-4 rounded-md border border-white/15 bg-[#181A1D]/90 px-3.5 py-2 text-xs text-neutral-200">
            <span className="font-semibold text-[#E5C454]">Estudo Espacial 3D</span>
            <span className="mx-2 text-white/30" aria-hidden="true">·</span>
            <span>Arraste para rotacionar</span>
          </div>

          {/* Collapsible Bottom Control Dock (solid rgba surface, no backdrop-filter over WebGL) */}
          <div className="pointer-events-none absolute inset-x-0 bottom-4 z-10 flex flex-col items-center px-3">
            <button
              type="button"
              onClick={() => setDockCollapsed((prev) => !prev)}
              aria-expanded={!dockCollapsed}
              aria-label={dockCollapsed ? 'Mostrar controles 3D' : 'Ocultar controles 3D'}
              className="pointer-events-auto mb-2 inline-flex items-center gap-1.5 rounded-md border border-white/20 bg-[#181A1D]/95 px-3 py-1.5 text-xs font-medium text-neutral-200 transition-colors hover:border-[#D4AF37] hover:text-[#E5C454] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#D4AF37]"
            >
              {dockCollapsed ? (
                <>
                  <ChevronUp className="h-3.5 w-3.5 text-[#D4AF37]" aria-hidden="true" />
                  Mostrar Controles
                </>
              ) : (
                <>
                  <ChevronDown className="h-3.5 w-3.5 text-[#D4AF37]" aria-hidden="true" />
                  Ocultar Controles
                </>
              )}
            </button>

            {!dockCollapsed && (
              <div className="pointer-events-auto flex max-w-full flex-wrap items-center justify-center gap-2 rounded-lg border border-white/15 bg-[#181A1D]/92 p-2 shadow-xl">
                <div className="flex flex-wrap items-center gap-1" role="group" aria-label="Ângulos de câmera">
                  {CAMERA_OPTIONS.map((opt) => {
                    const active = cameraPreset === opt.id;
                    return (
                      <button
                        key={opt.id}
                        type="button"
                        onClick={() => handleCameraChange(opt.id)}
                        className={`inline-flex items-center gap-1.5 rounded-md px-3 py-2 text-xs font-medium whitespace-nowrap shrink-0 transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#D4AF37] ${
                          active
                            ? 'bg-[#D4AF37] text-[#1A1A1D] font-semibold'
                            : 'text-neutral-200 hover:bg-white/10 hover:text-white'
                        }`}
                      >
                        {opt.id === 'exploded' && (
                          <Layers className="h-3.5 w-3.5" aria-hidden="true" />
                        )}
                        {opt.label}
                      </button>
                    );
                  })}
                </div>

                <div className="hidden h-6 w-px bg-white/15 sm:block" aria-hidden="true" />

                <div className="flex items-center gap-1" role="group" aria-label="Iluminação da maquete">
                  <button
                    type="button"
                    onClick={() => handleLightingChange('day')}
                    className={`inline-flex items-center gap-1.5 rounded-md px-3 py-2 text-xs font-medium whitespace-nowrap shrink-0 transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#D4AF37] ${
                      lightingMood === 'day'
                        ? 'bg-white/15 text-[#E5C454] border border-[#D4AF37]/50'
                        : 'text-neutral-300 hover:bg-white/10 hover:text-white'
                    }`}
                  >
                    <Sun className="h-3.5 w-3.5" aria-hidden="true" />
                    Dia Ensolarado
                  </button>
                  <button
                    type="button"
                    onClick={() => handleLightingChange('golden')}
                    className={`inline-flex items-center gap-1.5 rounded-md px-3 py-2 text-xs font-medium whitespace-nowrap shrink-0 transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#D4AF37] ${
                      lightingMood === 'golden'
                        ? 'bg-white/15 text-[#E5C454] border border-[#D4AF37]/50'
                        : 'text-neutral-300 hover:bg-white/10 hover:text-white'
                    }`}
                  >
                    <Sunset className="h-3.5 w-3.5" aria-hidden="true" />
                    Crepúsculo Dourado
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
