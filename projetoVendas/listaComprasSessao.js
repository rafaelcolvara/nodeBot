const env = require('../.env')
const Telegraf = require('telegraf')
const bot = new Telegraf(env.token)
const Extra = require('telegraf/extra')
const Markup = require('telegraf/markup')
const session = require('telegraf/session')


const botoes = lista => Extra.markup(
    Markup.inlineKeyboard(
        lista.map(item => Markup.callbackButton(item, `delete ${item}`))
        ,{columns : 3}
    )
)

bot.use(session())


bot.start(async ctx => {
    const name = ctx.update.message.from.first_name
    await ctx.reply(`Seja bem vindo ${name}!`)
    console.log(`${name} usou a lista`)
    await ctx.reply(`Escreva os items que você deseja adicionar na lista de compras`)
    ctx.session.lista = []  
})

bot.on('text', ctx => {
    let msg = ctx.update.message.text
    if (ctx.session.lista!==undefined && ctx.session.lista !== null) {
        ctx.session.lista.push(msg)
        ctx.reply(`${msg}  adicionado!`, botoes(ctx.session.lista))        
    }
    })

bot.action(/delete (.+)/,ctx => {
     ctx.session.lista = ctx.session.lista.filter(item => item!=ctx.match[1])
     ctx.reply(`${ctx.match[1]} deletado!`, botoes(ctx.session.lista))
} )

bot.startPolling()