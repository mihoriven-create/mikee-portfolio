"use client";

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useEffect, useMemo } from "react";
import * as THREE from "three";
import { WAYPOINTS, damp, journey, lerp, progressFor, sampleScene, smoothstep, type SceneParams } from "./journeyState";

// The live gold environment. Every effect reads the same shared uniforms, which one driver updates each frame
// from the page's scroll progress. Fine details (dust, trails, frame lines) are drawn in the vertex shader so the
// CPU does almost nothing per frame.

const U = {
  uT: { value: 0 },
  uCamZ: { value: 8 },
  uVel: { value: 0 },
  uLight: { value: 0.5 },
  uRays: { value: 0.3 },
  uDust: { value: 0.5 },
  uTrail: { value: 0 },
  uFrames: { value: 0.4 },
  uCalm: { value: 1 },
  uAspect: { value: 1.6 },
  uPool: { value: new THREE.Vector2(0.2, 0.1) },
  uPx: { value: 900 },
};

const DEPTH = 140; // how far the world stretches along the camera's path
const FRAME_SPACING = 7;
const FRAME_COUNT = 19;

// Deterministic pseudo-random numbers: the same world on the server, the client and every reload.
function rng(seed: number) {
  let a = seed;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const GOLD = "vec3(1.0, 0.76, 0.32)";

// ----------------------------------------------------------------- atmosphere
// A full-screen shader: deep charcoal, a warm pool of light and soft shafts that fan out from above.
const atmosphereVertex = /* glsl */ `
varying vec2 vUv;
void main(){ vUv = position.xy * 0.5 + 0.5; gl_Position = vec4(position.xy, 0.9999, 1.0); }`;
const atmosphereFragment = /* glsl */ `
uniform float uT, uLight, uRays, uAspect; uniform vec2 uPool; varying vec2 vUv;
float hash(vec2 p){ return fract(sin(dot(p, vec2(12.9898, 78.233))) * 43758.5453); }
void main(){
  vec2 p = vUv - 0.5; p.x *= uAspect;
  vec3 col = mix(vec3(0.030, 0.027, 0.022), vec3(0.010, 0.010, 0.010), smoothstep(-0.5, 0.6, p.y));
  vec2 q = p - uPool;
  col += ${GOLD} * exp(-dot(q, q) * 3.4) * 0.26 * uLight;
  vec2 r = p - (uPool + vec2(0.30, 0.62));
  float ang = atan(r.y, r.x);
  float shafts = pow(max(0.0, sin(ang * 9.0 + uT * 0.05 + sin(ang * 3.0 + uT * 0.07) * 1.6) * 0.5 + 0.5), 6.0);
  col += ${GOLD} * shafts * exp(-length(r) * 1.35) * 0.36 * uRays * uLight;
  col += (hash(gl_FragCoord.xy + uT) - 0.5) / 200.0;
  gl_FragColor = vec4(col, 1.0);
}`;

function Atmosphere() {
  const { geometry, material } = useMemo(() => {
    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute("position", new THREE.BufferAttribute(new Float32Array([-1, -1, 0, 3, -1, 0, -1, 3, 0]), 3));
    const material = new THREE.ShaderMaterial({
      uniforms: U,
      vertexShader: atmosphereVertex,
      fragmentShader: atmosphereFragment,
      depthTest: false,
      depthWrite: false,
    });
    return { geometry, material };
  }, []);
  useEffect(() => () => { geometry.dispose(); material.dispose(); }, [geometry, material]);
  return <mesh geometry={geometry} material={material} frustumCulled={false} renderOrder={-100} />;
}

// ----------------------------------------------------------- depth frames
// Thin gold outlines hung along the camera's path with a receding floor: the layers the camera flies through.
const framesVertex = /* glsl */ `
attribute float aSeed; uniform float uCamZ, uT, uFrames, uLight, uCalm; varying float vA;
void main(){
  vec3 p = position;
  float dz = uCamZ - p.z;
  float near = smoothstep(1.5, 7.0, dz);
  float far = 1.0 - smoothstep(30.0, 80.0, dz);
  float a = sin(uT * 0.1 * uCalm + aSeed * 6.28) * 0.015;
  float c = cos(a), s = sin(a);
  p.xy = vec2(c * p.x - s * p.y, s * p.x + c * p.y);
  vA = near * far * (0.30 + 0.70 * pow(1.0 - clamp(dz / 64.0, 0.0, 1.0), 1.5)) * uFrames * uLight;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(p, 1.0);
}`;
const framesFragment = /* glsl */ `
varying float vA;
void main(){ gl_FragColor = vec4(${GOLD}, vA * 0.85); }`;

function Frames() {
  const { geometry, material } = useMemo(() => {
    const rnd = rng(7);
    const pos: number[] = [];
    const seed: number[] = [];
    const seg = (x1: number, y1: number, z1: number, x2: number, y2: number, z2: number, s: number) => {
      pos.push(x1, y1, z1, x2, y2, z2);
      seed.push(s, s);
    };
    for (let i = 0; i < FRAME_COUNT; i++) {
      const z = 4 - i * FRAME_SPACING;
      const s = rnd();
      const w = 7 + rnd() * 3;
      const h = 4.2 + rnd() * 1.6;
      const cx = (rnd() - 0.5) * 1.4;
      const cy = (rnd() - 0.5) * 0.8;
      const corner = [[cx - w, cy - h], [cx + w, cy - h], [cx + w, cy + h], [cx - w, cy + h]];
      for (let k = 0; k < 4; k++) {
        const a = corner[k];
        const b = corner[(k + 1) % 4];
        seg(a[0], a[1], z, b[0], b[1], z, s);
      }
      // A second, inset outline on alternate frames adds layers without adding clutter.
      if (i % 2 === 0) {
        const ins = 0.8;
        const inner = [[cx - w + ins, cy - h + ins], [cx + w - ins, cy - h + ins], [cx + w - ins, cy + h - ins], [cx - w + ins, cy + h - ins]];
        for (let k = 0; k < 4; k++) {
          const a = inner[k];
          const b = inner[(k + 1) % 4];
          seg(a[0], a[1], z, b[0], b[1], z, s);
        }
      }
    }
    // The receding floor: long lines running away from the camera, crossed at each frame.
    const zFar = 4 - FRAME_COUNT * FRAME_SPACING;
    for (let x = -12; x <= 12; x += 2) seg(x, -5.4, 8, x, -5.4, zFar, 0.5);
    for (let i = 0; i < FRAME_COUNT; i++) seg(-12, -5.4, 4 - i * FRAME_SPACING, 12, -5.4, 4 - i * FRAME_SPACING, 0.5);

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute("position", new THREE.BufferAttribute(new Float32Array(pos), 3));
    geometry.setAttribute("aSeed", new THREE.BufferAttribute(new Float32Array(seed), 1));
    const material = new THREE.ShaderMaterial({
      uniforms: U,
      vertexShader: framesVertex,
      fragmentShader: framesFragment,
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      depthTest: false,
    });
    return { geometry, material };
  }, []);
  useEffect(() => () => { geometry.dispose(); material.dispose(); }, [geometry, material]);
  return <lineSegments geometry={geometry} material={material} frustumCulled={false} renderOrder={1} />;
}

// ------------------------------------------------------------------- dust
// Gold dust that always surrounds the viewer: positions wrap around the camera in the shader.
const dustVertex = /* glsl */ `
attribute float aSeed; uniform float uT, uCamZ, uDust, uLight, uCalm, uPx; varying float vA; varying float vS;
void main(){
  vec3 p = position;
  float d = mod(uCamZ - p.z, ${DEPTH.toFixed(1)});
  p.z = uCamZ - d;
  p.y = mod(p.y + 8.0 + uT * (0.05 + aSeed * 0.12) * uCalm, 16.0) - 8.0;
  p.x += sin(uT * 0.15 * uCalm + aSeed * 20.0) * 0.8;
  vec4 mv = modelViewMatrix * vec4(p, 1.0);
  float near = smoothstep(1.5, 6.0, d);
  float far = 1.0 - smoothstep(60.0, 125.0, d);
  float twinkle = 0.65 + 0.35 * sin(uT * 1.7 * uCalm + aSeed * 40.0);
  vA = (0.25 + aSeed * 0.75) * uDust * uLight * near * far * twinkle;
  vS = aSeed;
  gl_PointSize = uPx * (0.012 + aSeed * 0.026) / max(-mv.z, 0.6);
  gl_Position = projectionMatrix * mv;
}`;
const dustFragment = /* glsl */ `
varying float vA; varying float vS;
void main(){
  float d = length(gl_PointCoord - 0.5) * 2.0;
  float a = smoothstep(1.0, 0.0, d); a *= a;
  vec3 c = mix(${GOLD}, vec3(1.0, 0.92, 0.70), vS);
  gl_FragColor = vec4(c, a * vA * 1.2);
}`;

function Dust({ count }: { count: number }) {
  const { geometry, material } = useMemo(() => {
    const rnd = rng(21);
    const pos = new Float32Array(count * 3);
    const seed = new Float32Array(count);
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (rnd() - 0.5) * 36;
      pos[i * 3 + 1] = (rnd() - 0.5) * 16;
      pos[i * 3 + 2] = -rnd() * DEPTH;
      seed[i] = rnd();
    }
    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute("position", new THREE.BufferAttribute(pos, 3));
    geometry.setAttribute("aSeed", new THREE.BufferAttribute(seed, 1));
    const material = new THREE.ShaderMaterial({
      uniforms: U,
      vertexShader: dustVertex,
      fragmentShader: dustFragment,
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      depthTest: false,
    });
    return { geometry, material };
  }, [count]);
  useEffect(() => () => { geometry.dispose(); material.dispose(); }, [geometry, material]);
  return <points geometry={geometry} material={material} frustumCulled={false} renderOrder={2} />;
}

