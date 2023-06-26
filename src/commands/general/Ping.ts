import { DiscordClient } from 'lib/DiscordClient'
import { Args } from 'lib/structures/Args'
import Command from 'lib/structures/Command'
import { DiscordEmbed } from 'lib/structures/DiscordEmbed'
import { AnyTextableChannel, ApplicationCommandOptionTypes, CommandInteraction, Message, Uncached } from 'oceanic.js'

import { ApplicationCommandOptionBuilder } from '@oceanicjs/builders'

export default class PingCommand extends Command {
    constructor(client: DiscordClient) {
        super(client, {
            name: 'ping',
            description: 'Pong!',
            group: 'General',
            preconditions: [],
            cooldown: 2
        })
    }
    run(message: Message<AnyTextableChannel | Uncached>, args: Args) {
        message.channel?.createMessage({
            embeds: [
                new DiscordEmbed()
                    .setTitle('Pong!')
                    .addDefaults(this.client)
                    .setDescription(`**Latency:** ${message?.guild ? message.guild?.shard.latency : this.client.shards.first()?.latency}ms`)
                    .toJSON()
            ]
        })
    }
    registerSlashCommand(): ApplicationCommandOptionBuilder<ApplicationCommandOptionTypes> {
        return new ApplicationCommandOptionBuilder(ApplicationCommandOptionTypes.SUB_COMMAND, 'ping').setDescription('Ping command').setName('ping')
    }
    interactionRun(interaction: CommandInteraction): Promise<any> {
        return interaction.createMessage({
            content: 'Hello'
        })
    }
}
