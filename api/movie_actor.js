const express = require('express')
const router = express.Router()

module.exports = router

router.get('/', async(req, res) => { // ใช้ async function
    try {
        let db = req.db
        let rows = await db('mm_actor')
        let actor = req.query.actor
            //join actor ex 
            // let rows = await db('mm_movies as m')
            // .join('mm_movies_actor as m_a','m.movie_id','m_a.movie_id')
            // .join('mm_actor as a','a.actor_id','m_a.actor_id').where('m.movie_id','=','1')
        if (actor) {
            rows = await db('mm_actor as m').where('m.actorName', 'like', `%${actor}%`)
        } else {
            rows = await db('mm_actor as m')
        }
        res.send({
            ok: true, // ส่ง status 
            actor: rows, // ส่งค่ากลับ
        })
    } catch (e) {
        res.send({ ok: false, error: e.message })
    }
})



router.get('/actorId/:id', async(req, res) => {
    let db = req.db
    let rows = await db('mm_movies as m')
        .join('mm_movies_actor as m_a', 'm.movie_id', 'm_a.movie_id')
        .join('mm_actor as a', 'a.actor_id', 'm_a.actor_id')
        .where('m.movieId', '=', req.params.id)
    res.send({
        ok: true,
        actor: rows,
    })
})

router.delete('/aid/:actorId', function(req, res) {
    req.db('mm_movies').where({ actorId: req.params.actorId }).delete().then(() => {
        res.send({ status: true })
    }).catch(e => res.send({ status: false, error: e.message }))
})

router.delete('/id/:actorId', function(req, res) {
    req.db('mm_movies_actor').where({ actorId: req.params.actorId }).delete().then(() => {
        res.send({ status: true })
    }).catch(e => res.send({ status: false, error: e.message }))
})

router.post('/actorRole', async(req, res) => {
    let db = req.db
    let rows = await db('mm_movies_actor as m')
        .where('m.movieId', '=', req.body.mId)
        .where('m.actorId', '=', req.body.aId).update({
            movieActorRole: req.body.movieActorRole
        })
    res.send({
        ok: true
    })
})

router.post('/newActor', async(req, res) => {
    let db = req.db
    let ids = await db('mm_actor').insert({
        actorName: req.body.actorName,
        actorBplace: req.body.actorBplace,
        actorBdate: req.body.actorBdate
    })
    res.send({
        ok: true,
        ids: ids
    })
})

router.post('/editActor', async(req, res) => {
    let db = req.db
    let ids = await db('mm_actor as m').where('m.actorId', '=', req.body.actorId).update({
        actorId: req.body.actorId,
        actorName: req.body.actorName,
        actorBplace: req.body.actorBplace,
        actorBdate: req.body.actorBdate
    })
    res.send({
        ok: true
    })
})

router.post('/addMovieActor', async(req, res) => {
    let db = req.db
    let ids = await db('mm_movies_actor').insert({
        actorId: req.body.actorId,
        movieId: req.body.movieId,
        movieActorRole: req.body.movieActorRole
    })
    res.send({
        ok: true,
        ids: ids
    })
})