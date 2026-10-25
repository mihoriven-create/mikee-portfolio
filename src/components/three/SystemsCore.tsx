"use client";

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useMemo, useRef, type PointerEvent as ReactPointerEvent } from "react";
import * as THREE from "three";

const GOLD = new THREE.Color("#d4af37");
const GOLD_LIGHT = new THREE.Color("#f3d98b");
const SHOCKWAVE_SECONDS = 1.4;

/** Shared, mutable interaction state — written by DOM pointer handlers, read every frame. */
type Interaction = {
  dragging: boolean;
  moved: number;
  lastX: number;
  lastY: number;
  velX: number;
  velY: number;
  hovered: boolean;
  boost: number; // 0..1, decays after a click
  pulse: number; // seconds since the last shockwave started (-1 = idle)
  originPending: boolean; // the next frame captures the click position as the shockwave origin
  originX: number;
  originY: number;
};

// Module-level because there is a single hero core per page; mutating it per frame avoids re-renders.
const interaction: Interaction = {
  dragging: false,
  moved: 0,
  lastX: 0,
  lastY: 0,
  velX: 0,
  velY: 0,
  hovered: false,
  boost: 0,
  pulse: -1,
  originPending: false,
  originX: 0,
  originY: 0,
};

/** Deterministic 0..1 pseudo-random value (keeps render pure; same layout every time). */
function hash(n: number) {
  const x = Math.sin(n * 12.9898 + 78.233) * 43758.5453;
  return x - Math.floor(x);
}

/** Where the orb sits and how big it is, in world units, for the current viewport. */
function useLayout() {
  const viewport = useThree((s) => s.viewport);
  const size = useThree((s) => s.size);
  const mobile = size.width < 640;
  // Fit the orbit system (radius ≈ 2.6) into a share of the screen, below the heading.
  const scale = Math.min(viewport.height * (mobile ? 0.15 : 0.125), viewport.width * (mobile ? 0.17 : 0.2));
  const y = -viewport.height * (mobile ? 0.03 : 0.085);
  return { viewport, scale, y, mobile };
}

let goldMatcap: THREE.CanvasTexture | null = null;

/**
 * A baked "studio-lit gold" sphere painted on a small canvas. Matcap materials read their shading from it,
 * so the orb looks metallic without real-time lights or an environment map (which cost seconds of
 * shader compilation and pre-filtering on mobile CPUs).
 */
function getGoldMatcap() {
  if (goldMatcap) return goldMatcap;
  const size = 256;
  const canvas = document.createElement("canvas");
  canvas.width = canvas.height = size;
  const ctx = canvas.getContext("2d")!;
  const body = ctx.createRadialGradient(size * 0.36, size * 0.3, size * 0.02, size * 0.5, size * 0.5, size * 0.52);
  body.addColorStop(0, "#fffbe8");
  body.addColorStop(0.16, "#f7e3a1");
  body.addColorStop(0.42, "#d4af37");
  body.addColorStop(0.72, "#8c6a22");
  body.addColorStop(1, "#24190a");
  ctx.fillStyle = body;
  ctx.fillRect(0, 0, size, size);
  // Warm rim light from the lower right.
  const rim = ctx.createRadialGradient(size * 0.78, size * 0.8, 0, size * 0.78, size * 0.8, size * 0.35);
  rim.addColorStop(0, "rgba(243,217,139,0.55)");
  rim.addColorStop(1, "rgba(243,217,139,0)");
  ctx.fillStyle = rim;
  ctx.fillRect(0, 0, size, size);
  goldMatcap = new THREE.CanvasTexture(canvas);
  goldMatcap.colorSpace = THREE.SRGBColorSpace;
  return goldMatcap;
}

