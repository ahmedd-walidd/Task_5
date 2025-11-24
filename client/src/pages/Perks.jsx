import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { api } from '../api'

export default function Perks() {
  const [perks, setPerks] = useState([])
  const [q, setQ] = useState('')
  const [min, setMin] = useState('')

  async function load() {
    const res = await api.get('/perks', { params: { q, minDiscount: min || undefined } })
    console.log(res.data.perks)
    setPerks(res.data.perks)
  }

  useEffect(() => { load() }, [])

  return (
    <div className="space-y-4">
      

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {perks.map(p => (
          <Link 
            key={p._id} 
            to={`/perks/${p._id}/view`}
            className="card hover:shadow-md transition-shadow cursor-pointer block"
          >
            <div className="flex items-center justify-between">
              <div>
                <div className="font-semibold">{p.title}</div>
                <div className="text-sm text-zinc-600">{p.merchant} • {p.category} • {p.discountPercent}%</div>
              </div>
            </div>
            {p.description && <p className="mt-2 text-sm">{p.description}</p>}
          </Link>
        ))}
        {perks.length === 0 && <div className="text-sm text-zinc-600">No perks found.</div>}
      </div>
    </div>
  )
}
