import { DiscordClient } from 'lib/DiscordClient'
import { Argument, ArgumentContext } from 'lib/structures/Argument'

export default class StringArgument extends Argument {
    constructor(client: DiscordClient) {
        super(client, 'string')
    }
    public messageRun(content: string, context: ArgumentContext) {
        return typeof content === 'string'
            ? this.ok(content)
            : this.error({
                  message: 'Invalid string.',
                  identifier: 'string',
                  type: 'string',
                  argument: this
              })
    }
}
