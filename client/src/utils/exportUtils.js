/**
 * Utility functions for exporting study content as Markdown or JSON.
 */

export function exportAsMarkdown(studyData) {
  if (!studyData) return;

  let content = `# ${studyData.title || 'Study Set'}\n\n`;
  content += `> ${studyData.description || ''}\n\n`;

  content += `## 🎴 Flashcards (${studyData.flashcards?.length || 0})\n\n`;
  studyData.flashcards?.forEach((card, idx) => {
    content += `### Flashcard ${idx + 1}\n`;
    content += `**Q:** ${card.question}\n\n`;
    content += `**A:** ${card.answer}\n\n---\n\n`;
  });

  content += `## 📝 Quiz Questions (${studyData.quiz?.length || 0})\n\n`;
  studyData.quiz?.forEach((q, idx) => {
    content += `### Question ${idx + 1}: ${q.question}\n`;
    q.options?.forEach((opt, oIdx) => {
      const isCorrect = oIdx === q.correctAnswer;
      content += `- [${isCorrect ? 'x' : ' '}] ${opt}${isCorrect ? ' (Correct)' : ''}\n`;
    });
    content += `\n**Explanation:** ${q.explanation}\n\n---\n\n`;
  });

  const blob = new Blob([content], { type: 'text/markdown;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `${(studyData.title || 'study_set').toLowerCase().replace(/[^a-z0-9]/g, '_')}.md`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

export function exportAsJson(studyData) {
  if (!studyData) return;
  const jsonStr = JSON.stringify(studyData, null, 2);
  const blob = new Blob([jsonStr], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `${(studyData.title || 'study_set').toLowerCase().replace(/[^a-z0-9]/g, '_')}.json`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
