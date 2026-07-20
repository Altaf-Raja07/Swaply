---
name: Terracotta & Grain
colors:
  surface: '#faf9f5'
  surface-dim: '#dbdad6'
  surface-bright: '#faf9f5'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f4f4f0'
  surface-container: '#efeeea'
  surface-container-high: '#e9e8e4'
  surface-container-highest: '#e3e2df'
  on-surface: '#1b1c1a'
  on-surface-variant: '#58423c'
  inverse-surface: '#2f312e'
  inverse-on-surface: '#f2f1ed'
  outline: '#8b716a'
  outline-variant: '#dfc0b7'
  surface-tint: '#a73918'
  primary: '#a43716'
  on-primary: '#ffffff'
  primary-container: '#c54f2c'
  on-primary-container: '#fffbff'
  inverse-primary: '#ffb5a0'
  secondary: '#506354'
  on-secondary: '#ffffff'
  secondary-container: '#d0e5d2'
  on-secondary-container: '#546758'
  tertiary: '#735c00'
  on-tertiary: '#ffffff'
  tertiary-container: '#c7a84a'
  on-tertiary-container: '#4e3d00'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#ffdbd1'
  primary-fixed-dim: '#ffb5a0'
  on-primary-fixed: '#3b0900'
  on-primary-fixed-variant: '#862201'
  secondary-fixed: '#d3e8d5'
  secondary-fixed-dim: '#b7ccb9'
  on-secondary-fixed: '#0e1f13'
  on-secondary-fixed-variant: '#394b3d'
  tertiary-fixed: '#ffe089'
  tertiary-fixed-dim: '#e4c363'
  on-tertiary-fixed: '#241a00'
  on-tertiary-fixed-variant: '#574500'
  background: '#faf9f5'
  on-background: '#1b1c1a'
  surface-variant: '#e3e2df'
typography:
  display-lg:
    fontFamily: Literata
    fontSize: 48px
    fontWeight: '700'
    lineHeight: '1.1'
    letterSpacing: -0.02em
  display-lg-mobile:
    fontFamily: Literata
    fontSize: 32px
    fontWeight: '700'
    lineHeight: '1.2'
    letterSpacing: -0.01em
  headline-md:
    fontFamily: Literata
    fontSize: 24px
    fontWeight: '600'
    lineHeight: '1.3'
  body-lg:
    fontFamily: Karla
    fontSize: 18px
    fontWeight: '400'
    lineHeight: '1.6'
  body-md:
    fontFamily: Karla
    fontSize: 16px
    fontWeight: '400'
    lineHeight: '1.5'
  label-caps:
    fontFamily: Karla
    fontSize: 12px
    fontWeight: '700'
    lineHeight: '1'
    letterSpacing: 0.05em
  button:
    fontFamily: Karla
    fontSize: 16px
    fontWeight: '700'
    lineHeight: '1'
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  unit: 4px
  container-max: 1200px
  gutter: 24px
  margin-desktop: 64px
  margin-mobile: 20px
  stack-sm: 8px
  stack-md: 16px
  stack-lg: 32px
---

## Brand & Style

This design system centers on a "Humanist-Editorial" aesthetic, blending the warmth of a local community bulletin board with the precision of a modern digital marketplace. The brand personality is grounded, communal, and tactile, intentionally avoiding the sterile frictionlessness of typical SaaS products in favor of a "lived-in" feel.

The design movement is **Modern-Organic Minimalism**. It prioritizes heavy whitespace and a restricted, naturalistic color palette. Visual interest is driven by high-quality typography and subtle tactile metaphors—elements should feel like physical objects (paper, clay, wood) placed on a warm surface. The target audience consists of lifelong learners and local creators who value authenticity over corporate efficiency.

## Colors

The palette is rooted in earth tones to evoke a sense of stability and craft. 

