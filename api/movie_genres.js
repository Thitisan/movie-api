const express = require('express')
const router = express.Router()

module.exports = router

//path http://localhost:7000/api/movie_genres/
router.get('/', async(req, res) => {
    try {
        let rows = await req.db('mm_genres')

        res.send({
            ok: true,
            genres: rows,
        })
    } catch (e) {
        res.send({ ok: false, error: e.message })
    }
})

router.get('/mgenres/:id', async(req, res) => {
    let db = req.db
    let rows = await db('mm_movies as m')
        .join('mm_movies_genres as m_g', 'm.movie_id', 'm_g.movie_id')
        .join('mm_genres as g', 'g.genres_id', 'm_g.genres_id')
        .where('m.movie_id', '=', req.params.id)
    res.send({
        ok: true,
        movie_genre: rows,
    })
})

router.get('/genres/:id', async(req, res) => {
    let db = req.db
    let rows = await db('mm_movies as m')
        .join('mm_movies_genres as m_g', 'm.movie_id', 'm_g.movie_id')
        .join('mm_genres as g', 'g.genres_id', 'm_g.genres_id')
        .where('m.movie_id', '=', req.params.id).select('g.genres_id')
    res.send({
        ok: true,
        movie_genre: rows,
    })
})

router.get('/movielike', async(req, res) => {
    let db = req.db
    let rows = await db('mm_movies as m')
        .join('mm_movies_genres as m_g', 'm.movie_id', 'm_g.movie_id')
        .join('mm_genres as g', 'g.genres_id', 'm_g.genres_id')
    res.send({
        ok: true,
        movie_like: rows,
    })
})

//add new movie_genres in movie
router.post('/mgenres/new/', async(req, res) => {
    let db = req.db
    let mgenres = await db('mm_movies_genres')
        .insert({
            mogId: req.body.mogId,
            genresId: req.body.genresId,
            movieId: req.body.movieId,
        })
    res.send({
        ok: true,
        moviegenres: mgenres
    })
})

router.delete('/id/:movieId', function(req, res) {
    req.db('mm_movies_genres').where({ movieId: req.params.movieId }).delete().then(() => {
        res.send({ status: true })
    }).catch(e => res.send({ status: false, error: e.message }))
})