import React, {useState} from 'react'
import axios from 'axios'

export default function App(){
  const [ingredient, setIngredient] = useState('')
  const [meals, setMeals] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [selected, setSelected] = useState(null)

  async function search(e){
    e && e.preventDefault()
    if(!ingredient) return
    setLoading(true); setError(null); setMeals([]); setSelected(null)
    try{
      const res = await axios.get('https://www.themealdb.com/api/json/v1/1/filter.php', {params:{i:ingredient}})
      if(!res.data.meals){ setError('No recipes found'); setLoading(false); return }
      setMeals(res.data.meals)
    }catch(err){
      setError('API error')
    }finally{ setLoading(false) }
  }

  async function openMeal(id){
    setSelected(null)
    try{
      const res = await axios.get('https://www.themealdb.com/api/json/v1/1/lookup.php', {params:{i:id}})
      setSelected(res.data.meals?.[0] ?? null)
    }catch(err){ setError('Failed to fetch meal') }
  }

  return (
    <div className="min-h-screen bg-amber-50 p-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-4">Recipe Ideas</h1>
        <form onSubmit={search} className="flex gap-2 mb-4">
          <input value={ingredient} onChange={e=>setIngredient(e.target.value)} placeholder="Ingredient (e.g. chicken)" className="flex-1 p-2 border rounded" />
          <button className="px-4 py-2 bg-amber-600 text-white rounded">Find</button>
        </form>
        {loading && <div>Loading…</div>}
        {error && <div className="text-red-600">{error}</div>}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {meals.map(m=>(
            <div key={m.idMeal} className="p-2 bg-white rounded shadow">
              <img src={m.strMealThumb} alt="" className="w-full h-36 object-cover rounded"/>
              <div className="mt-2 font-semibold">{m.strMeal}</div>
              <button className="mt-2 text-sm text-sky-600" onClick={()=>openMeal(m.idMeal)}>View</button>
            </div>
          ))}
        </div>

        {selected && (
          <div className="mt-6 p-4 bg-white rounded shadow">
            <h2 className="text-xl font-semibold">{selected.strMeal}</h2>
            <div className="mt-2">Category: {selected.strCategory} | Area: {selected.strArea}</div>
            <img src={selected.strMealThumb} className="w-48 h-48 object-cover rounded mt-3"/>
            <h3 className="mt-3 font-semibold">Instructions</h3>
            <p className="whitespace-pre-line text-sm">{selected.strInstructions}</p>
            {selected.strYoutube && <div className="mt-2"><a href={selected.strYoutube} target="_blank" rel="noreferrer" className="text-sky-600">YouTube Video</a></div>}
          </div>
        )}
      </div>
    </div>
  )
}
