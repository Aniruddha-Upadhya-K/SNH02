import { z } from "zod";
import { createTRPCRouter, protectedProcedure, publicProcedure } from "../trpc";
import fs from "fs";
import os from "os";
import axios from "axios";
export const chatRouter = createTRPCRouter({
    handleQuery: protectedProcedure.input(z.object({
        query: z.string(),
    })).mutation(async ({ ctx, input }) => {
        let chatid = ctx.session.user.latestChatId;
        if(!chatid) {
            const newChat = await ctx.prisma.chats.create({
                data:{
                    user: {
                        connect: {
                            id: z.string().parse(ctx.session.user.id)
                        }
                    }
                }
            })
            chatid = newChat.id
            const response = await axios.post("http://127.0.0.1:8080/completion", {
            prompt: input.query, "n_predict": 128 
        },
            { headers: { "Content-Type": "application/json" } }
        )
        await ctx.prisma.chats.update({
            where: {
                id: chatid
            },
            data: {
                chatHistory: response.data.content
            }
        })
        //TODO: convert response to audio
        return response.data.content
        }

        else{
            const context = await ctx.prisma.chats.findUnique({
                where: {
                    id: chatid
                }
            })
            const response = await axios.post("http://127.0.0.1:8080/completion", {
            prompt: input.query, "n_predict": 128
        },
            { headers: { "Content-Type": "application/json" } }
        )
        await ctx.prisma.chats.update({
            where: {
                id: chatid
            },
            data: {
                chatHistory: context + response.data.content
            }
        })

        //TODO: convert response to audio
        return context + response.data.content
        }
    })
})