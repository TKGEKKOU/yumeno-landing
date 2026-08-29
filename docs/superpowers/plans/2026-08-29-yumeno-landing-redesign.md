# YUMENO Landing Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Redesign the standalone YUMENO landing page around a plain-language role experience, a CSS peel reveal hero, and a living voice waveform while retaining accurate technical proof.

**Architecture:** Keep the existing React/Vite app and replace the monolithic page markup with focused data-driven sections. Add two small presentational components: `PeelReveal` for an accessible layered hero interaction and `Waveform` for the animated voice motif. Use CSS tokens and media queries for the paper/ink/red visual system and motion fallback.

**Tech Stack:** React 19, Vite 6, CSS, semantic HTML, CSS keyframes.

## Global Constraints

- Hero title and subtitle must use plain Chinese and contain no LangGraph, RAG, or Multi-Agent terms.
- Use only facts supported by the local YUMENO README/Product/Architecture docs.
- Do not add external runtime dependencies.
- `dist/` remains ignored; deploy by uploading its contents to the user's own server.
- All interactive effects must remain readable with keyboard focus and `prefers-reduced-motion: reduce`.

---

### Task 1: Add accessible visual primitives

**Files:**
- Create: `src/components/PeelReveal.jsx`
- Create: `src/components/PeelReveal.css`
- Create: `src/components/Waveform.jsx`
- Create: `src/components/Waveform.css`

**Interfaces:**
- `PeelReveal({ children, reveal, className })` renders a focusable/hoverable layered wrapper and exposes `reveal` beneath the surface.
- `Waveform({ bars = 36, className })` renders decorative bars with `aria-hidden="true"`.

- [ ] Build components with CSS fallback, keyboard focus, and reduced-motion rules.
- [ ] Run `npm run build` and confirm the components compile.

### Task 2: Replace page information architecture and copy

**Files:**
- Modify: `src/App.jsx`
- Modify: `index.html`

**Interfaces:**
- Import `PeelReveal` and `Waveform`.
- Keep all outbound links pointing to `TKGEKKOU/yumeno` and its Releases/docs/issues.

- [ ] Implement sections: Hero, Experience, Voice Studio, Runtime, Trust, Deployment, Quick Start, Footer.
- [ ] Replace stale “6 Worker/584 tests” claims with the documented 1 + 1 + 5 architecture and 107-test metric.
- [ ] Use semantic buttons/links and descriptive labels.

### Task 3: Implement visual system and responsive layout

**Files:**
- Modify: `src/App.css`
- Modify: `src/index.css`
- Modify: `.gitignore`

- [ ] Style paper/ink/red visual language, grid marks, cards, workflow nodes, metrics, and footer.
- [ ] Add responsive breakpoints for 1024px and 720px.
- [ ] Add reduced-motion overrides and visible focus styles.
- [ ] Ignore `.superpowers/` preview artifacts.

### Task 4: Verify production output

**Files:**
- No source changes unless verification finds a defect.

- [ ] Run `npm run build`.
- [ ] Run the local server on `127.0.0.1:17000` and request `/` with HTTP 200.
- [ ] Inspect the rendered page and verify no horizontal overflow at desktop/mobile widths.
- [ ] Commit all changes with `feat: redesign YUMENO landing page`.
