import React, {useState} from 'react'
import axios from 'axios'

export default function App(){
  const [q, setQ] = useState('')
  const [books, setBooks] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  async function search(e){
    e && e.preventDefault()
    if(!q) return
    setLoading(true); setError(null)
    try{
      const res = await axios.get('https://openlibrary.org/search.json', {params:{title:q}})
      setBooks(res.data.docs.slice(0,30))
    }catch(err){
      setError('Network error. Try again.')
    }finally{ setLoading(false) }
  }

  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold mb-4">Book Finder</h1>
        <form onSubmit={search} className="flex gap-2 mb-4">
          <input value={q} onChange={e=>setQ(e.target.value)} placeholder="Search by title..." className="flex-1 p-2 border rounded" />
          <button className="px-4 py-2 bg-blue-600 text-white rounded">Search</button>
        </form>
        {loading && <div>Loading…</div>}
        {error && <div className="text-red-600">{error}</div>}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {books.map(b=>(
            <div key={b.key} className="p-3 bg-white rounded shadow">
              <div className="flex gap-3">
                {b.cover_i ? <img src={`https://covers.openlibrary.org/b/id/${b.cover_i}-M.jpg`} alt="" className="w-20 h-28 object-cover rounded"/> : <div className="w-20 h-28 bg-slate-200 rounded flex items-center justify-center text-sm">No Cover</div>}
                <div>
                  <h2 className="font-semibold">{b.title}</h2>
                  <div className="text-sm text-slate-600">{b.author_name?.join(', ')}</div>
                  <div className="text-xs text-slate-500 mt-2">First published: {b.first_publish_year ?? 'N/A'}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
