
# Fix: PDF Export Shows Folded/Collapsed Content

## Problem Identified

When exporting the trip itinerary to PDF, the day-by-day sections use `Collapsible` components that remain collapsed during the print. This means:

1. Only Day 1 is expanded by default (line 116: `setExpandedDays([1])`)
2. When user clicks the PDF button, `window.print()` is triggered
3. The collapsed days remain hidden in the printed PDF
4. Users cannot see their full itinerary in the exported document

---

## Solution

Before triggering `window.print()`, expand ALL collapsible sections, wait for the DOM to update, then print. Optionally restore the previous state after printing.

---

## Implementation

### File: `src/pages/TripItinerary.tsx`

**Current PDF handler (line 241):**
```text
onClick={() => window.print()}
```

**New PDF handler with expand-all logic:**

```text
+----------------------------------------------------------+
| 1. Store current expanded days state                     |
| 2. Expand ALL days (setExpandedDays to all day numbers)  |
| 3. Wait for React to re-render (small timeout)           |
| 4. Trigger window.print()                                |
| 5. After print dialog closes, restore original state     |
+----------------------------------------------------------+
```

### Code Changes

**Add a new handler function:**
```typescript
const handleDownloadPDF = () => {
  // Store current state
  const previousExpanded = [...expandedDays];
  
  // Expand all days
  const allDays = Array.from({ length: trip?.total_days || 0 }, (_, i) => i + 1);
  setExpandedDays(allDays);
  
  // Wait for DOM update, then print
  setTimeout(() => {
    window.print();
    
    // Restore state after print dialog closes
    setTimeout(() => {
      setExpandedDays(previousExpanded);
    }, 500);
  }, 100);
};
```

**Update button onClick:**
```text
Before:  onClick={() => window.print()}
After:   onClick={handleDownloadPDF}
```

---

## Optional Enhancement: Print-Specific CSS

Add CSS that automatically expands collapsible content when printing:

```css
@media print {
  /* Force all collapsible content to show */
  [data-state="closed"] {
    display: block !important;
    height: auto !important;
    overflow: visible !important;
  }
  
  /* Hide interactive elements */
  button:not(.print-visible) {
    display: none !important;
  }
  
  /* Clean layout for print */
  .sticky {
    position: static !important;
  }
}
```

This provides a fallback if the JavaScript approach doesn't fully work.

---

## Files to Modify

| File | Change |
|------|--------|
| `src/pages/TripItinerary.tsx` | Add `handleDownloadPDF` function, update button onClick |
| `src/index.css` (optional) | Add print media query styles |

---

## Expected Behavior After Fix

1. User views their trip itinerary (some days collapsed)
2. User clicks "PDF" button
3. All day sections automatically expand
4. Print dialog appears with full itinerary visible
5. After printing/canceling, view returns to original collapsed state

---

## Technical Details

### Why setTimeout is Needed

React's state updates are asynchronous. After calling `setExpandedDays(allDays)`, the DOM doesn't update immediately. A small timeout (100ms) ensures the Collapsible components have time to animate open before `window.print()` captures the page.

### Why Restore State

After printing, we restore the original `expandedDays` state so the user experience isn't changed by clicking the PDF button. This is a non-destructive operation.
