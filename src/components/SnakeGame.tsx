import { useEffect, useRef, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Trophy, RotateCcw, Play, Pause } from 'lucide-react';

interface Point {
  x: number;
  y: number;
}

const GRID_SIZE = 20;
const INITIAL_SPEED = 150;
const SPEED_INCREMENT = 2;

export default function SnakeGame() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [snake, setSnake] = useState<Point[]>([{ x: 10, y: 10 }]);
  const [food, setFood] = useState<Point>({ x: 5, y: 5 });
  const [direction, setDirection] = useState<Point>({ x: 0, y: -1 });
  const [isGameOver, setIsGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [isPaused, setIsPaused] = useState(true);
  const [speed, setSpeed] = useState(INITIAL_SPEED);

  const generateFood = useCallback((currentSnake: Point[]) => {
    let newFood: Point;
    while (true) {
      newFood = {
        x: Math.floor(Math.random() * GRID_SIZE),
        y: Math.floor(Math.random() * GRID_SIZE),
      };
      if (!currentSnake.some(segment => segment.x === newFood.x && segment.y === newFood.y)) {
        break;
      }
    }
    return newFood;
  }, []);

  const resetGame = () => {
    setSnake([{ x: 10, y: 10 }]);
    setFood(generateFood([{ x: 10, y: 10 }]));
    setDirection({ x: 0, y: -1 });
    setIsGameOver(false);
    setScore(0);
    setSpeed(INITIAL_SPEED);
    setIsPaused(false);
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'ArrowUp':
          if (direction.y !== 1) setDirection({ x: 0, y: -1 });
          break;
        case 'ArrowDown':
          if (direction.y !== -1) setDirection({ x: 0, y: 1 });
          break;
        case 'ArrowLeft':
          if (direction.x !== 1) setDirection({ x: -1, y: 0 });
          break;
        case 'ArrowRight':
          if (direction.x !== -1) setDirection({ x: 1, y: 0 });
          break;
        case ' ':
          setIsPaused(prev => !prev);
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [direction]);

  useEffect(() => {
    if (isPaused || isGameOver) return;

    const moveSnake = () => {
      const newHead = {
        x: snake[0].x + direction.x,
        y: snake[0].y + direction.y,
      };

      // Check collision with walls
      if (
        newHead.x < 0 ||
        newHead.x >= GRID_SIZE ||
        newHead.y < 0 ||
        newHead.y >= GRID_SIZE
      ) {
        setIsGameOver(true);
        if (score > highScore) setHighScore(score);
        return;
      }

      // Check collision with self
      if (snake.some(segment => segment.x === newHead.x && segment.y === newHead.y)) {
        setIsGameOver(true);
        if (score > highScore) setHighScore(score);
        return;
      }

      const newSnake = [newHead, ...snake];

      // Check if food eaten
      if (newHead.x === food.x && newHead.y === food.y) {
        setScore(prev => prev + 10);
        setFood(generateFood(newSnake));
        setSpeed(prev => Math.max(prev - SPEED_INCREMENT, 50));
      } else {
        newSnake.pop();
      }

      setSnake(newSnake);
    };

    const interval = setInterval(moveSnake, speed);
    return () => clearInterval(interval);
  }, [snake, direction, food, isPaused, isGameOver, speed, score, highScore, generateFood]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const cellSize = canvas.width / GRID_SIZE;

    // Clear canvas
    ctx.fillStyle = '#0a0a0a';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw Grid
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.05)';
    ctx.lineWidth = 0.5;
    for (let i = 0; i <= GRID_SIZE; i++) {
      ctx.beginPath();
      ctx.moveTo(i * cellSize, 0);
      ctx.lineTo(i * cellSize, canvas.height);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(0, i * cellSize);
      ctx.lineTo(canvas.width, i * cellSize);
      ctx.stroke();
    }

    // Draw Snake
    snake.forEach((segment, index) => {
      const isHead = index === 0;
      ctx.fillStyle = isHead ? '#00f3ff' : '#00a8b4';
      ctx.shadowBlur = isHead ? 15 : 5;
      ctx.shadowColor = '#00f3ff';
      
      // Draw rounded rectangle for snake segment
      const x = segment.x * cellSize + 2;
      const y = segment.y * cellSize + 2;
      const size = cellSize - 4;
      const r = 4;
      
      ctx.beginPath();
      ctx.moveTo(x + r, y);
      ctx.lineTo(x + size - r, y);
      ctx.quadraticCurveTo(x + size, y, x + size, y + r);
      ctx.lineTo(x + size, y + size - r);
      ctx.quadraticCurveTo(x + size, y + size, x + size - r, y + size);
      ctx.lineTo(x + r, y + size);
      ctx.quadraticCurveTo(x, y + size, x, y + size - r);
      ctx.lineTo(x, y + r);
      ctx.quadraticCurveTo(x, y, x + r, y);
      ctx.closePath();
      ctx.fill();
    });

    // Draw Food
    ctx.fillStyle = '#ff00ff';
    ctx.shadowBlur = 20;
    ctx.shadowColor = '#ff00ff';
    ctx.beginPath();
    const centerX = food.x * cellSize + cellSize / 2;
    const centerY = food.y * cellSize + cellSize / 2;
    ctx.arc(centerX, centerY, cellSize / 3, 0, Math.PI * 2);
    ctx.fill();

    // Reset shadow for next frame
    ctx.shadowBlur = 0;
  }, [snake, food]);

  return (
    <div className="flex flex-col items-center gap-6 p-8 glass-morphism rounded-3xl neon-border-cyan relative overflow-hidden">
      <div className="flex justify-between w-full items-center mb-2 px-2">
        <div className="flex flex-col">
          <span className="text-[10px] uppercase tracking-widest text-white/50 font-mono">Current Score</span>
          <span className="text-3xl font-bold font-digital neon-text-cyan">{score.toString().padStart(4, '0')}</span>
        </div>
        <div className="flex flex-col items-end">
          <div className="flex items-center gap-2">
            <Trophy className="w-4 h-4 text-neon-yellow" />
            <span className="text-[10px] uppercase tracking-widest text-white/50 font-mono">High Score</span>
          </div>
          <span className="text-xl font-bold font-digital text-neon-yellow">{highScore.toString().padStart(4, '0')}</span>
        </div>
      </div>

      <div className="relative group">
        <canvas
          ref={canvasRef}
          width={400}
          height={400}
          className="rounded-lg bg-black/50 border border-white/10"
        />
        
        <AnimatePresence>
          {(isPaused || isGameOver) && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 flex flex-col items-center justify-center bg-black/80 backdrop-blur-sm rounded-lg"
            >
              {isGameOver ? (
                <div className="flex flex-col items-center gap-4">
                  <h2 className="text-4xl font-bold font-digital neon-text-magenta animate-pulse">GAME OVER</h2>
                  <p className="text-white/70 font-mono">Score: {score}</p>
                  <button
                    onClick={resetGame}
                    className="flex items-center gap-2 px-6 py-3 bg-neon-cyan/20 border border-neon-cyan text-neon-cyan rounded-full hover:bg-neon-cyan hover:text-black transition-all duration-300 font-bold uppercase tracking-wider"
                  >
                    <RotateCcw className="w-5 h-5" />
                    Try Again
                  </button>
                </div>
              ) : (
                <div className="flex flex-col items-center gap-4">
                  <h2 className="text-4xl font-bold font-digital neon-text-cyan">PAUSED</h2>
                  <button
                    onClick={() => setIsPaused(false)}
                    className="flex items-center gap-2 px-8 py-4 bg-neon-magenta/20 border border-neon-magenta text-neon-magenta rounded-full hover:bg-neon-magenta hover:text-white transition-all duration-300 font-bold uppercase tracking-wider"
                  >
                    <Play className="w-6 h-6 fill-current" />
                    Resume
                  </button>
                  <p className="text-white/40 text-xs mt-2 font-mono">Press SPACE to Play/Pause</p>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="w-full flex justify-center gap-4 text-xs font-mono text-white/30 uppercase tracking-widest">
        <span>WASD / ARROWS to Move</span>
        <span>•</span>
        <span>SPACE to Pause</span>
      </div>

      {/* Decorative elements */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-neon-cyan/5 blur-3xl -z-10" />
      <div className="absolute bottom-0 left-0 w-48 h-48 bg-neon-magenta/5 blur-3xl -z-10" />
    </div>
  );
}
