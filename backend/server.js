const express = require('express')
const mysql = require('mysql')

const app = express()
app.use(express.json())

//mysql connection
const connection = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "siamcyber",
})

connection.connect(err => {
    if (err) throw err
    console.log("Connected to MySQL Server")
})

// Create ROUTES
//GET WEB
app.get('/web', async (req, res) => {
    try {
        connection.query("SELECT * FROM report_web ORDER BY id DESC", (err, results, fields) => {
            if (err) {
                console.log(err)
                return res.status(400).send();
            }
            res.status(200).json(results)
        })
    } catch (err) {
        console.log(err);
        res.status(500).send();
    }
})

//GET phone
app.get('/phone', async (req, res) => {
    try {
        connection.query("SELECT * FROM report_phone ORDER BY id DESC", (err, results, fields) => {
            if (err) {
                console.log(err)
                return res.status(400).send();
            }
            res.status(200).json(results)
        })
    } catch (err) {
        console.log(err);
        res.status(500).send();
    }
})

//GET ID WEB
app.get('/web/:url', async (req, res) => {
    const { url } = req.params
    console.log(url)
    try {
        connection.query(`SELECT * FROM report_web WHERE url LIKE '${url}'`, (err, results, fields) => {
            if (err) {
                console.log(err)

            }
            if (results.length === 0) {
                res.status(200).send({ message: "Not found" })
            } else {
                res.status(200).json(results)
            }

        })
    } catch (err) {
        console.log(err);

    }
})


//GET ID phone
app.get('/phone/:url', async (req, res) => {
    const { url } = req.params
    console.log(url)
    try {
        connection.query(`SELECT * FROM report_phone WHERE phone LIKE '${url}'`, (err, results, fields) => {
            if (err) {
                console.log(err)

            }
            if (results.length === 0) {
                res.status(200).send({ message: "Not found" })
            } else {
                res.status(200).json(results)
            }

        })
    } catch (err) {
        console.log(err);

    }
})

app.listen(3001, () => {
    console.log("Server is Listening PORT 3001 SUCCESS")
})