const { SlashCommandBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('help')
		.setDescription('Replies with a list of commands for help!'),
	async execute(interaction) {
		return interaction.reply('This command is still being constructed!');
	},
};