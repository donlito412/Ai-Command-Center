# TASK-013 Output: Functional Government Contract Center

## Completed
- Replaced the Contracts page content with a working opportunity manager.
- Added contract opportunity search, active/saved/reviewing/applying/submitted/archive filters, AI-fit filter, detail view, save action, status updates, editable notes, source links, and CSV export.
- Added contract-type filtering for AI/automation, web/app/software, media/content, data/analytics, and training/technical opportunities.
- Added SLED, state, local, federal, and subcontracting scope filters.
- Changed the default view from AI-only to all active opportunities.
- Added broader subcontracting, facilities, staffing/admin, event services, and federal prime support opportunity records.
- Expanded default fallback opportunities so the page loads multiple usable contract records before any external source refresh.
- Added explicit Search button that queries the product API with the entered search term.
- Changed fallback/source-target records to use procurement search links and label them `Search Source`; real imported records with actual posting URLs show `Open Opportunity`.
- Added contract fit scoring and deadline urgency helpers.
- Added `/api/contracts/refresh` for source refresh/import.
- Added SAM.gov API support when `SAM_GOV_API_KEY` is configured.
- Added live SLED/local source connectors for PA eMarketplace, COSTARS, PennBid, Pittsburgh Beacon, Allegheny County Bonfire, Allegheny County DHS solicitations, Pittsburgh Public Schools, and Pittsburgh Water Bonfire.
- Added per-source refresh timeouts so one slow procurement portal cannot block the full refresh.
- Added fallback federal, Pennsylvania, and Pittsburgh source imports so the module works without external API keys.
- Synced root app and nested `/command-center` app copies.

## Verification
- `npm run lint`: passed.
- `npm run build`: passed.
- `POST /api/contracts/refresh`: imported fallback source opportunities.
- `POST /api/contracts/refresh`: imported live PA eMarketplace records with direct solicitation links and Pittsburgh Public Schools RFP/PDF links.
- `GET /api/products/contract_opportunities?status=active&limit=5`: returned active contract opportunity records.
- `GET /api/products/contract_opportunities?status=active&q=website&limit=100`: returned the web application opportunity.
- `/contracts`: rendered the working contract manager controls.

## Source Targets
- SAM.gov contract opportunities
- Pennsylvania eMarketplace
- Pennsylvania COSTARS
- PennBid
- City of Pittsburgh Beacon
- Allegheny County Bonfire
- Allegheny County DHS Solicitations
- Pittsburgh Public Schools RFPs
- Pittsburgh Water Bonfire

## Next Step
Execute `TASK-014` to build the Functional AI Wealth Empire Center.
