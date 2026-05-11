// ─────────────────────────────────────────────────────────────
// MyFitAI — Active Workout Page (/workout/active)
// Orchestrates session: header, exercise loggers, rest timer,
// plate calculator, and summary screen.
// ─────────────────────────────────────────────────────────────

import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useWorkoutBuilder } from '../context/WorkoutBuilderContext';
import { usePreferences } from '../context/PreferencesContext';
import SessionHeader from '../components/WorkoutSession/SessionHeader';
import ExerciseSetLogger from '../components/WorkoutSession/ExerciseSetLogger';
import RestTimer from '../components/WorkoutSession/RestTimer';
import PlateCalculator from '../components/WorkoutSession/PlateCalculator';
import SessionSummary from '../components/WorkoutSession/SessionSummary';
import type { WorkoutSession, LoggedSet } from '../types/workout';

export default function ActiveWorkout() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const templateId = searchParams.get('templateId');

  const {
    activeSession, isSessionActive, sessionElapsed,
    startSession, endSession, cancelSession,
    logSet, addSetToExercise, removeSet,
    restTimer, startRestTimer, skipRest,
    templates, getPreviousSessionData, checkForPR,
  } = useWorkoutBuilder();

  const { defaultRestTimer, autoStartRestTimer } = usePreferences();

  const [showPlateCalc, setShowPlateCalc] = useState(false);
  const [showEndConfirm, setShowEndConfirm] = useState(false);
  const [completedSession, setCompletedSession] = useState<WorkoutSession | null>(null);
  const [currentExIdx, setCurrentExIdx] = useState(0);

  // Start session on mount if not already active
  useEffect(() => {
    if (!isSessionActive && !completedSession) {
      const template = templateId ? templates.find(t => t.id === templateId) : undefined;
      startSession(template);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleEndWorkout = async () => {
    setShowEndConfirm(false);
    const session = await endSession();
    if (session) {
      setCompletedSession(session);
    }
  };

  const handleCancel = () => {
    cancelSession();
    navigate('/workout');
  };

  const handleSetComplete = (exerciseIdx: number) => {
    if (autoStartRestTimer && defaultRestTimer > 0) {
      startRestTimer(defaultRestTimer);
    }
    // Track which exercise the user is on
    setCurrentExIdx(exerciseIdx);
  };

  const handleRestAddTime = (seconds: number) => {
    if (restTimer) {
      startRestTimer(restTimer.remaining + seconds);
    }
  };

  // Show summary screen
  if (completedSession) {
    return (
      <SessionSummary
        session={completedSession}
        onDone={() => navigate('/workout')}
      />
    );
  }

  // No active session (shouldn't happen, but guard)
  if (!activeSession) {
    return (
      <main className="max-w-md mx-auto px-6 pt-20 pb-32 text-center">
        <span className="material-symbols-outlined text-6xl text-on-surface-variant mb-4 block">fitness_center</span>
        <h2 className="font-headline font-extrabold text-xl mb-2">No Active Session</h2>
        <p className="text-on-surface-variant text-sm mb-6">Start a workout from the Workout tab.</p>
        <button onClick={() => navigate('/workout')}
          className="bg-primary text-on-primary px-6 py-3 rounded-xl font-bold uppercase tracking-wider text-sm active:scale-95 transition-transform">
          Go to Workouts
        </button>
      </main>
    );
  }

  return (
    <>
      <SessionHeader
        workoutName={activeSession.templateName}
        elapsed={sessionElapsed}
        currentExercise={currentExIdx + 1}
        totalExercises={activeSession.exercises.length}
        onEnd={() => setShowEndConfirm(true)}
        onOpenPlateCalc={() => setShowPlateCalc(true)}
      />

      <main className="max-w-md mx-auto px-4 pt-4 pb-32 space-y-4">
        {activeSession.exercises.map((exercise, exIdx) => {
          const ghostValues = getPreviousSessionData(exercise.exerciseId);
          return (
            <ExerciseSetLogger
              key={exercise.exerciseId + exIdx}
              exerciseIdx={exIdx}
              exerciseName={exercise.exerciseName}
              thumbnailEmoji={exercise.thumbnailEmoji}
              sets={exercise.sets as LoggedSet[]}
              ghostValues={ghostValues}
              restSeconds={defaultRestTimer}
              onLogSet={logSet}
              onAddSet={addSetToExercise}
              onRemoveSet={removeSet}
              onSetComplete={handleSetComplete}
              onStartRest={startRestTimer}
              exerciseId={exercise.exerciseId}
              checkPR={checkForPR}
              sessionId={activeSession.id}
            />
          );
        })}

        {activeSession.exercises.length === 0 && (
          <div className="text-center py-16">
            <span className="material-symbols-outlined text-5xl text-on-surface-variant/30 mb-3 block">add_circle</span>
            <p className="text-on-surface-variant text-sm">No exercises in this workout.</p>
            <p className="text-on-surface-variant/50 text-xs mt-1">Go back and add exercises to your template.</p>
          </div>
        )}
      </main>

      {/* Rest Timer Overlay */}
      {restTimer && (
        <RestTimer
          remaining={restTimer.remaining}
          total={restTimer.total}
          onSkip={skipRest}
          onAddTime={handleRestAddTime}
        />
      )}

      {/* Plate Calculator */}
      <PlateCalculator isOpen={showPlateCalc} onClose={() => setShowPlateCalc(false)} />

      {/* End Workout Confirmation */}
      {showEndConfirm && (
        <div className="fixed inset-0 z-[150] flex items-center justify-center">
          <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={() => setShowEndConfirm(false)} />
          <div className="relative bg-[var(--color-surface)] rounded-3xl p-6 w-[85%] max-w-sm border border-white/[0.06] shadow-2xl animate-in zoom-in-95 fade-in duration-300">
            <h3 className="font-headline font-extrabold text-lg mb-2">End Workout?</h3>
            <p className="text-on-surface-variant text-sm mb-6">Your session data will be saved.</p>
            <div className="flex gap-3">
              <button onClick={() => setShowEndConfirm(false)}
                className="flex-1 py-3 rounded-xl bg-[var(--color-surface-container)] text-on-surface font-bold text-sm uppercase tracking-wider active:scale-95 transition-transform">
                Continue
              </button>
              <button onClick={handleEndWorkout}
                className="flex-1 py-3 rounded-xl bg-primary text-on-primary font-bold text-sm uppercase tracking-wider active:scale-95 transition-transform">
                End & Save
              </button>
            </div>
            <button onClick={handleCancel}
              className="w-full mt-3 py-2 text-error text-[11px] font-bold uppercase tracking-widest active:scale-95">
              Discard Session
            </button>
          </div>
        </div>
      )}
    </>
  );
}
