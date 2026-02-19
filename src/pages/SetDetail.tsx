import { useParams, useNavigate } from 'react-router-dom';
import { useSetStore } from '@/store/setStore';
import { ArrowLeft, CheckCircle2, Circle, HelpCircle, BookOpen } from 'lucide-react';
// Removed useExperimentStore confetti for now, or can re-import if compatible

export default function SetDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { sets, toggleStep } = useSetStore();

  const kit = sets.find((s) => s.id === id);

  if (!kit) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-muted-foreground">Deney seti bulunamadı</p>
      </div>
    );
  }

  const completedCount = kit.steps.filter((s) => s.completed).length;
  const allDone = completedCount === kit.steps.length;
  const progress = kit.progress;

  const handleToggle = (stepId: number) => {
    toggleStep(kit.id, stepId);
    // Confetti trigger logic can be moved to store or kept here if store returns success
  };

  return (
    <div className="animate-fade-in">
      {/* Header */}
      <div className="px-4 pt-4 pb-2 flex items-center gap-3">
        <button onClick={() => navigate(-1)} className="tap-target p-2 -ml-2 rounded-xl hover:bg-muted transition-colors">
          <ArrowLeft size={22} />
        </button>
        <div className="flex-1">
          <h1 className="text-xl font-extrabold font-heading">{kit.emoji} {kit.title}</h1>
          <p className="text-xs text-muted-foreground">{kit.category} · Sınıf {kit.grade}</p>
        </div>
      </div>

      <div className="px-4 py-4 space-y-4">
        {/* Progress */}
        <div className="card-kit p-4">
          <div className="flex justify-between text-sm mb-2">
            <span className="font-bold font-heading">İlerleme</span>
            <span className="text-muted-foreground">{completedCount}/{kit.steps.length}</span>
          </div>
          <div className="progress-track">
            <div className="progress-fill" style={{ width: `${progress}%` }} />
          </div>
          {allDone && (
            <p className="text-sm font-bold text-primary mt-2 text-center animate-scale-in">
              🎉 Tebrikler! Deneyi tamamladın!
            </p>
          )}
        </div>

        {/* Parts */}
        <div className="card-kit p-4">
          <h2 className="font-bold font-heading text-sm mb-3">📦 Malzemeler</h2>
          <div className="flex flex-wrap gap-2">
            {kit.parts.map((part) => (
              <span key={part} className="px-3 py-1.5 rounded-full bg-muted text-xs font-medium">
                {part}
              </span>
            ))}
          </div>
        </div>

        {/* Steps */}
        <div className="card-kit p-4">
          <h2 className="font-bold font-heading text-sm mb-3">📋 Adımlar</h2>
          <div className="space-y-3">
            {kit.steps.map((step) => (
              <button
                key={step.id}
                onClick={() => handleToggle(step.id)}
                className="flex items-start gap-3 w-full text-left tap-target py-1 transition-all"
              >
                {step.completed ? (
                  <CheckCircle2 className="text-primary flex-shrink-0 mt-0.5" size={22} />
                ) : (
                  <Circle className="text-muted-foreground flex-shrink-0 mt-0.5" size={22} />
                )}
                <span className={`text-sm ${step.completed ? 'line-through text-muted-foreground' : ''}`}>
                  {step.text}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Curriculum */}
        <div className="card-kit p-4 flex items-center gap-3">
          <BookOpen size={20} className="text-secondary flex-shrink-0" />
          <div>
            <p className="text-xs text-muted-foreground">Müfredat Referansı</p>
            <p className="text-sm font-bold">{kit.curriculumRef}</p>
          </div>
        </div>

        {/* Help Button */}
        <button
          onClick={() => navigate('/assistant')}
          className="btn-accent w-full justify-center"
        >
          <HelpCircle size={20} />
          Takıldım — AI'ya Sor
        </button>
      </div>
    </div>
  );
}
