# Corino React storefront

**Live demo:** https://corino-react-storefront.vercel.app

A reference implementation of the [`@moonbase.sh/react`](https://github.com/manul-audio/moonbase-react) SDK on Next.js 16, dressed up as the storefront of **Corino Studio**, a fictional Oslo audio-plugin company selling two plugins (HALO, a saturator, and DRIFT, a granular reverb) plus a bundle. It follows the design of Moonbase's own Corino reference sites so the three can be compared side by side.

It shows what a server-rendered React site built on Moonbase looks like end to end: landing page with live pricing, cart drawer, embedded checkout, login, product downloads, an account area with licence activation, and the callback pages Moonbase's hosted flows redirect to, with the catalog and user state hydrated on the server so the first paint is real data.

## Run it locally

```bash
pnpm install
pnpm dev
```

pnpm is required: npm 12 refuses to install the SDK's GitHub Release tarball unless you pass `--allow-remote=all`.

Open <http://localhost:5173>. The site talks to the public `https://corino-demo.moonbase.sh` tenant by default, which already allows that origin. To point it at your own tenant, create `.env.local`:

```ini
MOONBASE_ENDPOINT=https://your-tenant.moonbase.sh
```

and add `http://localhost:5173` to your own tenant's allowed storefront URLs.

To exercise the callback pages against your own tenant, set its custom storefront locations to the paths listed under "What's in the box" below (for example `LogIn` → `/login`, `AutoActivation` → `/activate`).

## What's in the box

- **Landing page** (`app/page.tsx`) with `PluginCard` and `BundleSection` bound to `useProduct` / `useBundle`; an owned product swaps "Add to cart" for "Download".
- **Cart drawer** (`components/CartDrawer.tsx`) using `useCart`, opening Moonbase's embedded checkout overlay with `checkout({ redirect: false })`.
- **Checkout completion** (`components/CheckoutCompletion.tsx`) subscribing to `onCheckoutCompleted` and routing to `/order-completed`.
- **Login modal** using `useAuth().signIn`; **download modal** using `useInventory().getProduct` and `downloadProduct`.
- **Server-side boot** (`app/layout.tsx`) via `createServerStorefront` from `@moonbase.sh/react/ssr`; any boot failure renders an unavailable page.
- **Deep links**: `/?add_product=halo` or `/?add_bundle=duo-bundle` open the drawer with the item added.
- **Account area** at `/account` (`app/account/layout.tsx`) with tabs for profile (`useAuth().update`, `setPassword`, `signOut`), owned products (`useInventory().getProducts`), per-product downloads, activations and licences (`getProduct`, `downloadProduct`, `getProductActivations`, `revokeActivation`, `getProductLicenses`), and voucher redemption (`useVoucher().redeem`).
- **Licence activation** at `/activate` (`components/activation/`): the online `?token=` flow through `useActivationRequest`, and the offline machine-file upload through `activateProduct(token, ActivationMethod.Offline)`.
- **Custom-storefront callback pages** for every location Moonbase can redirect to: `/login`, `/sign-up`, `/confirm-email`, `/forgot-password`, `/download`, `/subscriptions`, `/account/confirm-email-change`.
- **Cookie consent banner** (`components/CookieBanner.tsx`) feeding `setAttributionConsent`.
- **Embedded storefront switch** in the demo banner: flips between this site's own UI built on the SDK hooks and Moonbase's hosted embedded storefront (cart, sign-in, product details). The choice is remembered per browser; set `CORINO_UI=embedded` on the server to make the embedded storefront the starting mode. Both modes share one cart (the embedded storefront and the SDK use the same browser storage), and the page replays storage events so each side sees the other's changes.

## Tests

```bash
pnpm test:e2e
```

Builds the app and runs Playwright against it on port 5173, plus a second server on port 3100 pointed at a broken endpoint to verify the unavailable page. Set `E2E_ACCOUNT_EMAIL` and `E2E_ACCOUNT_PASSWORD` to an existing demo-tenant account to also run the signed-in account test; nothing in CI creates accounts, orders beyond the cart, or activations. The browser tests add items to a cart on the shared demo tenant (open orders only, never payments).

Manual check that automation cannot cover: open checkout, pay with Moonbase's test card, confirm you land on `/order-completed`.

- Redeem a voucher at `/account/redeem` with a code from your tenant and see the product appear under `/account/products`.
- Open `/activate?token=…` with a real activation token from a Corino demo build and watch it auto-activate, or sign in and start a trial.

## Stack

Next.js 16 (App Router, SSR), React 19, `@moonbase.sh/react` (installed from its GitHub Release tarball until it is on npm), plain CSS, Playwright.

## Licence

MIT.
