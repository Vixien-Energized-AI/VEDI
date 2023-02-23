const fs = require('node:fs');
const path = require('node:path');
const { Client, Collection, Events, GatewayIntentBits } = require('discord.js');
const { token } = require('./config.json');
const { EmbedBuilder } = require('discord.js');
const dateStart = new Date();

const client = new Client({ intents: [GatewayIntentBits.Guilds] });

client.commands = new Collection();
const commandsPath = path.join(__dirname, 'commands');
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
	const filePath = path.join(commandsPath, file);
	const command = require(filePath);
	client.commands.set(command.data.name, command);
}

client.once(Events.ClientReady, c => {
	const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
	console.log(`Ready! Logged in as ${c.user.tag} at ${dateStart.toLocaleTimeString('en-DE', options)} `);

	const ReportChannel = client.channels.cache.find(channel => channel.id === '1071010909268480000');
	const RestartUnixTime = Math.round(dateStart.getTime() / 1000);
	const ReportEmbed = new EmbedBuilder()
		.setColor(0x00FFFF)
		.setTitle('!!Bot restart!!')
		.setURL('https://discord.com/api/oauth2/authorize?client_id=1070347186921025576&permissions=1642790907126&scope=bot')
		.setAuthor({ name: c.user.username, iconURL: c.user.avatarURL() })
		.setDescription('Bot has restarted right now!')
		.setThumbnail('http://vedi.bplaced.net/images/loading.gif')
		// .addFields(
		//	{ name: 'Regular field title', value: 'Some value here' },
		//	{ name: '\u200B', value: '\u200B' },
		//	{ name: 'Inline field title', value: 'Some value here', inline: true },
		//	{ name: 'Inline field title', value: 'Some value here', inline: true },
		// )
		.addFields({ name: 'Time of restart', value: `<t:${RestartUnixTime}:f>`, inline: true })
		.setTimestamp()
		.setFooter({ text: 'Why did I have to restart anyways 😢', iconURL: 'http://vedi.bplaced.net/images/Profile_Picture_Icon.png' });
	ReportChannel.send({ embeds: [ReportEmbed] }).then(sentEmbed => {
		sentEmbed.react('🛑');
	});
});

// Set the bot's presence (activity and status)
client.on('ready', () => {
	client.user.setPresence({
		activities: [{
			'name': 'Vivien working...',
			'type': 1,
			'url': 'https://www.twitch.tv/vivi_vixien',
		}],
	});
	const voiceChannel = client.channels.cache.find(channel => channel.id === '1071519930517831690');
	const Day = dateStart.getDate();
	const Month = dateStart.getMonth();
	const Years = dateStart.getFullYear();
	const Hours = dateStart.getHours();
	const Minutes = dateStart.getMinutes();
	const lastRestart = `${Day}.${Month}.${Years} - ${Hours}:${Minutes} GMT+1`;
	function between(x, min, max) {
		return x >= min && x <= max;
	}
	if (between(Hours, 0, 9)) {
		if (between(Minutes, 0, 9)) {
			// eslint-disable-next-line no-shadow
			const lastRestart = `${Day}.${Month}.${Years} - 0${Hours}:0${Minutes} GMT+1`;
			voiceChannel.setName(lastRestart);
		}
		else {
			// eslint-disable-next-line no-shadow
			const lastRestart = `${Day}.${Month}.${Years} - 0${Hours}:${Minutes} GMT+1`;
			voiceChannel.setName(lastRestart);
		}
	}
	else if (between(Hours, 10, 23)) {
		if (between(Minutes, 0, 9)) {
			// eslint-disable-next-line no-shadow
			const lastRestart = `${Day}.${Month}.${Years} - ${Hours}:0${Minutes} GMT+1`;
			voiceChannel.setName(lastRestart);
		}
		else {
			// eslint-disable-next-line no-shadow
			const lastRestart = `${Day}.${Month}.${Years} - ${Hours}:${Minutes} GMT+1`;
			voiceChannel.setName(lastRestart);
		}
	}
	else if (voiceChannel.name === lastRestart) {
		console.log('Can\'t change the restart vc name due being to frequent!');
	}
	else {
		try {
			// eslint-disable-next-line no-shadow
			const lastRestart = `${Day}.${Month}.${Years} - ${Hours}:${Minutes} GMT+1`;
			voiceChannel.setName(lastRestart);
		}
		catch (error) {
			console.error(error);
		}
	}
});

client.on('reconnecting', c => {
	console.log(`${c.user.username} is reconnecting...`);
});

client.on('disconnect', c => {
	console.log(`${c.user.username} disconnected!`);
});

client.on(Events.InteractionCreate, async interaction => {
	if (!interaction.isChatInputCommand()) return;

	const command = client.commands.get(interaction.commandName);

	if (!command) return;

	try {
		await command.execute(interaction);
	}
	catch (error) {
		console.error(error);
		await interaction.reply({ content: 'There was an error while executing this command!\nPlease use the error command to tell Vivien what happend!', ephemeral: true });
	}
});

client.login(token);