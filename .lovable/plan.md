

# Real-Time Customer Support Chatbot - Implementation Plan

## Overview

A comprehensive customer support system featuring:
- **Floating chat widget** for website visitors
- **AI-powered chatbot** for automated responses using Lovable AI
- **Real-time admin dashboard** for live human support
- **Lead capture** with database persistence
- **Luxury-themed UI** matching the brand (dark navy, gold accents)

---

## Architecture Overview

```text
+------------------+       +-------------------+       +------------------+
|  Chat Widget     | <---> |  Supabase         | <---> |  Admin Dashboard |
|  (Frontend)      |       |  (Realtime + DB)  |       |  (Live Support)  |
+------------------+       +-------------------+       +------------------+
         |                          |
         v                          v
+------------------+       +-------------------+
|  Chat Bot Edge   |       |  Database Tables  |
|  Function        |       |  (Conversations,  |
|  (Lovable AI)    |       |   Messages, Leads)|
+------------------+       +-------------------+
```

---

## Database Schema

### New Tables Required

**1. `chat_conversations`**
| Column | Type | Description |
|--------|------|-------------|
| id | UUID | Primary key |
| visitor_id | TEXT | Anonymous visitor identifier |
| visitor_name | TEXT | Collected name (nullable) |
| visitor_email | TEXT | Collected email (nullable) |
| visitor_phone | TEXT | Collected phone (nullable) |
| travel_date | DATE | Collected travel date (nullable) |
| status | TEXT | 'active', 'closed', 'waiting_agent' |
| is_agent_connected | BOOLEAN | If live agent has joined |
| agent_id | UUID | FK to auth.users (nullable) |
| current_page | TEXT | Page visitor is on |
| created_at | TIMESTAMPTZ | Creation timestamp |
| updated_at | TIMESTAMPTZ | Last activity |
| closed_at | TIMESTAMPTZ | When conversation ended |

**2. `chat_messages`**
| Column | Type | Description |
|--------|------|-------------|
| id | UUID | Primary key |
| conversation_id | UUID | FK to chat_conversations |
| sender_type | TEXT | 'visitor', 'bot', 'agent' |
| sender_name | TEXT | Display name |
| content | TEXT | Message text |
| metadata | JSONB | Extra data (quick replies, etc.) |
| created_at | TIMESTAMPTZ | Timestamp |

**3. `chat_leads`**
| Column | Type | Description |
|--------|------|-------------|
| id | UUID | Primary key |
| conversation_id | UUID | FK to chat_conversations |
| name | TEXT | Lead name |
| email | TEXT | Lead email |
| phone | TEXT | Lead phone |
| travel_date | DATE | Intended travel date |
| message | TEXT | Initial inquiry |
| source | TEXT | 'chatbot' |
| created_at | TIMESTAMPTZ | Timestamp |

**4. `admin_presence`** (for online status)
| Column | Type | Description |
|--------|------|-------------|
| user_id | UUID | FK to auth.users |
| is_online | BOOLEAN | Online status |
| last_seen | TIMESTAMPTZ | Last activity |

### Realtime Configuration
Enable realtime for `chat_messages`, `chat_conversations`, and `admin_presence` tables.

### RLS Policies
- Visitors can insert messages and create conversations (anonymous access)
- Visitors can only read their own conversation (matched by visitor_id)
- Admins can read/write all conversations and messages
- Admin presence: admins can update their own presence, all can read

---

## Component Structure

### Frontend Components

```text
src/components/chat/
├── ChatWidget.tsx           # Floating icon + expandable window
├── ChatWindow.tsx           # Main chat interface
├── ChatMessage.tsx          # Individual message bubble
├── ChatInput.tsx            # Message input with send button
├── ChatHeader.tsx           # Header with minimize/close
├── ChatWelcome.tsx          # Welcome screen with quick actions
├── LeadCaptureForm.tsx      # Name/email/phone/date form
├── QuickReplyButtons.tsx    # Predefined response buttons
└── TypingIndicator.tsx      # Bot/agent typing animation
```

