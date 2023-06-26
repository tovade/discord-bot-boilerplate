import { ApplicationCommandOptionBuilder, ComponentBuilder, SelectMenu } from '@oceanicjs/builders'
import { DiscordClient } from 'lib/DiscordClient'
import { Args } from 'lib/structures/Args'
import Command from 'lib/structures/Command'
import { DiscordEmbed } from 'lib/structures/DiscordEmbed'
import { InteractionCollector } from 'oceanic-collectors'
import {
    AnyTextableChannel,
    ComponentTypes,
    Message,
    Uncached,
    MessageActionRow,
    InteractionTypes,
    MessageFlags,
    ApplicationCommandOptionTypes,
    CommandInteraction
} from 'oceanic.js'

export default class HelpCommand extends Command {
    constructor(client: DiscordClient) {
        super(client, {
            name: 'help',
            description: 'View all my commands!',
            group: 'General',
            preconditions: [],
            cooldown: 2
        })
    }
    async run(message: Message<AnyTextableChannel | Uncached>, args: Args) {
        const command = await args.get('string').catch(() => null)
        const builder = new ComponentBuilder<MessageActionRow>()

        if (!command) {
            const menu = new SelectMenu(ComponentTypes.STRING_SELECT, 'HELP_MENU').setValues(1, 1)

            const groups = this.client.registry.getAllGroupNames()

            for (const group of groups) {
                menu.addOption(group, group.toLowerCase(), `commands in the category: ${group}`)
            }
            menu.setPlaceholder('Select category')

            builder.addComponent(menu)
            const msg = await message.channel?.createMessage({
                embeds: [
                    new DiscordEmbed()
                        .addDefaults(this.client)
                        .setTitle('Help')
                        .setDescription('Hello! This is the help command, use the select menu below to get my commands!\nThanks for using me! ❤')
                        .toJSON()
                ],
                components: builder.toJSON()
            })
            const collector = new InteractionCollector<InteractionTypes.MESSAGE_COMPONENT, ComponentTypes.STRING_SELECT>(this.client, {
                channel: message.channel,
                filter: c => c.data.customID === 'HELP_MENU',
                time: 300000
            })
            const slashCommands = await this.client.application.getGuildCommands(message.guildID as string)

            collector.on('collect', collected => {
                const commands = this.client.registry.commands.filter(c => c.info.group === this.toCapitalize(collected.data.values.getStrings()[0]))
                const interactionCommands = commands
                    .filter(c => c.registerSlashCommand)
                    .map(cmd => {
                        const slashyboi = slashCommands.find(slash => {
                            return slash.name === cmd.info.group.toLowerCase() && slash.options?.[0].name === cmd.info.name
                        })
                        return `</${cmd.info.group.toLowerCase()} ${cmd.info.name}:${slashyboi?.id}>`
                    })
                const embed = new DiscordEmbed()
                    .addDefaults(this.client)
                    .setTitle(`${this.toCapitalize(collected.data.values.getStrings()[0])}`)
                    .setDescription(
                        `**Message commands:**\n \`${commands?.map(com => com.info.name).join(', ')}\` \n\n**Interaction commands:**\n ${interactionCommands.join(', ')} `
                    )
                collected.defer(64)

                collected.createFollowup({
                    embeds: [embed.toJSON()],
                    flags: MessageFlags.EPHEMERAL
                })
            })
            collector.on('end', () => {
                const nBuilder = new ComponentBuilder<MessageActionRow>()

                menu.disable()

                nBuilder.addComponent(menu)

                msg?.edit({
                    components: nBuilder.toJSON()
                })
            })
        } else {
            const cmd = this.client.registry.findCommand(command)
            if (!cmd)
                return message.channel?.createMessage({
                    embeds: [new DiscordEmbed().addDefaults(this.client).setTitle(`⚠️ Error`).setDescription('Invalid command. Command was not found').toJSON()]
                })

            const embed = new DiscordEmbed()
                .addDefaults(this.client)
                .setTitle(this.toCapitalize(cmd.info.name))
                .addFields(
                    {
                        name: 'Description',
                        value: cmd.info.description as string,
                        inline: true
                    },
                    {
                        name: 'Category',
                        value: cmd.info.group,
                        inline: true
                    },
                    {
                        name: 'Examples',
                        value: `${cmd.info.examples ? cmd.info.examples.join(', ') : 'No examples'}`,
                        inline: true
                    },
                    {
                        name: 'Aliases',
                        value: `${cmd.info.aliases ? `\`${cmd.info.aliases.join(', ')}\`` : 'No aliases'}`,
                        inline: true
                    }
                )
            return message.channel?.createMessage({
                embeds: [embed.toJSON()]
            })
        }
    }
    registerSlashCommand(): ApplicationCommandOptionBuilder<ApplicationCommandOptionTypes> {
        const commandOption = new ApplicationCommandOptionBuilder(ApplicationCommandOptionTypes.STRING, 'command')
            .setRequired(false)
            .setDescription('Get the command!')
            .setName('command')
        return new ApplicationCommandOptionBuilder(ApplicationCommandOptionTypes.SUB_COMMAND, 'help')
            .setDescription('Get all my commands!')
            .setName('help')
            .addOption(commandOption)
    }
    async interactionRun(interaction: CommandInteraction): Promise<any> {
        const command = await interaction.data.options.getString('command', false)
        const builder = new ComponentBuilder<MessageActionRow>()

        if (!command) {
            const menu = new SelectMenu(ComponentTypes.STRING_SELECT, 'HELP_MENU').setValues(1, 1)

            const groups = this.client.registry.getAllGroupNames()

            for (const group of groups) {
                menu.addOption(group, group.toLowerCase(), `commands in the category: ${group}`)
            }
            menu.setPlaceholder('Select category')

            builder.addComponent(menu)
            await interaction.createMessage({
                embeds: [
                    new DiscordEmbed()
                        .addDefaults(this.client)
                        .setTitle('Help')
                        .setDescription('Hello! This is the help command, use the select menu below to get my commands!\nThanks for using me! ❤')
                        .toJSON()
                ],
                components: builder.toJSON()
            })
            const collector = new InteractionCollector<InteractionTypes.MESSAGE_COMPONENT, ComponentTypes.STRING_SELECT>(this.client, {
                channel: interaction.channel,
                filter: c => c.data.customID === 'HELP_MENU',
                time: 300000
            })
            const slashCommands = await this.client.application.getGuildCommands(interaction.guildID as string)

            collector.on('collect', collected => {
                const commands = this.client.registry.commands.filter(c => c.info.group === this.toCapitalize(collected.data.values.getStrings()[0]))
                const interactionCommands = commands
                    .filter(c => c.registerSlashCommand)
                    .map(cmd => {
                        const slashyboi = slashCommands.find(slash => {
                            return slash.name === cmd.info.group.toLowerCase()
                        })
                        console.log(slashyboi)
                        return `</${cmd.info.group.toLowerCase()} ${cmd.info.name}:${slashyboi?.id}>`
                    })
                const embed = new DiscordEmbed()
                    .addDefaults(this.client)
                    .setTitle(`${this.toCapitalize(collected.data.values.getStrings()[0])}`)
                    .setDescription(
                        `**Message commands:**\n \`${commands?.map(com => com.info.name).join(', ')}\` \n\n**Interaction commands:**\n ${interactionCommands.join(', ')} `
                    )
                collected.defer(64)

                collected.createFollowup({
                    embeds: [embed.toJSON()],
                    flags: MessageFlags.EPHEMERAL
                })
            })
            collector.on('end', () => {
                const nBuilder = new ComponentBuilder<MessageActionRow>()

                menu.disable()

                nBuilder.addComponent(menu)

                interaction.editOriginal({
                    components: nBuilder.toJSON()
                })
            })
        } else {
            const cmd = this.client.registry.findCommand(command)
            if (!cmd)
                return interaction.createMessage({
                    embeds: [new DiscordEmbed().addDefaults(this.client).setTitle(`⚠️ Error`).setDescription('Invalid command. Command was not found').toJSON()]
                })

            const embed = new DiscordEmbed()
                .addDefaults(this.client)
                .setTitle(this.toCapitalize(cmd.info.name))
                .addFields(
                    {
                        name: 'Description',
                        value: cmd.info.description as string,
                        inline: true
                    },
                    {
                        name: 'Category',
                        value: cmd.info.group,
                        inline: true
                    },
                    {
                        name: 'Examples',
                        value: `${cmd.info.examples ? cmd.info.examples.join(', ') : 'No examples'}`,
                        inline: true
                    },
                    {
                        name: 'Aliases',
                        value: `${cmd.info.aliases ? `\`${cmd.info.aliases.join(', ')}\`` : 'No aliases'}`,
                        inline: true
                    }
                )
            return interaction.createMessage({
                embeds: [embed.toJSON()]
            })
        }
    }
    private toCapitalize(str: string) {
        const split = str.split('')
        return `${split[0].toUpperCase()}${split.slice(1, str.length).join('')}`
    }
}
