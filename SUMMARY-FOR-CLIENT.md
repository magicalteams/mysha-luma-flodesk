# Mysha: Luma → Flodesk Location Segmentation — Status Update

## What we've built so far

We built a custom automation that connects Luma (event platform) to Flodesk (email platform) so that whenever someone registers for a Mysha event, they automatically get tagged with their city in Flodesk — for example, anyone who signs up for a Miami event gets added to a "Location: MIA" segment.

This gives Mysha the ability to send targeted, city-specific emails (like the upcoming SoHo House and Bath Club events) without any manual data entry.

The system has two parts:

1. **A one-time backfill** that goes through all past Luma events and tags every existing registrant with their city. This catches everyone who already signed up before the automation existed.

2. **An ongoing automation** that runs in the background going forward — every new Luma registration automatically gets tagged in Flodesk with the right city. This replaces the existing Zapier integration (which adds people to Flodesk but doesn't tag them by location).

It covers Miami, NYC, LA, Austin, Chicago, San Francisco, Boston, and DC — and is easy to expand to new cities.

The code is fully written, tested, and ready to deploy.

---

## The roadblock

Luma's API (the connection point our automation needs to talk to Luma) requires **Luma Plus**, which Mysha does not currently have. Without it, we can't programmatically pull event data or receive real-time notifications when someone registers.

---

## Our recommendation: Upgrade to Luma Plus (Option A)

The entire solution was designed around direct Luma API access. Upgrading unlocks everything immediately and is the cleanest long-term path.

### Option A — Upgrade to Luma Plus

**What happens:** We plug in the API keys, run the backfill, deploy, and turn on the webhook. Done.

**Timeline:** Half a day of hands-on work once we have access.

**Pros:**
- Everything works as built — no rework needed
- The backfill is fully automated (no manual exporting from Luma)
- Ongoing automation is direct and reliable (no Zapier dependency)
- Secure webhook verification built in
- Easy to expand to new cities — just add the city name, no other changes

**Cons:**
- Requires Luma Plus (additional cost on Mysha's Luma subscription)

---

### Option B — Work around it using Zapier (no upgrade)

**What happens:** We keep the core logic we built but reroute it through Zapier instead of connecting to Luma directly. The existing Zap gets modified to send registration data to our system, which handles the city tagging and Flodesk sync.

**Timeline:** 1–2 days of hands-on work.

**Pros:**
- No Luma upgrade needed
- Ongoing automation still works (new registrations get tagged going forward)

**Cons:**
- The historical backfill becomes manual — someone has to go into Luma, export each event's guest list one by one, and we process those files separately. This could take 2–4 hours depending on how many events there are, and would need to be repeated for each new city.
- Adds a Zapier dependency (monthly cost, one more tool that can break)
- Less secure (no cryptographic webhook verification)
- Ongoing maintenance of the Zap falls on someone non-technical

**Open question:** We haven't confirmed yet whether Zapier's Luma integration actually includes the event's city/location in the data it sends. If it doesn't, this approach may not be viable at all without additional workarounds.

---

## What about this week's Miami email?

Regardless of which option is chosen, Lauren's existing segmentation work (~200 Miami contacts from the Airtable import + existing Flodesk segments) is ready to use now. Neither option will be fully live before that email needs to go out, so the current list is the best starting point for this week.

---

## Bottom line

Option A (Luma Plus) takes half the time, has no open questions, and sets Mysha up to do this effortlessly for every city going forward. Option B works but is slower to implement, partially manual, and depends on an unverified Zapier capability.

We recommend Option A.
