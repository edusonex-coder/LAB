import { useExperimentStore } from '@/store/useExperimentStore';

const colors = [
  'hsl(122, 46%, 33%)',
  'hsl(210, 62%, 41%)',
  'hsl(38, 100%, 50%)',
  'hsl(0, 84%, 60%)',
  'hsl(280, 60%, 55%)',
];

export default function Confetti() {
  const showConfetti = useExperimentStore((s) => s.showConfetti);
  if (!showConfetti) return null;

  return (
    <div className="fixed inset-0 z-[100] pointer-events-none overflow-hidden">
      {Array.from({ length: 40 }).map((_, i) => (
        <div
          key={i}
          className="absolute animate-confetti"
          style={{
            left: `${Math.random() * 100}%`,
            animationDelay: `${Math.random() * 1.5}s`,
            animationDuration: `${2 + Math.random() * 2}s`,
            width: 10,
            height: 10,
            borderRadius: Math.random() > 0.5 ? '50%' : '2px',
            background: colors[Math.floor(Math.random() * colors.length)],
          }}
        />
      ))}
    </div>
  );
}
