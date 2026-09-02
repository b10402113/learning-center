// quiz.js — lightweight MCQ interaction for teach lessons
document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('.quiz-options').forEach(ul => {
    const correctIndex = parseInt(ul.dataset.correct);
    const feedback = ul.nextElementSibling;

    ul.querySelectorAll('li').forEach(li => {
      li.style.cursor = 'pointer';
      li.addEventListener('click', () => {
        if (ul.dataset.answered) return;
        ul.dataset.answered = 'true';

        ul.querySelectorAll('li').forEach(l => l.classList.remove('correct', 'incorrect'));

        const index = parseInt(li.dataset.index);
        if (index === correctIndex) {
          li.classList.add('correct');
          feedback.textContent = '✓ 正確！';
          feedback.className = 'quiz-feedback show correct';
        } else {
          li.classList.add('incorrect');
          ul.children[correctIndex].classList.add('correct');
          feedback.textContent = '✗ 不對。正確答案已標示。';
          feedback.className = 'quiz-feedback show incorrect';
        }
      });
    });
  });
});
