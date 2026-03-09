import {createContext, useEffect, useState} from 'react';

/**
 * Represents a single piece of confetti, with position (x, y) and velocity (vx, vy).
 */
class Particle {
  private static GRAVITY = 0.1;

  // randomly initialize confetti appearance
  angle = Math.random() * 2 * Math.PI;
  corners = 3 + Math.floor(Math.random() * 2);
  size = 2 + Math.random() * 5;
  color = `rgb(${Math.random() * 255}, ${Math.random() * 255}, ${Math.random() * 255})`;

  constructor(
    public x: number,
    public y: number,
    public vx: number,
    public vy: number,
  ) {}

  update() {
    // explicit euler integration
    this.x += this.vx;
    this.y += this.vy;
    this.vy += Particle.GRAVITY;
  }

  draw(ctx: CanvasRenderingContext2D) {
    // equally distribute border points
    ctx.beginPath();
    ctx.fillStyle = this.color;
    for (let i = 0; i < this.corners; i++) {
      const theta = (Math.PI * 2 * i) / this.corners + this.angle;
      const x = this.x + this.size * Math.cos(theta);
      const y = this.y + this.size * Math.sin(theta);
      if (i) {
        ctx.lineTo(x, y);
      } else {
        ctx.moveTo(x, y);
      }
    }
    ctx.closePath();
    ctx.fill();
  }
}

/**
 * Represents the current confetti-tossing function. It is a callback which takes in a number of confetti pieces to throw. This should not be used directly as a context tag, but rather via `useContext(ConfettiContext)` with `<ConfettiProvider>`.
 */
export const ConfettiContext = createContext<(count: number) => void>(() => {});

/**
 * Provides a function which can be used to toss confetti on the current page.
 */
export function ConfettiProvider({children}: React.PropsWithChildren<{}>) {
  const [toss, setToss] = useState<(count: number) => void>(() => () => {});

  useEffect(() => {
    // create particle state
    let particles: Particle[] = [];
    const toss = (count: number) => {
      particles = [];
      for (let i = 0; i < count; i++) {
        // choose a side for the particles to start from
        const left = Math.random() < 0.5;
        const angle = Math.random() * (Math.PI / 2) + (left ? 0 : Math.PI / 2);
        const speed = Math.random() * 10 + 3;
        particles.push(
          new Particle(
            left ? 0 : window.innerWidth,
            window.innerHeight,
            Math.cos(angle) * speed,
            -Math.sin(angle) * speed,
          ),
        );
      }
    };
    setToss(() => toss);

    // create canvas
    const canvas = document.createElement('canvas');
    canvas.style.position = 'absolute';
    canvas.style.zIndex = '1000000';
    canvas.style.left = canvas.style.top = '0';
    canvas.style.width = '100vw';
    canvas.style.height = '100vh';
    canvas.style.pointerEvents = 'none'; // so the page can be clicked
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // handle canvas sizing
    const onResize = () => {
      const ratio = window.devicePixelRatio;
      canvas.width = window.innerWidth * ratio;
      canvas.height = window.innerHeight * ratio;
      ctx.scale(ratio, ratio);
    };

    onResize();
    window.addEventListener('resize', onResize);

    // handle update loop
    const animate = () => {
      // schedule next frame
      rafId = requestAnimationFrame(animate);

      // get window dimensions
      const width = window.innerWidth;
      const height = window.innerHeight;

      // clear screen
      ctx.clearRect(0, 0, width, height);

      // update and draw confetti
      for (const particle of particles) {
        particle.update();
        particle.draw(ctx);
      }
    };
    let rafId = requestAnimationFrame(animate);

    document.body.appendChild(canvas);

    // clean-up
    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener('resize', onResize);
      canvas.remove();
    };
  }, []);

  return <ConfettiContext value={toss}>{children}</ConfettiContext>;
}
