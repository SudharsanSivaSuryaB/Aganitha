import React, {useState} from 'react'
import axios from 'axios'

export default function App(){
  const [city, setCity] = useState('')
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  async function fetchWeather(e){
    e && e.preventDefault()
    if(!city) return
    setLoading(true); setError(null); setData(null)
    try{
      // Geocoding (open-meteo)
      const geo = await axios.get('https://geocoding-api.open-meteo.com/v1/search', {params:{name:city, count:1}})
      if(!geo.data.results || geo.data.results.length===0){ setError('City not found'); setLoading(false); return }
      const {latitude, longitude, name, country} = geo.data.results[0]
      const res = await axios.get('https://api.open-meteo.com/v1/forecast', {params:{latitude, longitude, current_weather:true}})
      setData({place: name + ', ' + country, coords: {latitude, longitude}, weather: res.data.current_weather})
    }catch(err){
      setError('Network or API error')
    }finally{ setLoading(false) }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-50 to-white p-6">
      <div className="max-w-xl mx-auto">
        <h1 className="text-3xl font-bold mb-4">Weather Now</h1>
        <form onSubmit={fetchWeather} className="flex gap-2 mb-4">
          <input value={city} onChange={e=>setCity(e.target.value)} placeholder="Enter city name..." className="flex-1 p-2 border rounded" />
          <button className="px-4 py-2 bg-sky-600 text-white rounded">Get</button>
        </form>
        {loading && <div>Loading…</div>}
        {error && <div className="text-red-600">{error}</div>}
        {data && (
          <div className="p-4 bg-white rounded shadow">
            <div className="text-lg font-semibold">{data.place}</div>
            <div className="mt-2">Temperature: <strong>{data.weather.temperature}°C</strong></div>
            <div>Windspeed: {data.weather.windspeed} m/s</div>
            <div>Wind dir: {data.weather.winddirection}°</div>
            <div className="text-sm text-slate-500 mt-2">Coords: {data.coords.latitude.toFixed(3)}, {data.coords.longitude.toFixed(3)}</div>
          </div>
        )}
      </div>
    </div>
  )
}
