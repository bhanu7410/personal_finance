# Add Chroma-js Dynamic Colors & Subcategory UI

Currently, the `InteractiveSegmentedBar` uses a static set of colors, and the database schema only supports a flat list of categories. The goal is to support an unlimited variety of category colors using `chroma-js`, and introduce a "subcategory" feature with a dedicated, nested UI layout.

## Completed Changes

### Database Schema
- Added `parentId String?` to the `Category` model.
- Added `parent Category? @relation("CategoryHierarchy", fields: [parentId], references: [id])`
- Added `children Category[] @relation("CategoryHierarchy")`

### Backend / Data Fetching
- Updated data fetching logic in `groups/[id]/page.tsx` to include `category.parent`.
- Mapped parent attributes (`parentId`, `parentName`, `parentIcon`) into the client payload.

### Dependencies
- Installed `chroma-js` and `@types/chroma-js`.

### UI Components
- Updated `types.ts` to include `subcategories?: CategoryStat[]`.
- Updated `GroupDashboardClient.tsx` to compute categories by their parent, separating subcategories into a nested map, and used `chroma-js` to dynamically generate scales of color.
- Updated `InteractiveSegmentedBar.tsx` to conditionally render a nested subcategory segment and legend beneath the main category selector when a parent is selected.
