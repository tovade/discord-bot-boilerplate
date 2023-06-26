import { DiscordClient } from 'lib/DiscordClient'
import { DefaultConfig } from 'lib/utils/Config'

import { EmbedBuilder } from '@oceanicjs/builders'
import { EmbedField } from 'oceanic.js'

export class DiscordEmbed extends EmbedBuilder {
    constructor() {
        super()
    }
    addDefaults(client: DiscordClient) {
        this.setColor(DefaultConfig.color)
        this.setFooter(client.user?.username, client.user?.avatarURL('png'))
        return this
    }
    public override addFields(...fields: EmbedField[]): this {
        for (const field of fields) {
            this.addField(field.name, field.value, field.inline ?? false)
        }
        return this
    }
}
