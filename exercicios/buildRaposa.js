const env = require('../.env')
const Telegraf = require('telegraf') 
const bot = new Telegraf(env.token)
const Client = require('ssh2').Client;
const { Pool } = require('pg');

pool = new Pool({
  user: env.userPG,
  host: env.hostPG,
  database: env.databasePG,
  password: env.passwordPG,
  port: env.portPG, 
});


const config = {
    host: env.hostSSH,
    port: env.portSSH,
    username: env.usernameSSH,
    password: env.passwordSSH,
  };


async function consultarUsuariosHabilitados() {
    
    try {
      // Conecta ao banco de dados
      const client = await env.pool.connect();
  
      // Executa a consulta
      const result = await client.query('SELECT id_user FROM tb_user_bot_telegram');
  
      // Processa os resultados      
      const users = result.rows.map(row => row.id_user)
    
      // Libera o cliente do pool
      client.release();
      return users;

    } catch (error) {      
      console.error('Erro durante a consulta:', error);
    } finally {
      // Encerra a conexão com o pool      
      pool.end();
    
    }
  } 
// Função para conectar via SSH
function connectSSH(build, ctx) {
    const client = new Client();
  
    client.on('ready', () => {
      console.log('Conexão SSH estabelecida.');
      const buildScript = `./push.sh ${build}`
      console.log(buildScript)
      var shaRetorno 
      // Execute os comandos desejados dentro do callback 'ready'
      client.exec(buildScript, (err, stream) => {
        if (err) throw err;
        stream.on('close', (code, signal) => {
          console.log(`Processo encerrado com código ${code}`);
          client.end();
          ctx.reply(`Imagem enviada ao Playground SHA: ${shaRetorno}`)
        })
        .on('data', (data) => {
            const texto = data;

            const regex = /sha256:([a-fA-F0-9]+)/;
            const matches = texto.toString().match(regex);
            
            if (matches && matches.length > 1) {
              shaRetorno = matches[1];
              console.log(`SHA: ${shaRetorno}`);
            }
          console.log(`Saída: ${data}`);          
        })
        .stderr.on('data', (data) => {
          console.error(`Erro: ${data}`);
          ctx.reply(`Erro: ${data}`);
        });
      });
    });
  
    client.on('error', (err) => {
      console.error(`Erro na conexão SSH: ${err}`);
      ctx.reply(`Erro na conexão: ${err}`)
    });
  
    client.connect(config);
  }
  
  
bot.start(ctx => {
    const name = ctx.update.message.from.first_name    
    console.log(ctx.update.message.from)
    ctx.reply(`Seja bem vindo, ${name}!`)
    consultarUsuariosHabilitados()
    .then( result => {
      console.log(result)
    })
    .catch(error => {
      console.log(`Erro: ${error}`);
    })
})


bot.on('text', async (ctx, next) => {
    const mensagem= ctx.update.message.text
    console.log(mensagem)
    if (mensagem=='build') {

        await ctx.reply(`Agora cole o build do raposa:`)
        next()
    }else  if  (mensagem.includes('docker-registry')) {
        ctx.reply('enviando imagem, aguarde...')
        connectSSH(mensagem, ctx);   
    } else {
        next()
    }

    
})


bot.on('location', ctx => {
    const location = ctx.update.message.location
    console.log(location)
    ctx.reply(`Entendido, voce está em
    lat: ${location.latitude}
    lon: ${location.longitude}! `)
})

bot.on('contact', ctx => {
    const contact = ctx.update.message.contact
    console.log(contact)
    ctx.reply(`Vou lembrar do(a) ${contact.first_name} `)

})

bot.on('voice', ctx => {
    const voice = ctx.update.message.voice
    console.log(voice)
    ctx.reply(`A mensagem de voz tem ${voice.duration} segundos`)
})


bot.on('photo', ctx => {
    const photo = ctx.update.message.photo
    console.log(photo)
    photo.forEach((ph, i) => {
        ctx.reply(`Foto ${i} tem resolução de ${ph.width}x${ph.height}`)
    })
})


bot.on('sticker', ctx => {
    const sticker = ctx.update.message.sticker
    console.log(sticker)
    ctx.reply(`Recebi um sticker ${sticker.emoji} do conjunto ${sticker.set_name}`)
})

bot.startPolling()