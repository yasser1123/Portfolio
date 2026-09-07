/**
 * The genie effect.
 *
 * macOS warps a window through a mesh as it is sucked into the dock. The web has
 * no mesh warp, so this approximates it with two things happening at once:
 *   1. a transform anchored at the window's bottom-centre, which is the point
 *      that lands on the dock slot, and
 *   2. an animated `clip-path` funnel that pinches the bottom edge inward,
 *      which is what reads as "sucked in" rather than "shrunk".
 * Both interpolate on the compositor, so it stays smooth on a mid-range laptop.
 */
import { prefersReducedMotion } from './dom.js';

const DURATION = 520;
const EASING = 'cubic-bezier(0.32, 0, 0.16, 1)';

function funnelFrames(dx, dy) {
  return [
    {
      transform: 'translate(0px, 0px) scale(1, 1)',
      clipPath: 'polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)',
      borderRadius: '10px',
      opacity: 1,
      offset: 0
    },
    {
      transform: `translate(${dx * 0.26}px, ${dy * 0.3}px) scale(0.86, 0.7)`,
      clipPath: 'polygon(0% 0%, 100% 0%, 78% 100%, 22% 100%)',
      borderRadius: '12px',
      opacity: 1,
      offset: 0.36
    },
    {
      transform: `translate(${dx * 0.7}px, ${dy * 0.74}px) scale(0.48, 0.32)`,
      clipPath: 'polygon(0% 0%, 100% 0%, 62% 100%, 38% 100%)',
      borderRadius: '14px',
      opacity: 0.92,
      offset: 0.72
    },
    {
      transform: `translate(${dx}px, ${dy}px) scale(0.07, 0.05)`,
      clipPath: 'polygon(0% 0%, 100% 0%, 54% 100%, 46% 100%)',
      borderRadius: '16px',
      opacity: 0.25,
      offset: 1
    }
  ];
}

/** Vector from the window's bottom-centre to the centre of the dock slot. */
function vectorTo(winEl, targetEl) {
  const w = winEl.getBoundingClientRect();
  const t = targetEl
    ? targetEl.getBoundingClientRect()
    : { left: window.innerWidth / 2 - 20, top: window.innerHeight - 40, width: 40, height: 40 };
  return {
    dx: t.left + t.width / 2 - (w.left + w.width / 2),
    dy: t.top + t.height / 2 - w.bottom
  };
}

function run(winEl, targetEl, reverse) {
  // A finished minimise keeps holding its last frame (fill: both) so the window
  // stays collapsed while hidden. Drop it before starting the next one, or the
  // element snaps back to the funnel shape the moment this animation is cleared.
  cancel(winEl);

  const { dx, dy } = vectorTo(winEl, targetEl);
  const prev = winEl.style.transformOrigin;
  winEl.style.transformOrigin = '50% 100%';
  winEl.style.pointerEvents = 'none';

  const anim = winEl.animate(funnelFrames(dx, dy), {
    duration: prefersReducedMotion() ? 1 : DURATION,
    easing: EASING,
    fill: 'both',
    direction: reverse ? 'reverse' : 'normal'
  });
  winEl.__genie = anim;

  // A hidden or backgrounded tab pauses the animation, and `finished` may never
  // settle — which would strand the window half-collapsed. Cap the wait so the
  // caller always gets to finish its bookkeeping.
  const settled = Promise.race([
    anim.finished.catch(() => {}),
    new Promise((res) => setTimeout(res, DURATION + 250))
  ]);

  return settled
    .then(() => {
      winEl.style.pointerEvents = '';
      // Restoring ends on the identity frame, so the animation has nothing left
      // to hold and can be released; minimising keeps its final frame.
      if (reverse && winEl.__genie === anim) {
        cancel(winEl);
        winEl.style.transformOrigin = prev;
      }
    });
}

function cancel(winEl) {
  if (!winEl.__genie) return;
  try { winEl.__genie.cancel(); } catch { /* already gone */ }
  winEl.__genie = null;
}

/** Suck the window down into its dock slot. Resolves when it has landed. */
export const minimizeTo = (winEl, targetEl) => run(winEl, targetEl, false);

/** Play the same path backwards to bring it out again. */
export const restoreFrom = (winEl, targetEl) => run(winEl, targetEl, true);
