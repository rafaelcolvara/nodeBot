const env = require('../../.env')
const Telegraf = require('telegraf')
const session = require('telegraf/session')
const Stage  = require('telegraf/stage')
const Scene  = require('telegraf/scenes/base')
const {enter, leave} = Stage
const bot = new Telegraf(env.tokenListaCompras)

console.log(env.tokenListaCompras)

bot.start(ctx => {
    const name = ctx.update.message.from.first_name;
    ctx.reply(`Seja bem vindo ${name}`)
    ctx.reply(`Entre com /echo ou /soma para iniciar...`)
})


const echoScene = new Scene('echo')
echoScene.enter(ctx => ctx.reply(`Entrando na scena`))
echoScene.leave(ctx => ctx.reply(`Saindo da scena`))
echoScene.command('sair', leave())
echoScene.on('text', ctx => ctx.reply(ctx.message.text))
echoScene.on('message', ctx => ctx.reply('only text is accepted'))

let sum = 0

const sumScene = new Scene('sum')
sumScene.enter(ctx => ctx.reply(`Entrando na scena sum`))
sumScene.leave(ctx => ctx.reply(`Saindo na scena sum`))
sumScene.command('sair', leave())
sumScene.use(async (ctx, next) => {
    await ctx.reply('Você está em soma scene')
    await ctx.reply('Voce deseja: /zerar ou /sair ?')
    next()
})
sumScene.command('zerar', ctx=>{
    sum = 0
    ctx.reply(`Valor: ${sum}`)
})
sumScene.hears(/(\d+)/, ctx=> {
sum+=parseInt(ctx.match[1])
ctx.reply(`Valor: ${sum}`)
})
sumScene.on('message', ctx => ctx.reply('apenas numeros por favor'))

const stage = new Stage([echoScene, sumScene])
bot.use(session())
bot.use(stage.middleware())
bot.command('soma', enter('sum'))
bot.command('echo', enter('echo'))
bot.on('message', ctx => ctx.reply('use apenas /echo ou /soma por favor'))

bot.startPolling()
