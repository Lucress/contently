---
name: Contently
description: The operating system for a creator's business — idea pipeline, brand CRM, and revenue in one place.
colors:
  ink: "#171717"
  canvas: "#ffffff"
  surface: "#f5f5f5"
  subdued: "#737373"
  hairline: "#e5e5e5"
  near-black: "#0a0a0a"
  creator-violet: "#7c3aed"
  creator-violet-light: "#8b5cf6"
  creator-violet-muted: "#ede9fe"
  success: "#22c55e"
  warning: "#f59e0b"
  danger: "#ef4444"
typography:
  display:
    fontFamily: "Inter, system-ui, sans-serif"
    fontSize: "1.5rem"
    fontWeight: 600
    lineHeight: 1.3
    letterSpacing: "-0.025em"
  headline:
    fontFamily: "Inter, system-ui, sans-serif"
    fontSize: "1.25rem"
    fontWeight: 600
    lineHeight: 1.4
    letterSpacing: "-0.025em"
  title:
    fontFamily: "Inter, system-ui, sans-serif"
    fontSize: "1rem"
    fontWeight: 500
    lineHeight: 1.5
    letterSpacing: "normal"
  body:
    fontFamily: "Inter, system-ui, sans-serif"
    fontSize: "0.875rem"
    fontWeight: 400
    lineHeight: 1.625
    letterSpacing: "normal"
  label:
    fontFamily: "Inter, system-ui, sans-serif"
    fontSize: "0.75rem"
    fontWeight: 500
    lineHeight: 1.4
    letterSpacing: "0.01em"
rounded:
  sm: "4px"
  md: "6px"
  lg: "8px"
  xl: "12px"
  full: "9999px"
spacing:
  xs: "4px"
  sm: "8px"
  md: "16px"
  lg: "24px"
  xl: "32px"
components:
  button-primary:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.canvas}"
    rounded: "{rounded.md}"
    padding: "8px 16px"
  button-primary-hover:
    backgroundColor: "#262626"
    textColor: "{colors.canvas}"
    rounded: "{rounded.md}"
    padding: "8px 16px"
  button-ghost:
    backgroundColor: "transparent"
    textColor: "{colors.subdued}"
    rounded: "{rounded.md}"
    padding: "8px 16px"
  button-ghost-hover:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.ink}"
    rounded: "{rounded.md}"
    padding: "8px 16px"
  button-creator-plus:
    backgroundColor: "{colors.creator-violet}"
    textColor: "{colors.canvas}"
    rounded: "{rounded.md}"
    padding: "8px 16px"
  card:
    backgroundColor: "{colors.canvas}"
    rounded: "{rounded.lg}"
    padding: "24px"
  nav-link-active:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.ink}"
    rounded: "{rounded.md}"
    padding: "8px 12px"
---

# Design System: Contently

## 1. Overview

**Creative North Star: "The Editorial Partner"**

Contently's design system is built around one conviction: a creator shouldn't have to fight their tools. Every screen should feel like working with a fast, well-organised collaborator — one that keeps up with the creator's pace, surfaces what matters, and stays completely out of the way otherwise. The system reads like a well-edited publication: clean hierarchy, confident type, no decoration that doesn't earn its place.

The palette is deliberately restrained. Near-black ink on white canvas, with structured grays carrying all secondary information. The only colour that breaks the monochrome is Creator Violet (`#7c3aed`) — reserved exclusively for the premium tier. Its rarity is intentional: when violet appears, it signals something worth paying attention to. An upgrade wall, a Creator+ badge, a paywall CTA. Everywhere else, the system earns trust through clarity.

Motion is responsive, not choreographed. State changes — hover, open, close, load — are acknowledged at 0.2s ease-out. Nothing decorates for its own sake. Framer Motion transitions respect `prefers-reduced-motion`.

**Key Characteristics:**
- Monochromatic core with a single premium accent (Creator Violet)
- Inter throughout at comfortable text sizes — no display font heroics
- Flat surfaces at rest; soft shadow only on interaction or elevation
- 8px base radius, consistent across all interactive elements
- Dense-but-readable information architecture (sidebar + main panel layout)
- Encouraging microcopy; the system is always on the creator's side

## 2. Colors: The Ink & Canvas Palette

One near-neutral system — designed to disappear behind the content — with a single reserved accent that signals premium value.

### Primary
- **Editorial Ink** (`#171717`): The primary interactive colour. Used for all CTA buttons, active sidebar items, and high-emphasis text. Near-black rather than pure black — a degree warmer.

### Secondary
- **Creator Violet** (`#7c3aed`): Reserved exclusively for Creator+ features, upgrade walls, premium badges, and the subscription CTA. Never used for general interactive elements.
- **Creator Violet Light** (`#8b5cf6`): Hover and lighter-weight violet contexts — badge backgrounds at reduced opacity, gradient accents on Creator+ UI.
- **Creator Violet Muted** (`#ede9fe`): Chip and badge backgrounds where the violet needs to be present but recessive.