// ----------------------------------------------------------------- trails
// Streaks of light along the direction of travel. They brighten and stretch while the visitor scrolls fast.
const trailVertex = /* glsl */ `
attribute float aEnd; attribute float aSeed; attribute float aLen;
uniform float uT, uCamZ, uTrail, uLight, uCalm, uVel; varying float vA;
void main(){
  vec3 p = position;
  float d = mod(uCamZ - p.z + uT * (0.6 + aSeed) * uCalm, ${DEPTH.toFixed(1)});
  p.z = uCamZ - d + aEnd * aLen * (1.0 + uVel * 2.2);
  float near = smoothstep(2.0, 8.0, d);
  float far = 1.0 - smoothstep(50.0, 110.0, d);
  vA = (1.0 - aEnd) * near * far * uTrail * uLight * (0.35 + 0.65 * uVel + 0.25 * aSeed);
  gl_Position = projectionMatrix * modelViewMatrix * vec4(p, 1.0);
}`;
const trailFragment = /* glsl */ `
varying float vA;
void main(){ gl_FragColor = vec4(${GOLD}, vA * 1.0); }`;

function Trails({ count }: { count: number }) {
  const { geometry, material } = useMemo(() => {
    const rnd = rng(55);
    const pos = new Float32Array(count * 2 * 3);
    const end = new Float32Array(count * 2);
    const seed = new Float32Array(count * 2);
    const len = new Float32Array(count * 2);
    for (let i = 0; i < count; i++) {
      const x = (rnd() - 0.5) * 30;
      const y = (rnd() - 0.5) * 12;
      const z = -rnd() * DEPTH;
      const s = rnd();
      const l = 5 + rnd() * 9;
      for (let k = 0; k < 2; k++) {
        const o = (i * 2 + k) * 3;
        pos[o] = x;
        pos[o + 1] = y;
        pos[o + 2] = z;
        end[i * 2 + k] = k;
        seed[i * 2 + k] = s;
        len[i * 2 + k] = l;
      }
    }
    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute("position", new THREE.BufferAttribute(pos, 3));
    geometry.setAttribute("aEnd", new THREE.BufferAttribute(end, 1));
    geometry.setAttribute("aSeed", new THREE.BufferAttribute(seed, 1));
    geometry.setAttribute("aLen", new THREE.BufferAttribute(len, 1));
    const material = new THREE.ShaderMaterial({
      uniforms: U,
      vertexShader: trailVertex,
      fragmentShader: trailFragment,
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      depthTest: false,
    });
    return { geometry, material };
  }, [count]);
  useEffect(() => () => { geometry.dispose(); material.dispose(); }, [geometry, material]);
  return <lineSegments geometry={geometry} material={material} frustumCulled={false} renderOrder={3} />;
}

