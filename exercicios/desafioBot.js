const env = require('../.env')
const Telegraf = require('telegraf')
const bot = new Telegraf(env.token)
const autor = env.userMestre

bot.start(ctx => {
    const from = ctx.update.message.from
    var uname = autor
    console.log(`from: ${from.first_name}`)
    console.log(`env.userMestre ${env.userMestre}`)
    console.log(`author ${env.userMestre}`)
    
    if (from.first_name===uname)
        ctx.reply(`Ola mestre ${from.first_name}, estou ao seu dispor`)
    else
        ctx.reply(`Desculpe ${from.first_name}, só falo com meu mestre`)
})

bot.on('text', async (ctx, next) => {
    await ctx.reply('Olá')
    next()
})

bot.on('text', async (ctx, next) => {
    await ctx.reply('Tudo bem?')
    next()
})


bot.catch((err, ctx)=> {console.log(`ocorreu um erro ${err}`)})

bot.startPolling()