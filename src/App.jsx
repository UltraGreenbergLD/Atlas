import { useState, useRef, useEffect } from 'react'
import { getStaticResponse } from './atlasResponses.js'

// ─── Theme Definitions (from Figma) ──────────────────────────────────────
const THEMES = {
  midnight: {
    '--bg-default':       '#111520',
    '--bg-elevation-one': '#192030',
    '--bg-elevation-two': '#222a40',
    '--border-default':   '#2a3550',
    '--border-accent':    '#555d73',
    '--fg-primary':       '#d4d7dc',
    '--fg-secondary':     '#aaaeb9',
    '--btn-sec-bg':       '#0f2133',
    '--btn-sec-border':   '#2e6299',
    '--btn-sec-fg':       '#4da3ff',
    '--badge-success-bg': '#0a2a1f',
    '--badge-success-border': '#1f7f5c',
    '--badge-success-fg': '#34d399',
    '--pill-bg':          '#0c2d27',
    '--pill-border':      '#185a4e',
    '--pill-fg':          '#d8f9f3',
    '--input-bg':         '#0b0f1a',
    '--input-border':     '#2a3550',
    '--input-placeholder':'#7f8696',
    '--char-icon-bg':     'rgba(77,163,255,0.12)',
    '--nav-active-bg':    '#111520',
    '--icon-filter':      'none',
  },
  office: {
    '--bg-default':       '#edf1fb',
    '--bg-elevation-one': '#dde3f5',
    '--bg-elevation-two': '#ffffff',
    '--border-default':   '#c8d0e8',
    '--border-accent':    '#a0aac8',
    '--fg-primary':       '#1a2040',
    '--fg-secondary':     '#4a5280',
    '--btn-sec-bg':       '#dbeafe',
    '--btn-sec-border':   '#93c5fd',
    '--btn-sec-fg':       '#1d4ed8',
    '--badge-success-bg': '#dcfce7',
    '--badge-success-border': '#86efac',
    '--badge-success-fg': '#16a34a',
    '--pill-bg':          '#e0f2fe',
    '--pill-border':      '#7dd3fc',
    '--pill-fg':          '#0369a1',
    '--input-bg':         '#ffffff',
    '--input-border':     '#c8d0e8',
    '--input-placeholder':'#9099b8',
    '--char-icon-bg':     'rgba(29,78,216,0.1)',
    '--nav-active-bg':    '#edf1fb',
    '--icon-filter':      'invert(0.6) sepia(1) saturate(0.5) hue-rotate(190deg) brightness(0.6)',
  },
  dusk: {
    '--bg-default':       '#1a1225',
    '--bg-elevation-one': '#221830',
    '--bg-elevation-two': '#2d2040',
    '--border-default':   '#3d2d58',
    '--border-accent':    '#6b5080',
    '--fg-primary':       '#e8dff5',
    '--fg-secondary':     '#b09cc8',
    '--btn-sec-bg':       '#2a1540',
    '--btn-sec-border':   '#7c3aed',
    '--btn-sec-fg':       '#c4b5fd',
    '--badge-success-bg': '#0a2a1f',
    '--badge-success-border': '#1f7f5c',
    '--badge-success-fg': '#34d399',
    '--pill-bg':          '#2d1a40',
    '--pill-border':      '#7c3aed',
    '--pill-fg':          '#e9d5ff',
    '--input-bg':         '#130e1e',
    '--input-border':     '#3d2d58',
    '--input-placeholder':'#7a6590',
    '--char-icon-bg':     'rgba(167,139,250,0.15)',
    '--nav-active-bg':    '#1a1225',
    '--icon-filter':      'none',
  },
}

function applyTheme(name) {
  const vars = THEMES[name]
  const root = document.documentElement
  Object.entries(vars).forEach(([k, v]) => root.style.setProperty(k, v))
}

// ─── Figma asset URLs ─────────────────────────────────────────────────────
const ASSETS = {
  logo:    'https://www.figma.com/api/mcp/asset/7a28f0c4-2d54-474c-8cd3-7d2ca111ea3c',
  wow:     'https://www.figma.com/api/mcp/asset/b426c896-e0d2-4970-8d8f-a22a4a68fb91',
  avatar:  'https://www.figma.com/api/mcp/asset/5610fbd9-c69a-4a4c-990d-00651447ef99',
  charIcon:'https://www.figma.com/api/mcp/asset/c2c6f901-e979-4b98-a897-8575dc7bf9c4',
  atlasIcon:'https://www.figma.com/api/mcp/asset/15afae1f-dc1f-4803-926d-790ea610d3c2',
  sidebarToggle:'https://www.figma.com/api/mcp/asset/ffaa7488-b70d-47a1-beba-9b9a2e02a38c',
  homeIcon:'https://www.figma.com/api/mcp/asset/6438938a-6933-4120-b862-443ce3992005',
  brainIcon:'https://www.figma.com/api/mcp/asset/50f14884-7e9a-4405-9c26-1219b6d28f20',
  bookIcon:'https://www.figma.com/api/mcp/asset/4e5aeb05-8422-4086-bd26-53bdaf3b6709',
  filterIcon:'https://www.figma.com/api/mcp/asset/7401beac-cbae-4fc3-ab33-1fb69dc343c9',
  chevron: 'https://www.figma.com/api/mcp/asset/1a09c031-124a-44fd-a963-02b994150b1d',
  sparkle: 'https://www.figma.com/api/mcp/asset/c8ee8090-bd20-4a66-b158-781ba4633e00',
  guideIcon:'https://www.figma.com/api/mcp/asset/9f0c814e-39dd-42d6-8bbb-6a2b85a553eb',
  logIcon: 'https://www.figma.com/api/mcp/asset/a6559edf-5de6-4cb1-8a42-6ab94972d903',
  refreshIcon:'https://www.figma.com/api/mcp/asset/e40b032f-c75e-41c9-a99c-c4f8e867952b',
  keyIcon: 'https://www.figma.com/api/mcp/asset/3f815a01-3932-4670-a40a-7702681b0ea7',
  towerIcon:'https://www.figma.com/api/mcp/asset/2f9839fa-c858-4783-803d-86b52776ddd0',
  swordsIcon:'https://www.figma.com/api/mcp/asset/8f7c9ddc-f74f-4253-8c13-c41974127ad1',
  micIcon: 'https://www.figma.com/api/mcp/asset/663ef85e-117b-4b88-8837-95c953fbc69a',
}

