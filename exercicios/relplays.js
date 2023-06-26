const env = require('../.env')
const Telegraf = require('telegraf')
const bot = new Telegraf(env.token)

bot.start(async ctx => {
    await ctx.reply(`Seja bem vindo ${ctx.update.message.from.first_name}! 🤖`)

})

bot.on('text', ctx => {
    console .log(ctx.update.message.text)
    ctx.reply(ctx.update.message.text)

})

bot.startPolling()