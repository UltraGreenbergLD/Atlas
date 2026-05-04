// ─── Atlas Static Response Engine ────────────────────────────────────────
// All responses are pre-written based on scraped Wowhead Frost Mage data.
// No API calls, no cost. Safe for public portfolio use.

const RESPONSES = [
  // ── Quick prompt exact matches ──────────────────────────────────────────
  {
    match: ['what are todays bountiful delves', 'bountiful delves', 'delves today'],
    response: `**Today's Bountiful Delves** rotate daily. As a Frost Mage at ilvl 252, prioritize Tier 8+ delves for the best loot table — aim for Zekvir's Lair or The Sinkhole if they're bountiful today.

**Tips for Lorath:**
- Use your Frost Nova + Shatter combo on elite packs
- Bountiful delves reward a Coffer Key, so bring a Restored Coffer Key if you have one
- Whelpling's Shadowflame Crest drops are your main upgrade path this week`,
  },
  {
    match: ['best build for mythic+', 'mythic+ build', 'm+ build', 'best mythic build'],
    response: `**Frost Mage — Spellslinger M+ Build** (Current patch best performer)

**Key talents:**
- Spellslinger's Arcane Missiles proc
- Glacial Spike + Shatter setup
- Ice Nova for on-demand AoE CC
- Frozen Touch for CDR

**Stat priority:** Crit ≥ Mastery > Haste > Versatility

At 1,400 RaiderIO you're already in the range where Spellslinger pulls ahead of Frostfire on most key levels. Run it on 12s and above.`,
  },
  {
    match: ['best in slot weapon', 'bis weapon', 'frost mage weapon', 'best weapon'],
    response: `**Best in Slot Weapon for Frost Mage**

🥇 **Void-Touched Sept-Staff** — Nerub-ar Palace (Heroic/Mythic)
Best stat distribution for Frost, high Crit + secondary budget.

🥈 **Imprisoned Blasphemer's Wand + Off-hand** — If you prefer the split setup for better itemization control.

🥉 **Crafted ilvl 636 Staff** — Reachable now with Resonance Crystals. A solid stop-gap while you prog Nerub-ar.

For Lorath at ilvl 252, the crafted weapon is your fastest upgrade path if you haven't done it yet.`,
  },

  // ── Common follow-up questions ──────────────────────────────────────────
  {
    match: ['rotation', 'optimize rotation', 'frost mage rotation', 'dps rotation', 'priority list'],
    response: `**Frost Mage Priority (Spellslinger — Single Target)**

1. **Frozen Orb** on cooldown
2. **Comet Storm** on cooldown
3. **Glacial Spike** when Icicles = 5 + Fingers of Frost proc
4. **Ice Lance** to consume Fingers of Frost
5. **Frostbolt** as filler — never cap procs

**AoE (3+ targets):**
- Blizzard to generate Freezing Rain
- Ice Lance spam during Fingers of Frost
- Frozen Orb + Comet Storm on CD

Your RaiderIO score suggests solid fundamentals — the main gain at 1,400 is tightening Glacial Spike timing around Shatter windows.`,
  },
  {
    match: ['stat priority', 'stats', 'what stats', 'secondary stats'],
    response: `**Frost Mage Stat Priority** (Spellslinger build)

1. **Critical Strike** — Your #1 stat. Shatter mechanics make Crit disproportionately valuable. Aim for 40%+ raid buffed.
2. **Mastery** — Boosts Icicles and Glacial Spike damage directly.
3. **Haste** — Speeds up Frostbolt, more procs per minute. Soft cap around 20%.
4. **Versatility** — Survivability bonus, pick up where available.

**For Lorath at ilvl 252:** You're likely at ~35% Crit. Prioritize Crit gems and enchants before swapping gear pieces.`,
  },
  {
    match: ['gear check', 'gear', 'upgrades', 'what gear', 'gear upgrades', 'bis gear'],
    response: `**Gear Check — Lorath (ilvl 252)**

You're at a solid baseline. Key upgrade slots to target:

🔴 **Weapon** — Biggest DPS gain if not yet crafted to 636.
🟡 **Trinkets** — Spymasters Web (Nerub-ar) or Treacherous Transmitter are S-tier.
🟢 **Tier set** — 4pc Frost bonus is core to the Spellslinger build. Prioritize completing it via Great Vault.

**This week's M+ cache:** Check your Great Vault for Chest/Legs — tier slots you want to land.

At 1,400 RIO you should be clearing 10s comfortably — that loot range covers your current ilvl bracket well.`,
  },
  {
    match: ['check for class tuning', 'class tuning', 'tuning', 'nerfs', 'buffs'],
    response: `**Frost Mage — Recent Tuning (11.0.5)**

✅ **Spellslinger buffed** — Arcane Missiles proc damage increased ~8%. Widened the gap over Frostfire for M+.
✅ **Glacial Spike** — Minor damage increase to base hit.
⚠️ **Frostfire** — No changes this patch. Still viable for raid, but Spellslinger is the clear M+ pick now.

No significant nerfs to worry about. Frost is in a healthy spot — not the very top of the charts but strong and well-represented in high keys.

Source: Blizzard Forums / 11.0.5 patch notes`,
  },
  {
    match: ['help plan session', 'plan session', 'dailies', 'weeklies', 'session plan', 'what to do'],
    response: `**Session Plan for Lorath this week**

**Daily (15-20 min):**
- Bountiful Delves for Coffer Keys
- Warband bonus if available

**Weekly priorities:**
1. 🔑 Push at least one +10 for Great Vault slot (you're well-geared enough)
2. 🏛️ LFR / Normal Nerub-ar if missing tier pieces
3. ⚗️ Check Catalyst charges — convert off-pieces to tier if needed
4. 📦 Claim Great Vault on reset — prioritize tier slots

**Skip this week:** World quests below ilvl 242 reward threshold aren't worth the time at 252.`,
  },
  {
    match: ['raider.io', 'rio score', 'my score', 'improve rio', 'mythic score'],
    response: `**Lorath — RaiderIO: 1,400**

You're solidly in the mid-high range. Here's how to push further:

**To reach 1,600+:**
- Focus on timed +10s across all 8 current season dungeons
- Prioritize dungeons where Frost Mage excels: Ara-Kara, Stonevault, Grim Batol
- Consistency > score — a smooth +9 timed beats a chaotic +10 missed timer

**Current season affixes to know:**
- Fortified/Tyrannical cycle affects which weeks to push
- Frost Mage brings strong utility (Ring of Frost, Cone of Cold) that groups value

You're one solid push week away from 1,600.`,
  },

  // ── Fallback ────────────────────────────────────────────────────────────
  {
    match: [],
    response: null, // signals to use the default fallback
  },
]

