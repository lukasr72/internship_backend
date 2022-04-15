import express from "express";

import v1 from './api/v1'

const app = express()

app.use(express.urlencoded({extended: true}))
app.use(express.json())

// Register router
app.use('/api/v1', v1())


export default app

