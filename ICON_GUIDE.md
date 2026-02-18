# Maneho.ai Icon System Guide

## Overview

The Maneho.ai icon is a minimalist, geometric symbol that elegantly combines two core concepts:

1. **Steering Wheel** - Representing motorists, driving, and navigation (LTO compliance context)
2. **Scales of Justice** - Representing law, compliance, fairness, and legal assistance
3. **Gavel** - Representing authority, judgment, and judicial systems

The design uses **Civic Blue (#1d398b)** and white to maintain brand consistency and professional trust.

## Icon Variants

### 1. **Refined Icon** (`maneho-icon-refined.svg`)
**Use Case:** Primary logo, app header, marketing materials

**Features:**
- Full steering wheel with 8 spokes (4 cardinal + 4 diagonal)
- Detailed balance scales with gavel
- Compliance indicator checkmark (bottom-right)
- Premium rounded border accent
- Optimal for 128px+ displays

**Color:** Civic Blue (#1d398b) on white background

---

### 2. **Standard Icon** (`maneho-icon.svg`)
**Use Case:** UI components, social media, general-purpose branding

**Features:**
- Steering wheel with 4 cardinal spokes
- Integrated scales of justice
- Gavel head accent
- Clean geometric design
- Works at 64px and above

**Color:** Civic Blue (#1d398b) on white background

---

### 3. **Favicon** (`favicon.svg`)
**Use Case:** Browser tabs, favorites, app shortcuts

**Features:**
- Ultra-minimalist design
- Essential visual elements only
- Optimized for 16x16 - 32x32 scales
- Maximum clarity at small sizes
- Maintains brand recognition at tiny scales

**Color:** Civic Blue (#1d398b) on white background

---

### 4. **React Component** (`packages/ui/components/ManehoIcon.tsx`)
**Use Case:** Dynamic use in React applications

**Features:**
- Scalable SVG component
- Size variants: `sm` (32px), `md` (64px), `lg` (128px), `xl` (200px)
- Adaptive to theme colors (uses `currentColor`)
- Supports dark mode automatically
- TypeScript support

**Usage:**
```tsx
import { ManehoIcon } from '@repo/ui/ManehoIcon'

// Default
<ManehoIcon />

// Small
<ManehoIcon size="sm" />

// Large
<ManehoIcon size="lg" className="text-primary" />

// With custom styles
<ManehoIcon size="md" className="text-blue-600" />
```

---

## Design Principles

### Visual Hierarchy
1. **Steering Wheel** (primary) - Occupies 70% of the space
2. **Scales of Justice** (secondary) - Integrated horizontally
3. **Gavel** (tertiary) - Top accent element
4. **Compliance Indicator** (optional) - Bottom-right accent

### Geometric Construction
- **Base:** Perfect circle (diameter 140px for 200px canvas)
- **Spokes:** 5-7px stroke width for visibility
- **Balance Beam:** Horizontal line at 47.5% height
- **Pans:** 20x12px rectangles with 2px rounded corners
- **Gavel:** 20x14px block with 3px handle

### Color Strategy
- **Primary Color:** Civic Blue (#1d398b) - RGB(29, 57, 139)
- **Secondary:** White background for contrast
- **Accent Opacity:** 40-60% for secondary elements
- **Ensures:** WCAG AAA compliance for accessibility

### Scalability
| Size | Use Case | Min Width |
|------|----------|-----------|
| 16px | Favicon, Tab icon | 16px |
| 32px | App icon, Small UI | 32px |
| 64px | Avatar, Card header | 64px |
| 128px | Hero banner, Large avatar | 128px |
| 200px+ | Marketing, Poster | 200px+ |

---

## Usage Guidelines

### ✅ Do's
- Use on white or light backgrounds for primary version
- Maintain minimum 10px padding around icon
- Scale proportionally (maintain aspect ratio)
- Use in 1:1 aspect ratio only
- Apply consistent spacing in layouts

### ❌ Don'ts
- Don't distort or skew the icon
- Don't rotate or flip the icon
- Don't change primary colors (use Civic Blue)
- Don't add effects (shadows, glows) without approval
- Don't use at sizes smaller than 16px (except favicon)
- Don't apply gradients or patterns

---

## Implementation Examples

### HTML (Static)
```html
<!-- SVG embed -->
<img src="maneho-icon.svg" alt="Maneho.ai" width="64" height="64" />

<!-- Inline SVG -->
<object data="maneho-icon.svg" type="image/svg+xml"></object>
```

### React Component
```tsx
import { ManehoIcon } from '@repo/ui/ManehoIcon'

export function Header() {
  return (
    <header className="flex items-center gap-2">
      <ManehoIcon size="md" />
      <h1>Maneho.ai</h1>
    </header>
  )
}
```

### CSS Background
```css
.icon-element {
  background-image: url('maneho-icon.svg');
  background-size: contain;
  background-repeat: no-repeat;
  width: 64px;
  height: 64px;
}
```

### Dark Mode Support
```tsx
<ManehoIcon size="lg" className="text-primary dark:text-blue-400" />
```

---

## File Locations

```
maneho-ai/
├── apps/web/public/
│   ├── favicon.svg (browser favicon)
│   ├── maneho-icon.svg (standard icon)
│   └── maneho-icon-refined.svg (premium icon)
└── packages/ui/components/
    └── ManehoIcon.tsx (React component)
```

---

## Brand Integration

### In Authentication Flow
- Display at 64px in Auth card header
- Use with "Maneho.ai" text in white space
- Position centered above tabs

### In Navigation
- Favicon (16x16) in browser tab
- Header logo at 48px in navigation bar
- Sidebar icon at 40px when minimized

### In Marketing
- Social media: 200x200px refined version
- Website header: 128px refined version
- App store: 1024x1024 refined version (enlarged from SVG)

---

## Color Specifications

### Civic Blue
- **Hex:** #1d398b
- **RGB:** 29, 57, 139
- **HSL:** 220°, 74%, 35%
- **Tailwind:** Not standard; use custom via config
- **Accessibility:** AAA contrast ratio (4.5:1+) against white

### Dark Mode Variant
- **Hex:** #5b8de6 (brightened for contrast)
- **RGB:** 91, 141, 230
- **HSL:** 220°, 74%, 63%

---

## Performance Notes

- **SVG Size:** ~3KB for standard icon
- **Load Time:** Negligible (inline or cached)
- **Rendering:** GPU-accelerated on modern browsers
- **Accessibility:** Semantic SVG with proper ARIA labels

---

## Future Enhancements

Potential variations:
- Animated version (steering wheel rotation, scale balance animation)
- Multi-color variant for specific applications
- Icon set expansion (related compliance icons)
- 3D perspective version for app stores

---

## Contact & Feedback

For questions or suggestions about the icon system, please open an issue in the Maneho.ai repository.

**Last Updated:** 2026-02-18
**Version:** 1.0
**Status:** Final ✓
