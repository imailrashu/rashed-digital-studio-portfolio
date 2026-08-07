import { Canvas, useFrame } from "@react-three/fiber";
import {
  useEffect,
  useMemo,
  useRef,
  useState,
  type RefObject,
} from "react";
import * as THREE from "three";

import {
  type DeviceQuality,
  useDeviceQuality,
} from "../hooks/useDeviceQuality";
import { useReducedMotion } from "../hooks/useReducedMotion";
import { useTheme, type Theme } from "../components/theme/themeContext";
import ParticleFallback from "./ParticleFallback";

const scenePalettes = {
  dark: {
    shell: "#7cecff",
    nodes: "#d7faff",
    connections: "#56cfff",
    depth: "#527cff",
    core: "#3e87ff",
    ringPrimary: "#7ceeff",
    ringSecondary: "#4c72ff",
    ringDepth: "#8a6dff",
  },
  light: {
    shell: "#18749f",
    nodes: "#163c55",
    connections: "#297fd0",
    depth: "#6056c7",
    core: "#195fbd",
    ringPrimary: "#1980a9",
    ringSecondary: "#315dcc",
    ringDepth: "#7058c6",
  },
} as const;

function seededRandom(seed: number) {
  let value = seed % 2147483647;
  if (value <= 0) value += 2147483646;

  return () => {
    value = (value * 16807) % 2147483647;
    return (value - 1) / 2147483646;
  };
}

function particleCount(quality: DeviceQuality) {
  if (quality === "low") return 1900;
  if (quality === "medium") return 4400;
  return 8800;
}

function nodeCount(quality: DeviceQuality) {
  if (quality === "low") return 30;
  if (quality === "medium") return 58;
  return 92;
}

function pointOnSphere(random: () => number, radius = 1) {
  const theta = random() * Math.PI * 2;
  const phi = Math.acos(2 * random() - 1);

  return new THREE.Vector3(
    radius * Math.sin(phi) * Math.cos(theta),
    radius * Math.cos(phi) * 0.94,
    radius * Math.sin(phi) * Math.sin(theta),
  );
}

