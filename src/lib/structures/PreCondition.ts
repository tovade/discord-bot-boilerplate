import { DiscordClient } from 'lib/DiscordClient'
import { CommandInteraction, Message } from 'oceanic.js'

import { Err, Ok, Result } from '@sapphire/result'

export abstract class Precondition {
    /**
     * The client
     */
    public client: DiscordClient

    /**
     * The name of the precondition
     * @example
     * ```ts
     * export class MyPrecondition extends Precondition {
     *    constructor(client: DiscordClient) {
     *      super(client, 'myCondition')
     *   }
     * }
     * ```
     */
    public name: string
    constructor(client: DiscordClient, name: string) {
        this.client = client
        this.name = name
    }

    public abstract messageRun(message: Message): Ok<any> | Err<any>

    public abstract interactionRun(interaction: CommandInteraction): Ok<any> | Err<any>
    ok(value: any) {
        return Result.ok(value)
    }
    error(message) {
        return Result.err(message)
    }
}
