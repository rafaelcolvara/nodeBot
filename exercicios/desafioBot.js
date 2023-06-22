const env = require('../.env')
const Telegraf = require('telegraf')
const bot = new Telegraf(env.token)
const autor = env.userMestre

bot.start(ctx => {
    const from = ctx.update.message.from
    var uname = env.userMestre
    console.log(`from: ${from.first_name}`)
    console.log(`env.userMestre ${env.userMestre}`)
    if (from.first_name===uname)
        ctx.reply(`Ola mestre ${from.first_name}, estou ao seu dispor`)
    else
        ctx.reply(`Desculpe ${from.first_name}, só falo com meu mestre`)
})

bot.on('text', async (ctx, next) => {
    await ctx.reply('Fala viado')
    next()
})

bot.on('text', async (ctx, next) => {
    await ctx.reply('Nao entendi')
    next()
})


bot.catch((err, ctx)=> {console.log(`ocorreu um erro ${err}`)})

bot.startPolling()