### Neutral
- **Studio Canvas** (`#ffffff`): Page background, card surface, input background. The base layer.
- **Quiet Surface** (`#f5f5f5`): Secondary backgrounds — sidebar active state, muted panels, chip backgrounds, hover fills. The most-used neutral after canvas.
- **Subdued Voice** (`#737373`): Secondary text, placeholder labels, navigation items at rest. Mid-gray that meets WCAG AA contrast on white.
- **Hairline** (`#e5e5e5`): All borders and dividers. Structural but invisible at a glance.
- **Deep Canvas** (`#0a0a0a`): Dark mode page background; also used as `--foreground` in dark mode.

### Semantic
- **Success Green** (`#22c55e`): Positive status — published, paid, completed.
- **Warning Amber** (`#f59e0b`): Caution — scheduled, pending, attention required.
- **Danger Red** (`#ef4444`): Destructive actions, error states, past-due deals.

### Named Rules
**The One Violet Rule.** Creator Violet appears on one category of element per screen: the premium signal. It is never used for a primary CTA that a Free user can also trigger, never used as a hover state for neutral links, and never used as a decorative accent. Its scarcity is what makes the upgrade wall feel special, not intrusive.

**The No-Primary-Color Rule.** The primary palette is achromatic by design. If you find yourself adding a second colour to the core system (teal, coral, gold), stop. The restraint is the brand.

## 3. Typography

**Body Font:** Inter, system-ui, sans-serif

**Character:** A single humanist sans-serif throughout. Inter at small-to-medium sizes has the density a content dashboard needs without feeling cramped. The type hierarchy is expressed through weight (400 → 600) and size steps, not through a separate display face.

### Hierarchy
- **Display** (600, 1.5rem/24px, -0.025em tracking): Page titles, section heroes. Used sparingly — one per view at most.
- **Headline** (600, 1.25rem/20px, -0.025em tracking): Card section headers, modal titles, major group labels.
- **Title** (500, 1rem/16px, normal tracking): List item titles, form section labels, secondary headings.
- **Body** (400, 0.875rem/14px, 1.625 leading): All paragraph text, descriptions, card body content. Keep line length to 65–70ch for readability.
- **Label** (500, 0.75rem/12px, 0.01em tracking): Badges, chips, nav section labels, metadata, timestamps. Uppercase sparingly — only for categorical labels in all-caps (section titles in sidebar).

### Named Rules
**The Weight-First Rule.** Hierarchy is weight, then size. Do not use a larger size for emphasis if a heavier weight at the same size is sufficient. Over-sizing creates visual noise; weight alone communicates importance.

**The No-Uppercase Body Rule.** Uppercase text is permitted only for short categorical labels (sidebar section headers, badge text). All other text — buttons, form labels, descriptions, headings — is sentence case.

## 4. Elevation

Contently is flat by default. Cards, panels, and inputs have no shadow at rest; their boundary is established by the `#e5e5e5` hairline border. Depth is conveyed through tonal layering (white card on `#f5f5f5` surface) rather than shadow.

Shadows appear only in two contexts: interactive lift (hover on clickable cards) and modal elevation (dropdowns, popovers, dialogs).

### Shadow Vocabulary
- **State lift** (`0 4px 6px -1px rgba(0,0,0,0.06), 0 2px 4px -2px rgba(0,0,0,0.06)`): Applied on hover to clickable cards. Subtle — barely perceptible in isolation, visible as movement.
- **Structural lift** (`0 1px 3px 0 rgba(0,0,0,0.06), 0 1px 2px -1px rgba(0,0,0,0.06)`): Used for floating elements — popovers, dropdown menus, select panels — that sit above the page layer.
- **Micro lift** (`0 1px 2px 0 rgba(0,0,0,0.05)`): Inline feedback — active tab, selected pill, elevated chip.

### Named Rules
**The Flat-By-Default Rule.** A surface at rest has no shadow. Shadow is a state, not a style. If you add a shadow to a static card without hover or elevation intent, it is decoration. Remove it.

## 5. Components

### Buttons
Buttons use the full 6px (`rounded.md`) radius — confident and clickable without being rounded to the point of softness.

- **Primary** (`#171717` background, `#fafafa` text, `8px 16px` padding): The main action on any screen. One per context. On hover: darkens to `#262626`.
- **Ghost** (transparent background, `#737373` text): Secondary or cancel actions. On hover: `#f5f5f5` background, `#171717` text.
- **Creator+ CTA** (`#7c3aed` background, white text): Used exclusively on upgrade walls and billing pages. On hover: `#6d28d9`. Never used for product actions a free user can access.
- **Destructive** (`#ef4444` background, white text): Permanent destructive actions — delete, remove. Always preceded by a confirmation.

