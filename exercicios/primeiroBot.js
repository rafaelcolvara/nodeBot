const env = require('../.env')
const Telegraf = require('telegraf')
const bot = new Telegraf(env.token)

console.log(`token ${env.token}`)

bot.start(ctx => {
    const from = ctx.update.message.from
    console.log(from)
    ctx.reply(`Bem vindo ao chatbot ${from.first_name}!`)
})

bot.on('text', async (ctx, next) => {
    await ctx.reply('Olá')
    next()
})

bot.on('text', async (ctx, next) => {
    await ctx.reply('Como vai você?')
    next()
})


bot.catch((err, ctx)=> {console.log(`ocorreu um erro ${err}`)})

bot.startPolling()