### Admin Dashboard Components

```text
src/components/admin/chat/
├── LiveChatDashboard.tsx    # Main admin chat view
├── ConversationList.tsx     # Active conversations sidebar
├── ConversationItem.tsx     # Single conversation preview
├── AdminChatWindow.tsx      # Admin's chat interface
├── AdminChatInput.tsx       # Admin message input
├── VisitorInfo.tsx          # Visitor details panel
└── OnlineStatusToggle.tsx   # Admin online/offline toggle
```

### New Admin Page

```text
src/pages/admin/LiveChat.tsx # Admin live chat management page
```

---

## Backend Edge Functions

### 1. `chat-bot` Edge Function

Handles automated responses using Lovable AI (Gemini 3 Flash).

**Responsibilities:**
- Process visitor messages
- Query tours, pricing, locations from database
- Generate contextual responses about:
  - Dhow cruises and yacht experiences
  - Booking process
  - Prices and packages (fetched from `tours` table)
  - Locations (fetched from `locations` table)
  - Contact details (fetched from `site_settings`)
- Identify when to collect lead information
- Detect when human handoff is needed

**System Prompt Context:**
```text
You are a luxury concierge for Luxury Dhow Escapes in Dubai. 
You help visitors with:
- Information about dhow cruises and yacht charters
- Pricing and package details
- Booking assistance
- Location and timing information
- Contact details

When appropriate, collect visitor details (name, email, phone, travel date).
If a query requires human assistance, politely offer to connect them with a live agent.
```

### 2. `admin-presence` Edge Function

Manages admin online/offline status for smart routing.

---

## Smart Behavior Logic

### Message Flow

```text
1. Visitor opens chat
   └─> Show welcome message + quick action buttons

2. Visitor sends message
   └─> Check admin_presence table
       ├─> If any admin online AND conversation marked for handoff
       │   └─> Notify admin, show "Connecting to agent..."
       └─> Else
           └─> Send to chat-bot edge function
               └─> AI processes and responds

3. Admin joins conversation
   └─> Update is_agent_connected = true
   └─> Send "You are now connected with a live agent" message
   └─> All future messages go to admin (bypass bot)

4. Admin closes conversation
   └─> Update status = 'closed'
   └─> Optional: show feedback request
```

### Handoff Triggers
- Visitor explicitly requests human support
- Bot detects complex query it cannot handle
- Visitor shows frustration or repeats question
- Booking-related inquiries after lead capture

---

## UI Design Specifications

### Chat Widget Styling

**Colors (matching brand):**
- Primary: `hsl(220, 50%, 20%)` - Dark Navy
- Accent: `hsl(45, 60%, 65%)` - Gold
- Background: `hsl(220, 55%, 8%)` - Dark background
- Text: `hsl(45, 30%, 95%)` - Light cream

**Widget Icon:**
- Position: Bottom-right corner (same as current WhatsApp)
- Size: 56px x 56px
- Animation: Gentle pulse effect
- Z-index: Higher than WhatsApp widget (z-50)

**Chat Window:**
- Width: 380px (desktop), 100% - 16px (mobile)
- Height: 520px (desktop), 70vh (mobile)
- Border-radius: 16px
- Shadow: Luxury drop shadow
- Animations: Smooth slide-up on open (Framer Motion)

**Message Bubbles:**
- Visitor: Gold background, dark text
- Bot/Agent: Navy background, light text
- Rounded corners with tail indicator
- Timestamp below message

### Mobile Responsiveness
- Full-width on mobile with bottom sheet behavior
- Safe area padding for notched devices
- Touch-friendly 44px minimum tap targets
- Swipe-down to minimize

---

## File Changes Summary

### New Files to Create

