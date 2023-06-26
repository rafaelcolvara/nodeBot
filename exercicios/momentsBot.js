const env = require('../.env')
const Telegraf = require('telegraf')
const bot = new Telegraf(env.token)
const moment = require('moment')


bot.hears('pizza', ctx => ctx.reply('Quero!'))

bot.startPolling()