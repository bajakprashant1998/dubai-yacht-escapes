
# Fix Loading Issues Across Admin and Frontend

## Problem Analysis

After reviewing the codebase, I've identified several root causes for the loading issues:

### 1. Missing Timeout Protection
The `withTimeout` utility exists in `src/lib/withTimeout.ts` but is **not being used** in most hooks:
- `useChat.ts` - No timeout on conversation initialization or message fetching
- `useConversations.ts` - No timeout on fetching conversations
- `useChatAnalytics.ts` - No timeout on analytics queries
- `useCannedResponses.ts` - No timeout on canned response queries

### 2. N+1 Query Problem in useConversations
The `fetchConversations` function makes a separate query for each conversation to get the last message, causing significant slowdown:
```typescript
const convsWithMessages = await Promise.all(
  (convs || []).map(async (conv) => {
    const { data: msgs } = await supabase
      .from("chat_messages")
      .select("content")
      .eq("conversation_id", conv.id)
      // ...N queries for N conversations
```

### 3. Large Dataset Fetches in Analytics
`useChatAnalytics` fetches all messages and conversations without pagination, which can be slow with large datasets.

### 4. Simultaneous Subscriptions
Multiple realtime subscriptions created without cleanup coordination can cause resource contention.

---

## Solution Plan

### Phase 1: Add Timeout Protection to All Database Hooks

**Files to modify:**
- `src/hooks/useChat.ts`
- `src/hooks/useConversations.ts`
- `src/hooks/useChatAnalytics.ts`
- `src/hooks/useCannedResponses.ts`
- `src/hooks/useAdminPresence.ts`

Wrap all Supabase queries with the `withTimeout` utility:
```typescript
import { withTimeout } from "@/lib/withTimeout";

// Before
const { data } = await supabase.from("table").select("*");

// After  
const { data } = await withTimeout(
  supabase.from("table").select("*"),
  8000,
  "Failed to load data"
);
```

### Phase 2: Fix N+1 Query in Conversations

Replace the loop that fetches last message for each conversation with a single aggregated query using a database function or client-side grouping:

**Option A: Fetch all recent messages in one query**
```typescript
// Get all conversations
const { data: convs } = await supabase
  .from("chat_conversations")
  .select("*")
  .in("status", ["active", "waiting_agent"]);

// Get last message for all conversations in ONE query
const convIds = convs?.map(c => c.id) || [];
if (convIds.length > 0) {
  const { data: recentMessages } = await supabase
    .from("chat_messages")
    .select("conversation_id, content, created_at")
    .in("conversation_id", convIds)
    .order("created_at", { ascending: false });
  
  // Group by conversation_id client-side
}
```

### Phase 3: Optimize Analytics Queries

Add limits and pagination to analytics queries:
- Limit messages to last 1000 for response time calculation
- Add row limits to prevent large data fetches
- Cache results for 5 minutes using React Query's `staleTime`

### Phase 4: Improve Admin Role Verification

The current 15-second timeout is too long. Reduce it and add better error handling:
- Reduce timeout from 15s to 8s
- Show more specific error messages
- Add retry with exponential backoff

### Phase 5: Add Loading Error Boundaries

Create error boundaries to gracefully handle loading failures and provide retry options instead of blank screens.

---

## Technical Implementation Details

### File: `src/hooks/useChat.ts`

**Changes:**
1. Import `withTimeout`
2. Wrap `initConversation` database calls with timeout
3. Wrap `sendMessage` calls with timeout
4. Add error recovery (retry logic)

### File: `src/hooks/useConversations.ts`

**Changes:**
1. Import `withTimeout`
2. Replace N+1 query pattern with batch fetch
3. Add timeout to all database operations
4. Optimize message fetching with single query + client-side grouping

### File: `src/hooks/useChatAnalytics.ts`

**Changes:**
1. Import `withTimeout`
2. Add limits to queries (`.limit(1000)`)
3. Wrap all queries with timeout
4. Add row count estimates before full fetches

### File: `src/hooks/useCannedResponses.ts`

**Changes:**
1. Import `withTimeout`
2. Wrap all CRUD operations with timeout

### File: `src/hooks/useAdminPresence.ts`

**Changes:**
1. Import `withTimeout`
2. Wrap presence update operations with timeout

### File: `src/lib/withTimeout.ts`

**Changes:**
Reduce default timeout from 8000ms to 5000ms for faster feedback.

### File: `src/components/admin/AdminLayout.tsx`

**Changes:**
1. Reduce timeout from 15s to 8s
2. Add retry mechanism with exponential backoff
3. Improve error messaging

---

## Expected Outcomes

1. **Faster Feedback**: Users will see error states within 5-8 seconds instead of indefinite loading
2. **Fewer Hangs**: Timeout protection prevents infinite loading states
3. **Better Performance**: N+1 query fix reduces conversation list load time significantly
4. **Graceful Degradation**: Error boundaries allow users to retry failed loads
5. **Improved UX**: Specific error messages help users understand what went wrong

---

## Testing Checklist

After implementation, verify:
- [ ] Admin dashboard loads within 5 seconds
- [ ] Live Chat dashboard shows conversations quickly
- [ ] Chat widget initializes without hanging
- [ ] Analytics tab loads within reasonable time
- [ ] Slow network conditions show timeout errors (not infinite loading)
- [ ] Retry buttons work when errors occur
