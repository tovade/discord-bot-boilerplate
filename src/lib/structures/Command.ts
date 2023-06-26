import { CommandInteraction, Message } from 'oceanic.js'
import { ICommandInfo } from 'utils/types'

import { ApplicationCommandOptionBuilder } from '@oceanicjs/builders'

import { DiscordClient } from '../DiscordClient'
import { Colors } from '../utils/Colors'
import Logger from '../utils/Logger'
import { Args } from './Args'

export default abstract class Command {
    /**
     * Discord client.
     */
    readonly client: DiscordClient

    /**
     * Information of the command.
     */
    readonly info: ICommandInfo

    constructor(client: DiscordClient, info: ICommandInfo) {
        this.client = client
        this.info = info
    }

    /**
     * Executes when command throws an error.
     * @param message Message object
     * @param error Error message
     */
    async onError(message: Message, error: any) {
        Logger.log('ERROR', `An error occurred in "${this.info.name}" command.\n${error.stack}\n`, true)
        await message.channel?.createMessage({
            embeds: [
                {
                    color: Colors.Red,
                    title: '💥 Oops...',
                    description: `${message.author}, an error occurred while running this command. Please try again later.`
                }
            ]
        })
    }
    getArgs(message: Message, args: string[]) {
        const parsedargs = new Args(this.client, {
            args,
            message,
            client: this.client,
            command: this
        })

        return parsedargs
    }
    /**
     * Runs the command.
     * @param message The message
     */
    abstract run(message: Message, args: Args): Promise<any> | any

    registerSlashCommand?(): ApplicationCommandOptionBuilder
    /**
     * Runs the slash command.
     * @param interaction Interaction
     */
    interactionRun?(interaction: CommandInteraction): Promise<any>
}
