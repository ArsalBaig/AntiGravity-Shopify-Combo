# WizVape Frontend Design System Specification

> **Design Intent:** Deliver an implementation-ready, token-driven, WCAG 2.2 AA compliant UI design system for the WizVape e-commerce storefront that guarantees visual fidelity, strict brand consistency, accessible keyboard-first interaction, and responsive performance across mobile, tablet, and desktop surfaces.

---

## 1. Context and Goals

- **Brand / Product:** WizVape (Duplicate Storefront)
- **Reference URL:** `https://wizvape.co.uk/`
- **Target Audience:** Adult UK vape consumers, beginner-to-advanced vapers seeking pod kits, disposable alternatives, nic salts, coils, and hardware.
- **Surface:** E-Commerce Storefront (Responsive: Mobile 360px+, Tablet 768px+, Desktop 1200px - 1440px+).
- **Core Objectives:**
  1. Faithfully reproduce the high-converting, information-dense layout of WizVape UK.
  2. Implement an uncompromising Design Token Architecture (Typography, Colors, Spacing, Elevation, Motion) using CSS custom properties.
  3. Ensure all interactive components strictly adhere to the **7 mandatory interactive states** (`default`, `hover`, `focus-visible`, `active`, `disabled`, `loading`, `error`).
  4. Satisfy full **WCAG 2.2 AA** accessibility standards: minimum 4.5:1 text contrast, non-overlapping touch targets (minimum 44x44px), explicit visible focus rings, ARIA live regions for cart/toast announcements, and keyboard navigability.
  5. Reflect known production page component density:
     - Links: ~795
     - Buttons: ~126
     - Lists: ~80
     - Cards: ~69
     - Inputs: ~19
     - Navigation structures: ~2

---

## 2. Design Tokens and Foundations

All stylesheets, templates, and UI components **must** consume design tokens via CSS custom properties (`var(--token-name)`). Raw hex values, arbitrary pixel margins, or ad-hoc border properties in component classes are strictly prohibited.

### 2.1 Typography Tokens
- `font.family.primary`: `'Poppins', sans-serif`
- `font.family.stack`: `'Poppins', sans-serif, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif`
- `font.size.base`: `16px`
- `font.weight.light`: `300`
- `font.weight.base`: `400`
- `font.weight.medium`: `500`
- `font.weight.semibold`: `600`
- `font.weight.bold`: `700`
- `font.weight.extrabold`: `800`
- `font.lineHeight.base`: `18.4px`
- `font.lineHeight.tight`: `1.2`
- `font.lineHeight.normal`: `1.4`
- `font.lineHeight.relaxed`: `1.6`

#### Typography Scale
| Token | Computed Value | Rem Equivalent | Primary UI Application |
| :--- | :--- | :--- | :--- |
| `font.size.xs` | `0px` | `0rem` | Screen-reader only (`.sr-only` / `.visually-hidden`) |
| `font.size.sm` | `12px` | `0.75rem` | Badges, footnotes, timestamps, regulatory notices, SKU labels |
| `font.size.md` | `12.8px` | `0.8rem` | Breadcrumbs, review counts, trust assurance subtitles |
| `font.size.lg` | `13px` | `0.8125rem` | Swatch labels, table cell data, spec pills |
| `font.size.xl` | `14px` | `0.875rem` | Navigation links, product card titles, promo banners |
| `font.size.2xl`| `15px` | `0.9375rem` | Secondary action buttons, collection descriptions |
| `font.size.3xl`| `16px` | `1rem` | Standard body prose, primary inputs, dropdown selectors |
| `font.size.4xl`| `18px` | `1.125rem` | Subheadings, card group headers, cart item titles |
| `font.size.5xl`| `20px` | `1.25rem` | Section titles (`.collection--title`), modal titles |
| `font.size.6xl`| `22px` | `1.375rem` | Main product titles, hero headlines (`h1`) |
| `font.size.7xl`| `26px` | `1.625rem` | Highlighted sale pricing, key hero callouts |
| `font.size.8xl`| `32px` | `2.0rem` | Large discount banners, aggregate review scores |

