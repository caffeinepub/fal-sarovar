# Specification

## Summary
**Goal:** Add support for category images, multi-image products with variants, variant-required purchasing, a denser 3-column mobile menu layout, and customer order history.

**Planned changes:**
- Extend backend types/APIs to support category images, products with multiple images, and per-product variants (name, price, enabled/disabled) with backward-compatible defaults.
- Persist selected variant (and the unit price used at purchase time) per order line item; update order placement to accept and store this data.
- Add a backend “my orders” endpoint for authenticated customers to fetch their own order history (newest-first).
- Update admin UI for Categories to add/edit/remove a category image with preview; display category images in storefront category surfaces where applicable.
- Update admin UI for Products to manage multiple product images (add/edit/remove) and variants (add/edit/remove; enable/disable) with previews and persistence.
- Update storefront product flow to require selecting an enabled variant before Add to Cart (when variants exist) and auto-update displayed price based on selection.
- Update cart/checkout to treat items as product+variant, compute totals/discounts using variant price, and submit variant/unit price per line item; ensure order views can show variant info.
- Update storefront Menu on mobile to a compact 3-column grid with smaller product cards (image, name, price) while keeping larger breakpoints sensible.
- Add an Order History section to the storefront Account page (logged-in only), showing newest-first orders with date/status/total/items and variant labels, plus an English empty state.

**User-visible outcome:** Admins can manage category images and products with multiple images and variants; customers must choose a variant when required, see correct pricing in cart/checkout, browse a denser 3-column menu on mobile, and view their past orders in the Account page.