const FALLBACKS = [
  `That's a great question for Lorath's current progression. Based on your ilvl 252 Frost Mage profile, I'd focus on Spellslinger talent pathing and tightening your Shatter windows — that's where the biggest gains are at 1,400 RaiderIO.

Want me to pull up your rotation priority or gear check instead?`,

  `For a Frost Mage at your level, the answer usually comes down to Crit stacking and Glacial Spike timing. At 1,400 RIO you've got the fundamentals — the gains are in the margins now.

Try one of the quick prompts above for specific guidance, or ask me about rotation, stats, or gear.`,

  `I don't have specific data on that yet, but for Lorath's Frost Mage profile the general advice is: prioritize your 4pc tier bonus, keep Crit above 40%, and run Spellslinger for M+.

Ask me about your rotation, stat priority, or this week's session plan for more targeted help.`,
]

// ─── Normalize input for matching ─────────────────────────────────────────
function normalize(text) {
  return text.toLowerCase().replace(/[^a-z0-9\s+]/g, '').trim()
}

// ─── Main function — call this instead of the API ─────────────────────────
export function getStaticResponse(userMessage) {
  const input = normalize(userMessage)

  for (const entry of RESPONSES) {
    if (entry.match.length === 0) continue
    const hit = entry.match.some(keyword => input.includes(normalize(keyword)))
    if (hit) return entry.response
  }

  // Rotate through fallbacks based on message count (simple variety)
  const idx = Math.floor(Math.random() * FALLBACKS.length)
  return FALLBACKS[idx]
}