/** Gold dust spread across the whole hero: drifts, parts around the cursor, ripples with each shockwave. */
function GoldField({ animate }: { animate: boolean }) {
  const { viewport, mobile } = useLayout();
  const count = mobile ? 260 : 650;
  const points = useRef<THREE.Points>(null);

  const { base, initial, phases } = useMemo(() => {
    const base = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      base[i * 3] = (hash(i * 3) - 0.5) * viewport.width * 1.1;
      base[i * 3 + 1] = (hash(i * 3 + 1) - 0.5) * viewport.height * 1.1;
      base[i * 3 + 2] = (hash(i * 3 + 2) - 0.5) * 3;
    }
    const phases = Float32Array.from({ length: count }, (_, i) => hash(i + 9999) * Math.PI * 2);
    return { base, initial: base.slice(), phases };
  }, [count, viewport.width, viewport.height]);

  useFrame(({ pointer, clock }) => {
    if (!points.current || !animate) return;
    // Live positions are the geometry's own buffer; it starts as a copy of the home positions.
    const positions = points.current.geometry.attributes.position.array as Float32Array;
    const s = interaction;
    const px = (pointer.x * viewport.width) / 2;
    const py = (pointer.y * viewport.height) / 2;
    const t = clock.elapsedTime;
    const maxR = Math.hypot(viewport.width, viewport.height) / 2 + 1;
    const waveT = s.pulse >= 0 ? s.pulse / SHOCKWAVE_SECONDS : -1;
    const waveR = waveT * maxR * 1.3;

    for (let i = 0; i < count; i++) {
      const ix = i * 3;
      // Slow drift around each particle's home position.
      let tx = base[ix] + Math.sin(t * 0.3 + phases[i]) * 0.15;
      let ty = base[ix + 1] + Math.cos(t * 0.25 + phases[i]) * 0.15;

      // Part around the cursor.
      const dx = tx - px;
      const dy = ty - py;
      const d = Math.hypot(dx, dy) || 0.0001;
      if (d < 1.6) {
        const push = (1.6 - d) * 0.9;
        tx += (dx / d) * push;
        ty += (dy / d) * push;
      }

      // Shockwave: particles near the expanding wavefront get thrown outward.
      if (waveT >= 0) {
        const ox = base[ix] - s.originX;
        const oy = base[ix + 1] - s.originY;
        const od = Math.hypot(ox, oy) || 0.0001;
        const band = Math.abs(od - waveR);
        if (band < 1.2) {
          const force = (1.2 - band) * 1.1 * (1 - waveT);
          tx += (ox / od) * force;
          ty += (oy / od) * force;
        }
      }

      positions[ix] += (tx - positions[ix]) * 0.08;
      positions[ix + 1] += (ty - positions[ix + 1]) * 0.08;
    }
    points.current.geometry.attributes.position.needsUpdate = true;
  });

  return (
    <points ref={points}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[initial, 3]} />
      </bufferGeometry>
      <pointsMaterial
        color={GOLD_LIGHT}
        size={mobile ? 0.05 : 0.045}
        sizeAttenuation
        transparent
        opacity={0.75}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

/** A full-screen ring that expands from wherever the visitor clicked. */
function Shockwave() {
  const { viewport } = useLayout();
  const ring = useRef<THREE.Mesh>(null);
  const mat = useRef<THREE.MeshBasicMaterial>(null);

  useFrame(({ pointer }, delta) => {
    const s = interaction;
    if (!ring.current || !mat.current) return;
    if (s.originPending) {
      s.originX = (pointer.x * viewport.width) / 2;
      s.originY = (pointer.y * viewport.height) / 2;
      s.originPending = false;
    }
    if (s.pulse < 0) {
      mat.current.opacity = 0;
      return;
    }
    s.pulse += delta;
    const t = Math.min(s.pulse / SHOCKWAVE_SECONDS, 1);
    const maxR = Math.hypot(viewport.width, viewport.height) * 0.65;
    ring.current.position.set(s.originX, s.originY, 0.5);
    ring.current.scale.setScalar(0.2 + t * maxR);
    mat.current.opacity = 0.85 * (1 - t) ** 1.5;
    if (t >= 1) s.pulse = -1;
  });

  return (
    <mesh ref={ring}>
      <ringGeometry args={[0.96, 1, 128]} />
      <meshBasicMaterial ref={mat} color={GOLD_LIGHT} transparent opacity={0} side={THREE.DoubleSide} depthWrite={false} />
    </mesh>
  );
}

/** An orbit ring with integration "nodes" travelling along it; speeds up while boosted. */
function Orbit({ radius, tilt, speed, nodes }: { radius: number; tilt: [number, number, number]; speed: number; nodes: number }) {
  const group = useRef<THREE.Group>(null);
  const matcap = useMemo(() => getGoldMatcap(), []);
  const positions = useMemo(
    () =>
      Array.from({ length: nodes }, (_, i) => {
        const a = (i / nodes) * Math.PI * 2;
        return [Math.cos(a) * radius, Math.sin(a) * radius, 0] as [number, number, number];
      }),
    [nodes, radius],
  );

  useFrame((_, delta) => {
    const { boost, hovered } = interaction;
    if (group.current) group.current.rotation.z += delta * speed * (1 + boost * 7 + (hovered ? 0.8 : 0));
  });

  return (
    <group rotation={tilt}>
      <mesh>
        <torusGeometry args={[radius, 0.006, 8, 160]} />
        <meshBasicMaterial color={GOLD} transparent opacity={0.35} />
      </mesh>
      <group ref={group}>
        {positions.map((p, i) => (
          <mesh key={i} position={p}>
            <sphereGeometry args={[0.055, 16, 16]} />
            <meshMatcapMaterial matcap={matcap} color={GOLD_LIGHT} />
          </mesh>
        ))}
      </group>
    </group>
  );
}

