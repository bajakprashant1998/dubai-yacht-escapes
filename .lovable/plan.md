

## Plan: Enhance Trip Planner Wizard & Create Tests

The user is on `/plan-trip` and wants the wizard section enhanced to match the reference screenshot style (cleaner, more polished step indicators with icons and labels, refined date selection UI) and wants tests created.

### Current State
- 5-step wizard: Dates → Travelers → Nationality → Budget → Style
- Step indicators use rounded squares with icons and connecting lines
- Date pickers use Popover + Calendar components
- Navigation has Back/Continue buttons and trust badges at bottom
- All sub-components (TravelerCounter, BudgetSelector, etc.) are functional

### Changes

#### 1. Enhance `TripPlanner.tsx` - Wizard UI Polish
- **Step indicators**: Match reference — use rounded square icon containers with text labels below, cleaner spacing, softer active/completed states
- **Step 1 (Dates)**: Make the date picker buttons match the reference screenshot exactly — arrival date with blue filled state when selected, departure with outline style, cleaner layout
- **Days summary pill**: Improve the "X days in Dubai" indicator styling
- **Navigation footer**: Cleaner layout matching reference — left-aligned "← Back" text button, right-aligned filled "Continue →" button
- **Trust badges at bottom**: Match the reference pill style with icons

#### 2. Enhance Sub-components
- **TravelerCounter**: Add subtle hover states, improve spacing
- **BudgetSelector**: Add gradient backgrounds on selected state
- **TravelStyleSelector**: Refine selected indicator animations
- **SpecialOccasionSelector**: Minor polish for consistency

#### 3. Create Tests - `src/pages/__tests__/TripPlanner.test.tsx`
- Test wizard renders with step 1 (Dates) visible
- Test step navigation (Continue button advances, Back goes back)
- Test Continue button disabled when no dates selected
- Test step indicator shows correct active step
- Test traveler counter increment/decrement

#### 4. Create Tests - `src/components/trip/__tests__/TravelerCounter.test.tsx`
- Test renders with default values
- Test increment/decrement adults
- Test children min is 0, adults min is 1
- Test total travelers display

### Technical Details
- All changes are UI-only in existing components, no database or backend changes needed
- Tests will use Vitest + React Testing Library (already configured)
- Will mock `useTripPlanner`, `useMatchCombo`, and router hooks in tests
- Sub-component tests can render in isolation without mocking

