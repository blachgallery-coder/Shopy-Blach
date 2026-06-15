export default function handler(req, res) {
  const keys = Object.keys(process.env).filter(k => 
    k.includes('ANTHROPIC') || k.includes('CLE') || k.includes('API')
  )
  res.json({ keys, total: Object.keys(process.env).length })
}