function Core({ animate }: { animate: boolean }) {
  const { scale, y } = useLayout();
  const tilt = useRef<THREE.Group>(null);
  const spin = useRef<THREE.Group>(null);
  const inner = useRef<THREE.Mesh>(null);
  const innerMat = useRef<THREE.MeshMatcapMaterial>(null);
  const shell = useRef<THREE.Mesh>(null);
  const matcap = useMemo(() => getGoldMatcap(), []);

  useFrame(({ pointer }, delta) => {
    const s = interaction;
    if (!tilt.current || !spin.current || !inner.current || !shell.current || !innerMat.current) return;

    // Drag momentum, with a gentle idle spin once it settles.
    spin.current.rotation.y += s.velX;
    spin.current.rotation.x += s.velY;
    if (!s.dragging) {
      s.velX *= 0.94;
      s.velY *= 0.94;
      if (animate && Math.abs(s.velX) < 0.002) spin.current.rotation.y += delta * 0.12;
    }

    if (animate) {
      inner.current.rotation.y += delta * (0.25 + s.boost * 4);
      inner.current.rotation.x += delta * 0.1;
      shell.current.rotation.y -= delta * (0.12 + s.boost * 1.5);
      // Lean toward the cursor anywhere on screen (skipped while dragging so it never fights the user).
      if (!s.dragging) {
        tilt.current.rotation.x = THREE.MathUtils.lerp(tilt.current.rotation.x, -pointer.y * 0.4, 0.05);
        tilt.current.rotation.y = THREE.MathUtils.lerp(tilt.current.rotation.y, pointer.x * 0.5, 0.05);
      }
    }

    // Hover grows and brightens the core; a click adds a short flash.
    const targetScale = (s.hovered ? 1.14 : 1) + s.boost * 0.15;
    inner.current.scale.setScalar(THREE.MathUtils.lerp(inner.current.scale.x, targetScale, 0.12));
    // Matcap colour multiplies the baked shading; values above 1 brighten it into a glow.
    const glow = THREE.MathUtils.lerp(innerMat.current.color.r, (s.hovered ? 1.3 : 1) + s.boost * 0.6, 0.15);
    innerMat.current.color.setScalar(glow);
    s.boost = Math.max(0, s.boost - delta * 0.8);
  });

  return (
    <group position={[0, y, 0]} scale={scale}>
      <group ref={tilt}>
        <group ref={spin}>
          <mesh ref={inner} onPointerOver={() => (interaction.hovered = true)} onPointerOut={() => (interaction.hovered = false)}>
            <icosahedronGeometry args={[1, 1]} />
            <meshMatcapMaterial ref={innerMat} matcap={matcap} flatShading />
          </mesh>
          <mesh ref={shell} scale={1.45}>
            <icosahedronGeometry args={[1, 2]} />
            <meshBasicMaterial color={GOLD_LIGHT} wireframe transparent opacity={0.12} />
          </mesh>
          <Orbit radius={2.05} tilt={[1.2, 0.2, 0]} speed={animate ? 0.35 : 0} nodes={5} />
          {animate && (
            <>
              <Orbit radius={2.45} tilt={[-0.9, 0.6, 0.3]} speed={-0.22} nodes={7} />
              <Orbit radius={1.75} tilt={[0.3, -1.1, 0]} speed={0.5} nodes={3} />
            </>
          )}
        </group>
      </group>
    </group>
  );
}

export default function SystemsCore({ animate = true, onReady }: { animate?: boolean; onReady?: () => void }) {
  const container = useRef<HTMLDivElement>(null);

  const setCursor = (c: string) => container.current && (container.current.style.cursor = c);

  const onPointerDown = (e: ReactPointerEvent<HTMLDivElement>) => {
    const s = interaction;
    s.dragging = true;
    s.moved = 0;
    s.lastX = e.clientX;
    s.lastY = e.clientY;
    e.currentTarget.setPointerCapture(e.pointerId);
    setCursor("grabbing");
  };

  const onPointerMove = (e: ReactPointerEvent<HTMLDivElement>) => {
    const s = interaction;
    if (!s.dragging) return;
    const dx = e.clientX - s.lastX;
    const dy = e.clientY - s.lastY;
    s.moved += Math.abs(dx) + Math.abs(dy);
    s.velX = dx * 0.006;
    s.velY = dy * 0.006;
    s.lastX = e.clientX;
    s.lastY = e.clientY;
  };

  const onPointerUp = (e: ReactPointerEvent<HTMLDivElement>) => {
    const s = interaction;
    s.dragging = false;
    if (e.currentTarget.hasPointerCapture(e.pointerId)) e.currentTarget.releasePointerCapture(e.pointerId);
    setCursor("grab");
    // A press without real movement counts as a click: send a shockwave from that spot.
    if (s.moved < 6 && animate) {
      s.boost = 1;
      s.pulse = 0;
      s.originPending = true;
      s.velX += 0.08;
    }
  };

  return (
    <div
      ref={container}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerCancel={onPointerUp}
      // Vertical swipes still scroll the page on touch screens; horizontal ones spin the core.
      style={{ touchAction: "pan-y", cursor: "grab" }}
      className="size-full select-none"
      aria-hidden="true"
    >
      <Canvas
        dpr={[1, 1.5]}
        camera={{ position: [0, 0, 10], fov: 42 }}
        gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
        frameloop={animate ? "always" : "demand"}
        onCreated={() => onReady?.()}
      >
        {/* No lights needed: matcap and basic materials carry their own shading. */}
        <GoldField animate={animate} />
        <Core animate={animate} />
        <Shockwave />
      </Canvas>
    </div>
  );
}
