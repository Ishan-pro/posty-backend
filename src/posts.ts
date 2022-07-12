import { Router, Request, Response } from "express";

import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

const app:Router = new (Router as any)()

app.get('', async(req:Request, res:Response) => {
    const Allusers = await prisma.post.findMany()
    res.send(Allusers)
})

app.post('', async(req:Request, res:Response) => {
    res.send('Hello World')
})

export default app