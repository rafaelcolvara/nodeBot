const env = require('../.env')
const Telegraf = require('telegraf')
const Markup = require('telegraf/markup') 
const bot = new Telegraf(env.token)
const EventEmitter = require('events');
const emitter = new EventEmitter();

emitter.setMaxListeners(20);

const tecladoCarne = Markup.keyboard([
    ['🐷 Porco', '🐄 Vaca', '🐏 Carneiro'],
    ['🐓 Galinha', '🐣 Pintinho'],
    ['🐟 Peixe','🐙 Frutos do mar'],
    ['🍄 Sou vegano']
]).resize().extra()

bot.start(async ctx => {
    await ctx.reply(`Seja bem vindo ${ctx.update.message.from.first_name}!`)
    await ctx.reply(`Qual bebida você prefere? `,
    Markup.keyboard(['Coca','Pepsi']).resize().oneTime().extra())
})

bot.hears(['Coca', 'Pepsi'], async ctx => {
    await ctx.reply(`Nossa! Eu tambem gosto de ${ctx.match}`)
    await ctx.reply('Qual a sua carne predileta?', tecladoCarne)

})

bot.hears('🐄 Vaca', ctx => ctx.reply('🐄 é a minha predileta também'))
bot.hears('🍄 Sou vegano', ctx => ctx.reply('Parabéns, mas eu ainda estou ligado aos meus ancestrais neandertais'))
bot.on('text', ctx => ctx.reply('Legal!'))
bot.launch()