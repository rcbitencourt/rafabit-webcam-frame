import Mesh from "mesh-gradient.js";
import * as React from "react";

interface MeshGradientProps {
  colors?: string[];
  speed?: number;
  animated?: boolean;
  blur?: number;
  opacity?: number;
  pos?: number;
  width?: string;
  height?: string;
}

type TimeDelta = { time: number; delta: number };
type Callback = (data: TimeDelta) => void;

function useAnimationFrame(cb: Callback) {
  const cbRef = React.useRef<Callback>();
  const frame = React.useRef<number>();
  const init = React.useRef(performance.now());
  const last = React.useRef(performance.now());

  cbRef.current = cb;

  const animate = React.useCallback((now: number) => {
    cbRef.current?.({
      time: (now - init.current) / 1000,
      delta: (now - last.current) / 1000,
    });
    last.current = now;
    frame.current = requestAnimationFrame(animate);
  }, []);

  React.useEffect(() => {
    frame.current = requestAnimationFrame(animate);
    return () => {
      if (frame.current) {
        cancelAnimationFrame(frame.current);
      }
    };
  }, [animate]);
}

function generateUniqueId() {
  return "id-" + Date.now() + "-" + Math.random().toString(36).substr(2, 9);
}

export function MeshGradient(props: MeshGradientProps) {
  const canvasId = React.useMemo(() => generateUniqueId(), []);
  const canvasRef = React.useRef<HTMLCanvasElement>(null);
  const mesh = React.useMemo(() => new Mesh(), []);
  const [pos, setPos] = React.useState(0);
  const speed = props.speed ?? 0.01;
  const opacity = props.opacity ?? 1;
  const width = props.width ?? "100%";
  const height = props.height ?? "100%";
  const canvasStyle = {
    width,
    height,
    filter: `blur(${props.blur ?? 0}px)`,
    transform: `scale(${props.blur ? props.blur * 0.005 + 1 : 1})`,
    opacity: String(opacity),
  };

  const maskStyle = {
    width,
    height,
  };

  useAnimationFrame(() => {
    if (!props.animated) return;

    setPos((curr) => curr + Number(speed));
  });

  React.useEffect(() => {
    const colors = props.colors ?? ["#ffffff", "#3d3a3a", "#a6a6a6"];

    mesh.initGradient(`#${canvasId}`, colors);
  }, [canvasId, mesh, props.colors]);

  React.useEffect(() => {
    mesh.changePosition(pos);
  }, [mesh, pos]);

  React.useEffect(() => {
    setPos(0);
  }, [props.animated]);

  React.useEffect(() => {
    if (!props.animated && props.pos !== undefined) {
      setPos(props.pos);
    }
  }, [props.animated, props.pos]);

  return (
    <div style={{ ...maskStyle, overflow: "hidden" }}>
      <canvas style={canvasStyle} id={canvasId} ref={canvasRef} />
    </div>
  );
}