function NetworkObject({
  quality,
  reducedMotion,
  scrollProgress,
  theme,
}: {
  quality: DeviceQuality;
  reducedMotion: boolean;
  scrollProgress: RefObject<number>;
  theme: Theme;
}) {
  const rootRef = useRef<THREE.Group>(null);
  const shellRef = useRef<THREE.Points>(null);
  const innerRef = useRef<THREE.Mesh>(null);
  const ringsRef = useRef<THREE.Group>(null);
  const shellMaterialRef = useRef<THREE.PointsMaterial>(null);
  const lineMaterialRef = useRef<THREE.LineBasicMaterial>(null);
  const palette = scenePalettes[theme];
  const lightTheme = theme === "light";

  const shellPositions = useMemo(() => {
    const count = particleCount(quality);
    const random = seededRandom(1487);
    const array = new Float32Array(count * 3);

    for (let i = 0; i < count; i += 1) {
      const theta = random() * Math.PI * 2;
      const phi = Math.acos(2 * random() - 1);
      const architecture =
        Math.sin(theta * 6) * 0.055 +
        Math.cos(phi * 8) * 0.045;
      const radius = 1.22 + random() * 0.34 + architecture;

      array[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
      array[i * 3 + 1] = radius * Math.cos(phi) * 0.94;
      array[i * 3 + 2] = radius * Math.sin(phi) * Math.sin(theta);
    }

    return array;
  }, [quality]);

  const depthPositions = useMemo(() => {
    const count = quality === "low" ? 90 : quality === "medium" ? 180 : 320;
    const random = seededRandom(9021);
    const array = new Float32Array(count * 3);

    for (let i = 0; i < count; i += 1) {
      const point = pointOnSphere(random, 2.15 + random() * 1.25);
      array.set(point.toArray(), i * 3);
    }

    return array;
  }, [quality]);

  const network = useMemo(() => {
    const count = nodeCount(quality);
    const random = seededRandom(3719);
    const nodes = Array.from({ length: count }, () =>
      pointOnSphere(random, 1.37 + random() * 0.08),
    );
    const nodePositions = new Float32Array(count * 3);

    nodes.forEach((node, index) => {
      nodePositions.set(node.toArray(), index * 3);
    });

    const connectionPositions: number[] = [];
    const neighbors = quality === "low" ? 1 : quality === "medium" ? 2 : 3;

    nodes.forEach((node, index) => {
      const nearest = nodes
        .map((candidate, candidateIndex) => ({
          candidate,
          candidateIndex,
          distance: node.distanceToSquared(candidate),
        }))
        .filter(({ candidateIndex }) => candidateIndex > index)
        .sort((a, b) => a.distance - b.distance)
        .slice(0, neighbors);

      nearest.forEach(({ candidate }) => {
        connectionPositions.push(...node.toArray(), ...candidate.toArray());
      });
    });

    return {
      nodes: nodePositions,
      connections: new Float32Array(connectionPositions),
    };
  }, [quality]);

  useFrame((state, delta) => {
    const root = rootRef.current;
    const progress = scrollProgress.current ?? 0;

    if (!root) return;

    if (!reducedMotion) {
      root.rotation.y += delta * (0.045 + progress * 0.12);
      root.rotation.x = THREE.MathUtils.lerp(
        root.rotation.x,
        (quality === "low" ? 0 : state.pointer.y * 0.1) + progress * 0.18,
        0.035,
      );
      root.rotation.z = THREE.MathUtils.lerp(
        root.rotation.z,
        (quality === "low" ? 0 : -state.pointer.x * 0.075) - progress * 0.1,
        0.035,
      );
      root.position.x = THREE.MathUtils.lerp(
        root.position.x,
        progress > 0.52 ? (progress - 0.52) * 0.85 : 0,
        0.04,
      );

      if (shellRef.current) {
        shellRef.current.rotation.y -= delta * 0.018;
      }

      if (innerRef.current) {
        innerRef.current.rotation.x -= delta * 0.035;
        innerRef.current.rotation.y += delta * 0.055;
      }

      if (ringsRef.current) {
        ringsRef.current.rotation.z += delta * 0.025;
        const ringScale = 1 + progress * 0.2;
        ringsRef.current.scale.setScalar(
          THREE.MathUtils.lerp(ringsRef.current.scale.x, ringScale, 0.045),
        );
      }
    }

    const targetScale = 1 + Math.min(progress, 0.78) * 0.18;
    root.scale.setScalar(
      THREE.MathUtils.lerp(root.scale.x, targetScale, 0.04),
    );

    if (shellMaterialRef.current) {
      shellMaterialRef.current.opacity = THREE.MathUtils.lerp(
        lightTheme ? 0.72 : 0.86,
        lightTheme ? 0.48 : 0.56,
        progress,
      );
    }

    if (lineMaterialRef.current) {
      lineMaterialRef.current.opacity = THREE.MathUtils.lerp(
        lightTheme
          ? quality === "low" ? 0.18 : 0.14
          : quality === "low" ? 0.12 : 0.08,
        lightTheme
          ? quality === "low" ? 0.38 : 0.5
          : quality === "low" ? 0.3 : 0.58,
        progress,
      );
    }

    const cameraTargetZ = 5.3 - Math.min(progress, 0.72) * 0.72;
    state.camera.position.z = THREE.MathUtils.lerp(
      state.camera.position.z,
      cameraTargetZ,
      0.04,
    );
    state.camera.position.x = THREE.MathUtils.lerp(
      state.camera.position.x,
      quality === "low" ? 0 : state.pointer.x * 0.08,
      0.025,
    );
    state.camera.lookAt(0, 0, 0);
  });

  const torusSegments = quality === "low" ? 72 : quality === "medium" ? 112 : 160;

  return (
    <group ref={rootRef}>
      <points ref={shellRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[shellPositions, 3]}
          />
        </bufferGeometry>
        <pointsMaterial
          ref={shellMaterialRef}
          color={palette.shell}
          size={quality === "low" ? 0.026 : 0.018}
          sizeAttenuation
          transparent
          opacity={lightTheme ? 0.72 : 0.86}
          depthWrite={false}
          blending={lightTheme ? THREE.NormalBlending : THREE.AdditiveBlending}
        />
      </points>

      <points>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[network.nodes, 3]}
          />
        </bufferGeometry>
        <pointsMaterial
          color={palette.nodes}
          size={quality === "low" ? 0.05 : 0.04}
          sizeAttenuation
          transparent
          opacity={lightTheme ? 0.82 : 0.92}
          depthWrite={false}
          blending={lightTheme ? THREE.NormalBlending : THREE.AdditiveBlending}
        />
      </points>

      <lineSegments>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[network.connections, 3]}
          />
        </bufferGeometry>
        <lineBasicMaterial
          ref={lineMaterialRef}
          color={palette.connections}
          transparent
          opacity={lightTheme ? 0.14 : 0.08}
          depthWrite={false}
          blending={lightTheme ? THREE.NormalBlending : THREE.AdditiveBlending}
        />
      </lineSegments>

      <points>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[depthPositions, 3]}
          />
        </bufferGeometry>
        <pointsMaterial
          color={palette.depth}
          size={quality === "low" ? 0.02 : 0.014}
          sizeAttenuation
          transparent
          opacity={lightTheme ? 0.28 : 0.24}
          depthWrite={false}
        />
      </points>

      <mesh ref={innerRef} scale={0.76}>
        <icosahedronGeometry args={[1, quality === "low" ? 1 : 2]} />
        <meshBasicMaterial
          color={palette.core}
          wireframe
          transparent
          opacity={lightTheme ? 0.2 : 0.13}
          depthWrite={false}
        />
      </mesh>

      <group ref={ringsRef}>
        <mesh rotation={[1.02, 0.2, 0.35]} scale={1.58}>
          <torusGeometry args={[1, 0.004, 6, torusSegments]} />
          <meshBasicMaterial color={palette.ringPrimary} transparent opacity={lightTheme ? 0.42 : 0.33} />
        </mesh>

        <mesh rotation={[0.28, 0.98, 1.06]} scale={1.78}>
          <torusGeometry args={[1, 0.003, 6, torusSegments]} />
          <meshBasicMaterial color={palette.ringSecondary} transparent opacity={lightTheme ? 0.3 : 0.23} />
        </mesh>

        {quality !== "low" && (
          <mesh rotation={[0.72, -0.55, 0.16]} scale={1.98}>
            <torusGeometry args={[1, 0.0025, 6, torusSegments]} />
            <meshBasicMaterial color={palette.ringDepth} transparent opacity={lightTheme ? 0.18 : 0.13} />
          </mesh>
        )}
      </group>
    </group>
  );
}

