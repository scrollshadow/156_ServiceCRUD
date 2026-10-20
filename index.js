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

app.put('/biodata/:id', (req, res)=>{
    const {id} = req.params;
    const {nama, nim, kelas} = req.body;

    pool.query(
        'UPDATE biodata SET nama=$1, nim=$2, kelas=$3 WHERE id=$4 RETURNING *',
        [nama, nim, kelas, id]
    )
    .then(result => {
        if(result.rowCount === 0){
            return res.status(404).json({
                message: "Data tidak ditemukan"
            });
        }
        res.json({
            message: "data berhasil terupdate",
            data: result.rows[0]
        });
    })
    .catch(err => {
        console.error(err);
        res.status(500).send('Internal Server Error')
    });
})

app.put('/biodata/:id', (req, res)=>{

app.listen(port, () => {
    console.log(`app running on port ${port}.`)
})