| File | Purpose |
|------|---------|
| `src/components/chat/ChatWidget.tsx` | Main floating widget component |
| `src/components/chat/ChatWindow.tsx` | Chat interface container |
| `src/components/chat/ChatMessage.tsx` | Message bubble component |
| `src/components/chat/ChatInput.tsx` | Message input component |
| `src/components/chat/ChatHeader.tsx` | Chat window header |
| `src/components/chat/ChatWelcome.tsx` | Welcome screen |
| `src/components/chat/LeadCaptureForm.tsx` | Lead collection form |
| `src/components/chat/QuickReplyButtons.tsx` | Quick action buttons |
| `src/components/chat/TypingIndicator.tsx` | Typing animation |
| `src/components/admin/chat/LiveChatDashboard.tsx` | Admin chat view |
| `src/components/admin/chat/ConversationList.tsx` | Conversations sidebar |
| `src/components/admin/chat/ConversationItem.tsx` | Conversation preview |
| `src/components/admin/chat/AdminChatWindow.tsx` | Admin chat interface |
| `src/components/admin/chat/AdminChatInput.tsx` | Admin input |
| `src/components/admin/chat/VisitorInfo.tsx` | Visitor details |
| `src/components/admin/chat/OnlineStatusToggle.tsx` | Online toggle |
| `src/pages/admin/LiveChat.tsx` | Admin live chat page |
| `src/hooks/useChat.ts` | Chat state management |
| `src/hooks/useChatMessages.ts` | Realtime messages hook |
| `src/hooks/useAdminPresence.ts` | Admin status hook |
| `src/hooks/useConversations.ts` | Admin conversations hook |
| `src/lib/chatUtils.ts` | Chat utility functions |
| `supabase/functions/chat-bot/index.ts` | AI chatbot edge function |

### Files to Modify

| File | Change |
|------|--------|
| `src/App.tsx` | Add admin LiveChat route |
| `src/components/layout/Layout.tsx` | Add ChatWidget component |
| `src/components/admin/AdminSidebar.tsx` | Add Live Chat nav item |
| `supabase/config.toml` | Add chat-bot function config |
| `src/lib/exportCsv.ts` | Add chat leads export function |

---

## Implementation Phases

### Phase 1: Database Setup
- Create chat tables with migrations
- Enable realtime
- Set up RLS policies

### Phase 2: Chat Widget (Visitor Side)
- ChatWidget with floating icon
- ChatWindow with message display
- ChatInput and message sending
- Local storage for visitor_id persistence
- Welcome screen and quick replies

### Phase 3: AI Chatbot Integration
- Create chat-bot edge function
- Connect to Lovable AI (Gemini 3 Flash)
- Implement knowledge base from tours/locations/settings
- Add lead capture detection

### Phase 4: Lead Capture
- LeadCaptureForm component
- Save to chat_leads table
- Update conversation with visitor details

### Phase 5: Admin Dashboard
- LiveChat admin page
- ConversationList with realtime updates
- AdminChatWindow for responding
- Online status toggle

### Phase 6: Live Agent Handoff
- Admin presence tracking
- "Connecting to agent" message flow
- Agent join notification to visitor
- Seamless bot-to-human transition

### Phase 7: Export & Polish
- Export chats/leads to CSV
- Animations and polish
- Mobile optimization
- Testing

---

## Technical Notes

### Visitor Identification
- Generate UUID on first visit, store in localStorage
- Use this ID to track conversations across sessions
- Allow visitors to continue previous conversations

### Realtime Subscriptions
```typescript
// Messages subscription
supabase
  .channel('chat_messages')
  .on('postgres_changes', {
    event: 'INSERT',
    schema: 'public',
    table: 'chat_messages',
    filter: `conversation_id=eq.${conversationId}`
  }, handleNewMessage)
  .subscribe()
```

### Rate Limiting
- Implement client-side rate limiting (max 1 message/second)
- Handle 429 errors from Lovable AI gracefully
- Show "Please wait..." for bot responses

### Security Considerations
- Visitor can only access their own conversation (via visitor_id)
- Admin role required for dashboard access
- No sensitive data exposed in bot responses
- RLS policies enforce data isolation

