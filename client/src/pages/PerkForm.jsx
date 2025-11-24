import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { api } from '../api'

const defaults = { title: '', description: '', category: 'other', merchant: '', discountPercent: 0 }

export default function PerkForm() {
  const nav = useNavigate()
  const { id } = useParams()
  const [form, setForm] = useState(defaults)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!id) return
    api.get('/perks/' + id).then(res => setForm(res.data.perk))
  }, [id])

  function onChange(e) {
    const { name, value } = e.target
    setForm(prev => ({ ...prev, [name]: name === 'discountPercent' ? Number(value) : value }))
  }

  async function onSubmit(e) {
    e.preventDefault()
    setError('')
    try {
      if (id) await api.patch('/perks/' + id, form)
      else await api.post('/perks', form)
      nav('/perks')
    } catch (err) {
      setError(err?.response?.data?.message || 'Save failed')
    }
  }

  return (
    <div className="max-w-lg mx-auto card">
      <h1 className="text-xl font-semibold mb-4">{id ? 'Edit' : 'Create'} Perk</h1>
      <form onSubmit={onSubmit} className="space-y-3">
        <input className="input" name="title" placeholder="Title" value={form.title} onChange={onChange} />
        <input className="input" name="merchant" placeholder="Merchant" value={form.merchant} onChange={onChange} />
        <select className="input" name="category" value={form.category} onChange={onChange}>
          <option value="food">Food</option>
          <option value="tech">Tech</option>
          <option value="travel">Travel</option>
          <option value="fitness">Fitness</option>
          <option value="other">Other</option>
        </select>
        <input className="input" type="number" name="discountPercent" placeholder="Discount %" value={form.discountPercent} onChange={onChange} />
        <textarea className="input" name="description" placeholder="Description" value={form.description} onChange={onChange} />
        {error && <div className="text-red-600 text-sm">{error}</div>}
        <button className="btn" type="submit">Save</button>
      </form>
    </div>
  )
}
