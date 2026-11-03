/**
 * YouTube Gemini Summarizer - Content Script
 * Injects a Gemini button into YouTube's action bar
 */

const BUTTON_ID = 'yt-gemini-button';
const GEMINI_URL = 'https://gemini.google.com/u/2/app?pli=1';

/**
 * Creates the Gemini button element
 */
function createGeminiButton() {
  const button = document.createElement('button');
  button.id = BUTTON_ID;
  button.className = 'yt-gemini-btn';
  button.setAttribute('aria-label', 'Summarize with Gemini');
  
  // Gemini sparkle icon (inline SVG)
  button.innerHTML = `
    <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
      <path d="M12 2L9.19 8.63L2 12l7.19 3.37L12 22l2.81-6.63L22 12l-7.19-3.37L12 2z"/>
    </svg>
    <span>Gemini</span>
  `;
  
  button.addEventListener('click', handleGeminiClick);
  return button;
}

/**
 * Handles the Gemini button click
 * - Copies URL + prompt to clipboard
 * - Opens Gemini in a new tab
 */
async function handleGeminiClick() {
  const videoUrl = window.location.href;
  const prompt = `Summarize this video: ${videoUrl}`;
  
  try {
    await navigator.clipboard.writeText(prompt);
    
    // Visual feedback
    const button = document.getElementById(BUTTON_ID);
    const originalHTML = button.innerHTML;
    button.innerHTML = `
      <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
        <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z"/>
      </svg>
      <span>Copied!</span>
    `;
    button.classList.add('yt-gemini-btn--success');
    
    // Open Gemini in new tab
    window.open(GEMINI_URL, '_blank');
    
    // Reset button after delay
    setTimeout(() => {
      button.innerHTML = originalHTML;
      button.classList.remove('yt-gemini-btn--success');
    }, 2000);
    
  } catch (err) {
    console.error('Failed to copy to clipboard:', err);
  }
}

/**
 * Injects the Gemini button into YouTube's action bar
 */
function injectButton() {
  // Target container: the action buttons row for the current video metadata
  // Note: ytd-watch-metadata ensures we don't grab stale DOM elements from SPAs
  const actionContainer = document.querySelector('ytd-watch-metadata #top-level-buttons-computed');
  
  if (!actionContainer) return;
  
  // Check if our button is already inside this specific container
  if (actionContainer.querySelector(`#${BUTTON_ID}`)) return;
  
  // If the button exists somewhere else in the DOM (stale state), remove it
  document.querySelectorAll(`#${BUTTON_ID}`).forEach(el => el.remove());
  
  const button = createGeminiButton();
  
  // Insert after the Share button (or at the end if not found)
  const shareButton = actionContainer.querySelector('button[aria-label="Share"], button[aria-label="Share video"]')?.closest('ytd-button-renderer');
  
  if (shareButton) {
    shareButton.insertAdjacentElement('afterend', button);
  } else {
    actionContainer.appendChild(button);
  }
}

/**
 * MutationObserver to handle YouTube's SPA navigation
 * YouTube dynamically updates content without full page reloads
 */
const observer = new MutationObserver(() => {
  const isWatchPage = window.location.pathname.startsWith('/watch');
  
  if (isWatchPage) {
    // Fast DOM check: Only execute injection logic if our target container 
    // exists AND our button is missing from it.
    const actionContainer = document.querySelector('ytd-watch-metadata #top-level-buttons-computed');
    if (actionContainer && !actionContainer.querySelector(`#${BUTTON_ID}`)) {
      injectButton();
    }
  } else {
    // If we've navigated away from a video (e.g., to a channel), remove the button
    const existingBtn = document.getElementById(BUTTON_ID);
    if (existingBtn) existingBtn.remove();
  }
});

// Start observing the entire document for SPA changes
observer.observe(document.body, { childList: true, subtree: true });

// Initial injection setup
if (window.location.pathname.startsWith('/watch')) {
  setTimeout(injectButton, 1000);
}
