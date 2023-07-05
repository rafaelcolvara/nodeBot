const env = require('../../.env')
const Telegraf = require('telegraf')
const session = require('telegraf/session')
const Composer = require('telegraf/composer')
const Stage  = require('telegraf/stage')
const Extra = require('telegraf/extra')
const Markup = require('telegraf/markup')
const {enter, leave} = Stage
const WizardScene = require('telegraf/scenes/wizard')

let descricao = ''
let preco = 0
let data = null

const confirmacao = Extra.markup(Markup.inlineKeyboard([
    Markup.callbackButton('Sim','s'),
    Markup.callbackButton('Não','n'),
]))

const bot = new Telegraf(env.tokenListaCompras)

const precoHandler = new Composer()
precoHandler.hears(/(\d+)/, ctx => {
    preco = ctx.match[1]
    ctx.reply('é para pagar que dia?')
    ctx.wizard.next()
})

precoHandler.use(ctx => ctx.reply('Apenas numeros são aceitos'))

const dataHandler = new Composer()
dataHandler.hears(/(\d{2}\/\d{2}\/\d{4})/, ctx => {
    data = ctx.match[1]
    ctx.reply(`Aqui está um resumo da sua compra
            descrição: ${descricao}            
            preço: ${preco}
            data: ${preco}

            Confirma?
    `, confirmacao)
    ctx.wizard.next()
})

dataHandler.use(ctx => ctx.reply('Somente datas são aceitas (dd/MM/YYYY)'))

const confirmacaoHandler = new Composer()
confirmacaoHandler.action('s', ctx => { 
    ctx.reply(`Compra confirmada!`)
    ctx.scene.leave()
})

confirmacaoHandler.action('n', ctx => { 
    ctx.reply(`Compra Excluida!`)
    ctx.scene.leave()
})

confirmacaoHandler.use(ctx => { 
    ctx.reply(`confirme`, confirmacao)

})


const wizardCompra = new WizardScene('compra', 
ctx => {
    ctx.reply('O que voce comprou?')
    ctx.wizard.next()    
},
ctx => {
    descricao = ctx.update.message.text
    ctx.reply('Qual valor?')
    ctx.wizard.next()    
},
precoHandler,
dataHandler,
confirmacaoHandler
)

const stage = new Stage([wizardCompra], {default: 'compra'})
bot.use(session())
bot.use(stage.middleware())
bot.startPolling()