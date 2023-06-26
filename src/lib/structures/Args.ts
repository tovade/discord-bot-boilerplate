import { Message } from 'oceanic.js'

import { DiscordClient } from '../DiscordClient'
import { ArgumentContext } from './Argument'
import Command from './Command'

export interface ArgsOptions {
    args: string[]
    message: Message
    client: DiscordClient
    command: Command
}
export class Args {
    args: string[]
    client: DiscordClient
    options: ArgsOptions
    constructor(client: DiscordClient, opts: ArgsOptions) {
        this.client = client
        this.options = opts
        this.args = opts.args
    }

    async get(arg: string, opts: Omit<ArgumentContext, 'message' | 'command'> = {}) {
        const parsedArg = await this.client.registry.arguments
            .find(a => a.name === arg)
            ?.messageRun(this.args[0], {
                message: this.options.message,
                command: this.options.command,
                ...opts
            })
        this.args.shift()
        return parsedArg
    }
    rest(arg: string, opts: Omit<ArgumentContext, 'message' | 'command'> = {}) {
        const parsedArg = this.client.registry.arguments
            .find(a => a.name === arg)
            ?.messageRun(this.args.join(' '), {
                message: this.options.message,
                command: this.options.command,
                ...opts
            })
        return parsedArg
    }
}
