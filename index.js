import express from 'express'
import pg from 'pg'
const app = express()
const port = 3000
const { Pool } = pg

app.use(express.json())
app.use(
    express.urlencoded({
        extended: true,
    })
)

const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'mahasiswa',
    password: 'Qwerty123',
    port: '5432'
})

app.get('/', (req, res, next)=> {
    console.log("test data :");
    pool.query('select * from biodata')
        .then(testData => {
            console.log(testData);
            res.send(testData.rows);
        })
        .catch(err => {
            console.error(err);
            res.status(500).send('internal server error');
        });
})

app.post('/biodata', (req, res)=>{
    const {id, nama, nim, kelas} = req.body;

    pool.query(
        'INSERT INTO biodata (id, nama, nim, kelas) VALUES ($1, $2, $3, $4) RETURNING *',
        [id, nama, nim, kelas]
    )
    .then(result => res.json(result.rows[0]))
    .catch(err => {
        console.error(err);
        res.status(500).json({ error: err.message });
    });
});

//PUT(UPDATE DATA)

app.put('/biodata/:id', (req, res)=>{

app.listen(port, () => {
    console.log(`app running on port ${port}.`)
})