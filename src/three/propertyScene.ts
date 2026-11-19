import * as THREE from 'three';
import {OrbitControls} from 'three/addons/controls/OrbitControls.js';
import {RoomEnvironment} from 'three/addons/environments/RoomEnvironment.js';

export type CameraPresetId = 'overview' | 'leisure' | 'garage' | 'exploded';
export type LightingPresetId = 'day' | 'golden';

export interface PropertySceneController {
  setCameraPreset: (preset: CameraPresetId) => void;
  setLightingPreset: (mood: LightingPresetId) => void;
  setExploded: (exploded: boolean) => void;
  dispose: () => void;
}

interface CameraPreset {
  position: [number, number, number];
  target: [number, number, number];
  exploded: boolean;
}

const CAMERA_PRESETS: Record<CameraPresetId, CameraPreset> = {
  overview: {
    position: [15.4, 10.6, 16.0],
    target: [0.0, 0.55, 0.2],
    exploded: false,
  },
  leisure: {
    position: [-9.2, 5.8, 11.4],
    target: [-2.2, 0.8, 2.2],
    exploded: false,
  },
  garage: {
    position: [12.8, 4.6, 8.2],
    target: [3.8, 1.2, -1.4],
    exploded: false,
  },
  exploded: {
    position: [16.2, 12.2, 16.6],
    target: [0.0, 1.35, 0.0],
    exploded: true,
  },
};

const _scratchTargetPos = new THREE.Vector3();
const _scratchTargetLook = new THREE.Vector3();
const _scratchMat4 = new THREE.Matrix4();
const _scratchColor = new THREE.Color();

function detectSoftwareWebGL(): boolean {
  try {
    const probeCanvas = document.createElement('canvas');
    const gl = probeCanvas.getContext('webgl2');
    if (!gl) return true;
    const ext = gl.getExtension('WEBGL_debug_renderer_info');
    const param = ext ? ext.UNMASKED_RENDERER_WEBGL : gl.RENDERER;
    const gpu = String(gl.getParameter(param) ?? '');
    gl.getExtension('WEBGL_lose_context')?.loseContext();
    return /SwiftShader|llvmpipe|softpipe|Software|Basic Render/i.test(gpu);
  } catch {
    return true;
  }
}

function createTiledStoneTexture(
  baseHex: string,
  groutHex: string,
  tilesPerSide: number,
  anisotropy: number,
  isColorMap: boolean,
): THREE.CanvasTexture {
  const size = 512;
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d')!;

  ctx.fillStyle = groutHex;
  ctx.fillRect(0, 0, size, size);

  const step = size / tilesPerSide;
  for (let row = 0; row < tilesPerSide; row++) {
    for (let col = 0; col < tilesPerSide; col++) {
      const shade = ((row * 7 + col * 13) % 11) - 5;
      ctx.fillStyle = baseHex;
      ctx.fillRect(col * step + 2, row * step + 2, step - 4, step - 4);
      ctx.fillStyle = shade > 0 ? `rgba(255,255,255,${shade * 0.014})` : `rgba(0,0,0,${-shade * 0.014})`;
      ctx.fillRect(col * step + 2, row * step + 2, step - 4, step - 4);
    }
  }

  const tex = new THREE.CanvasTexture(canvas);
  tex.wrapS = THREE.RepeatWrapping;
  tex.wrapT = THREE.RepeatWrapping;
  tex.anisotropy = anisotropy;
  if (isColorMap) {
    tex.colorSpace = THREE.SRGBColorSpace;
  }
  return tex;
}

function createWoodGrainTexture(anisotropy: number): THREE.CanvasTexture {
  const size = 256;
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d')!;

  ctx.fillStyle = '#8b4e2b';
  ctx.fillRect(0, 0, size, size);

  for (let i = 0; i < 16; i++) {
    const y = i * (size / 16);
    ctx.fillStyle = i % 2 === 0 ? '#7c4322' : '#965732';
    ctx.fillRect(0, y + 1, size, size / 16 - 2);
  }

  const tex = new THREE.CanvasTexture(canvas);
  tex.wrapS = THREE.RepeatWrapping;
  tex.wrapT = THREE.RepeatWrapping;
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = anisotropy;
  return tex;
}

