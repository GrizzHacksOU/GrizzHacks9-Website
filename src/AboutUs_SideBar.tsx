import { useState } from 'react'
import './HelpMenu.css'

type Page = { id: string; title: string; body: string[] }

const rainbow = ['#4a5bff', '#1fa3ff', '#19d3c5', '#4cd137', '#ffd400', '#ff8a00', '#ff2d55', '#ff2fd0', '#a640ff', '#6a3dff']

const pages: Page[] = [
  {
    id: 'welcome',
    title: 'Welcome',
    body: ['Placeholder text for the Welcome page.', 'Add your own information here later.'],
  },
  {
    id: 'about',
    title: 'About Us',
    body: ['Placeholder text for the About Us page.', 'Add your own information here later.'],
  },
  {
    id: 'contact',
    title: 'Contact',
    body: ['Placeholder text for the Contact page.', 'Add your own information here later.'],
  },
]

type Tab = 'contents' | 'index' | 'search'

export default function SideBar() {
  const [open, setOpen] = useState(false)
  const [tab, setTab] = useState<Tab>('contents')
  const [selectedId, setSelectedId] = useState(pages[0].id)
  const [query, setQuery] = useState('')

  const selected = pages.find((p) => p.id === selectedId) ?? pages[0]

  const sortedPages = [...pages].sort((a, b) => a.title.localeCompare(b.title))
  const results = pages.filter((p) =>
    (p.title + ' ' + p.body.join(' ')).toLowerCase().includes(query.toLowerCase())
  )

  const renderList = (list: Page[]) => (
    <ul className="hm-list">
      {list.map((p) => (
        <li key={p.id}>
          <button
            className={p.id === selectedId ? 'hm-item active' : 'hm-item'}
            onClick={() => setSelectedId(p.id)}
          >
            <span
                className="hm-icon"
                style={{ ['--c' as string]: rainbow[pages.indexOf(p) % rainbow.length] }}
            />
            {p.title}
          </button>
        </li>
      ))}
    </ul>
  )

  return (
    <>
      <button className="hm-burger" onClick={() => setOpen(!open)} aria-label="Toggle menu">
        <span /><span /><span />
      </button>

      {open && (
        <div className="hm-window">
          <div className="hm-titlebar">
            <span>Help Topics</span>
            <button className="hm-close" onClick={() => setOpen(false)} aria-label="Close">
              X
            </button>
          </div>

          <div className="hm-body">
            <div className="hm-left">
              <div className="hm-tabs">
                {(['contents', 'index', 'search'] as Tab[]).map((t) => (
                  <button
                    key={t}
                    className={t === tab ? 'hm-tab active' : 'hm-tab'}
                    onClick={() => setTab(t)}
                  >
                    {t[0].toUpperCase() + t.slice(1)}
                  </button>
                ))}
              </div>

              <div className="hm-panel">
                {tab === 'contents' && renderList(pages)}
                {tab === 'index' && renderList(sortedPages)}
                {tab === 'search' && (
                  <>
                    <input
                      className="hm-search"
                      placeholder="Type a word..."
                      value={query}
                      onChange={(e) => setQuery(e.target.value)}
                    />
                    {renderList(results)}
                  </>
                )}
              </div>
            </div>

            <div className="hm-page">
              <h2>{selected.title}</h2>
              <hr />
              {selected.body.map((line, i) => (
                <p key={i}>{line}</p>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  )
}