# daechankimdesign_productdesign

A bespoke, high-performance product design portfolio website currently featuring the "31 stool (2025)" project. The platform is engineered to deliver a fluid, "Scrollytelling" user experience across desktop trackpads and mobile touch screens natively, without relying on heavy third-party layout frameworks like React or Vue. 

## ⚡ Core Architecture & Engineering Highlights

This codebase is built purely on **Vanilla HTML, CSS, and JavaScript**. It bypasses default web layout behaviors to instantiate a completely unified, custom-built scrolling engine.

*   **Custom Scroll Physics Engine:** Bypasses native HTML `overflow` behaviors by universally trapping `wheel` and `touchmove` events across all breakpoints. The engine accumulates pixel momentum to precisely scrub sequence loops or cycle overlay tabs dynamically.
*   **Context-Aware Tab-Hopping:** The custom interpreter intelligently decides if a vertical swipe gesture should naturally cycle the background image array, or if an overlay is active, cycle logically horizontally through "About" metadata tabs (`bio` -> `background` -> `contact`).
*   **Progressive Image Pre-Caching:** Low-fidelity versions of sequence frames are violently loaded instantly into local RAM upon boot. This ensures zero latency during aggressive image scrubbing routines, seamlessly swapping to high-fidelity asynchronous network fetches only when the user rests on a specific frame.
*   **Idle Auto-Play Engine:** Recognizes when the user is not actively interfering with the page scroll mechanism and kicks off an automatic 5000ms increment loop that gracefully pushes the gallery forward chronologically.
*   **Advanced Mobile OS Logic:** Actively neutralizes Safari Flexbox infinite-expansion bugs using `min-height: 0` constraints, and strictly asserts mathematical scroll authority natively by forcing `touch-action: none` directly over the DOM root to kill un-intended OS-level bounds-panning. 

## 📦 Project Structure

*   **/assets/images/sequence/**: Directory containing the high and progressive low-fidelity image frames.
*   **index.html**: Structural DOM foundation housing both the gallery sequence hooks and the tabbed overlay menu systems.
*   **style.css**: Extensive flex-container math dictating rigid image limits, typography tracking (`layer-tag`), grid layouts, `<br>` breakpoint adjustments, and specific CSS transitions spanning a hyper-optimized `740px` mobile form-factor constraint override.
*   **script.js**: The core logic brain containing the UI state tracking variables (`touchAccumulator`, `scrollAccumulator`, `state.activeTab`), async image caching workers, elasticity mathematical triggers, and event loop listeners.

## 🚀 Usage & Deployment

Since the architecture is strictly front-end Vanilla configurations, absolutely no node packet managers, bundlers, or compilation algorithms are required. 
Simply host or locally drag `index.html` into a modern Chromium or webkit-derived browser. 
