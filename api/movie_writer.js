const express = require('express')
const router = express.Router()

module.exports = router

router.get('/', async(req, res) => {
    try {
        let rows = await req.db('mm_writer')

        res.send({
            ok: true,
            writer: rows,
        })
    } catch (e) {
        res.send({ ok: false, error: e.message })
    }
})

router.get('/writer/:id', async(req, res) => {
    let db = req.db
    let rows = await db('mm_movies as m')
        .join('mm_movies_writer as m_w', 'm.movie_id', 'm_w.movie_id')
        .join('mm_writer as w', 'w.writer_id', 'm_w.writer_id')
        .where('m.movie_id', '=', req.params.id)
    res.send({
        ok: true,
        movie_writer: rows,
    })
})