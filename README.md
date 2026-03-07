# react-webshop-codespace

A React webshop with client-side Stripe Payment Links (Option B), deployed to GitHub Pages at **https://ukkie-kinderkleding.nl**.

---

## Checkout Flow (Client-Side Stripe Payment Links)

The checkout page uses a **client-only** Stripe Payment Link. No server or secret keys are required. When a customer reaches the checkout:

1. A QR code is displayed so mobile users can scan and pay directly.
2. An **Open Payment Link** button opens the Stripe-hosted payment page in a new tab.

All dynamic strings (product names, etc.) are sanitised with **DOMPurify** to prevent XSS.

### Environment Variables

| Variable | Description |
|---|---|
| `REACT_APP_PAYMENT_LINK_URL` | Your Stripe Payment Link URL (e.g. `https://buy.stripe.com/…`). Set in CI/CD as a repository secret. |
| `CLIENT_URL` | Optional: the public URL of the deployed frontend (e.g. `https://ukkie-kinderkleding.nl`). |

When `REACT_APP_PAYMENT_LINK_URL` is not set the QR code and pay button are hidden and a clear message is shown.

---

## Local Development

```bash
cd frontend
npm install
npm start          # http://localhost:3000
```

## Running Tests

```bash
cd frontend
npm test           # runs all tests (jest + @testing-library/react)
```

## Linting

```bash
cd frontend
npm run lint       # ESLint with security plugin
```

## Building for Production

```bash
cd frontend
npm run build
```

---

## CI / CD

| Workflow | Trigger | Description |
|---|---|---|
| `ci.yml` | push / PR (all branches) | Lint, test (with coverage), `npm audit` |
| `deploy-pages.yml` | push to `main`/`master`, manual dispatch | Build → GitHub Pages with CNAME |
| `codeql-analysis.yml` | push / PR | GitHub CodeQL security scan |

### Required Repository Secrets

Add these in **Settings → Secrets and variables → Actions**:

| Secret | Value |
|---|---|
| `REACT_APP_PAYMENT_LINK_URL` | Your Stripe Payment Link URL |

---

## GitHub Pages Deployment

1. Enable **GitHub Pages** in repository Settings → Pages, set source to **GitHub Actions**.
2. Add the following DNS records for **ukkie-kinderkleding.nl** at your registrar:

### DNS Records

**A records (apex domain):**

```
185.199.108.153
185.199.109.153
185.199.110.153
185.199.111.153
```

**CNAME record (www subdomain):**

```
www → NacedoZorgvol.github.io
```

3. Enable **Enforce HTTPS** in Pages settings once the DNS has propagated.
4. The site will be live at **https://ukkie-kinderkleding.nl**.