function supportsWebGL() {
  try {
    const canvas = document.createElement("canvas");
    return Boolean(
      window.WebGLRenderingContext &&
        (canvas.getContext("webgl") || canvas.getContext("experimental-webgl")),
    );
  } catch {
    return false;
  }
}

export default function ParticleScene({
  scrollProgress,
}: {
  scrollProgress: RefObject<number>;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(true);
  const [webGLSupported] = useState(() => supportsWebGL());
  const quality = useDeviceQuality();
  const reducedMotion = useReducedMotion();
  const { theme } = useTheme();

  useEffect(() => {
    const container = containerRef.current;
    if (!container || !("IntersectionObserver" in window)) return;

    const observer = new IntersectionObserver(
      ([entry]) => setIsVisible(entry.isIntersecting),
      { rootMargin: "120px 0px", threshold: 0.01 },
    );

    observer.observe(container);
    return () => observer.disconnect();
  }, []);

  if (!webGLSupported) {
    return <ParticleFallback />;
  }

  return (
    <div
      className="particle-scene"
      ref={containerRef}
      data-quality={quality}
      data-render-mode={isVisible && !reducedMotion ? "continuous" : "paused"}
    >
      <Canvas
        dpr={
          quality === "low"
            ? [1, 1.5]
            : quality === "medium"
              ? [1, 1.6]
              : [1, 2]
        }
        frameloop={isVisible && !reducedMotion ? "always" : "demand"}
        camera={{ position: [0, 0, 5.3], fov: 40 }}
        gl={{
          antialias: quality !== "low",
          alpha: true,
          powerPreference: quality === "high" ? "high-performance" : "low-power",
        }}
      >
        <NetworkObject
          quality={quality}
          reducedMotion={reducedMotion}
          scrollProgress={scrollProgress}
          theme={theme}
        />
      </Canvas>
    </div>
  );
}
