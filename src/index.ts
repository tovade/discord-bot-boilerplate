// Getting and validating .env file
import EnvLoader from 'lib/utils/EnvLoader'
EnvLoader.load()

// Setting up moment-timezone
import moment from 'moment-timezone'
moment.locale('en')
moment.tz.setDefault('Europe/Istanbul')

// Starting client
import { DiscordClient } from 'lib/DiscordClient'

const client = new DiscordClient({
    auth: `Bot ${process.env.TOKEN}`,
    gateway: {
        intents: [
            'GUILDS',
            'GUILD_MESSAGES',
            'GUILD_MESSAGE_REACTIONS',
            'GUILD_MEMBERS',
            'GUILD_PRESENCES',
            'MESSAGE_CONTENT',
            'AUTO_MODERATION_CONFIGURATION',
            'AUTO_MODERATION_EXECUTION'
        ]
    }
})
client.start()