// ----------------------------------------------------------------- driver
// The camera flies along one smooth curve through the waypoints (a Catmull-Rom spline, as in Kage's rig).
const curveP = new THREE.CatmullRomCurve3(WAYPOINTS.map((w) => new THREE.Vector3(...w.p)), false, "catmullrom", 0.42);
const curveT = new THREE.CatmullRomCurve3(WAYPOINTS.map((w) => new THREE.Vector3(...w.t)), false, "catmullrom", 0.42);
const _p = new THREE.Vector3();
const _t = new THREE.Vector3();
const scene: SceneParams = { light: 0, rays: 0, dust: 0, trail: 0, frames: 0, calm: 1, poolX: 0, poolY: 0 };

const perf = { acc: 0, n: 0, scale: 1 };
let clock = 0;

type DriverProps = { reduced: boolean; baseDpr: number };

function Driver({ reduced, baseDpr }: DriverProps) {
  useFrame((state, rawDelta) => {
    const dt = Math.min(rawDelta, 0.05); // animation never jumps…
    clock += dt;

    // …but the quality governor reads the truth (Kage's frame-time governor): shed resolution when frames run
    // slow, win it back when there is headroom.
    if (clock > 2.2 && !reduced) {
      perf.acc += rawDelta;
      perf.n++;
      if (perf.n >= 40 || perf.acc > 0.9) {
        const avg = perf.acc / perf.n;
        perf.acc = 0;
        perf.n = 0;
        if (avg > 0.023 && perf.scale > 0.55) {
          perf.scale = Math.max(0.55, perf.scale * (avg > 0.05 ? 0.64 : 0.85));
          state.setDpr(baseDpr * perf.scale);
        } else if (avg < 0.0138 && perf.scale < 1) {
          perf.scale = Math.min(1, perf.scale + 0.08);
          state.setDpr(baseDpr * perf.scale);
        }
      }
    }

    // One number drives everything: where the visitor is in the story.
    journey.prog = progressFor(window.scrollY);
    journey.smooth = reduced ? journey.prog : damp(journey.smooth, journey.prog, 5.2, dt);
    journey.mx = damp(journey.mx, journey.tmx, 2.6, dt);
    journey.my = damp(journey.my, journey.tmy, 2.6, dt);
    const lag = reduced ? 0 : Math.min(1, Math.abs(journey.prog - journey.smooth) * 2.5);

    sampleScene(journey.smooth, scene);

    // Camera along the curve, with a gentle hand-held drift from the pointer that fades out near the end.
    const n = WAYPOINTS.length - 1;
    const u = Math.min(1, Math.max(0, journey.smooth / n));
    curveP.getPoint(u, _p);
    curveT.getPoint(u, _t);
    const par = reduced ? 0 : 1 - smoothstep(3.2, 5, journey.smooth) * 0.7;
    _p.x += journey.mx * 0.7 * par;
    _p.y += journey.my * 0.4 * par;
    _t.x -= journey.mx * 0.25 * par;
    _t.y -= journey.my * 0.15 * par;
    const camera = state.camera as THREE.PerspectiveCamera;
    camera.position.copy(_p);
    camera.lookAt(_t);
    // Tall (phone) screens get a wider lens so the frames don't fall off the sides.
    const aspect = state.size.width / Math.max(1, state.size.height);
    const nf = Math.min(1, Math.max(0, (1.62 - aspect) / 1.05));
    const fov = 46 * (1 + nf * 0.4);
    if (Math.abs(camera.fov - fov) > 1e-3) {
      camera.fov = fov;
      camera.updateProjectionMatrix();
    }

    U.uT.value = reduced ? 0 : clock;
    U.uCamZ.value = _p.z;
    U.uVel.value = lag;
    U.uLight.value = scene.light;
    U.uRays.value = scene.rays;
    U.uDust.value = scene.dust;
    U.uTrail.value = scene.trail;
    U.uFrames.value = scene.frames;
    U.uCalm.value = scene.calm;
    U.uAspect.value = aspect;
    U.uPool.value.set(lerp(U.uPool.value.x, scene.poolX - journey.mx * 0.03, 0.2), lerp(U.uPool.value.y, scene.poolY + journey.my * 0.03, 0.2));
    U.uPx.value = state.size.height;
  });

  return null;
}

