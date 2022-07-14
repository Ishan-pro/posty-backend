import { Router, Request, Response } from "express";

import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

const app:Router = new (Router as any)()

app.get('', async(req:Request, res:Response) => {
    const Allposts = await prisma.post.findMany()
    res.send(Allposts)
})

app.post('/byuser/', async(req:Request, res:Response) => {
    const {username} = req.body
    console.log(req.user.username)
    if (username) {
        const userposts = await prisma.post.findMany({
            where:{
                authorname:username
            }
        })
        res.send(userposts)
    } else {
        res.status(404).send("Invalid Request")
    }
})

app.post('', async(req:Request, res:Response) => {
    const {content} = req.body
    if (req.user && content) {
        const post = await prisma.post.create({
            data:{
                content,
                authorname:req.user.username
            }
        })
        res.send(post)
    } else {
        res.status(404).send('Invalid Request')
    }
})

app.delete('', async (req:Request, res:Response) => {
    const {postid} = req.body
    if (postid && req.user) {
        await prisma.post.delete({
            where:{
                id:postid,
                authorname:req.user.username
            }
        })
        res.send("Deleted")
    } else {
        res.status(404).send("invalid request")
    }
})

export default app