---

### 2.2 Color Tokens

The palette balances a clean, high-contrast e-commerce background with high-visibility call-to-action colors and UK vape regulatory warning styling.

| Token Name | Hex Code | Semantic Role |
| :--- | :--- | :--- |
| `color.text.primary` | `#222222` | Primary body copy, headers, main product titles |
| `color.text.secondary`| `#0000ee` | Text hyperlinks, active breadcrumb links, shop all links |
| `color.text.tertiary` | `#666666` | Secondary metadata, review dates, inactive filters |
| `color.text.inverse` | `#ffffff` | White text on dark buttons, announcement bar copy |
| `color.surface.base` | `#000000` | Top announcement bar, primary CTA buttons, dark chips |
| `color.surface.muted` | `#ffffff` | Page background, card backgrounds, modal windows |
| `color.surface.raised`| `#f1f1f1` | Feature boxes, subtle divider lines, input borders |
| `color.surface.subtle`| `#f8f9fa` | Hover tints, table alternate rows, disabled surfaces |
| `color.surface.strong`| `#c90076` | Vibrant brand accent, deal banners, highlight pills |
| `color.accent.deal` | `#c71231` | "Sale" badges, price discounts, countdown alerts |
| `color.accent.cyan` | `#00b4d8` | Brand cyan accents, warranty & authentic verification icons |
| `color.status.instock`| `#16a34a` | In-stock green indicators, free shipping progress bar |
| `color.status.warning`| `#f59e0b` | Low-stock badges, age verification alert borders |
| `color.status.error` | `#dc2626` | Error message text, invalid input borders |
| `color.rating.star` | `#fba22a` | Judge.me review star color |
| `color.focus.ring` | `#0284c7` | WCAG 2.2 compliant focus ring color (`2px solid`) |

---

### 2.3 Spacing Scale
- `space.1`: `3px`
- `space.2`: `4px`
- `space.3`: `5px`
- `space.4`: `7px`
- `space.5`: `7.5px`
- `space.6`: `8px`
- `space.7`: `9px`
- `space.8`: `10px`
- Standard Layout Increments:
  - `space.12`: `12px` (standard card padding mobile)
  - `space.16`: `16px` (base component gap)
  - `space.20`: `20px` (card content padding)
  - `space.24`: `24px` (grid column gap)
  - `space.32`: `32px` (section vertical spacing)
  - `space.48`: `48px` (large section vertical rhythm)
  - `space.64`: `64px` (hero container padding)

---

### 2.4 Radius, Elevation, and Motion Tokens
- **Radius Tokens:**
  - `radius.xs`: `3px` (micro badges, tags)
  - `radius.sm`: `4px` (form inputs, filter pills)
  - `radius.md`: `5px` (swatches, button corners)
  - `radius.lg`: `12px` (product cards, feature boxes)
  - `radius.xl`: `25px` (pill CTA buttons, modal dialogs)
  - `radius.2xl`: `50px` (circular avatars, circular badge indicators)
  - `radius.full`: `9999px` (rounded-full pills)
- **Shadow & Elevation Tokens:**
  - `shadow.1`: `0 1px 3px rgba(0, 0, 0, 0.08), 0 1px 2px rgba(0, 0, 0, 0.04)` (Card resting)
  - `shadow.2`: `0 4px 12px rgba(0, 0, 0, 0.12), 0 2px 4px rgba(0, 0, 0, 0.08)` (Card hover / Flydown)
  - `shadow.3`: `rgb(61, 8, 8) 0px 4px 0px 0px, rgba(0, 0, 0, 0.3) 0px 5px 12px 0px` (Deal button elevation)
  - `shadow.drawer`: `-4px 0 28px rgba(0, 0, 0, 0.2)` (Slide-out cart drawer)
  - `shadow.sticky`: `0 -4px 16px rgba(0, 0, 0, 0.08)` (Sticky mobile action bar)
