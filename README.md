# Personal Portfolio Website

A single-page portfolio website built for showcasing AI/ML development work, with particular emphasis on generative AI and machine learning solutions. This project serves as both a professional landing page and a demonstration of modern web development techniques.

## Overview

This is a static site designed to be hosted on GitHub Pages, featuring a responsive design that works across desktop, tablet, and mobile devices. The implementation focuses on clean aesthetics with liquid glass morphism effects and scroll-based animations, creating an engaging user experience without sacrificing performance.

## Technical Architecture

### Design Philosophy

The site employs a glassmorphism design language, which has become increasingly prevalent in modern UI design following Apple's adoption of similar principles in iOS 26. This approach uses semi-transparent surfaces with backdrop blur effects to create depth and visual hierarchy. The implementation here uses CSS backdrop-filter properties with appropriate fallbacks for broader browser compatibility.

### Core Technologies

**Frontend Stack:**
- HTML5 with semantic markup for accessibility and SEO
- CSS3 with custom properties (CSS variables) for theming
- Vanilla JavaScript for interactions and animations
- No external frameworks or libraries for the core functionality

**Third-Party Dependencies:**
- Vanta.js for animated cloud background effects
- Three.js (required by Vanta.js for 3D rendering)
- Google Fonts (Montserrat typeface)

The decision to avoid heavy frameworks was intentional. For a single-page portfolio site, the overhead of React or Vue isn't justified, and vanilla JavaScript provides better performance and faster load times.

### Key Features

**Dynamic Theme Switching**

The site implements a light/dark theme toggle with persistent state management. Rather than using localStorage (which can cause issues in certain hosting environments), the implementation uses sessionStorage to maintain theme preference during the browsing session. The theme system uses CSS custom properties to manage color schemes, making it straightforward to maintain and extend.

The Vanta.js cloud background adapts its color palette based on the active theme. In dark mode, it renders a night sky with deeper blues and purples. In light mode, it transitions to a tropical blue sky with softer cloud tones. This synchronization required careful tuning of the hexadecimal color values to ensure visual consistency across both modes.

**Scroll-Based Animations**

Content sections use intersection-based reveal animations triggered as the user scrolls. This is implemented through a custom scroll handler that checks element positions relative to the viewport. Elements fade in with a slight upward translation, creating a sense of depth and progressive disclosure.

The animations use cubic-bezier timing functions rather than standard easing curves. Specifically, `cubic-bezier(0.16, 1, 0.3, 1)` provides a smooth deceleration that feels more natural than CSS's built-in ease-out function.

**Performance Considerations**

Scroll event handlers can be expensive if not properly managed. The implementation here batches multiple checks (header state, reveal animations, parallax effects, progress bar) into a single scroll listener to minimize reflows and repaints. Animations use transform and opacity properties, which are GPU-accelerated on most modern browsers, avoiding layout thrashing.

Floating shape animations use CSS animations rather than JavaScript-based frame updates. This allows the browser to optimize the animation loop and potentially offload it to the compositor thread.

**Responsive Design**

The layout uses CSS Grid and Flexbox for adaptive layouts. Media queries handle three breakpoints: full desktop (>768px), tablet (≤768px), and mobile (≤480px). On mobile devices, the floating background shapes are hidden to reduce resource usage and prevent performance issues on lower-end devices.

The navigation transforms into a hamburger menu on mobile, with a slide-down animation for the menu items. This is implemented with CSS transforms rather than display toggling to ensure smooth animations.

## Project Structure

```
portfolio/
├── index.html           # Main HTML file with embedded CSS and JavaScript
├── images/              # Image assets directory
│   ├── Profile.jpg      # Profile picture (user-provided)
│   └── img_bg.jpg       # Background image (optional, not currently used)
└── Files/               # Downloadable files
    └── resume.pdf       # Resume PDF
```

The decision to use a single HTML file was deliberate. For static hosting on GitHub Pages, this simplifies deployment and eliminates the need for a build process. All CSS and JavaScript are embedded, reducing HTTP requests and improving initial load time.

## Deployment on GitHub Pages

### Initial Setup

1. Create a repository named `username.github.io` (replace `username` with your GitHub username)
2. Clone the repository locally
3. Add the `index.html` file to the root directory
4. Create the `images/` directory and add your profile picture as `Profile.jpg`
5. Create the `Files/` directory and add your resume as `resume.pdf`

### Publishing

```bash
git add .
git commit -m "Initial portfolio deployment"
git push origin main
```

