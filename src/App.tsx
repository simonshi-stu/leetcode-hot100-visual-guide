import { useReadingProgress, useFocusMode, useProgress } from './hooks';
import { guideById } from './model';
import { HomePage } from './components/HomePage';
import { ProblemPage } from './components/ProblemPage';
import { PageShell } from './components/Layout';
import { NotFound, usePageTitle, useRoute } from './routes';

export default function App() {
  const id = useRoute();
  const guide = id == null ? undefined : guideById.get(id);
  const progress = useProgress();
  const { focus, toggleFocus } = useFocusMode();
  const readingProgress = useReadingProgress(String(id));
  usePageTitle(id);

  return (
    <PageShell problemMode={guide != null} completedCount={progress.completed.length} focus={focus} onToggleFocus={toggleFocus} readingProgress={readingProgress}>
      {guide ? <ProblemPage guide={guide} completed={progress.completed.includes(guide.id)} onToggleCompleted={progress.toggleCompleted} markRead={progress.markRead} /> : id == null ? <HomePage read={progress.read} completed={progress.completed} /> : <NotFound id={id} />}
    </PageShell>
  );
}