// No API — responses are served from atlasResponses.js (static, zero cost)

// ─── Sidebar ──────────────────────────────────────────────────────────────
function Sidebar({ page, setPage, collapsed, setCollapsed }) {
  return (
    <div style={{
      width: collapsed ? 44 : 208, flexShrink: 0, height: '100%', display: 'flex', flexDirection: 'column',
      background: 'var(--bg-elevation-one)', overflow: 'hidden',
      transition: 'width 0.2s ease',
    }}>
      {/* Header */}
      <div style={{ display:'flex', alignItems:'center', justifyContent: collapsed ? 'center' : 'space-between', padding:8, flexShrink:0 }}>
        {!collapsed && (
          <div style={{ display:'flex', alignItems:'center', gap:8 }}>
            <div style={{ width:30, height:29, borderRadius:8, overflow:'hidden', background:'var(--bg-elevation-one)', flexShrink:0 }}>
              <img src={ASSETS.logo} style={{ width:'100%', height:'100%', objectFit:'cover' }} alt="Atlas" />
            </div>
            <span style={{ fontFamily:'var(--font-secondary)', fontWeight:600, fontSize:16, color:'var(--fg-primary)', whiteSpace:'nowrap' }}>
              Welcome
            </span>
          </div>
        )}
        <img
          src={ASSETS.sidebarToggle}
          onClick={() => setCollapsed(!collapsed)}
          className="ui-icon"
          style={{ width:17, height:17, cursor:'pointer', opacity:.7, flexShrink:0 }}
          alt="Toggle sidebar"
        />
      </div>

      {/* Nav — hidden when collapsed */}
      {!collapsed && (
      <div style={{ flex:1, padding:'16px 8px', display:'flex', flexDirection:'column', justifyContent:'space-between' }}>
        <div style={{ display:'flex', flexDirection:'column', gap:8 }}>
          {[
            { key:'home',     label:'Home',      icon: ASSETS.homeIcon },
            { key:'knowledge',label:'Knowledge', icon: ASSETS.brainIcon },
            { key:'logs',     label:'Logs',      icon: ASSETS.bookIcon },
            { key:'settings', label:'Settings',  icon: ASSETS.filterIcon },
          ].map(item => {
            const active = page === item.key
            const clickable = item.key === 'home' || item.key === 'settings'
            return (
              <button key={item.key} onClick={() => clickable && setPage(item.key)} style={{
                display:'flex', alignItems:'center', gap:12, height:37,
                padding:'0 16px', borderRadius:6, width:'100%', textAlign:'left',
                background: active ? 'var(--bg-default)' : 'transparent',
                cursor: clickable ? 'pointer' : 'default',
                opacity: (!clickable && !active) ? .5 : 1,
              }}>
                <img src={item.icon} className="ui-icon" style={{ width:16, height:16, flexShrink:0 }} alt="" />
                <span style={{ fontFamily:'var(--font-secondary)', fontWeight:600, fontSize:14, color:'var(--fg-primary)' }}>
                  {item.label}
                </span>
              </button>
            )
          })}
        </div>

        {/* PC Performance */}
        <div style={{ display:'flex', flexDirection:'column', gap:8 }}>
          {[
            { label:'CPU', value:'34%' },
            { label:'GPU', value:'72%' },
            { label:'Memory', value:'58%' },
          ].map(stat => (
            <div key={stat.label} style={{ display:'flex', alignItems:'center', justifyContent:'space-between', height:21 }}>
              <span style={{ fontFamily:'var(--font-primary)', fontWeight:500, fontSize:12, color:'var(--fg-primary)', textTransform:'uppercase' }}>
                {stat.label}
              </span>
              <span style={{ fontFamily:'var(--font-primary)', fontSize:12, color:'var(--fg-secondary)' }}>
                {stat.value}
              </span>
            </div>
          ))}
        </div>
      </div>
      )} {/* end collapsed check */}

      {/* Footer — hidden when collapsed */}
      {!collapsed && (
      <div style={{ borderTop:'1px solid var(--border-default)', background:'var(--bg-elevation-one)' }}>
        {/* Active Game */}
        <div style={{ display:'flex', gap:8, padding:12, alignItems:'flex-start' }}>
          <div style={{ width:32, height:32, flexShrink:0 }}>
            <img src={ASSETS.wow} style={{ width:'100%', height:'100%', objectFit:'cover' }} alt="WoW" />
          </div>
          <div style={{ flex:1, display:'flex', alignItems:'center', gap:8, minWidth:0 }}>
            <div style={{ flex:1, minWidth:0 }}>
              <div style={{ fontFamily:'var(--font-primary)', fontWeight:500, fontSize:8, color:'var(--fg-primary)', textTransform:'capitalize', lineHeight:'12px' }}>
                Current Game
              </div>
              <div style={{ fontFamily:'var(--font-primary)', fontWeight:500, fontSize:12, color:'var(--fg-primary)', lineHeight:'16px' }}>
                World of Warcraft
              </div>
            </div>
            <img src={ASSETS.chevron} className="ui-icon" style={{ width:12, height:12, flexShrink:0 }} alt="" />
          </div>
        </div>
        {/* User */}
        <div style={{ display:'flex', gap:8, padding:12, alignItems:'center' }}>
          <img src={ASSETS.avatar} style={{ width:32, height:32, borderRadius:128, objectFit:'cover', flexShrink:0 }} alt="User" />
          <span style={{ fontFamily:'var(--font-primary)', fontSize:14, color:'var(--fg-primary)' }}>User1</span>
        </div>
      </div>
      )} {/* end collapsed check */}
    </div>
  )
}