function createContactShadowTexture(): THREE.CanvasTexture {
  const size = 256;
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d')!;
  const grad = ctx.createRadialGradient(size / 2, size / 2, 16, size / 2, size / 2, size / 2);
  grad.addColorStop(0, 'rgba(0,0,0,0.48)');
  grad.addColorStop(0.65, 'rgba(0,0,0,0.18)');
  grad.addColorStop(1, 'rgba(0,0,0,0.0)');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, size, size);

  const tex = new THREE.CanvasTexture(canvas);
  return tex;
}

export function mountPropertyScene(
  container: HTMLElement,
  onWebGLError?: () => void,
): PropertySceneController {
  const isSoftwareGl = detectSoftwareWebGL();
  const width = Math.max(container.clientWidth, 320);
  const height = Math.max(container.clientHeight, 320);

  let renderer: THREE.WebGLRenderer;
  try {
    renderer = new THREE.WebGLRenderer({
      antialias: !isSoftwareGl,
      powerPreference: 'high-performance',
    });
  } catch {
    onWebGLError?.();
    return {
      setCameraPreset: () => {},
      setLightingPreset: () => {},
      setExploded: () => {},
      dispose: () => {},
    };
  }

  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.08;
  renderer.setPixelRatio(isSoftwareGl ? 1 : Math.min(window.devicePixelRatio, 2));
  renderer.setSize(width, height);
  renderer.shadowMap.enabled = !isSoftwareGl;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  renderer.domElement.style.display = 'block';
  renderer.domElement.style.width = '100%';
  renderer.domElement.style.height = '100%';
  container.appendChild(renderer.domElement);

  const scene = new THREE.Scene();
  const dayHorizon = new THREE.Color(0x1f2226);
  const goldenHorizon = new THREE.Color(0x1b191d);
  scene.background = dayHorizon.clone();
  scene.fog = new THREE.FogExp2(0x1f2226, 0.022);

  const pmremGenerator = new THREE.PMREMGenerator(renderer);
  const envTexture = pmremGenerator.fromScene(new RoomEnvironment(), 0.04).texture;
  scene.environment = envTexture;
  pmremGenerator.dispose();

  const camera = new THREE.PerspectiveCamera(42, width / height, 0.1, 120);
  camera.position.set(...CAMERA_PRESETS.overview.position);

  const controls = new OrbitControls(camera, renderer.domElement);
  controls.enableDamping = !isSoftwareGl;
  controls.dampingFactor = 0.07;
  controls.maxPolarAngle = Math.PI / 2 - 0.06;
  controls.minDistance = 7;
  controls.maxDistance = 26;
  controls.target.set(...CAMERA_PRESETS.overview.target);
  controls.update();

  // Studio & Architectural 3-Point Lighting Rig
  const hemiLight = new THREE.HemisphereLight(0xcfe4ff, 0x3f3c38, 0.85);
  scene.add(hemiLight);

  const keyLight = new THREE.DirectionalLight(0xfff1d6, 2.2);
  keyLight.position.set(11, 16, 9);
  keyLight.castShadow = !isSoftwareGl;
  keyLight.shadow.mapSize.set(1024, 1024);
  keyLight.shadow.camera.near = 2;
  keyLight.shadow.camera.far = 42;
  keyLight.shadow.camera.left = -12;
  keyLight.shadow.camera.right = 12;
  keyLight.shadow.camera.top = 12;
  keyLight.shadow.camera.bottom = -12;
  keyLight.shadow.bias = -0.0005;
  keyLight.shadow.normalBias = 0.02;
  scene.add(keyLight);

  const rimLight = new THREE.DirectionalLight(0xd4af37, 0.65);
  rimLight.position.set(-10, 7, -11);
  scene.add(rimLight);

  const gourmetGlow = new THREE.PointLight(0xffcf87, 1.4, 11, 2);
  gourmetGlow.position.set(-3.2, 2.4, -2.2);
  scene.add(gourmetGlow);

  const maxAniso = renderer.capabilities.getMaxAnisotropy();
  const disposables: Array<{dispose: () => void}> = [envTexture];

  // Procedural Textures
  const deckColorTex = createTiledStoneTexture('#b59f87', '#7b6a57', 8, maxAniso, true);
  deckColorTex.repeat.set(3, 3);
  const deckBumpTex = createTiledStoneTexture('#d8d8d8', '#333333', 8, maxAniso, false);
  deckBumpTex.repeat.set(3, 3);
  const poolTileTex = createTiledStoneTexture('#1a7ec7', '#135f9c', 12, maxAniso, true);
  poolTileTex.repeat.set(2, 3);
  const woodTex = createWoodGrainTexture(maxAniso);
  woodTex.repeat.set(2, 2);
  const shadowTex = createContactShadowTexture();
  disposables.push(deckColorTex, deckBumpTex, poolTileTex, woodTex, shadowTex);

  // Materials Library (varying roughness & metalness across adjacent parts)
  const plinthMat = new THREE.MeshStandardMaterial({color: 0x323337, roughness: 0.88, metalness: 0.05});
  const courtyardMat = new THREE.MeshStandardMaterial({
    color: 0xffffff,
    map: deckColorTex,
    bumpMap: deckBumpTex,
    bumpScale: 0.02,
    roughness: 0.72,
    metalness: 0.05,
  });
  const wallMat = new THREE.MeshStandardMaterial({color: 0xe6dcc8, roughness: 0.85, metalness: 0.0});
  const darkSlateMat = new THREE.MeshStandardMaterial({color: 0x2f3035, roughness: 0.68, metalness: 0.12});
  const goldTrimMat = new THREE.MeshPhysicalMaterial({
    color: 0xd4af37,
    metalness: 0.92,
    roughness: 0.18,
    anisotropy: 0.8,
  });
  const steelBeamMat = new THREE.MeshStandardMaterial({color: 0xb93c28, roughness: 0.42, metalness: 0.55});
  const woodMat = new THREE.MeshStandardMaterial({color: 0xffffff, map: woodTex, roughness: 0.65, metalness: 0.05});
  const graniteMat = new THREE.MeshStandardMaterial({color: 0x1e1f22, roughness: 0.2, metalness: 0.25});
  const marbleMat = new THREE.MeshStandardMaterial({color: 0xf2efe9, roughness: 0.25, metalness: 0.05});
  const glassMat = new THREE.MeshPhysicalMaterial({
    color: 0xdbeeff,
    metalness: 0.0,
    roughness: 0.06,
    transmission: isSoftwareGl ? 0 : 0.85,
    transparent: true,
    opacity: isSoftwareGl ? 0.38 : 1.0,
    ior: 1.5,
    thickness: 0.2,
    depthWrite: false,
  });
  const poolMosaicMat = new THREE.MeshStandardMaterial({
    color: 0xffffff,
    map: poolTileTex,
    roughness: 0.35,
    metalness: 0.05,
  });
  const waterMat = new THREE.MeshPhysicalMaterial({
    color: 0x269be8,
    roughness: 0.08,
    metalness: 0.1,
    transparent: true,
    opacity: 0.72,
    clearcoat: 1.0,
    clearcoatRoughness: 0.06,
  });
  const solarMat = new THREE.MeshStandardMaterial({color: 0x162238, roughness: 0.22, metalness: 0.75});
  const contactShadowMat = new THREE.MeshBasicMaterial({
    map: shadowTex,
    transparent: true,
    opacity: 0.5,
    depthWrite: false,
  });

  disposables.push(
    plinthMat,
    courtyardMat,
    wallMat,
    darkSlateMat,
    goldTrimMat,
    steelBeamMat,
    woodMat,
    graniteMat,
    marbleMat,
    glassMat,
    poolMosaicMat,
    waterMat,
    solarMat,
    contactShadowMat,
  );

  // 1. Ground & Courtyard Base Group
  const baseGroup = new THREE.Group();
  scene.add(baseGroup);

  const groundShadowGeo = new THREE.PlaneGeometry(24, 24);
  const groundShadow = new THREE.Mesh(groundShadowGeo, contactShadowMat);
  groundShadow.rotation.x = -Math.PI / 2;
  groundShadow.position.y = -0.34;
  baseGroup.add(groundShadow);

  const plinthGeo = new THREE.BoxGeometry(15.2, 0.36, 13.0);
  const plinth = new THREE.Mesh(plinthGeo, plinthMat);
  plinth.position.set(0, -0.18, 0);
  plinth.receiveShadow = true;
  baseGroup.add(plinth);

  const deckGeo = new THREE.BoxGeometry(14.6, 0.04, 12.4);
  const deck = new THREE.Mesh(deckGeo, courtyardMat);
  deck.position.set(0, 0.02, 0);
  deck.receiveShadow = true;
  baseGroup.add(deck);

  // Gold perimeter plinth accent band
  const goldPlinthGeo = new THREE.BoxGeometry(15.24, 0.06, 13.04);
  const goldPlinth = new THREE.Mesh(goldPlinthGeo, goldTrimMat);
  goldPlinth.position.set(0, -0.02, 0);
  baseGroup.add(goldPlinth);

  // Perimeter Boundary Walls
  const backWallGeo = new THREE.BoxGeometry(14.6, 2.5, 0.25);
  const backWall = new THREE.Mesh(backWallGeo, wallMat);
  backWall.position.set(0, 1.25, -6.08);
  backWall.castShadow = true;
  backWall.receiveShadow = true;
  baseGroup.add(backWall);

  const leftWallGeo = new THREE.BoxGeometry(0.25, 2.5, 12.2);
  const leftWall = new THREE.Mesh(leftWallGeo, wallMat);
  leftWall.position.set(-7.18, 1.25, 0);
  leftWall.castShadow = true;
  leftWall.receiveShadow = true;
  baseGroup.add(leftWall);

  // Instanced Architectural Planter Boxes & Foliage Clusters along perimeter
  const planterBoxGeo = new THREE.BoxGeometry(0.62, 0.28, 0.62);
  const planterBoxMat = new THREE.MeshStandardMaterial({color: 0x2d2e33, roughness: 0.72, metalness: 0.1});
  const shrubGeo = new THREE.IcosahedronGeometry(0.24, 0);
  const shrubMat = new THREE.MeshStandardMaterial({color: 0xffffff, roughness: 0.88, metalness: 0.0, flatShading: true});
  const shrubPositions: Array<[number, number, number, number]> = [
    [-6.6, 0.04, -4.5, 1.05],
    [-6.6, 0.04, -3.4, 0.92],
    [-6.6, 0.04, 2.2, 1.1],
    [-6.6, 0.04, 3.6, 0.95],
    [-6.6, 0.04, 4.9, 1.08],
    [6.6, 0.04, 4.8, 1.0],
    [5.2, 0.04, 5.6, 0.88],
    [-4.8, 0.04, 5.6, 0.94],
  ];
  const planterInstanced = new THREE.InstancedMesh(planterBoxGeo, planterBoxMat, shrubPositions.length);
  const shrubInstanced = new THREE.InstancedMesh(shrubGeo, shrubMat, shrubPositions.length * 2);
  shrubPositions.forEach(([x, y, z, s], idx) => {
    _scratchMat4.makeScale(s, 1.0, s);
    _scratchMat4.setPosition(x, y + 0.14, z);
    planterInstanced.setMatrixAt(idx, _scratchMat4);

    _scratchMat4.makeScale(s * 1.05, s * 0.95, s * 1.05);
    _scratchMat4.setPosition(x, y + 0.42, z);
    shrubInstanced.setMatrixAt(idx * 2, _scratchMat4);
    _scratchColor.setHSL(0.34, 0.42, 0.22 + (idx % 3) * 0.04);
    shrubInstanced.setColorAt(idx * 2, _scratchColor);

    _scratchMat4.makeScale(s * 0.72, s * 0.85, s * 0.72);
    _scratchMat4.setPosition(x + 0.12, y + 0.52, z - 0.08);
    shrubInstanced.setMatrixAt(idx * 2 + 1, _scratchMat4);
    _scratchColor.setHSL(0.33, 0.44, 0.28 + (idx % 2) * 0.04);
    shrubInstanced.setColorAt(idx * 2 + 1, _scratchColor);
  });
  planterInstanced.computeBoundingSphere();
  planterInstanced.castShadow = true;
  shrubInstanced.computeBoundingSphere();
  shrubInstanced.castShadow = true;
  baseGroup.add(planterInstanced, shrubInstanced);
  disposables.push(groundShadowGeo, plinthGeo, deckGeo, goldPlinthGeo, backWallGeo, leftWallGeo, planterBoxGeo, planterBoxMat, shrubGeo, shrubMat);

  // 2. Main Residence & Kitchen Interior + Carport Group
  const houseGroup = new THREE.Group();
  scene.add(houseGroup);

  // Interior Marble Kitchen Floor (disjoint Y = 0.06 > deck top 0.04)
  const kitchenFloorGeo = new THREE.BoxGeometry(6.8, 0.04, 6.2);
  const kitchenFloor = new THREE.Mesh(kitchenFloorGeo, marbleMat);
  kitchenFloor.position.set(3.2, 0.06, -2.5);
  kitchenFloor.receiveShadow = true;
  houseGroup.add(kitchenFloor);

  // Interior Kitchen Granite Counter & Wood Cabinets
  const cabinetGeo = new THREE.BoxGeometry(3.4, 0.85, 0.72);
  const cabinet = new THREE.Mesh(cabinetGeo, woodMat);
  cabinet.position.set(3.4, 0.5, -4.9);
  cabinet.castShadow = true;
  houseGroup.add(cabinet);

  const counterTopGeo = new THREE.BoxGeometry(3.48, 0.08, 0.78);
  const counterTop = new THREE.Mesh(counterTopGeo, graniteMat);
  counterTop.position.set(3.4, 0.96, -4.9);
  houseGroup.add(counterTop);

  const upperCabinetGeo = new THREE.BoxGeometry(2.4, 0.65, 0.42);
  const upperCabinet = new THREE.Mesh(upperCabinetGeo, woodMat);
  upperCabinet.position.set(3.8, 1.95, -5.05);
  houseGroup.add(upperCabinet);

  // Structural Residence Walls (east + center divider)
  const eastWallGeo = new THREE.BoxGeometry(0.28, 2.8, 6.4);
  const eastWall = new THREE.Mesh(eastWallGeo, wallMat);
  eastWall.position.set(6.55, 1.42, -2.5);
  eastWall.castShadow = true;
  eastWall.receiveShadow = true;
  houseGroup.add(eastWall);

  const dividerWallGeo = new THREE.BoxGeometry(0.24, 2.8, 3.1);
  const dividerWall = new THREE.Mesh(dividerWallGeo, wallMat);
  dividerWall.position.set(-0.2, 1.42, -4.1);
  dividerWall.castShadow = true;
  houseGroup.add(dividerWall);

  // Sliding Glass Doors facing the Pool
  const glassDoorGeo = new THREE.BoxGeometry(3.6, 2.35, 0.06);
  const glassDoor = new THREE.Mesh(glassDoorGeo, glassMat);
  glassDoor.position.set(1.75, 1.24, 0.55);
  glassDoor.renderOrder = 4;
  houseGroup.add(glassDoor);

  // Gold Door Frame Trim
  const doorFrameGeo = new THREE.BoxGeometry(3.72, 0.08, 0.12);
  const doorFrameTop = new THREE.Mesh(doorFrameGeo, goldTrimMat);
  doorFrameTop.position.set(1.75, 2.45, 0.55);
  houseGroup.add(doorFrameTop);

  // Covered Garage / Carport Extension (front right) with timber soffit & red steel beams
  const carportGroup = new THREE.Group();
  houseGroup.add(carportGroup);

  const carportPillarGeo = new THREE.BoxGeometry(0.18, 2.6, 0.18);
  const pillar1 = new THREE.Mesh(carportPillarGeo, steelBeamMat);
  pillar1.position.set(6.45, 1.32, 4.9);
  pillar1.castShadow = true;
  const pillar2 = new THREE.Mesh(carportPillarGeo, steelBeamMat);
  pillar2.position.set(1.2, 1.32, 4.9);
  pillar2.castShadow = true;
  carportGroup.add(pillar1, pillar2);

  // Explodable Roof Assembly (House Pitched Roof + Carport Canopy + Solar Panels)
  const roofGroup = new THREE.Group();
  scene.add(roofGroup);

  // Carport Timber Soffit & Steel Beams
  const carportSoffitGeo = new THREE.BoxGeometry(5.6, 0.12, 4.6);
  const carportSoffit = new THREE.Mesh(carportSoffitGeo, woodMat);
  carportSoffit.position.set(3.85, 2.66, 2.75);
  carportSoffit.castShadow = true;
  roofGroup.add(carportSoffit);

  const beamGeo = new THREE.BoxGeometry(5.68, 0.18, 0.14);
  const beamFront = new THREE.Mesh(beamGeo, steelBeamMat);
  beamFront.position.set(3.85, 2.58, 4.95);
  const beamMid = new THREE.Mesh(beamGeo, steelBeamMat);
  beamMid.position.set(3.85, 2.58, 2.8);
  roofGroup.add(beamFront, beamMid);

  // Main House Pitched Roof Volume (grouped so solar panels align cleanly on the slope)
  const mainRoofAssembly = new THREE.Group();
  mainRoofAssembly.position.set(3.2, 2.96, -2.55);
  mainRoofAssembly.rotation.z = -0.05;
  roofGroup.add(mainRoofAssembly);

  const mainRoofGeo = new THREE.BoxGeometry(7.3, 0.24, 6.8);
  const mainRoof = new THREE.Mesh(mainRoofGeo, darkSlateMat);
  mainRoof.castShadow = true;
  mainRoofAssembly.add(mainRoof);

  // Brushed Gold Fascia Accent Strip on Roof
  const fasciaGeo = new THREE.BoxGeometry(7.36, 0.08, 6.86);
  const fascia = new THREE.Mesh(fasciaGeo, goldTrimMat);
  fascia.position.y = -0.12;
  mainRoofAssembly.add(fascia);

  // Solar Panels Array (InstancedMesh flush on top of mainRoof)
  const panelGeo = new THREE.BoxGeometry(1.15, 0.06, 2.05);
  const solarPanels = new THREE.InstancedMesh(panelGeo, solarMat, 4);
  for (let i = 0; i < 4; i++) {
    _scratchMat4.identity();
    _scratchMat4.setPosition(-2.1 + i * 1.4, 0.16, 0.3);
    solarPanels.setMatrixAt(i, _scratchMat4);
  }
  solarPanels.computeBoundingSphere();
  mainRoofAssembly.add(solarPanels);

  disposables.push(
    kitchenFloorGeo,
    cabinetGeo,
    counterTopGeo,
    upperCabinetGeo,
    eastWallGeo,
    dividerWallGeo,
    glassDoorGeo,
    doorFrameGeo,
    carportPillarGeo,
    carportSoffitGeo,
    beamGeo,
    mainRoofGeo,
    fasciaGeo,
    panelGeo,
  );

  // 3. Swimming Pool & Curved Spa + Gourmet Barbecue Pavilion
  const poolGroup = new THREE.Group();
  scene.add(poolGroup);

  // Pool Coping Border (raised slightly above courtyard y=0.04)
  const poolRimGeo = new THREE.BoxGeometry(4.4, 0.08, 7.1);
  const poolRim = new THREE.Mesh(poolRimGeo, marbleMat);
  poolRim.position.set(-3.9, 0.06, 1.65);
  poolRim.receiveShadow = true;
  poolGroup.add(poolRim);

  // Pool Interior Basin (disjoint Y = 0.085)
  const poolBasinGeo = new THREE.BoxGeometry(3.8, 0.04, 6.5);
  const poolBasin = new THREE.Mesh(poolBasinGeo, poolMosaicMat);
  poolBasin.position.set(-3.9, 0.085, 1.65);
  poolGroup.add(poolBasin);

  // Curved Extruded Spa / Hidro Ledge
  const spaShape = new THREE.Shape();
  spaShape.absarc(0, 0, 1.2, -Math.PI * 0.15, Math.PI * 1.15, false);
  spaShape.absarc(0, 0, 0.88, Math.PI * 1.15, -Math.PI * 0.15, true);
  const spaGeo = new THREE.ExtrudeGeometry(spaShape, {
    depth: 0.24,
    bevelEnabled: true,
    bevelThickness: 0.03,
    bevelSize: 0.03,
    bevelSegments: 2,
  });
  const spaMesh = new THREE.Mesh(spaGeo, marbleMat);
  spaMesh.rotation.x = Math.PI / 2;
  spaMesh.position.set(-3.3, 0.28, -0.5);
  spaMesh.castShadow = true;
  poolGroup.add(spaMesh);

  // Animated Pool Water Surface (disjoint Y = 0.15)
  const waterGeo = new THREE.PlaneGeometry(3.75, 6.45, 16, 24);
  waterMat.onBeforeCompile = (shader) => {
    shader.uniforms.uTime = {value: 0};
    waterMat.userData.shader = shader;
    shader.vertexShader = `uniform float uTime;\n` + shader.vertexShader;
    shader.vertexShader = shader.vertexShader.replace(
      '#include <begin_vertex>',
      `#include <begin_vertex>
       transformed.z += sin(position.x * 3.0 + uTime * 1.6) * 0.014 + cos(position.y * 2.4 + uTime * 1.2) * 0.014;`,
    );
  };
  const waterMesh = new THREE.Mesh(waterGeo, waterMat);
  waterMesh.rotation.x = -Math.PI / 2;
  waterMesh.position.set(-3.9, 0.15, 1.65);
  waterMesh.renderOrder = 2;
  poolGroup.add(waterMesh);

  // Gourmet Barbecue Counter & Backsplash
  const gourmetGroup = new THREE.Group();
  scene.add(gourmetGroup);

  const gourmetBacksplashGeo = new THREE.BoxGeometry(5.6, 2.35, 0.22);
  const gourmetBacksplash = new THREE.Mesh(gourmetBacksplashGeo, darkSlateMat);
  gourmetBacksplash.position.set(-3.6, 1.2, -5.7);
  gourmetBacksplash.castShadow = true;
  gourmetGroup.add(gourmetBacksplash);

  const barCounterBaseGeo = new THREE.BoxGeometry(4.4, 0.92, 0.72);
  const barCounterBase = new THREE.Mesh(barCounterBaseGeo, darkSlateMat);
  barCounterBase.position.set(-3.6, 0.48, -4.05);
  barCounterBase.castShadow = true;
  gourmetGroup.add(barCounterBase);

  const barCounterTopGeo = new THREE.BoxGeometry(4.56, 0.08, 0.84);
  const barCounterTop = new THREE.Mesh(barCounterTopGeo, graniteMat);
  barCounterTop.position.set(-3.6, 0.96, -4.05);
  gourmetGroup.add(barCounterTop);

  // Gold Trim under Gourmet Bar
  const barGoldTrimGeo = new THREE.BoxGeometry(4.58, 0.04, 0.86);
  const barGoldTrim = new THREE.Mesh(barGoldTrimGeo, goldTrimMat);
  barGoldTrim.position.set(-3.6, 0.91, -4.05);
  gourmetGroup.add(barGoldTrim);

  // Gourmet Pavilion Timber Columns & Explodable Roof
  const gourmetPostGeo = new THREE.BoxGeometry(0.18, 2.55, 0.18);
  const gPost1 = new THREE.Mesh(gourmetPostGeo, woodMat);
  gPost1.position.set(-1.1, 1.3, -2.5);
  const gPost2 = new THREE.Mesh(gourmetPostGeo, woodMat);
  gPost2.position.set(-6.1, 1.3, -2.5);
  gourmetGroup.add(gPost1, gPost2);

  const gourmetRoofGeo = new THREE.BoxGeometry(5.9, 0.16, 3.9);
  const gourmetRoof = new THREE.Mesh(gourmetRoofGeo, darkSlateMat);
  gourmetRoof.position.set(-3.6, 2.68, -4.2);
  gourmetRoof.castShadow = true;
  roofGroup.add(gourmetRoof);

  disposables.push(
    poolRimGeo,
    poolBasinGeo,
    spaGeo,
    waterGeo,
    gourmetBacksplashGeo,
    barCounterBaseGeo,
    barCounterTopGeo,
    barGoldTrimGeo,
    gourmetPostGeo,
    gourmetRoofGeo,
  );

  if (!isSoftwareGl) {
    renderer.compile(scene, camera);
  }

  // State for smooth exponential damping transitions
  let targetCamPos = new THREE.Vector3(...CAMERA_PRESETS.overview.position);
  let targetLookAt = new THREE.Vector3(...CAMERA_PRESETS.overview.target);
  let isCameraAnimating = false;
  let targetExploded = 0;
  let currentExploded = 0;
  let frameId = 0;
  let renderBusy = false;
  let renderDirty = false;
  let disposed = false;
  let lastTime = performance.now();

  const handleControlsStart = () => {
    isCameraAnimating = false;
  };
  controls.addEventListener('start', handleControlsStart);

  const handleControlsChange = () => {
    requestRender();
  };
  controls.addEventListener('change', handleControlsChange);

  function afterDraw(cb: () => void) {
    const gl = renderer.getContext() as WebGL2RenderingContext;
    const sync = gl.fenceSync(gl.SYNC_GPU_COMMANDS_COMPLETE, 0);
    gl.flush();
    const poll = () => {
      if (disposed) return;
      const state = sync && gl.getSyncParameter(sync, gl.SYNC_STATUS);
      if (state === gl.UNSIGNALED) {
        frameId = window.setTimeout(poll, 5);
      } else {
        if (sync) gl.deleteSync(sync);
        frameId = window.setTimeout(cb, 80);
      }
    };
    frameId = window.setTimeout(poll, 5);
  }

  function requestRender() {
    if (disposed) return;
    if (renderBusy) {
      renderDirty = true;
      return;
    }
    renderBusy = true;
    frameId = requestAnimationFrame((now) => {
      if (disposed) return;
      renderDirty = false;
      const dt = Math.min((now - lastTime) / 1000, 0.08);
      lastTime = now;

      let needsAnotherFrame = false;

      if (waterMat.userData.shader) {
        waterMat.userData.shader.uniforms.uTime.value = now * 0.001;
      }

      if (isCameraAnimating) {
        const alpha = 1 - Math.exp(-6.5 * dt);
        _scratchTargetPos.copy(targetCamPos);
        _scratchTargetLook.copy(targetLookAt);
        camera.position.lerp(_scratchTargetPos, alpha);
        controls.target.lerp(_scratchTargetLook, alpha);
        if (
          camera.position.distanceTo(_scratchTargetPos) < 0.03 &&
          controls.target.distanceTo(_scratchTargetLook) < 0.03
        ) {
          camera.position.copy(_scratchTargetPos);
          controls.target.copy(_scratchTargetLook);
          isCameraAnimating = false;
        } else {
          needsAnotherFrame = true;
        }
      }

      if (Math.abs(targetExploded - currentExploded) > 0.002) {
        const alpha = 1 - Math.exp(-7.0 * dt);
        currentExploded += (targetExploded - currentExploded) * alpha;
        roofGroup.position.y = currentExploded * 2.45;
        needsAnotherFrame = true;
      } else if (currentExploded !== targetExploded) {
        currentExploded = targetExploded;
        roofGroup.position.y = currentExploded * 2.45;
      }

      controls.update();
      renderer.render(scene, camera);

      const done = () => {
        renderBusy = false;
        if (renderDirty || needsAnotherFrame) {
          requestRender();
        }
      };

      if (isSoftwareGl) {
        afterDraw(done);
      } else {
        done();
      }
    });
  }

  // Initial render
  requestRender();

  const handleResize = () => {
    if (disposed) return;
    const w = Math.max(container.clientWidth, 320);
    const h = Math.max(container.clientHeight, 320);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    renderer.setSize(w, h);
    requestRender();
  };
  window.addEventListener('resize', handleResize);

  const handleContextLost = (event: Event) => {
    event.preventDefault();
    onWebGLError?.();
  };
  renderer.domElement.addEventListener('webglcontextlost', handleContextLost);

  return {
    setCameraPreset(preset: CameraPresetId) {
      const cfg = CAMERA_PRESETS[preset];
      targetCamPos.set(...cfg.position);
      targetLookAt.set(...cfg.target);
      isCameraAnimating = true;
      targetExploded = cfg.exploded ? 1 : 0;
      requestRender();
    },
    setLightingPreset(mood: LightingPresetId) {
      if (mood === 'golden') {
        scene.background = goldenHorizon.clone();
        (scene.fog as THREE.FogExp2).color.copy(goldenHorizon);
        keyLight.color.setHex(0xffc978);
        keyLight.intensity = 2.0;
        keyLight.position.set(-10, 8, 12);
        hemiLight.color.setHex(0x8a7896);
        hemiLight.groundColor.setHex(0x2d241e);
        hemiLight.intensity = 0.65;
        rimLight.intensity = 1.15;
        gourmetGlow.intensity = 3.2;
        renderer.toneMappingExposure = 1.05;
      } else {
        scene.background = dayHorizon.clone();
        (scene.fog as THREE.FogExp2).color.copy(dayHorizon);
        keyLight.color.setHex(0xfff1d6);
        keyLight.intensity = 2.2;
        keyLight.position.set(11, 16, 9);
        hemiLight.color.setHex(0xcfe4ff);
        hemiLight.groundColor.setHex(0x3f3c38);
        hemiLight.intensity = 0.85;
        rimLight.intensity = 0.65;
        gourmetGlow.intensity = 1.4;
        renderer.toneMappingExposure = 1.08;
      }
      requestRender();
    },
    setExploded(exploded: boolean) {
      targetExploded = exploded ? 1 : 0;
      requestRender();
    },
    dispose() {
      disposed = true;
      cancelAnimationFrame(frameId);
      clearTimeout(frameId);
      window.removeEventListener('resize', handleResize);
      controls.removeEventListener('start', handleControlsStart);
      controls.removeEventListener('change', handleControlsChange);
      renderer.domElement.removeEventListener('webglcontextlost', handleContextLost);
      controls.dispose();
      disposables.forEach((d) => d.dispose());
      renderer.dispose();
      if (renderer.domElement.parentElement === container) {
        container.removeChild(renderer.domElement);
      }
    },
  };
}
