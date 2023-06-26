import { ApplicationCommandOptionsSubCommand, Message } from 'oceanic.js'

import { ArgumentErrorOptions } from '../lib/errors/ArgumentError'
import Command from 'lib/structures/Command'
import { Args } from 'lib/structures/Args'

/**
 * Type for logging.
 */
export type LogType = 'SUCCESS' | 'WARNING' | 'ERROR' | 'INFO'

/**
 * Information interface for commands.
 */
export interface ICommandInfo {
    /** Name of the command */
    name: string

    /** Group name of the command */
    group: string

    /** Aliases of the command */
    aliases?: string[]

    /** Example usages */
    examples?: string[]

    /** Description of the command */
    description?: string

    /**
     * Time to wait for each use (seconds)
     *
     * Developers are not affected
     */
    cooldown?: number

    /** Status of the command */
    enabled?: boolean

    /**
     * Wether to use the command as a slash command or a message command
     */
    type?: 'MESSAGE' | 'BOTH' | 'SLASH'

    preconditions?: AvailablePreconditions[]

    slashOptions?: ApplicationCommandOptionsSubCommand[]
}
export enum CustomEvents {
    error = 'error',
    uncaughtException = 'uncaughtException',
    argumentError = 'argumentError',
    commandError = 'commandError'
}
export interface KamikoEvents {
    [CustomEvents.error]: [code: number, message: string]
    [CustomEvents.uncaughtException]: [error: Error]
}
declare module 'oceanic.js' {
    interface ClientEvents {
        [CustomEvents.argumentError]: [data: ArgumentErrorOptions]
        [CustomEvents.commandError]: [error: unknown, opts: { command: Command; args: Args; message: Message }]
    }
}
export enum AvailablePreconditions {
    OwnerOnly = 'OwnerOnly'
}
