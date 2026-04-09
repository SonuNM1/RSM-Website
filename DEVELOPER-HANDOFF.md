# RSM Cosmos Website — Developer Handoff

## Project Overview
Cinematic single-page website for **Relevant Search Media** (relevantsearchmedia.com).  
Theme: cosmic/universe — "search is a cosmos, not a checklist."

---

## Required Files (all must be in the same directory)

| File | Purpose | Size |
|------|---------|------|
| `rsm-cosmos-definitive.html` | Complete single-file website (HTML + CSS + JS) | 53 KB |
| `nebula-bg.mp4` | Hero background video (loops after Big Bang) | 15 MB |
| `bigbang.mp4` | Big Bang explosion video (plays once during intro) | 37 MB |
| `cosmic-nebula.mp4` | Section 1 "Evolution" background video | 19 MB |
| `swirling-nebula.mp4` | Section 2 "Connected Cosmos" background video | 4.8 MB |
| `dust-clouds.mp4` | Section 3 "Why Visibility" background video | 5.7 MB |

### Files NOT used (can be discarded)
`cosmos-bg.mp4`, `cosmic-wood.mp4`, `explosion.mp4`, `storms-bg.mp4`

---

## Architecture

### Single-File Build
Everything is in ONE HTML file — no build tools, no npm, no frameworks.
- CSS is in `<style>` tag
- JavaScript is in `<script>` tag (vanilla JS, no dependencies)
- Google Fonts loaded via `@import` (Outfit, JetBrains Mono, Playfair Display)
- RSM logo loaded from: `https://relevantsearchmedia.com/wp-content/uploads/2023/09/relevant-search-media-logo-300x188.png`

### Layer Stack (z-index)
```
z-index 0:   Background canvas (painted nebula fallback)
z-index 1:   Video backgrounds (.vbg, #vBang)
z-index 2:   Dark overlay (#vOverlay)
z-index 2:   Stars canvas (#cBg)  
z-index 3:   Effects canvas (#cFx) — tendrils, particles, flares
z-index 10:  Platform icons (.nd)
z-index 100: Sun disc / Eye of Cosmos (.sun)
z-index 300: Navigation (.nav)
z-index 400: Skip intro button (#skip)
z-index 9997-9999: Custom cursor
```

### Animation Phases (Hero Section)
The hero runs a 5-phase cinematic sequence:
1. **DARK** (80 frames) — Stars fade in over dark space
2. **CHARGE** (160 frames) — Google "G" logo appears with spinning energy rings
3. **EXPLODE** (380 frames) — Big Bang with `bigbang.mp4` + 37 internet brand name particles (Yahoo, AOL, Napster etc.)
4. **EXPAND** (120 frames) — Icons fly outward, sun disc reveals, `nebula-bg.mp4` fades in
5. **LIVE** (forever) — Icons orbit, energy particles flow, tendrils connect, nebula cycles

### Scroll Sections
3 sections below the hero, each with:
- Looping video background at 25% opacity
- Dark gradient overlay for text readability
- Scroll-triggered reveal animations (IntersectionObserver)

---

## Interactive Features

| Feature | Description |
|---------|-------------|
| Custom cursor | Golden ring + dot + glow trail (body has `cursor:none`) |
| Magnetic icons | Icons pull toward cursor within 150px radius |
| Parallax depth | Inner ring icons shift more than outer on mouse move |
| Icon tooltips | Golden pill tooltip on hover showing service description |
| Timeline stagger | Milestones appear one-by-one with 120ms delay |
| Eye of Cosmos hover | Sun disc glows brighter, orbit text speeds up |
| Skip intro | Button at bottom-right, jumps to living cosmos |

---

## External Links

| Link | Where Used |
|------|------------|
| `https://calendly.com/thomas-relevant-search-media/30min` | Nav CTA, Sun disc CTA, Section 3 CTA |
| `https://relevantsearchmedia.com/wp-content/uploads/2023/09/relevant-search-media-logo-300x188.png` | Nav logo, Sun disc logo |

---

## Deployment Notes

### For WordPress Integration
1. Upload all 5 video files to the media library or a CDN
2. Update the `<source src="...">` paths in the HTML to point to the hosted video URLs
3. The HTML can be used as:
   - A standalone landing page
   - A custom page template (strip `<html>/<head>/<body>` tags, keep `<style>` + `<div id="wrap">` + `<script>`)
   - Embedded via iframe

### For Static Hosting
1. Upload all 6 files to the same directory on the server
2. Works out of the box — no server-side processing needed
3. Test with a local HTTP server: `python3 -m http.server 8000`

### Performance Optimization
- **Videos:** Consider converting .mp4 to WebM for smaller file sizes. Add WebM as additional `<source>` elements
- **Video CDN:** Host videos on a CDN (Cloudflare, BunnyCDN) for faster loading
- **Preloading:** Add `<link rel="preload" href="bigbang.mp4" as="video">` in `<head>` for the explosion video
- **Canvas particles:** Reduce particle count on mobile (currently 800 stars, 1200 debris). Check the `DUR` and star count values in the JS
- **Logo:** Download the RSM logo and host locally instead of loading from the WordPress site

### Mobile Notes
- Basic responsive breakpoints at 768px and 900px
- Canvas animation runs at full particle count on mobile — may need throttling for low-end devices
- Custom cursor is CSS-only — works on touch devices but glow trail won't show (no mousemove events)
- Navigation collapses (menu links hidden on mobile, logo + CTA remain)

---

## Content Structure

### Nav Menu Links
- The Cosmos → `#cosmos` (Section 1)
- How It Works → `#how` (Section 2)  
- Future → `#future` (Section 3)
- About → `#about` (not built yet)
- Book Strategy Call → Calendly link

### Sections to Build (not included yet)
- Section 4: "One Package, Not Twelve Vendors" — comparison grid
- Section 5: "The Results" — client stats and testimonials
- Section 6: "The Origin Awaits" — final CTA with RSM logo large
- Footer

---

## Quick Test
1. Put all 6 files in one folder
2. Open terminal in that folder
3. Run: `python3 -m http.server 8000`
4. Open: `http://localhost:8000/rsm-cosmos-definitive.html`
5. Watch the Big Bang sequence → living cosmos → scroll down for sections