type JourneySceneProps = {
  /** Draw frames at all (the stage is on or near the screen). */
  active: boolean;
  reduced: boolean;
  low: boolean;
  onReady: () => void;
};

export default function JourneyScene({ active, reduced, low, onReady }: JourneySceneProps) {
  const baseDpr = low ? 1.25 : 1.5;
  return (
    <Canvas
      dpr={[1, baseDpr]}
      frameloop={!active ? "never" : reduced ? "demand" : "always"}
      camera={{ position: [0, 0.2, 8], fov: 46, near: 0.3, far: 220 }}
      gl={{ antialias: !low, alpha: false, powerPreference: "high-performance" }}
      onCreated={() => onReady()}
      style={{ position: "absolute", inset: 0 }}
    >
      <Atmosphere />
      <Frames />
      <Dust count={low ? 280 : 700} />
      <Trails count={low ? 28 : 64} />
      <Driver reduced={reduced} baseDpr={baseDpr} />
      <ReducedInvalidator reduced={reduced} />
    </Canvas>
  );
}

// With reduced motion the loop only runs on demand, so ask for a new frame whenever the scroll position changes.
function ReducedInvalidator({ reduced }: { reduced: boolean }) {
  const invalidate = useThree((s) => s.invalidate);
  useEffect(() => {
    if (!reduced) return;
    const draw = () => invalidate();
    window.addEventListener("scroll", draw, { passive: true });
    window.addEventListener("resize", draw);
    return () => {
      window.removeEventListener("scroll", draw);
      window.removeEventListener("resize", draw);
    };
  }, [reduced, invalidate]);
  return null;
}