- **Motion Tokens:**
  - `motion.duration.instant`: `1ms`
  - `motion.duration.fast`: `150ms` (hover states, color transitions)
  - `motion.duration.normal`: `250ms` (accordion open, flydowns, modals)
  - `motion.duration.slow`: `350ms` (cart drawer slide)
  - `motion.easing.standard`: `cubic-bezier(0.4, 0.0, 0.2, 1)`
  - `motion.easing.decelerate`: `cubic-bezier(0.0, 0.0, 0.2, 1)`

---

## 3. Mandatory 7-State Component Rule

Every interactive element (buttons, links, inputs, selects, swatches, accordions, cards) **must** explicitly define and visually respond to all 7 interactive states:

1. **`default`**: Unmodified baseline presentation.
2. **`hover`**: Visual feedback on pointer mouseover (slight scale or background tint, cursor pointer).
3. **`focus-visible`**: Visible outline (`2px solid var(--color-focus-ring)`) with `2px` offset when focused via keyboard navigation.
4. **`active`**: Momentary pressed feedback on mousedown or tap (`transform: scale(0.98)` or dark background shift).
5. **`disabled`**: `opacity: 0.55`, `cursor: not-allowed`, no hover or click events, `aria-disabled="true"`.
6. **`loading`**: Replaces text or appends an accessible spinner, `aria-busy="true"`, pointer events disabled.
7. **`error`**: Clear red border (`#dc2626`), high contrast error description text linked via `aria-describedby`.

---

## 4. Component-Level Rules & Anatomies

### 4.1 Header & Announcement Bar
- **Announcement Bar**: Fixed top strip with `#000000` background and `#ffffff` text (`font.size.sm`). Cycles key value propositions: "FREE UK DELIVERY ON ORDERS OVER £20", "SAME DAY DISPATCH BEFORE 4PM", "18+ ADULT PRODUCT NOTICE".
- **Main Header**:
  - Logo (`wizvape.co.uk` high-res SVG/PNG) with `height: 38px; width: auto`.
  - Live Search Input with embedded Category Selector dropdown and instant clear button. Minimum touch target height `48px`.
  - Header Actions: Help link with phone/chat icon, Account login modal trigger, Cart button with dynamic item count badge (`background: var(--color-surface-strong)`).
- **Mega Navigation Bar**:
  - Top level links: *Vape Kits*, *Disposable Vapes*, *Prefilled Pods*, *E-Liquids*, *Coils & Pods*, *Deals & Multi-Buys*.
  - Hover / Focus-visible reveals multi-column dropdowns showcasing sub-categories (e.g. *Pod Kits*, *Sub-Ohm*, *100ml Shortfills*, *5 for £30 Deals*) with visual category thumbnails.

### 4.2 Hero Promotional Banner Carousel
- High-visibility promotional canvas featuring seasonal discounts (e.g. "NEW YEAR VAPE DEALS", "OXVA XLIM 4 JUST £18.99", "5 FOR £30 MULTI-BUY").
- Accessible slide controls (Prev / Next buttons, slide dot indicators, pausing on hover/focus).

### 4.3 Key Features / Trust Assurance Bar
- Container with 4 responsive feature cards (`background: #f3f3f366; border-radius: 8px; padding: 12px; height: 117px`):
  1. **Free UK Delivery**: Orders over £20.
  2. **Same Day Dispatch**: Orders placed before 4:00 PM.
  3. **100% Genuine Guarantee**: Authenticity batch code guarantee.
  4. **Expert Customer Care**: UK-based phone & email support.

### 4.4 Product Card (`.product-card`)
- **Anatomy**:
  - Image container (1:1 aspect ratio) with high-res WebP image.
  - Discount / Deal badge pill at top-left (`color.accent.deal` or `color.surface.strong`).
  - Stock badge (`In Stock` with green dot).
  - Brand vendor label (`OXVA`, `VooPoo`, `SMOK`, `Vaporesso`).
  - Product Title (`font.size.xl`, 2-line clamp with tooltip on hover).
  - Star rating with review count (`Judge.me` style, 5 gold stars).
  - Price container: Sale price in bold (`font.size.3xl`), crossed-out MSRP price if discounted.
  - Color Swatches: Up to 6 color bubbles (`18x18px`) that interactively switch the active card image.
  - "Add to Basket" primary button.

