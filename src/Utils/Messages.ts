export const ErrorMessages = {
  disabledCommand: "This command is disabled.",
  developerOnly: "This command is only for the developers.",
  missingUserPermissions: (perms: string[]) =>
    `You are missing the following permissions: ${perms.join(", ")}`,
  missingClientPermissions: (perms: string[]) =>
    `I am missing the following permissions: ${perms.join(", ")}`,
};
