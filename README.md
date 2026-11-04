# Corino React storefront

A reference implementation of the [`@moonbase.sh/react`](https://github.com/manul-audio/moonbase-react) SDK on Next.js 16, dressed up as the storefront of **Corino Studio**, a fictional Oslo audio-plugin company selling two plugins (HALO, a saturator, and DRIFT, a granular reverb) plus a bundle. It follows the design of Moonbase's own Corino reference sites so the three can be compared side by side.

It shows what a server-rendered React site built on Moonbase looks like end to end: landing page with live pricing, cart drawer, embedded checkout, login, and product downloads, with the catalog and user state hydrated on the server so the first paint is real data.

## Run it locally

```bash
pnpm install
pnpm dev
```

Open <http://localhost:5173>. The site talks to the public `https://corino-demo.moonbase.sh` tenant by default, which already allows that origin. To point it at your own tenant, create `.env.local`:

```ini
MOONBASE_ENDPOINT=https://your-tenant.moonbase.sh
```

and add `http://localhost:5173` to your own tenant's allowed storefront URLs.

## What's in the box

- **Landing page** (`app/page.tsx`) with `PluginCard` and `BundleSection` bound to `useProduct` / `useBundle`; an owned product swaps "Add to cart" for "Download".
- **Cart drawer** (`components/CartDrawer.tsx`) using `useCart`, opening Moonbase's embedded checkout overlay with `checkout({ redirect: false })`.
- **Checkout completion** (`components/CheckoutCompletion.tsx`) subscribing to `onCheckoutCompleted` and routing to `/order-completed`.
- **Login modal** using `useAuth().signIn`; **download modal** using `useInventory().getProduct` and `downloadProduct`.
- **Server-side boot** (`app/layout.tsx`) via `createServerStorefront` from `@moonbase.sh/react/ssr`; any boot failure renders an unavailable page.
- **Deep links**: `/?add_product=halo` or `/?add_bundle=duo-bundle` open the drawer with the item added.

Account area, licence activation, and the custom-storefront callback pages are the next milestone.

## Tests

```bash
pnpm test:e2e
```

Builds the app and runs Playwright against it on port 5173, plus a second server on port 3100 pointed at a broken endpoint to verify the unavailable page. Set `E2E_SIGNUP=1` to also run the signup test, which creates a throwaway account on the demo tenant.

Manual check that automation cannot cover: open checkout, pay with Moonbase's test card, confirm you land on `/order-completed`.

## Stack

Next.js 16 (App Router, SSR), React 19, `@moonbase.sh/react` (installed from its GitHub Release tarball until it is on npm), plain CSS, Playwright.

## Licence

MIT.
