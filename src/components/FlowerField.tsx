"use client";

import { useEffect, useRef, useState } from "react";

/*
 * Animated flower strip.
 *
 * The approved artwork is a single photograph, so instead of cutting it into
 * sprites (which would never look as good as the photo) we keep the original
 * pixels and bend them with a wind field in a fragment shader:
 *
 * - Displacement grows with height, so stems stay rooted at the bottom and
 *   heads sway the most. That reads as rotation about the base, not drifting.
 * - The phase varies slowly across x, so neighbouring stems move together but
 *   distant clusters move at different speeds, like real gusts.
 * - The pointer adds a small depth shift (tops move more than bases).
 *
 * The <img> underneath is the fallback for no-WebGL, reduced motion, and the
 * first paint; the canvas fades in over it once its first frame is ready.
 */

const VERT = `
attribute vec2 a_pos;
varying vec2 v_uv;
void main() {
  v_uv = a_pos * 0.5 + 0.5;
  gl_Position = vec4(a_pos, 0.0, 1.0);
}`;

const FRAG = `
precision mediump float;
varying vec2 v_uv;
uniform sampler2D u_tex;
uniform float u_time;
uniform vec2 u_scale;   // cover-fit: uv -> texture space
uniform vec2 u_offset;
uniform vec2 u_pointer; // -1..1, smoothed

void main() {
  // v_uv.y: 0 at the bottom of the canvas, 1 at the top.
  float h = v_uv.y;
  float bend = pow(h, 1.6);

  vec2 uv = v_uv * u_scale + u_offset;
  float x = uv.x;
  float t = u_time;

  float gust  = sin(t * 0.32 + x * 2.1) * 0.5 + 0.5;
  float sway  = sin(t * 0.85 + x * 6.3)
              + 0.45 * sin(t * 1.55 + x * 12.7 + 1.3)
              + 0.20 * sin(t * 2.70 + x * 23.0 + 4.1);
  float dx = sway * (0.0028 + 0.0024 * gust) * bend;
  float dy = sin(t * 1.10 + x * 9.0 + 0.7) * 0.0016 * bend;

  dx += u_pointer.x * 0.006 * bend;
  dy += u_pointer.y * 0.003 * bend;

  vec2 p = uv - vec2(dx, dy);
  p.y = 1.0 - p.y;
  gl_FragColor = texture2D(u_tex, clamp(p, vec2(0.001), vec2(0.999)));
}`;

type Props = { src: string; width: number; height: number; className?: string };

export function FlowerField({ src, width, height, className = "" }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [live, setLive] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const gl = canvas.getContext("webgl", { premultipliedAlpha: false, antialias: false });
    if (!gl) return;

    const prog = link(gl, VERT, FRAG);
    if (!prog) return;
    gl.useProgram(prog);

    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW);
    const aPos = gl.getAttribLocation(prog, "a_pos");
    gl.enableVertexAttribArray(aPos);
    gl.vertexAttribPointer(aPos, 2, gl.FLOAT, false, 0, 0);

    const uTime = gl.getUniformLocation(prog, "u_time");
    const uScale = gl.getUniformLocation(prog, "u_scale");
    const uOffset = gl.getUniformLocation(prog, "u_offset");
    const uPointer = gl.getUniformLocation(prog, "u_pointer");

    let raf = 0;
    let visible = true;
    let ready = false;
    let disposed = false;
    const pointer = { x: 0, y: 0, tx: 0, ty: 0 };
    const start = performance.now();

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      const w = canvas.clientWidth;
      const h = canvas.clientHeight;
      canvas.width = Math.max(1, Math.round(w * dpr));
      canvas.height = Math.max(1, Math.round(h * dpr));
      gl.viewport(0, 0, canvas.width, canvas.height);
      // object-fit: cover, anchored to the bottom so stems never float.
      const view = w / h;
      const img = width / height;
      if (view > img) {
        const s = img / view;
        gl.uniform2f(uScale, 1, s);
        gl.uniform2f(uOffset, 0, 0);
      } else {
        const s = view / img;
        gl.uniform2f(uScale, s, 1);
        gl.uniform2f(uOffset, (1 - s) / 2, 0);
      }
    };

    const frame = (now: number) => {
      raf = 0;
      if (!visible || disposed) return;
      pointer.x += (pointer.tx - pointer.x) * 0.04;
      pointer.y += (pointer.ty - pointer.y) * 0.04;
      gl.uniform1f(uTime, (now - start) / 1000);
      gl.uniform2f(uPointer, pointer.x, pointer.y);
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
      raf = requestAnimationFrame(frame);
    };
    const play = () => {
      if (ready && visible && !raf) raf = requestAnimationFrame(frame);
    };

    const image = new Image();
    image.decoding = "async";
    image.onload = () => {
      if (disposed) return;
      const tex = gl.createTexture();
      gl.bindTexture(gl.TEXTURE_2D, tex);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, image);
      resize();
      ready = true;
      play();
      requestAnimationFrame(() => !disposed && setLive(true));
    };
    image.src = src;

    const ro = new ResizeObserver(resize);
    ro.observe(canvas);

    const io = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting && !document.hidden;
      play();
    });
    io.observe(canvas);

    const onVisibility = () => {
      visible = !document.hidden;
      play();
    };
    document.addEventListener("visibilitychange", onVisibility);

    const onPointer = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      pointer.tx = (e.clientX / window.innerWidth) * 2 - 1;
      pointer.ty = (e.clientY / window.innerHeight) * 2 - 1;
    };
    window.addEventListener("pointermove", onPointer, { passive: true });

    return () => {
      disposed = true;
      cancelAnimationFrame(raf);
      ro.disconnect();
      io.disconnect();
      document.removeEventListener("visibilitychange", onVisibility);
      window.removeEventListener("pointermove", onPointer);
      gl.getExtension("WEBGL_lose_context")?.loseContext();
    };
  }, [src, width, height]);

  return (
    <div className={`relative ${className}`}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={src}
        alt=""
        aria-hidden
        width={width}
        height={height}
        className="absolute inset-0 size-full object-cover object-bottom"
      />
      <canvas
        ref={canvasRef}
        aria-hidden
        className={`absolute inset-0 size-full transition-opacity duration-700 ${live ? "opacity-100" : "opacity-0"}`}
      />
    </div>
  );
}

function link(gl: WebGLRenderingContext, vs: string, fs: string) {
  const compile = (type: number, source: string) => {
    const s = gl.createShader(type)!;
    gl.shaderSource(s, source);
    gl.compileShader(s);
    if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) {
      console.warn(gl.getShaderInfoLog(s));
      return null;
    }
    return s;
  };
  const v = compile(gl.VERTEX_SHADER, vs);
  const f = compile(gl.FRAGMENT_SHADER, fs);
  if (!v || !f) return null;
  const p = gl.createProgram()!;
  gl.attachShader(p, v);
  gl.attachShader(p, f);
  gl.linkProgram(p);
  return gl.getProgramParameter(p, gl.LINK_STATUS) ? p : null;
}
