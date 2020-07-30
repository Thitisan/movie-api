const express = require('express')
const router = express.Router()

module.exports = router

router.get('/', async(req, res) => {
    try {
        let rows = await req.db('mm_production')

        res.send({
            ok: true,
            production: rows,
        })
    } catch (e) {
        res.send({ ok: false, error: e.message })
    }
})

router.get('/production/:id', async(req, res) => {
    let db = req.db
    let rows = await db('mm_movies as m')
        .join('mm_movies_production as m_p', 'm.movie_id', 'm_p.movie_id')
        .join('mm_production as p', 'p.pco_id', 'm_p.pco_id')
        .where('m.movie_id', '=', req.params.id)
    res.send({
        ok: true,
        movie_production: rows,
    })
})