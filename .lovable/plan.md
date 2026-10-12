# Requested app updates

- Remove light-mode controls, stored theme switching, and light-theme styling; keep the app consistently dark.
- Correct admin trip saves to send numeric price/rating values and show readable backend validation details.
- Add clear loading and success/error feedback when creating or updating batches.
- Improve the navigation backdrop and mobile menu readability; add the provided Instagram and YouTube links with icons in the footer and contact page.
- Resolve the existing root error-component type issue and verify the app after changes.

## Technical details

Keep request/error normalization in the shared API utility, preserve existing dark design tokens, and reuse the existing Sonner toast system.