### Cards / Containers
- **Corner Style:** 8px (`rounded.lg`) for main content cards; 12px (`rounded.xl`) for kanban columns, calendar tiles, and hero panels.
- **Background:** White (`#ffffff`) on the default `#f5f5f5` page surface.
- **Border:** `1px solid #e5e5e5` (hairline). No shadow at rest.
- **Hover (clickable cards only):** `box-shadow: 0 4px 6px -1px rgba(0,0,0,0.06), 0 2px 4px -2px rgba(0,0,0,0.06); cursor: pointer`.
- **Internal Padding:** 24px (`spacing.lg`) for standard cards; 12px (`spacing.sm` × 1.5) for compact list cards.

### Inputs / Fields
- **Style:** White background, `1px solid #e5e5e5` border, 6px radius, `8px 12px` padding.
- **Focus:** Border shifts to `#171717`; outer ring `0 0 0 3px rgba(23,23,23,0.08)`. No colour — focus is expressed through ink, not violet.
- **Placeholder:** `#a3a3a3` (mid-neutral, clearly secondary).
- **Error:** Border `#ef4444`; helper text in danger red below the field.
- **Disabled:** `#f5f5f5` background, `#d4d4d4` border, `#a3a3a3` text.

### Navigation (Sidebar)
- **Structure:** Fixed-left sidebar, 64px collapsed / 256px expanded. Two sections (Creation, Business) separated by a hairline.
- **Link at rest:** `#737373` text, no background. Icon-only when collapsed.
- **Link hover:** `#f5f5f5` background, `#171717` text. 0.1s ease transition.
- **Link active:** `#f5f5f5` background, `#171717` text, 500 weight.
- **Locked item (gated feature):** `rgba(115,115,115,0.5)` text (50% opacity subdued). Small `Lock` icon (12px) trailing the label. Links still resolve — the lock is pre-click signalling, not a disabled state.

### Badges / Chips
- **Status badge** (idea, scripted, filming, published, etc.): Coloured dot + label text. Dot colours follow semantic palette (success, warning, etc.). Pill shape (`rounded.full`), `2px 8px` padding.
- **Creator+ badge:** `#ede9fe` background, `#7c3aed` text, crown or star icon leading. `rounded.full`.
- **Plan badge** (Pro, Free): Subdued — `#f5f5f5` background, `#737373` text. No accent.

### Status Pipeline (Idea → Published)
The 7-step pipeline (idea → scripted → to_film → filmed → editing → scheduled → published) is the product's spine. Each status has a colour-coded dot and a `DropdownMenu` trigger on the card — the creator can advance the pipeline without navigating away. Status colours: idea (gray), scripted (blue), to_film (amber), filmed (purple), editing (orange), scheduled (green), published (emerald).

## 6. Do's and Don'ts

### Do:
- **Do** use `#171717` (Editorial Ink) for all primary interactive elements — buttons, active states, links with intent.
- **Do** reserve Creator Violet (`#7c3aed`) strictly for premium/upgrade contexts. One violet surface per screen, maximum.
- **Do** default to flat surfaces (no shadow). Apply `box-shadow: soft-lg` only on hover of a clickable card or on a floating element.
- **Do** use Inter 500 weight for form labels, nav items, and button text. 400 for body, 600 for headings.
- **Do** keep badge and chip text concise — 1–2 words. Use the status dot, not a colour-filled background, for pipeline status on cards.
- **Do** support `prefers-reduced-motion` in all Framer Motion variants.
- **Do** show a Lock icon (12px, `text-muted-foreground/40`) on gated sidebar items. Never silently hide them.

### Don't:
- **Don't** use violet for a CTA that a Free user can trigger. The moment violet appears on a general action, the premium signal is diluted.
- **Don't** add a second accent colour to the core system. Teal, coral, gold — none of these belong. The achromatic palette is the brand.
- **Don't** use shadows on static, non-interactive cards. *If it's not clickable, it doesn't need a shadow.*
- **Don't** uppercase body text, button labels, or form field text. Uppercase is only for short sidebar section headers and badge chips where categorical labelling demands it.
- **Don't** make the tool look like a **corporate SaaS** — no heavy blue tones, no dense data tables without breathing room, no enterprise-speak in empty states or tooltips.
- **Don't** make it **childish or toy-like** — no Canva-style bubbly illustrations, no oversized emojis as primary UI, no cartoonish hover animations. Warm ≠ playful.
- **Don't** use border-left coloured stripes as a design pattern — they read as a 2015 dashboard aesthetic. Status is communicated by the dot and the dropdown, not a left-side accent bar.
