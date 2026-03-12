import { useRef, useEffect, useCallback } from 'react';

class Ant {
  constructor(canvas) {
    this.x = Math.random() * canvas.width;
    this.y = Math.random() * canvas.height;
    this.angle = Math.random() * Math.PI * 2;
    this.speed = 0.6 + Math.random() * 0.8;
    this.turnRate = 0.05 + Math.random() * 0.1;
    this.size = 2 + Math.random() * 2;
    this.legPhase = Math.random() * Math.PI * 2;
    this.wanderAngle = 0;
    this.trail = [];
    this.maxTrail = 20;
  }

  update(canvas, pheromones) {
    // Wander behavior
    this.wanderAngle += (Math.random() - 0.5) * this.turnRate * 2;
    this.angle += this.wanderAngle * 0.1;

    // Follow pheromones if nearby
    if (pheromones && pheromones.length > 0) {
      let nearestDist = Infinity;
      let nearestAngle = 0;
      for (const p of pheromones) {
        const dx = p.x - this.x;
        const dy = p.y - this.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 80 && dist < nearestDist && p.strength > 0.1) {
          nearestDist = dist;
          nearestAngle = Math.atan2(dy, dx);
        }
      }
      if (nearestDist < 80) {
        const angleDiff = nearestAngle - this.angle;
        this.angle += Math.sin(angleDiff) * 0.03;
      }
    }

    this.x += Math.cos(this.angle) * this.speed;
    this.y += Math.sin(this.angle) * this.speed;
    this.legPhase += 0.3;

    // Wrap around
    if (this.x < -10) this.x = canvas.width + 10;
    if (this.x > canvas.width + 10) this.x = -10;
    if (this.y < -10) this.y = canvas.height + 10;
    if (this.y > canvas.height + 10) this.y = -10;

    // Leave trail
    this.trail.push({ x: this.x, y: this.y });
    if (this.trail.length > this.maxTrail) this.trail.shift();
  }

  draw(ctx) {
    ctx.save();
    ctx.translate(this.x, this.y);
    ctx.rotate(this.angle);

    // Body
    const s = this.size;
    ctx.fillStyle = '#2a1810';

    // Head
    ctx.beginPath();
    ctx.ellipse(s * 1.5, 0, s * 0.6, s * 0.5, 0, 0, Math.PI * 2);
    ctx.fill();

    // Thorax
    ctx.beginPath();
    ctx.ellipse(0, 0, s * 0.7, s * 0.5, 0, 0, Math.PI * 2);
    ctx.fill();

    // Abdomen
    ctx.beginPath();
    ctx.ellipse(-s * 1.8, 0, s * 1, s * 0.7, 0, 0, Math.PI * 2);
    ctx.fill();

    // Legs
    ctx.strokeStyle = '#2a1810';
    ctx.lineWidth = 0.5;
    for (let i = -1; i <= 1; i++) {
      const offset = Math.sin(this.legPhase + i * 1.2) * 2;
      // Left legs
      ctx.beginPath();
      ctx.moveTo(i * s * 0.5, 0);
      ctx.lineTo(i * s * 0.5 - s * 0.3, -s * 1.2 + offset);
      ctx.stroke();
      // Right legs
      ctx.beginPath();
      ctx.moveTo(i * s * 0.5, 0);
      ctx.lineTo(i * s * 0.5 + s * 0.3, s * 1.2 - offset);
      ctx.stroke();
    }

    // Antennae
    ctx.beginPath();
    ctx.moveTo(s * 1.5, -s * 0.3);
    ctx.quadraticCurveTo(s * 2.5, -s * 1.2, s * 2.8, -s * 0.8);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(s * 1.5, s * 0.3);
    ctx.quadraticCurveTo(s * 2.5, s * 1.2, s * 2.8, s * 0.8);
    ctx.stroke();

    ctx.restore();
  }
}

export function useAntSimulation(canvasRef, antCount = 30) {
  const antsRef = useRef([]);
  const animFrameRef = useRef();
  const pheromonesRef = useRef([]);

  const addPheromone = useCallback((x, y) => {
    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return;
    const scaleX = canvasRef.current.width / rect.width;
    const scaleY = canvasRef.current.height / rect.height;
    pheromonesRef.current.push({
      x: (x - rect.left) * scaleX,
      y: (y - rect.top) * scaleY,
      strength: 1,
      age: 0,
    });
  }, [canvasRef]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const resize = () => {
      canvas.width = canvas.offsetWidth * window.devicePixelRatio;
      canvas.height = canvas.offsetHeight * window.devicePixelRatio;
      ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
    };
    resize();

    antsRef.current = Array.from({ length: antCount }, () => new Ant({
      width: canvas.offsetWidth,
      height: canvas.offsetHeight,
    }));

    const animate = () => {
      ctx.clearRect(0, 0, canvas.offsetWidth, canvas.offsetHeight);

      // Update and draw pheromone trails
      const pheromones = pheromonesRef.current;
      for (let i = pheromones.length - 1; i >= 0; i--) {
        pheromones[i].strength -= 0.003;
        pheromones[i].age++;
        if (pheromones[i].strength <= 0) {
          pheromones.splice(i, 1);
          continue;
        }
        ctx.beginPath();
        ctx.arc(pheromones[i].x / window.devicePixelRatio, pheromones[i].y / window.devicePixelRatio, 3, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(76, 153, 0, ${pheromones[i].strength * 0.4})`;
        ctx.fill();
      }

      // Draw ant trails
      for (const ant of antsRef.current) {
        if (ant.trail.length > 1) {
          ctx.beginPath();
          ctx.moveTo(ant.trail[0].x, ant.trail[0].y);
          for (let i = 1; i < ant.trail.length; i++) {
            ctx.lineTo(ant.trail[i].x, ant.trail[i].y);
          }
          ctx.strokeStyle = 'rgba(76, 153, 0, 0.08)';
          ctx.lineWidth = 1;
          ctx.stroke();
        }
      }

      for (const ant of antsRef.current) {
        ant.update(
          { width: canvas.offsetWidth, height: canvas.offsetHeight },
          pheromones.map(p => ({
            ...p,
            x: p.x / window.devicePixelRatio,
            y: p.y / window.devicePixelRatio,
          }))
        );
        ant.draw(ctx);
      }

      animFrameRef.current = requestAnimationFrame(animate);
    };

    animate();

    const onResize = () => {
      resize();
    };
    window.addEventListener('resize', onResize);

    return () => {
      cancelAnimationFrame(animFrameRef.current);
      window.removeEventListener('resize', onResize);
    };
  }, [canvasRef, antCount]);

  return { addPheromone };
}
