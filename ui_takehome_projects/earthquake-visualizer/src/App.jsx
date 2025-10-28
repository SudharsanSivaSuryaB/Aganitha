import React, {useEffect, useState} from 'react'
import axios from 'axios'
import { MapContainer, TileLayer, CircleMarker, Popup } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import './styles.css'

export default function App(){
  const [quakes, setQuakes] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  async function fetchQuakes(){
    setLoading(true); setError(null)
    try{
      const res = await axios.get('https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_day.geojson')
      setQuakes(res.data.features)
    }catch(err){
      setError('Failed to fetch earthquakes')
    }finally{ setLoading(false) }
  }

  useEffect(()=>{ fetchQuakes(); const t = setInterval(fetchQuakes, 5*60*1000); return ()=>clearInterval(t) },[])

  return (
    <div className="min-h-screen bg-slate-50 p-4">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-4">Earthquake Visualizer (past 24h)</h1>
        {loading && <div>Loading…</div>}
        {error && <div className="text-red-600">{error}</div>}
        <div className="h-[600px] rounded overflow-hidden shadow">
          <MapContainer center={[20,0]} zoom={2} style={{height:'100%', width:'100%'}}>
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"/>
            {quakes.map(q=>{
              const [lon,lat,depth] = q.geometry.coordinates
              const mag = q.properties.mag || 0
              return (
                <CircleMarker key={q.id} center={[lat,lon]} radius={4+mag*2} fillOpacity={0.7} stroke={false}>
                  <Popup>
                    <div><strong>{q.properties.place}</strong></div>
                    <div>Magnitude: {mag}</div>
                    <div>Time: {new Date(q.properties.time).toLocaleString()}</div>
                    <div>Depth: {depth} km</div>
                    <div><a href={q.properties.url} target="_blank" rel="noreferrer">USGS Details</a></div>
                  </Popup>
                </CircleMarker>
              )
            })}
          </MapContainer>
        </div>
      </div>
    </div>
  )
}
