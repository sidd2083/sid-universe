'use client';

import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { useRouter } from 'next/navigation';
import { INITIAL_PLANETS } from '@/lib/planetsData';
import { PlanetConfig } from '@/lib/types';
import { cosmicSounds } from '@/lib/soundEffects';
import { Orbit, Compass, Eye, Sparkles } from 'lucide-react';

interface UniverseCanvasProps {
  onSelectPlanet?: (planet: PlanetConfig) => void;
}

export default function UniverseCanvas({ onSelectPlanet }: UniverseCanvasProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  const [hoveredPlanet, setHoveredPlanet] = useState<PlanetConfig | null>(null);
  const [tooltipPos, setTooltipPos] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [isWarping, setIsWarping] = useState<boolean>(false);

  useEffect(() => {
    if (!containerRef.current) return;

    const container = containerRef.current;
    let width = container.clientWidth || window.innerWidth;
    let height = container.clientHeight || 650;

    // 1. Scene & Camera
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x020409, 0.015);

    const camera = new THREE.PerspectiveCamera(48, width / height, 0.1, 1000);
    camera.position.set(0, 16, 26);
    camera.lookAt(0, 0, 0);

    // 2. Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.2;
    container.appendChild(renderer.domElement);

    // 3. Lighting
    const ambientLight = new THREE.AmbientLight(0x1a264a, 0.8);
    scene.add(ambientLight);

    // Sun PointLight at core
    const sunLight = new THREE.PointLight(0xffb700, 3.5, 90, 1.2);
    sunLight.position.set(0, 0, 0);
    scene.add(sunLight);

    // Subtle rim light
    const rimLight = new THREE.DirectionalLight(0x64748b, 0.5);
    rimLight.position.set(20, 40, 20);
    scene.add(rimLight);

    // 4. Central Sun (representing Sid)
    const sunGroup = new THREE.Group();
    scene.add(sunGroup);

    // Sun Core
    const sunGeometry = new THREE.SphereGeometry(1.6, 36, 36);
    const sunMaterial = new THREE.MeshBasicMaterial({
      color: 0xffcc33,
    });
    const sunMesh = new THREE.Mesh(sunGeometry, sunMaterial);
    sunGroup.add(sunMesh);

    // Sun Corona Halo
    const coronaGeo = new THREE.SphereGeometry(1.95, 32, 32);
    const coronaMat = new THREE.MeshBasicMaterial({
      color: 0xff6600,
      transparent: true,
      opacity: 0.35,
      blending: THREE.AdditiveBlending,
      side: THREE.BackSide
    });
    const coronaMesh = new THREE.Mesh(coronaGeo, coronaMat);
    sunGroup.add(coronaMesh);

    // Outer Solar Flare Aura
    const auraGeo = new THREE.SphereGeometry(2.3, 32, 32);
    const auraMat = new THREE.MeshBasicMaterial({
      color: 0xffaa00,
      transparent: true,
      opacity: 0.15,
      blending: THREE.AdditiveBlending,
      side: THREE.BackSide
    });
    const auraMesh = new THREE.Mesh(auraGeo, auraMat);
    sunGroup.add(auraMesh);

    // 5. Starfield Particles
    const starCount = 1800;
    const starGeo = new THREE.BufferGeometry();
    const starPositions = new Float32Array(starCount * 3);
    const starColors = new Float32Array(starCount * 3);

    for (let i = 0; i < starCount; i++) {
      const radius = 35 + Math.random() * 80;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(Math.random() * 2 - 1);

      starPositions[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
      starPositions[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
      starPositions[i * 3 + 2] = radius * Math.cos(phi);

      // Star tinting: subtle blues, whites, gold
      const tint = Math.random();
      if (tint > 0.8) {
        starColors[i * 3] = 0.7; starColors[i * 3 + 1] = 0.85; starColors[i * 3 + 2] = 1.0;
      } else if (tint > 0.6) {
        starColors[i * 3] = 1.0; starColors[i * 3 + 1] = 0.9; starColors[i * 3 + 2] = 0.6;
      } else {
        starColors[i * 3] = 1.0; starColors[i * 3 + 1] = 1.0; starColors[i * 3 + 2] = 1.0;
      }
    }

    starGeo.setAttribute('position', new THREE.BufferAttribute(starPositions, 3));
    starGeo.setAttribute('color', new THREE.BufferAttribute(starColors, 3));

    const starMat = new THREE.PointsMaterial({
      size: 0.6,
      vertexColors: true,
      transparent: true,
      opacity: 0.85,
    });
    const starField = new THREE.Points(starGeo, starMat);
    scene.add(starField);

    // 6. Create the 7 Custom Planets
    interface PlanetNode {
      config: PlanetConfig;
      mesh: THREE.Mesh;
      group: THREE.Group;
      orbitLine: THREE.Line;
      angle: number;
    }

    const planetNodes: PlanetNode[] = [];
    const raycastMeshes: THREE.Mesh[] = [];

    INITIAL_PLANETS.forEach((planet, index) => {
      const planetGroup = new THREE.Group();
      scene.add(planetGroup);

      // Orbital Path Line
      const orbitCurve = new THREE.EllipseCurve(
        0, 0,
        planet.orbitRadius, planet.orbitRadius,
        0, 2 * Math.PI,
        false,
        0
      );
      const points = orbitCurve.getPoints(90);
      const orbitGeometry = new THREE.BufferGeometry().setFromPoints(
        points.map(p => new THREE.Vector3(p.x, 0, p.y))
      );
      const orbitMaterial = new THREE.LineBasicMaterial({
        color: new THREE.Color(planet.color),
        transparent: true,
        opacity: 0.18
      });
      const orbitLine = new THREE.Line(orbitGeometry, orbitMaterial);
      scene.add(orbitLine);

      // Planet Sphere Mesh
      const geometry = new THREE.SphereGeometry(planet.radius, 32, 32);
      const material = new THREE.MeshStandardMaterial({
        color: new THREE.Color(planet.color),
        roughness: 0.5,
        metalness: 0.4,
        emissive: new THREE.Color(planet.emissiveColor),
        emissiveIntensity: 0.35,
      });

      const mesh = new THREE.Mesh(geometry, material);
      (mesh as any).userData = { planet };
      planetGroup.add(mesh);
      raycastMeshes.push(mesh);

      // Optional Planetary Ring
      if (planet.rings) {
        const ringGeo = new THREE.RingGeometry(planet.radius * 1.35, planet.radius * 2.1, 32);
        const ringMat = new THREE.MeshBasicMaterial({
          color: new THREE.Color(planet.ringColor || planet.color),
          side: THREE.DoubleSide,
          transparent: true,
          opacity: 0.45,
        });
        const ringMesh = new THREE.Mesh(ringGeo, ringMat);
        ringMesh.rotation.x = Math.PI / 2.3;
        planetGroup.add(ringMesh);
      }

      // Initial angle spread
      const initialAngle = (index / INITIAL_PLANETS.length) * Math.PI * 2;

      planetNodes.push({
        config: planet,
        mesh,
        group: planetGroup,
        orbitLine,
        angle: initialAngle
      });
    });

    // 7. Raycasting & Interaction
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2(-100, -100);

    let isDragging = false;
    let prevMouseX = 0;
    let prevMouseY = 0;
    let targetRotationY = 0;
    let targetRotationX = 0;

    const handlePointerDown = (e: MouseEvent | TouchEvent) => {
      isDragging = true;
      const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
      const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
      prevMouseX = clientX;
      prevMouseY = clientY;
    };

    const handlePointerMove = (e: MouseEvent | TouchEvent) => {
      const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
      const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;

      if (isDragging) {
        const deltaX = clientX - prevMouseX;
        const deltaY = clientY - prevMouseY;
        targetRotationY += deltaX * 0.005;
        targetRotationX += deltaY * 0.003;
        targetRotationX = Math.max(-0.4, Math.min(0.8, targetRotationX));
        prevMouseX = clientX;
        prevMouseY = clientY;
      }

      // Tooltip positioning for mouse
      if (!('touches' in e)) {
        const rect = container.getBoundingClientRect();
        mouse.x = ((e.clientX - rect.left) / width) * 2 - 1;
        mouse.y = -((e.clientY - rect.top) / height) * 2 + 1;
        setTooltipPos({ x: e.clientX, y: e.clientY });
      }
    };

    const handlePointerUp = () => {
      isDragging = false;
    };

    const handleClick = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      const clickMouse = new THREE.Vector2(
        ((e.clientX - rect.left) / width) * 2 - 1,
        -((e.clientY - rect.top) / height) * 2 + 1
      );

      raycaster.setFromCamera(clickMouse, camera);
      const intersects = raycaster.intersectObjects(raycastMeshes);

      if (intersects.length > 0) {
        const hitPlanet = (intersects[0].object as any).userData?.planet as PlanetConfig;
        if (hitPlanet) {
          triggerWarp(hitPlanet);
        }
      }
    };

    function triggerWarp(planet: PlanetConfig) {
      cosmicSounds.playWarp();
      setIsWarping(true);
      if (onSelectPlanet) {
        onSelectPlanet(planet);
      }
      setTimeout(() => {
        router.push(planet.path);
      }, 350);
    }

    container.addEventListener('mousedown', handlePointerDown);
    window.addEventListener('mousemove', handlePointerMove);
    window.addEventListener('mouseup', handlePointerUp);
    container.addEventListener('click', handleClick);

    container.addEventListener('touchstart', handlePointerDown, { passive: true });
    window.addEventListener('touchmove', handlePointerMove, { passive: true });
    window.addEventListener('touchend', handlePointerUp);

    // 8. Resize Handler
    const handleResize = () => {
      if (!container) return;
      width = container.clientWidth || window.innerWidth;
      height = container.clientHeight || 650;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    };
    window.addEventListener('resize', handleResize);

    // 9. Animation Loop
    let animationFrameId: number;
    let clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);

      const delta = clock.getDelta();
      const elapsedTime = clock.getElapsedTime();

      // Rotate Sun
      sunGroup.rotation.y += 0.003;
      coronaMesh.rotation.y -= 0.002;
      auraMesh.rotation.z += 0.001;

      // Pulse Sun corona
      const pulse = 1 + Math.sin(elapsedTime * 2) * 0.04;
      coronaMesh.scale.set(pulse, pulse, pulse);

      // Slowly rotate starfield
      starField.rotation.y = elapsedTime * 0.0008;

      // Orbit planets
      planetNodes.forEach((node) => {
        node.angle += node.config.orbitSpeed;
        const x = Math.cos(node.angle) * node.config.orbitRadius;
        const z = Math.sin(node.angle) * node.config.orbitRadius;
        node.group.position.set(x, 0, z);

        // Self rotation
        node.mesh.rotation.y += node.config.rotationSpeed;
      });

      // Smooth camera drag rotation
      camera.position.x += (Math.sin(targetRotationY) * 26 - camera.position.x) * 0.05;
      camera.position.z += (Math.cos(targetRotationY) * 26 - camera.position.z) * 0.05;
      camera.position.y += ((16 + targetRotationX * 12) - camera.position.y) * 0.05;
      camera.lookAt(0, 0, 0);

      // Check Raycast hover
      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster.intersectObjects(raycastMeshes);

      if (intersects.length > 0) {
        const hitPlanet = (intersects[0].object as any).userData?.planet as PlanetConfig;
        if (hitPlanet && hoveredPlanet?.id !== hitPlanet.id) {
          setHoveredPlanet(hitPlanet);
          cosmicSounds.playPlanetHover(320);
          container.style.cursor = 'pointer';
        }
      } else {
        if (hoveredPlanet) {
          setHoveredPlanet(null);
          container.style.cursor = 'default';
        }
      }

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
      container.removeEventListener('mousedown', handlePointerDown);
      window.removeEventListener('mousemove', handlePointerMove);
      window.removeEventListener('mouseup', handlePointerUp);
      container.removeEventListener('click', handleClick);
      container.removeEventListener('touchstart', handlePointerDown);
      window.removeEventListener('touchmove', handlePointerMove);
      window.removeEventListener('touchend', handlePointerUp);

      if (container && renderer.domElement) {
        container.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, [router, onSelectPlanet, hoveredPlanet]);

  return (
    <div className="relative w-full h-[540px] sm:h-[620px] md:h-[700px] flex items-center justify-center overflow-hidden select-none">
      {/* 3D Canvas Container */}
      <div ref={containerRef} className="w-full h-full cursor-grab active:cursor-grabbing" />

      {/* Orbit Controls Hint Overlay */}
      <div className="absolute top-4 left-4 z-20 pointer-events-none hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-space-950/70 border border-space-border/60 text-[11px] font-mono text-slate-400 backdrop-blur-sm">
        <Compass size={13} className="text-cyan-400 animate-spin" style={{ animationDuration: '10s' }} />
        <span>Drag to rotate orbital plane • Click planet to enter</span>
      </div>

      {/* Sun Label (Sid) */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none z-10 flex flex-col items-center">
        <div className="mt-14 px-3 py-1 rounded-full bg-black/60 border border-amber-500/40 backdrop-blur-md text-[11px] font-mono font-bold tracking-widest text-amber-300 uppercase shadow-[0_0_12px_#ffaa00]">
          SID • CORE SUN
        </div>
      </div>

      {/* Hover Tooltip / Hologram */}
      {hoveredPlanet && (
        <div
          className="fixed z-50 pointer-events-none -translate-x-1/2 -translate-y-full mb-4 px-4 py-3 rounded-xl glass-panel-glow border shadow-2xl max-w-xs transition-opacity duration-150"
          style={{
            left: `${tooltipPos.x}px`,
            top: `${tooltipPos.y - 12}px`,
            borderColor: hoveredPlanet.color
          }}
        >
          <div className="flex items-center justify-between gap-3 mb-1">
            <span
              className="text-xs font-mono font-bold uppercase tracking-wider"
              style={{ color: hoveredPlanet.color }}
            >
              {hoveredPlanet.name}
            </span>
            <span className="text-[10px] font-mono text-slate-400">
              {hoveredPlanet.sector.split(':')[0]}
            </span>
          </div>
          <p className="text-xs text-slate-200 leading-tight mb-2">
            {hoveredPlanet.description}
          </p>
          <div className="flex items-center gap-1.5 text-[10px] font-mono text-cyan-300">
            <Eye size={12} />
            <span>Click to enter {hoveredPlanet.path}</span>
          </div>
        </div>
      )}

      {/* Warp Transition Screen */}
      {isWarping && (
        <div className="absolute inset-0 z-40 bg-space-950/90 backdrop-blur-md flex items-center justify-center flex-col gap-3 animate-pulse">
          <div className="w-12 h-12 rounded-full border-2 border-cyan-400 border-t-transparent animate-spin" />
          <div className="text-xs font-mono tracking-widest uppercase text-cyan-300">
            Warping to Sector Coordinates...
          </div>
        </div>
      )}
    </div>
  );
}