### 4.5 Slide-Out Cart Drawer (`.cart-drawer`)
- Anchored to right viewport (`max-width: 440px; width: 100%`).
- Backdrop overlay with subtle blur.
- Free Delivery Progress Bar: Calculates remaining spend to unlock free delivery (Threshold: £20.00).
- Scrollable list of items with thumbnail, title, selected color, quantity controls (`-` / `+`), and remove button.
- Sticky drawer footer with Subtotal, VAT breakdown notice, and primary Checkout button.
- Keyboard Trap: When open, tab key cycles only inside the drawer; `Escape` key immediately closes drawer.

### 4.6 Judge.me Customer Review Carousel
- Verified store review badge ("Customers rate us 4.9/5 based on 12,480+ reviews").
- Carousel of verified buyer quotes with star rating, customer name, verified buyer badge, and product purchased.

### 4.7 Multi-Column Footer
- Newsletter Signup with email input, submit button, and instant success confirmation.
- 4 navigation columns: Shop Categories, Customer Service, Legal & Compliance, About WizVape.
- Mandatory UK Age Verification Notice: "You must be 18 or older to purchase tobacco or nicotine products in the UK."
- Payment method icon row: Visa, Mastercard, Maestro, PayPal, Apple Pay, Google Pay.

---

## 5. Accessibility Acceptance Criteria (WCAG 2.2 AA)

- **Keyboard Navigation**: All interactive components are reachable via `Tab` / `Shift+Tab`. No keyboard traps exist.
- **Focus Indicators**: Every interactive control displays an unambiguous `2px solid #0284c7` focus ring with `2px` offset when focused via keyboard.
- **Contrast Ratios**:
  - Body text (`#222222` on `#ffffff`): 16.0:1 (passes AAA).
  - Secondary text (`#666666` on `#ffffff`): 5.7:1 (passes AA).
  - Hyperlinks (`#0000ee` on `#ffffff`): 8.6:1 (passes AA).
  - Button text (`#ffffff` on `#000000`): 21.0:1 (passes AAA).
  - Deal accent (`#c71231` on `#ffffff`): 5.9:1 (passes AA).
- **Touch Target Sizing**: Minimum clickable area of 44x44 CSS pixels on touch viewports.
- **Screen Reader Announcements**:
  - Live region (`aria-live="polite"`) for cart additions and drawer updates.
  - Form controls have explicit `<label>` tags with matching `for`/`id` attributes.
  - Images have descriptive `alt` attributes.

---

## 6. Anti-Patterns & Prohibited Implementations

- **No Raw Hex In Components**: Never write `color: #000;` directly in component rules; always use `var(--color-surface-base)`.
- **No Missing States**: Never create a button without `:hover`, `:focus-visible`, `:active`, and `[disabled]` declarations.
- **No Missing Fallbacks**: Image elements must have fallback handlers or placeholder graphics.
- **No Layout Shift on Swatch Change**: Swatch switching must not alter the card container dimensions.
- **No Hidden Focus**: Never use `outline: none` without providing an alternative high-contrast focus indicator.

---

## 7. QA Checklist

- [ ] Typography renders in 'Poppins' font across all weights (300, 400, 500, 600, 700).
- [ ] Header logo matches WizVape branding and retains aspect ratio.
- [ ] Search input has accessible label and functional flydown suggestions.
- [ ] Navigation dropdowns work seamlessly on hover and on keyboard focus.
- [ ] Feature bar displays all 4 value propositions with icons.
- [ ] Product cards render real titles, prices, star ratings, and working color swatches.
- [ ] Clicking "Add to Basket" increments cart count, triggers button loading/success state, and opens the Cart Drawer.
- [ ] Cart Drawer calculates remaining amount for free UK delivery accurately.
- [ ] Pressing `Escape` closes any open drawer or modal.
- [ ] Layout is fully responsive from 360px mobile width up to 1440px+ ultra-wide.
