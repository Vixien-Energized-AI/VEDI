const { SlashCommandBuilder, GatewayIntentBits, Client } = require('discord.js');
const { token } = require('../config.json');
const client = new Client({ intents: [GatewayIntentBits.Guilds] });

module.exports = {
	data: new SlashCommandBuilder()
		.setName('restart')
		.setDescription('Restarts the client'),
	async execute(interaction) {
		if (interaction.user.id === '426381586473156629' || interaction.user.id === '715912580127785060') {
			const dateStart = new Date();
			const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
			console.log(`VEDI is now restarting! The time is ${dateStart.toLocaleTimeString('en-DE', options)}`);
			await interaction.deferReply({ ephemeral: false });
			const StartRestart = new Date();
			client.destroy();
			client.login(token);
			const EndRestart = new Date();
			const TimeRestart = Math.abs(EndRestart - StartRestart);
			await interaction.editReply(`Restart complete!\nRestart took ${TimeRestart}ms!`).then(sentReply => {
				sentReply.react('✅');
			});
			console.log(`Finished restarting! Restart took ${TimeRestart}ms!`);
		}
		else {
			interaction.reply('You are not my owner!');
		}
	},
};