- **Base (#FDFCF8):** A warm, creamy off-white used for all primary backgrounds. It reduces eye strain and feels more approachable than pure white.
- **Primary (#D95D39):** A deep terracotta/clay orange. Used for primary actions, highlights, and active states. It suggests energy and human touch.
- **Secondary (#4A5D4E):** A muted forest green. Used for success states, secondary categories, and grounding elements.
- **Accent (#E8C766):** A soft ochre used sparingly for the "coin/token" motif and special highlights.
- **Text (#2D2D2D):** A soft charcoal that maintains high contrast against the cream base while feeling less "digital" than pure black.

## Typography

The typography pairing reinforces the "indie-editorial" feel. 

**Literata** (Headings) provides a scholarly yet contemporary voice. Its sturdy serifs ensure readability while giving the product a literary, trustworthy character. Use large display sizes for hero sections to emphasize the editorial narrative.

**Karla** (Body & UI) offers a slightly quirky, grotesque personality that keeps the interface from feeling too formal. It is highly legible at small sizes and its irregular character widths add to the "hand-crafted" charm of the design system. 

For information hierarchy, utilize `label-caps` for eyebrows and metadata, and ensure `body-lg` is the default for descriptions to maintain a spacious, readable feel.

## Layout & Spacing

This design system uses a **Fluid-Fixed Hybrid Grid**. Content is housed in a centered container with a maximum width of 1200px. 

- **Desktop:** 12-column grid with 24px gutters. Use generous margins (64px) to allow the content to "breathe" like a high-end magazine.
- **Mobile:** Single column with 20px side margins. 
- **Rhythm:** An 8px linear scale (4px for micro-adjustments) governs all padding and margins. Vertical stacking should be intentional; use `stack-lg` (32px) between unrelated sections to maintain the airy, editorial feel.

Layouts should favor asymmetrical compositions occasionally to lean into the "indie" aesthetic, avoiding perfectly centered "bootstrap-style" rows.

## Elevation & Depth

Depth is achieved through **Tonal Layering** and **Ambient Shadows** rather than stark elevation. 

- **The Base:** The off-white background is the lowest level.
- **Surface Level:** Cards and containers use a slightly lighter or identical background to the base, but are defined by a very thin (0.5px) border in a darkened version of the cream color or a soft charcoal at 10% opacity.
- **Shadows:** Use a single, consistent shadow style for interactive elements: `0 4px 12px rgba(45, 45, 45, 0.05)`. This is a "whisper shadow"—barely there, meant to provide just enough lift to signify interactability.
- **Active State:** When a card or button is pressed, it should "sink" (remove shadow, slight scale down to 0.98), mimicking a tactile physical press.

## Shapes

The shape language is "Soft-Organic." 

- **Standard Radius:** 8px (`rounded-md`). Used for buttons, inputs, and small cards.
- **Large Radius:** 16px (`rounded-lg`). Used for main content containers and feature cards.
- **The Coin Motif:** Credits, badges, and avatars must be fully circular (pill/circle). This contrast against the rounded-rectangles creates a visual metaphor for currency and tokens within the skill exchange.
- **Icons:** Icons should feature rounded terminals and a slightly inconsistent "hand-drawn" stroke width to match the playful, humanist brand style.

## Components

- **Buttons:** Primary buttons are solid terracotta (#D95D39) with white text. Secondary buttons use a forest green (#4A5D4E) outline. Buttons have a fixed height (48px) and 8px border radius.
- **Cards:** Feature cards should have a 16px radius, a thin neutral border, and use the Literata font for titles. Use ample internal padding (24px).
- **Skill Chips:** Small, pill-shaped tags using the secondary green at 10% opacity with solid green text. No border.
- **Credit Badges (The Coin):** High-contrast circular badges using the tertiary ochre (#E8C766). They should feature a subtle inner-bevel or a 1px darker stroke to look "stamped."
- **Input Fields:** Bottom-border only or very light four-sided borders. Labels sit above the field in `label-caps` typography. Focus state should be a 2px terracotta bottom-border.
- **List Items:** Separated by thin, 1px horizontal lines in a lightened charcoal. Use "hover" states that subtly shift the background color to a darker cream.