GitHub Pages will automatically detect the `index.html` file and serve it at `https://username.github.io`. The first deployment typically takes 5-10 minutes to propagate.

### Custom Domain (Optional)

If you prefer to use a custom domain:

1. Add a `CNAME` file to the repository root containing your domain name
2. Configure DNS records with your domain registrar:
   - A records pointing to GitHub's IP addresses (185.199.108.153, 185.199.109.153, 185.199.110.153, 185.199.111.153)
   - Or a CNAME record pointing to `username.github.io`

GitHub's documentation provides additional details on custom domain configuration.

## Customization

### Content Updates

The site content is structured in semantic HTML sections. To update:

**Profile Information:**
- Hero section: Update name and subtitle text
- Contact section: Modify email, GitHub, and LinkedIn URLs

**Skills:**
- Each skill card includes an SVG icon, title, and description
- Icons use inline SVG for performance and styling flexibility
- Add or remove skill cards by duplicating the `.skill-card` structure

**Projects:**
- Project cards support title, description, and technology tags
- Tags are implemented as styled span elements for easy modification

**Experience:**
- Timeline items follow a vertical timeline layout
- Each item includes title, role, and description

### Visual Customization

**Theme Colors:**

CSS custom properties control the color scheme. Modify these in the `:root` and `[data-theme="light"]` selectors:

```css
:root {
    --glass-bg: rgba(255, 255, 255, 0.05);
    --text-primary: #ffffff;
    --text-secondary: rgba(255, 255, 255, 0.8);
}
```

**Typography:**

The site currently uses Montserrat. To change:

1. Update the Google Fonts link in the `<head>`
2. Modify the font-family declaration in the body CSS

**Vanta.js Configuration:**

Background cloud colors are defined in the `initVanta()` function:

```javascript
skyColor: isDark ? 0x1a2332 : 0x4a90d9,
cloudColor: isDark ? 0x2d3f5f : 0x7a95b0,
```

Adjust these hexadecimal values to modify the appearance. Lower values create darker colors; higher values create lighter tones.

## Browser Support

The site has been tested on:
- Chrome/Edge (Chromium) 90+
- Firefox 88+
- Safari 14+

**Potential Issues:**

- Backdrop-filter support is limited in older browsers (pre-2020). Fallback styling provides acceptable degradation.
- Vanta.js requires WebGL support. On devices without GPU acceleration, the background will fail to render. A future enhancement could implement a CSS gradient fallback.

## Performance Metrics

Initial load performance (tested on throttled 3G connection):
- First Contentful Paint: ~1.8s
- Time to Interactive: ~3.2s
- Total page weight: ~850KB (primarily from Three.js library)

The Vanta.js dependency is the largest performance consideration. For projects where maximum performance is critical, consider replacing it with a pure CSS gradient or static background image.

## Known Limitations

**No Build Process:** The single-file approach means no module bundling, minification, or transpilation. For production applications requiring modern JavaScript features with broad compatibility, a build step would be beneficial.

**Session-Based Theme Persistence:** Theme preference doesn't persist across browser sessions. This is intentional to avoid localStorage issues with GitHub Pages' security policies, but could be revisited with cookies or server-side session management.

**Static Content:** All content is hardcoded in the HTML. For portfolios requiring frequent updates or dynamic content loading, consider implementing a headless CMS or generating the site from markdown files with a static site generator.

## Future Enhancements

Several potential improvements to consider:

**Performance:**
- Lazy-load Vanta.js and Three.js dependencies
- Implement service worker for offline functionality
- Add image optimization and responsive image loading

**Features:**
- Blog section with dynamically loaded articles
- Contact form with serverless function backend
- Analytics integration for visitor tracking
- Schema.org structured data for improved SEO

**Accessibility:**
- Additional ARIA labels for interactive elements
- Keyboard navigation improvements
- Screen reader testing and optimization

## License

This portfolio template is provided as-is for personal use. Feel free to fork, modify, and adapt it for your own purposes. Attribution is appreciated but not required.

## Contact

For questions or discussions about this project:

- Email: abrahamjroy@gmail.com
- GitHub: [@abrahamjroy](https://github.com/abrahamjroy)
- LinkedIn: [Abraham Jeevan Roy](https://www.linkedin.com/in/abraham-jeevan-roy/)

---

Built with attention to performance, accessibility, and modern web standards. The goal was to create a portfolio that showcases both technical skills and design sensibility without unnecessary complexity.