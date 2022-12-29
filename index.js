const express = require('express');
const app = express();
const cors = require('cors');
const port = process.env.PORT || 5000;
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');

require('dotenv').config();
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.7r6jn89.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run() {
    try {
        const database = client.db("hiring-hub");
        const jobsCollection = database.collection("jobs");

        app.get('/jobs', async (req, res) => {
            const location = req.query.location;
            const role = req.query.role;
            let query = {};
            if (location && role) {
                query = { location: location, role: role }
            }
            else if (location) {
                query = { location: location }
            }
            else if (role) {
                query = { role: role }
            } else {
                query = {}
            }
            const result = await jobsCollection.find(query).toArray();
            res.send(result);
        })

        app.get('/job/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const job = await jobsCollection.findOne(query);
            res.send(job);
        })

        app.post('/job', async (req, res) => {
            const job = req.body;
            const result = await jobsCollection.insertOne(job);
            res.send(result);
        })

        app.patch('/job/:id', async (req, res) => {
            const id = req.params.id;
            const job = req.body;
            const filter = { _id: ObjectId(id) };
            const updateJob = {
                $set: job
            }
            const result = await jobsCollection.updateOne(filter, updateJob);
            res.send(result);
        })

        app.delete('/job/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await jobsCollection.deleteOne(query);
            res.send(result)
        })
    }
    finally {
    }
}
run().catch(error => console.log(error));

app.get('/', (req, res) => {
    res.send('Server is running!')
})

app.listen(port, () => {
    console.log(`Listening to port ${port}`)
})