// ─── Character Card ───────────────────────────────────────────────────────
function CharacterCard() {
  return (
    <div style={{
      background:'var(--bg-elevation-one)', border:'1px solid var(--border-default)',
      borderRadius:16, padding:16, display:'flex', flexDirection:'column', gap:16,
      width:280, flexShrink:0, alignSelf:'stretch',
      boxShadow:'0px 4px 3px rgba(0,0,0,0.09)',
    }}>
      {/* Header */}
      <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between' }}>
        <div style={{ display:'flex', gap:12, alignItems:'flex-start', width:152 }}>
          <div style={{
            width:44, height:44, borderRadius:6, flexShrink:0,
            background:'var(--char-icon-bg)', display:'flex', alignItems:'center', justifyContent:'center', padding:4,
          }}>
            <img src={ASSETS.charIcon} style={{ width:'100%', height:'100%', objectFit:'cover', borderRadius:4 }} alt="" />
          </div>
          <div style={{ display:'flex', flexDirection:'column', gap:4 }}>
            <span style={{ fontFamily:'var(--font-secondary)', fontWeight:600, fontSize:16, color:'var(--fg-primary)', lineHeight:'24px' }}>
              Lorath
            </span>
            <div style={{ display:'flex', alignItems:'center', fontSize:12, color:'var(--fg-secondary)', lineHeight:'normal' }}>
              <span>Illidan</span>
              <span style={{ margin:'0 2px' }}>•</span>
              <span>Alliance</span>
            </div>
          </div>
        </div>
        <button style={{
          background:'var(--btn-sec-bg)', border:'1px solid var(--btn-sec-border)',
          borderRadius:8, padding:'4px 8px',
          fontFamily:'var(--font-primary)', fontWeight:500, fontSize:12, color:'var(--btn-sec-fg)',
          cursor:'pointer',
        }}>Change</button>
      </div>

      {/* Stats */}
      <div style={{ display:'flex', flexDirection:'column', gap:8 }}>
        {[
          { label:'Item Level',    value:'252' },
          { label:'Class',         value:'Mage' },
          { label:'Specialization',value:'Frost' },
          { label:'Raider.IO',     value:'1,400' },
        ].map((row, i, arr) => (
          <div key={row.label}>
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', whiteSpace:'nowrap' }}>
              <span style={{ fontFamily:'var(--font-primary)', fontWeight:500, fontSize:12, color:'var(--fg-secondary)', lineHeight:'16px' }}>
                {row.label}
              </span>
              <span style={{ fontFamily:'var(--font-secondary)', fontWeight:600, fontSize:14, color:'var(--fg-primary)', lineHeight:'20px' }}>
                {row.value}
              </span>
            </div>
            {i < arr.length - 1 && (
              <div style={{ height:1, background:'var(--border-accent)', marginTop:8 }} />
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

// ─── Quick Action Card ────────────────────────────────────────────────────
function QuickActionCard({ onActionClick }) {
  const actions = [
    { title:'Check For Class Tuning',                      source:'Blizzard Forums' },
    { title:'Help Plan Session Out (M+, Dailies, Weeklies)',source:'Atlas' },
    { title:'Class Rotation and Stat Priority',            source:'Icy Veins' },
  ]
  return (
    <div style={{
      background:'var(--bg-elevation-one)', border:'1px solid var(--border-default)',
      borderRadius:16, padding:16, display:'flex', flexDirection:'column', gap:16,
      flex:1, minWidth:0, alignSelf:'stretch',
      boxShadow:'0px 4px 3px rgba(0,0,0,0.09)',
    }}>
      <div style={{ display:'flex', alignItems:'center', gap:8, height:21 }}>
        <img src={ASSETS.sparkle} className="ui-icon" style={{ width:16, height:16 }} alt="" />
        <span style={{ fontFamily:'var(--font-secondary)', fontWeight:600, fontSize:16, color:'var(--fg-primary)', lineHeight:'24px' }}>
          Quick Actions
        </span>
      </div>
      <div style={{ display:'flex', flexDirection:'column', gap:8 }}>
        {actions.map(a => (
          <button key={a.title} onClick={() => onActionClick(a.title)} style={{
            background:'var(--bg-elevation-two)', border:'1px solid var(--border-accent)',
            borderRadius:8, padding:'8px 16px', textAlign:'left', width:'100%', cursor:'pointer',
            display:'flex', flexDirection:'column', gap:8,
          }}>
            <span style={{ fontFamily:'var(--font-secondary)', fontWeight:600, fontSize:14, color:'var(--fg-primary)', lineHeight:'20px', display:'block', width:'100%' }}>
              {a.title}
            </span>
            <span style={{ fontFamily:'var(--font-primary)', fontWeight:500, fontSize:12, color:'var(--fg-secondary)', lineHeight:'16px', whiteSpace:'nowrap' }}>
              {a.source}
            </span>
          </button>
        ))}
      </div>
    </div>
  )
}

// ─── Recent Guides Card ───────────────────────────────────────────────────
function RecentGuidesCard() {
  const guides = [
    { title:'Frost Mage Spellslinger Build - M+', source:'Archon.gg', time:'2 hours ago' },
    { title:'Frost Mage Rotation - Raid',          source:'Archon.gg', time:'2 hours ago' },
    { title:'Frost Mage - Crafted Gear',           source:'Archon.gg', time:'2 hours ago' },
  ]
  return (
    <div style={{
      background:'var(--bg-elevation-one)', border:'1px solid var(--border-default)',
      borderRadius:16, padding:16, display:'flex', flexDirection:'column', gap:16, width:'100%',
      boxShadow:'0px 4px 3px rgba(0,0,0,0.09)',
    }}>
      <div style={{ display:'flex', alignItems:'center', gap:8 }}>
        <img src={ASSETS.guideIcon} className="ui-icon" style={{ width:16, height:16 }} alt="" />
        <span style={{ fontFamily:'var(--font-secondary)', fontWeight:600, fontSize:16, color:'var(--fg-primary)', lineHeight:'24px' }}>
          Recent Guides & Knowledge
        </span>
      </div>
      <div style={{ display:'flex', flexDirection:'column', gap:8 }}>
        {guides.map(g => (
          <div key={g.title} style={{
            background:'var(--bg-elevation-two)', border:'1px solid var(--border-accent)',
            borderRadius:8, height:56, display:'flex', alignItems:'center',
            padding:'8px 24px', gap:8,
          }}>
            <div style={{ display:'flex', flexDirection:'column', gap:2, flex:1, minWidth:0 }}>
              <span style={{ fontFamily:'var(--font-secondary)', fontWeight:600, fontSize:14, color:'var(--fg-primary)', lineHeight:'20px', whiteSpace:'nowrap' }}>
                {g.title}
              </span>
              <div style={{ display:'flex', gap:8, alignItems:'center', color:'var(--fg-secondary)', whiteSpace:'nowrap' }}>
                <span style={{ fontFamily:'var(--font-primary)', fontWeight:500, fontSize:12, lineHeight:'16px' }}>{g.source}</span>
                <span style={{ fontSize:11 }}>·</span>
                <span style={{ fontFamily:'var(--font-primary)', fontWeight:500, fontSize:12, lineHeight:'16px' }}>{g.time}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
      <div style={{ display:'flex', alignItems:'center', justifyContent:'center' }}>
        <span style={{ fontFamily:'var(--font-secondary)', fontWeight:600, fontSize:14, color:'var(--fg-primary)', lineHeight:'20px', cursor:'pointer' }}>
          View Knowledge Base
        </span>
      </div>
    </div>
  )
}

// ─── Recent Logs Card ─────────────────────────────────────────────────────
function RecentLogsCard() {
  const logs = [
    { title:'Magisters Terrace - 10',       type:'Mythic+', time:'2 hours ago', icon: ASSETS.keyIcon,    iconSize:{ w:24, h:24 } },
    { title:'Voidspire — Crown of the Cosmos',type:'Raid',  time:'4 hours ago', icon: ASSETS.towerIcon,  iconSize:{ w:18, h:20 } },
    { title:'Slayers Rise',                  type:'PVP',    time:'1 day Ago',   icon: ASSETS.swordsIcon, iconSize:{ w:21, h:21 } },
  ]
  return (
    <div style={{
      background:'var(--bg-elevation-one)', border:'1px solid var(--border-default)',
      borderRadius:16, padding:16, display:'flex', flexDirection:'column', gap:16, width:'100%',
      boxShadow:'0px 4px 3px rgba(0,0,0,0.09)',
    }}>
      <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between' }}>
        <div style={{ display:'flex', alignItems:'center', gap:8 }}>
          <img src={ASSETS.logIcon} className="ui-icon" style={{ width:15, height:14 }} alt="" />
          <span style={{ fontFamily:'var(--font-secondary)', fontWeight:600, fontSize:16, color:'var(--fg-primary)', lineHeight:'24px' }}>
            Recent Logs
          </span>
        </div>
        <img src={ASSETS.refreshIcon} className="ui-icon" style={{ width:23, height:16, cursor:'pointer', opacity:.7 }} alt="" />
      </div>
      <div style={{ display:'flex', flexDirection:'column', gap:8 }}>
        {logs.map(l => (
          <div key={l.title} style={{
            background:'var(--bg-elevation-two)', border:'1px solid var(--border-accent)',
            borderRadius:8, height:56, display:'flex', alignItems:'center', padding:8, gap:8,
          }}>
            <div style={{ width:40, height:40, borderRadius:6, flexShrink:0, display:'flex', alignItems:'center', justifyContent:'center' }}>
              <img src={l.icon} className="ui-icon" style={{ width:l.iconSize.w, height:l.iconSize.h }} alt="" />
            </div>
            <div style={{ display:'flex', flexDirection:'column', gap:2, flex:1, minWidth:0 }}>
              <span style={{ fontFamily:'var(--font-secondary)', fontWeight:600, fontSize:14, color:'var(--fg-primary)', lineHeight:'20px', whiteSpace:'nowrap' }}>
                {l.title}
              </span>
              <div style={{ display:'flex', gap:8, alignItems:'center', color:'var(--fg-secondary)', whiteSpace:'nowrap' }}>
                <span style={{ fontFamily:'var(--font-primary)', fontWeight:500, fontSize:12, lineHeight:'16px' }}>{l.type}</span>
                <span style={{ fontSize:11 }}>·</span>
                <span style={{ fontFamily:'var(--font-primary)', fontWeight:500, fontSize:12, lineHeight:'16px' }}>{l.time}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
      <div style={{ display:'flex', alignItems:'center', justifyContent:'center' }}>
        <span style={{ fontFamily:'var(--font-secondary)', fontWeight:600, fontSize:14, color:'var(--fg-primary)', lineHeight:'20px', cursor:'pointer' }}>
          View More
        </span>
      </div>
    </div>
  )
}

// ─── Home Dashboard ───────────────────────────────────────────────────────
function HomeDashboard({ onActionClick }) {
  return (
    <div style={{
      background:'var(--bg-default)', border:'0.5px solid var(--border-accent)',
      borderRadius:24, flex:1, minWidth:0, height:'100%',
      overflowX:'clip', overflowY:'auto',
    }}>
      <div style={{ padding:16, display:'flex', flexDirection:'column', gap:16, minHeight:925 }}>
        {/* Top row */}
        <div style={{ display:'flex', gap:16, alignItems:'flex-start' }}>
          <CharacterCard />
          <QuickActionCard onActionClick={onActionClick} />
        </div>
        {/* Recents row */}
        <div style={{ display:'flex', flexDirection:'column', gap:16 }}>
          <RecentGuidesCard />
          <RecentLogsCard />
        </div>
      </div>
    </div>
  )
}

// ─── Settings Page ────────────────────────────────────────────────────────
function Toggle({ defaultOn = false }) {
  const [on, setOn] = useState(defaultOn)
  return (
    <button onClick={() => setOn(!on)} style={{
      width:36, height:20, borderRadius:10, flexShrink:0, cursor:'pointer',
      background: on ? '#3b82f6' : 'rgba(255,255,255,0.15)',
      position:'relative', transition:'background .2s',
    }}>
      <span style={{
        position:'absolute', top:2, left: on ? 18 : 2,
        width:16, height:16, borderRadius:'50%', background:'#fff',
        transition:'left .2s', boxShadow:'0 1px 3px rgba(0,0,0,.4)',
      }} />
    </button>
  )
}

function SettingsPage({ theme, setTheme }) {
  const toggles = [
    { label:'Data Privacy Controls',  desc:'Limit data sent to AI services', defaultOn:true },
    { label:'AI Accuracy Feedback',   desc:'Allow rating responses for improvement' },
    { label:'Performance Mode',       desc:'Reduce AI resource usage during gameplay' },
    { label:'Hint Mode',              desc:'Give hints instead of full answers' },
  ]
  const keybinds = [
    { label:'Summon Overlay',  desc:'Pulls up the in-game overlay.', keys:'Shift + Q' },
    { label:'Text Command',    desc:'Allows you to control Atlas in game with Text.', keys:'Shift + /' },
    { label:'Voice Command',   desc:'Allows you to control Atlas in game with Voice.', keys:'~' },
  ]
  const themes = [
    { key:'midnight', name:'Midnight', desc:'The default Atlas theme, inherently dark.' },
    { key:'office',   name:'Office',   desc:"If you want to relieve the days of Microsoft Office's blinding UI, this one is for you." },
    { key:'dusk',     name:'Dusk',     desc:"A slightly more colorful version of Midnight, are you that scared of the dark?" },
  ]

  return (
    <div style={{
      background:'var(--bg-default)', border:'0.5px solid var(--border-accent)',
      borderRadius:24, flex:1, minWidth:0, height:'100%',
      overflowX:'clip', overflowY:'auto',
    }}>
      <div style={{ padding:16, display:'flex', flexDirection:'column', gap:16 }}>
        {/* Row 1 */}
        <div style={{ display:'flex', gap:16 }}>
          {/* System Performance */}
          <div style={{
            background:'var(--bg-elevation-one)', border:'1px solid var(--border-default)',
            borderRadius:16, padding:16, flex:1, display:'flex', flexDirection:'column', gap:16,
            boxShadow:'0px 4px 3px rgba(0,0,0,0.09)',
          }}>
            <div style={{ display:'flex', alignItems:'center', gap:8 }}>
              <span style={{ fontFamily:'var(--font-secondary)', fontWeight:600, fontSize:16, color:'var(--fg-primary)' }}>
                System Performance
              </span>
            </div>
            {[
              { label:'CPU',    value:34, color:'#4da3ff' },
              { label:'GPU',    value:72, color:'#f59e0b' },
              { label:'Memory', value:58, color:'#a78bfa' },
            ].map(s => (
              <div key={s.label} style={{ display:'flex', alignItems:'center', gap:8 }}>
                <span style={{ fontFamily:'var(--font-primary)', fontWeight:500, fontSize:12, color:'var(--fg-primary)', width:60, textTransform:'uppercase' }}>{s.label}</span>
                <div style={{ flex:1, height:5, background:'rgba(255,255,255,.06)', borderRadius:10, overflow:'hidden' }}>
                  <div style={{ width:`${s.value}%`, height:'100%', background:s.color, borderRadius:10 }} />
                </div>
                <span style={{ fontFamily:'var(--font-primary)', fontSize:12, color:'var(--fg-secondary)', width:32, textAlign:'right' }}>{s.value}%</span>
              </div>
            ))}
          </div>

          {/* Keybinds */}
          <div style={{
            background:'var(--bg-elevation-one)', border:'1px solid var(--border-default)',
            borderRadius:16, padding:16, flex:1, display:'flex', flexDirection:'column', gap:12,
            boxShadow:'0px 4px 3px rgba(0,0,0,0.09)',
          }}>
            <span style={{ fontFamily:'var(--font-secondary)', fontWeight:600, fontSize:16, color:'var(--fg-primary)' }}>Keybinds</span>
            <p style={{ fontFamily:'var(--font-primary)', fontSize:12, color:'var(--fg-secondary)', lineHeight:'16px' }}>
              To assign a keybind, click the container and then press a key to assign it.
            </p>
            {keybinds.map(k => (
              <div key={k.label} style={{ display:'flex', alignItems:'center', justifyContent:'space-between', gap:12 }}>
                <div>
                  <div style={{ fontFamily:'var(--font-secondary)', fontWeight:600, fontSize:14, color:'var(--fg-primary)', lineHeight:'20px' }}>{k.label}</div>
                  <div style={{ fontFamily:'var(--font-primary)', fontSize:12, color:'var(--fg-secondary)', lineHeight:'16px' }}>{k.desc}</div>
                </div>
                <button style={{
                  background:'var(--bg-elevation-two)', border:'1px solid var(--border-accent)',
                  borderRadius:6, padding:'6px 12px', flexShrink:0,
                  fontFamily:'var(--font-primary)', fontWeight:500, fontSize:13, color:'var(--fg-primary)',
                  cursor:'pointer', whiteSpace:'nowrap',
                }}>{k.keys}</button>
              </div>
            ))}
          </div>
        </div>

        {/* Row 2 */}
        <div style={{ display:'flex', gap:16 }}>
          {/* Assistant Settings */}
          <div style={{
            background:'var(--bg-elevation-one)', border:'1px solid var(--border-default)',
            borderRadius:16, padding:16, flex:1, display:'flex', flexDirection:'column', gap:4,
            boxShadow:'0px 4px 3px rgba(0,0,0,0.09)',
          }}>
            <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:8 }}>
              <span style={{ fontFamily:'var(--font-secondary)', fontWeight:600, fontSize:16, color:'var(--fg-primary)' }}>Assistant Settings</span>
            </div>
            {toggles.map(t => (
              <div key={t.label} style={{ display:'flex', alignItems:'center', gap:12, padding:'10px 0', borderBottom:'1px solid var(--border-default)' }}>
                <div style={{ width:32, height:32, borderRadius:8, background:'var(--bg-elevation-two)', flexShrink:0, display:'flex', alignItems:'center', justifyContent:'center' }}>
                  <span style={{ fontSize:16 }}>⊙</span>
                </div>
                <div style={{ flex:1, minWidth:0 }}>
                  <div style={{ fontFamily:'var(--font-secondary)', fontWeight:600, fontSize:14, color:'var(--fg-primary)', lineHeight:'20px' }}>{t.label}</div>
                  <div style={{ fontFamily:'var(--font-primary)', fontSize:12, color:'var(--fg-secondary)', lineHeight:'16px' }}>{t.desc}</div>
                </div>
                <Toggle defaultOn={t.defaultOn} />
              </div>
            ))}
          </div>

          {/* Atlas Themes */}
          <div style={{
            background:'var(--bg-elevation-one)', border:'1px solid var(--border-default)',
            borderRadius:16, padding:16, flex:1, display:'flex', flexDirection:'column', gap:12,
            boxShadow:'0px 4px 3px rgba(0,0,0,0.09)',
          }}>
            <span style={{ fontFamily:'var(--font-secondary)', fontWeight:600, fontSize:16, color:'var(--fg-primary)' }}>Atlas Themes</span>
            <p style={{ fontFamily:'var(--font-primary)', fontSize:12, color:'var(--fg-secondary)', lineHeight:'16px' }}>
              Change it up, make Atlas feel like yours.
            </p>
            {themes.map(t => (
              <div key={t.key} style={{ display:'flex', alignItems:'center', justifyContent:'space-between', gap:12 }}>
                <div>
                  <div style={{ fontFamily:'var(--font-secondary)', fontWeight:600, fontSize:14, color:'var(--fg-primary)', lineHeight:'20px' }}>{t.name}</div>
                  <div style={{ fontFamily:'var(--font-primary)', fontSize:12, color:'var(--fg-secondary)', lineHeight:'16px', maxWidth:220 }}>{t.desc}</div>
                </div>
                {theme === t.key ? (
                  <button style={{
                    background:'var(--btn-sec-bg)', border:'1px solid var(--btn-sec-border)',
                    borderRadius:8, padding:'6px 12px', flexShrink:0,
                    fontFamily:'var(--font-primary)', fontWeight:500, fontSize:12, color:'var(--btn-sec-fg)',
                    cursor:'default', whiteSpace:'nowrap',
                  }}>Current Theme</button>
                ) : (
                  <button onClick={() => setTheme(t.key)} style={{
                    background:'var(--bg-elevation-two)', border:'1px solid var(--border-accent)',
                    borderRadius:8, padding:'6px 12px', flexShrink:0,
                    fontFamily:'var(--font-primary)', fontWeight:500, fontSize:12, color:'var(--fg-primary)',
                    cursor:'pointer', whiteSpace:'nowrap',
                    transition:'background 0.15s, border-color 0.15s',
                  }}>Select</button>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

// ─── Chat Panel ───────────────────────────────────────────────────────────
const QUICK_PROMPTS = [
  'What Are Todays Bountiful Delves?',
  'Best Build for Mythic+?',
  'Best in Slot Weapon for Frost Mage',
]

function PromptPill({ text, onClick }) {
  return (
    <button onClick={() => onClick(text)} style={{
      background:'var(--pill-bg)', border:'1px solid var(--pill-border)',
      borderRadius:4, padding:'4px 8px',
      fontFamily:'var(--font-primary)', fontSize:14, color:'var(--pill-fg)',
      cursor:'pointer', whiteSpace:'nowrap', lineHeight:'20px',
    }}>{text}</button>
  )
}

function ChatPanel({ messages, isThinking, inputValue, setInputValue, onSend }) {
  const feedRef = useRef(null)
  useEffect(() => {
    if (feedRef.current) feedRef.current.scrollTop = feedRef.current.scrollHeight
  }, [messages, isThinking])

  return (
    <div style={{
      flex:'0 0 280px', width:280, height:'100%', display:'flex', flexDirection:'column',
      background:'var(--bg-elevation-one)',
    }}>
      {/* Header */}
      <div style={{ padding:'16px 8px', display:'flex', alignItems:'center', justifyContent:'space-between', borderBottom:'1px solid var(--border-default)' }}>
        <div style={{ display:'flex', alignItems:'center', gap:16 }}>
          <div style={{ width:32, height:32, borderRadius:'50%', background:'rgba(99,102,241,0.2)', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
            <img src={ASSETS.atlasIcon} style={{ width:32, height:32, objectFit:'cover' }} alt="Atlas" />
          </div>
          <span style={{ fontFamily:'var(--font-secondary)', fontWeight:600, fontSize:16, color:'var(--fg-primary)', whiteSpace:'nowrap' }}>
            Atlas Command
          </span>
        </div>
        <div style={{
          background:'var(--badge-success-bg)', border:'1px solid var(--badge-success-border)',
          borderRadius:12, padding:'4px 8px', display:'flex', alignItems:'center', gap:8,
        }}>
          <div style={{ width:4, height:4, borderRadius:'50%', background:'var(--badge-success-fg)', flexShrink:0 }} />
          <span style={{ fontFamily:'var(--font-primary)', fontWeight:500, fontSize:8, color:'var(--badge-success-fg)', textTransform:'uppercase', lineHeight:'12px', whiteSpace:'nowrap' }}>
            Connected
          </span>
        </div>
      </div>

      {/* Message feed */}
      <div ref={feedRef} style={{ flex:1, overflowY:'auto', padding:'12px 8px 12px 16px', display:'flex', flexDirection:'column', gap:16 }}>
        {/* Default Atlas intro message */}
        {messages.length === 0 && (
          <div style={{ display:'flex', alignItems:'flex-start', justifyContent:'space-between' }}>
            <div style={{
              width:24, height:24, borderRadius:'50%', flexShrink:0,
              background:'var(--bg-elevation-one)', border:'1px solid var(--border-default)',
              display:'flex', alignItems:'center', justifyContent:'center',
            }}>
              <img src={ASSETS.atlasIcon} style={{ width:24, height:24, objectFit:'cover' }} alt="" />
            </div>
            <div style={{
              background:'var(--bg-default)', borderRadius:8,
              padding:'8px 12px', maxWidth:267,
            }}>
              <p style={{ fontFamily:'var(--font-primary)', fontSize:14, color:'var(--fg-secondary)', lineHeight:'20px' }}>
                Hey there! I'm your AI gaming co-pilot. Ask me anything about your current game. Quests, builds, crafting, or strategies. I'm here when you need me.
              </p>
            </div>
          </div>
        )}
        {messages.map((m, i) => {
          const isUser = m.role === 'user'
          return (
            <div key={i} style={{ display:'flex', alignItems:'flex-start', gap:8, flexDirection: isUser ? 'row-reverse' : 'row', animation:'fadeUp .2s ease' }}>
              {!isUser && (
                <div style={{ width:24, height:24, borderRadius:'50%', flexShrink:0, background:'var(--bg-elevation-one)', border:'1px solid var(--border-default)', display:'flex', alignItems:'center', justifyContent:'center' }}>
                  <img src={ASSETS.atlasIcon} style={{ width:24, height:24 }} alt="" />
                </div>
              )}
              <div style={{
                background: isUser ? 'var(--bg-elevation-two)' : 'var(--bg-default)',
                borderRadius:8, padding:'8px 12px', maxWidth:240,
                fontFamily:'var(--font-primary)', fontSize:14, color:'var(--fg-secondary)', lineHeight:'20px',
              }}>
                {m.content}
              </div>
            </div>
          )
        })}
        {isThinking && (
          <div style={{ display:'flex', alignItems:'flex-start', gap:8 }}>
            <div style={{ width:24, height:24, borderRadius:'50%', flexShrink:0, background:'var(--bg-elevation-one)', border:'1px solid var(--border-default)', display:'flex', alignItems:'center', justifyContent:'center' }}>
              <img src={ASSETS.atlasIcon} style={{ width:24, height:24 }} alt="" />
            </div>
            <div style={{ background:'var(--bg-default)', borderRadius:8, padding:'12px', display:'flex', gap:4, alignItems:'center' }}>
              {[0,1,2].map(i => (
                <span key={i} style={{ width:6, height:6, borderRadius:'50%', background:'var(--fg-secondary)', display:'inline-block', animation:`bounce 1.2s ${i*.2}s infinite` }} />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Quick prompts */}
      <div style={{ padding:'16px 8px', borderTop:'1px solid var(--border-default)', display:'flex', flexDirection:'column', gap:8 }}>
        <span style={{ fontFamily:'var(--font-primary)', fontSize:12, color:'var(--fg-secondary)', lineHeight:'16px' }}>
          Quick prompts
        </span>
        <div style={{ display:'flex', flexWrap:'wrap', gap:8 }}>
          {QUICK_PROMPTS.map(p => <PromptPill key={p} text={p} onClick={onSend} />)}
        </div>
      </div>

      {/* Input */}
      <div style={{ padding:'16px 16px 16px 8px', borderTop:'1px solid var(--border-default)' }}>
        <div style={{
          background:'var(--input-bg)', border:'1px solid var(--input-border)',
          borderRadius:8, padding:'12px 14px', display:'flex', alignItems:'center', gap:8,
        }}>
          <input
            value={inputValue}
            onChange={e => setInputValue(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && !e.shiftKey && (e.preventDefault(), onSend(inputValue))}
            placeholder="Command Atlas..."
            style={{
              flex:1, background:'transparent', border:'none', outline:'none',
              fontFamily:'var(--font-primary)', fontSize:14, color:'var(--fg-primary)', lineHeight:'20px',
            }}
          />
          <img src={ASSETS.micIcon} className="ui-icon" style={{ width:24, height:24, cursor:'pointer', opacity:.6 }} alt="" />
        </div>
      </div>
    </div>
  )
}

// ─── Main content wrapper ─────────────────────────────────────────────────
function MainContent({ page, onActionClick, theme, setTheme }) {
  return (
    <div style={{ flex:1, minWidth:0, height:'100%', display:'flex', padding:'12px 8px', gap:0 }}>
      {page === 'home'
        ? <HomeDashboard onActionClick={onActionClick} />
        : <SettingsPage theme={theme} setTheme={setTheme} />
      }
    </div>
  )
}

// ─── App ──────────────────────────────────────────────────────────────────
export default function App() {
  const [page, setPage] = useState('home')
  const [collapsed, setCollapsed] = useState(false)
  const [theme, setTheme] = useState('midnight')
  const [messages, setMessages] = useState([])
  const [isThinking, setIsThinking] = useState(false)
  const [inputValue, setInputValue] = useState('')

  const sendMessage = async (text) => {
    const trimmed = (text || inputValue).trim()
    if (!trimmed) return
    setInputValue('')
    const userMsg = { role:'user', content:trimmed }
    setMessages(prev => [...prev, userMsg])
    setIsThinking(true)
    // Realistic thinking delay (800ms–1.4s)
    const delay = 800 + Math.random() * 600
    await new Promise(r => setTimeout(r, delay))
    const reply = getStaticResponse(trimmed)
    setMessages(prev => [...prev, { role:'assistant', content:reply }])
    setIsThinking(false)
  }

  return (
    <div style={{ width:'100%', height:'100%', display:'flex', overflow:'hidden', background:'var(--bg-elevation-one)' }}>
      <Sidebar page={page} setPage={setPage} collapsed={collapsed} setCollapsed={setCollapsed} />
      <MainContent page={page} onActionClick={sendMessage} theme={theme} setTheme={(t) => { setTheme(t); applyTheme(t) }} />
      <ChatPanel
        messages={messages}
        isThinking={isThinking}
        inputValue={inputValue}
        setInputValue={setInputValue}
        onSend={sendMessage}
      />
    </div>
  )
}
