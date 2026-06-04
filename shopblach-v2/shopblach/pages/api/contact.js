export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end()
  const { nom, email, sujet, message } = req.body
  // TODO: envoyer via nodemailer
  console.log('Contact form:', { nom, email, sujet, message })
  res.status(200).json({ ok: true })
}
