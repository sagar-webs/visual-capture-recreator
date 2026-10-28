<!-- LOVABLE:BEGIN -->
> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.
<!-- LOVABLE:END -->

## Project rules
- Site content (products, services, industries, contact details, form options) lives in `src/lib/site.ts`; pages read from it so copy stays consistent.
- Demo requests go through one server function (`src/lib/demo.functions.ts`) that validates, rate-limits, stores in `demo_requests`, then notifies; success is only shown after storage succeeds.
- Analytics loads only when `VITE_GA4_MEASUREMENT_ID` is set and the visitor accepts the consent banner; `VITE_SITE_URL` enables canonical URLs, `VITE_GSC_VERIFICATION` the Search Console tag.
- Theme is set before paint by an inline script in `__root.tsx`; dark is the brand default.
