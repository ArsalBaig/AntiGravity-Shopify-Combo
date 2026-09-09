# WizVape Duplicate Frontend Storefront

A high-fidelity, token-driven duplicate e-commerce storefront for **WizVape UK** (`https://wizvape.co.uk/`), built according to WCAG 2.2 AA accessibility standards, the 7 mandatory interactive states rule, and the comprehensive design specifications defined in `frontend-design-system.md`.

---

## 1. Directory Structure

```
WizVape Duplicate Frontend/
├── frontend-design-system.md   # Core design system tokens, rules, states, and QA checklist
├── index.html                  # Main responsive storefront markup
├── README.md                   # Project documentation
├── styles/
│   └── main.css                # CSS custom properties, 7-state components, responsive grid
└── scripts/
    └── main.js                 # Cart drawer logic, swatches, live search, toast notifications
```

Image assets and catalogs are isolated outside the codebase in:
```
f:/GitHub Desktop/Front-end-Images/
└── assets-manifest.json        # Manifest mapping brand logos, category images, and product photos
```

---

## 2. Key Features Implemented

1. **Brand Identity & Header**:
   - High-resolution WizVape brand logo and favicon.
   - Announcement ticker highlighting Free UK Delivery over £20 and Same Day Dispatch before 4:00 PM.
   - Live predictive search with category dropdown selector and interactive flydown preview.
   - Dynamic Cart toggle button with live badge counter.

2. **Mega Navigation**:
   - Multi-column dropdowns for *Vape Kits*, *Prefilled Pods*, *E-Liquids*, *Coils & Pods*, and deal strips (*5 for £30*, *3 for £15*).

3. **Promotional Hero & Key Features**:
   - High-impact promotional hero card featuring latest launches with responsive image positioning.
   - 4-item Trust Assurance Bar (Free Delivery, Same Day Dispatch, 100% Genuine, UK Support).
   - Multi-Buy Saver promotional cards.

4. **Product Catalog & Deep-Dive Showcase**:
   - Featured products grid with live data: *Oxva Xlim 4 Pod Kit*, *VooPoo Drag 6 220W Sub-Ohm Kit*, *SMOK Nord 6*, *Vaporesso Armour Octa*.
   - Interactive color swatches that switch active product imagery on the fly.
   - Interactive deep-dive section with thumbnail gallery, spec badges, and quantity stepper.

5. **Slide-Out Cart Drawer**:
   - Modal drawer with backdrop blur and smooth sliding transition.
   - Dynamic Free Delivery calculation bar showing real-time remaining spend to unlock free UK delivery.
   - Quantity decrement/increment (`-` / `+`), item removal, and live subtotal updates.

6. **Accessibility & Regulatory Compliance**:
   - Full keyboard accessibility with high-contrast focus rings (`2px solid #0284c7`).
   - Accessible ARIA live regions for cart and toast announcements.
   - Mandatory UK TPD 18+ nicotine age warning notice.
   - Payment method badges (Visa, Mastercard, PayPal, Apple Pay, Google Pay).

---

## 3. How to View Locally

Simply open `index.html` in any modern web browser:
```
file:///f:/GitHub%20Desktop/WizVape%20Duplicate%20Frontend/index.html
```
Or serve using any local static HTTP server (e.g. VS Code Live Server, Python `http.server`, or Vite).
