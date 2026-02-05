import {
    TextChannel, ChannelType, ButtonBuilder, ActionRowBuilder, ButtonStyle,
    PermissionFlagsBits, Interaction, CacheType, CategoryChannel
} from 'discord.js';
import { discordClient } from './client';
import { env } from '../utils/validateEnv';

// Initialize Gemini
// const genAI = ... (Removed)



export const setupDiscordBot = async () => {
    try {
        const token = process.env.DISCORD_TOKEN;

        if (!token) {
            console.warn('⚠️ DISCORD_TOKEN is missing in .env. Bot will not start.');
            return;
        }

        discordClient.once('ready', (c) => {
            console.log(`🤖 Medysa Admin Bot is online! Logged in as ${c.user.tag}`);
        });

        discordClient.on('guildMemberAdd', async (member) => {
            const rookieRole = member.guild.roles.cache.find(r => r.name === 'Rookie');
            if (rookieRole) {
                await member.roles.add(rookieRole);
            }
        });

        discordClient.on('interactionCreate', async (interaction) => {
            if (!interaction.isButton()) return;

            if (interaction.customId === 'open_ticket') {
                const guild = interaction.guild;
                if (!guild) return;

                // Check if user already has a ticket
                const existingChannel = guild.channels.cache.find(c => c.name === `ticket-${interaction.user.username.toLowerCase()}`);
                if (existingChannel) {
                    await interaction.reply({ content: `❌ You already have an open ticket: ${existingChannel}`, ephemeral: true });
                    return;
                }

                await interaction.reply({ content: '⏳ Creating your private ticket...', ephemeral: true });

                try {
                    // Create TICKETS category if not exists
                    let ticketCat = guild.channels.cache.find(c => c.name === '🎫 SUPPORT TICKETS' && c.type === 4);
                    if (!ticketCat) {
                        ticketCat = await guild.channels.create({ name: '🎫 SUPPORT TICKETS', type: 4 });
                    }

                    // Create Private Channel
                    const ticketChannel = await guild.channels.create({
                        name: `ticket-${interaction.user.username}`,
                        parent: ticketCat.id,
                        permissionOverwrites: [
                            {
                                id: guild.id,
                                deny: [PermissionFlagsBits.ViewChannel],
                            },
                            {
                                id: interaction.user.id,
                                allow: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.SendMessages],
                            },
                            {
                                id: guild.roles.cache.find(r => r.name === 'Moderator')?.id || guild.ownerId,
                                allow: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.SendMessages],
                            },
                        ],
                    });

                    await ticketChannel.send({
                        content: `Hello ${interaction.user}, welcome to support!`,
                        embeds: [{
                            description: 'Please describe your issue below. A staff member will be with you shortly.\n\n🔒 *This conversation is private.*',
                            color: 0xF59E0B,
                        }]
                    });

                    await interaction.editReply({ content: `✅ Ticket created: ${ticketChannel}` });

                } catch (error) {
                    console.error(error);
                    await interaction.editReply({ content: '❌ Failed to create ticket. Please contact admin.' });
                }
            }
        });

        discordClient.on('messageCreate', async (message) => {
            if (message.author.bot) return;

            // !cleanup command to remove duplicates
            if (message.content === '!cleanup') {
                const guild = message.guild;
                if (!guild) return;

                await message.reply('🧹 Cleaning up duplicates...');

                const channelNames = [
                    '🏰 GREAT HALL', 'general', 'announcements', '📜-rules', '📅-economic-calendar',
                    '⚔️ BATTLEFIELD', 'wins-and-profits', 'loss-porn',
                    '💁 SUPPORT', '🎫-support', '❓-faq', '🔧-tech-status', '🎁-giveaways',
                    '🔮 ORACLE (VIP)', 'ai-signals',
                    '🔊 VOICE CHANNELS', 'The Pit (Trading)', 'Lounge (Casual)'
                ];

                const roleNames = ['Knight', 'Medysa AI', 'Moderator', 'Analyst', 'Whale 🐋', 'Sniper 🎯', 'Rookie'];

                // Delete Channels
                let deletedChannels = 0;
                guild.channels.cache.forEach(async (channel) => {
                    if (channelNames.includes(channel.name)) {
                        await channel.delete().catch(() => { });
                        deletedChannels++;
                    }
                });

                // Delete Roles
                let deletedRoles = 0;
                guild.roles.cache.forEach(async (role) => {
                    if (roleNames.includes(role.name)) {
                        await role.delete().catch(() => { });
                        deletedRoles++;
                    }
                });

                await message.reply(`✨ Cleaned up! (Deleted existing channels/roles). Ready for \`!setup\`.`);
            }

            if (message.content === '!setup') {
                const guild = message.guild;
                if (!guild) return;

                // Security Check: Only Server Owner can run this
                if (message.author.id !== guild.ownerId) {
                    await message.reply('⛔ **Access Denied.** Only the Server Owner can use this command.');
                    return;
                }

                await message.reply('🏰 Starting Server Construction... (Checking for existing items)');

                try {
                    // Helper to get or create role
                    const getOrCreateRole = async (name: string, color: any, hoist: boolean, position: number, permissions: bigint[] = []) => {
                        let role = guild.roles.cache.find(r => r.name === name);
                        if (!role) {
                            role = await guild.roles.create({
                                name,
                                color,
                                hoist, // Separate in sidebar
                                permissions,
                                reason: 'Medysa Setup',
                            });
                        } else {
                            // Update existing role if needed (ensure it's hoisted)
                            if (role.hoist !== hoist || role.color !== color) {
                                await role.edit({ hoist, color });
                            }
                        }
                        // Try to set position (Bot must be higher than the role to do this)
                        try {
                            // Using relative position to avoid "Hierarchy" error
                            // We attempt to set permissions, but setting position exactly might fail if Bot is lower.
                            // However, we passed a safe relative position logic below.
                            await role.setPosition(position);
                        } catch (e) {
                            console.warn(`Could not set position for ${name}. Ensure Bot Role is higher.`);
                        }
                        return role;
                    };

                    // 1. Create Roles (Hierarchy: Top to Bottom)
                    // Strategy: Get Bot's Highest Role Position and stack strictly below it.
                    const botHighestRole = guild.members.me?.roles.highest.position || 1;
                    let currentPos = botHighestRole - 1;

                    // Ensure we don't go below 1
                    const getPos = () => {
                        const p = currentPos;
                        currentPos = currentPos > 1 ? currentPos - 1 : 1;
                        return p;
                    };

                    const modRole = await getOrCreateRole('Moderator', '#EF4444', true, getPos(), [PermissionFlagsBits.Administrator]);
                    const analystRole = await getOrCreateRole('Analyst', '#3B82F6', true, getPos());
                    const whaleRole = await getOrCreateRole('Whale 🐋', '#10B981', true, getPos());
                    const sniperRole = await getOrCreateRole('Sniper 🎯', '#06B6D4', true, getPos());
                    const aiRole = await getOrCreateRole('Medysa AI', '#A855F7', true, getPos());
                    const knightRole = await getOrCreateRole('Knight', '#F59E0B', true, getPos());
                    const rookieRole = await getOrCreateRole('Rookie', '#9CA3AF', true, getPos());

                    // Ensure Rookie is hoisted
                    if (!rookieRole.hoist) await rookieRole.edit({ hoist: true });

                    // Helper to get or create category
                    const getOrCreateCategory = async (name: string) => {
                        const existing = guild.channels.cache.find(c => c.name === name && c.type === 4);
                        if (existing) return existing;
                        return await guild.channels.create({ name, type: 4 });
                    };

                    // Helper to get or create channel
                    const getOrCreateChannel = async (name: string, parentId: string, topic?: string, type: number = 0) => {
                        const existing = guild.channels.cache.find(c => c.name === name && c.parentId === parentId);
                        if (existing) return existing;
                        return await guild.channels.create({ name, parent: parentId, topic, type });
                    };

                    // 2. Create Categories & Channels
                    // Public Area
                    const publicCat = await getOrCreateCategory('🏰 GREAT HALL');
                    const rulesChannel = await getOrCreateChannel('📜-rules', publicCat.id, 'Official Community Rules');
                    const calendarChannel = await getOrCreateChannel('📅-economic-calendar', publicCat.id, 'Daily Economic Events');
                    const giveawayChannel = await getOrCreateChannel('🎁-giveaways', publicCat.id, 'Community Prizes');
                    const announceChannel = await getOrCreateChannel('announcements', publicCat.id);

                    // GENERAL: Rookies allow to chat
                    let genChannel = guild.channels.cache.find(c => c.name === 'general' && c.parentId === publicCat.id) as unknown as TextChannel;
                    if (!genChannel) {
                        genChannel = await guild.channels.create({
                            name: 'general', parent: publicCat.id,
                            permissionOverwrites: [
                                { id: guild.id, allow: ['ViewChannel'] },
                                { id: rookieRole.id, allow: ['SendMessages'] }
                            ]
                        }) as unknown as TextChannel;
                    } else {
                        // Ensure permissions if exists
                        await genChannel.permissionOverwrites.edit(rookieRole, { SendMessages: true });
                    }

                    // Support Area
                    const supportCat = await getOrCreateCategory('💁 SUPPORT');
                    const faqChannel = await getOrCreateChannel('❓-faq', supportCat.id, 'Frequently Asked Questions');
                    const supportChannel = await getOrCreateChannel('🎫-support', supportCat.id, 'Open a Ticket');
                    const statusChannel = await getOrCreateChannel('🔧-tech-status', supportCat.id, 'System Health');

                    // --- POPULATE CHANNELS ---

                    // 1. FAQ
                    if (faqChannel && (faqChannel as any).type === ChannelType.GuildText) {
                        const c = faqChannel as TextChannel;
                        if ((await c.messages.fetch({ limit: 1 })).size === 0) {
                            await c.send({
                                embeds: [{
                                    title: '❓ MEDYSA KNOWLEDGE BASE',
                                    description: 'Everything you need to know about the Medysa Trading Ecosystem.',
                                    color: 0x3B82F6,
                                    fields: [
                                        { name: '🚀 What makes Medysa different?', value: 'Medysa isn\'t just a journal. It uses AI to analyze your emotional state and trading patterns, preventing tilt before it happens.' },
                                        { name: '💎 Membership Tiers', value: '**Knight:** Standard Tier (Journaling).\n**Medysa AI:** Elite Tier (AI Analysis + Signals).' },
                                        { name: '🔗 How to Connect?', value: 'Go to your Dashboard > Settings to link your Discord account.' },
                                        { name: '🛡️ Is my data safe?', value: 'We use bank-grade encryption. Your API keys are never stored in plain text.' }
                                    ]
                                }]
                            });
                        }
                    }

                    // 2. Tech Status
                    if (statusChannel && (statusChannel as any).type === ChannelType.GuildText) {
                        const c = statusChannel as TextChannel;
                        if ((await c.messages.fetch({ limit: 1 })).size === 0) {
                            await c.send({
                                embeds: [{
                                    title: '🔴 SYSTEM STATUS',
                                    description: 'System is currently offline for pre-launch maintenance.',
                                    color: 0xEF4444,
                                    fields: [
                                        { name: 'API', value: '🔴 Offline', inline: true },
                                        { name: 'Database', value: '🔴 Offline', inline: true },
                                        { name: 'AI Engine', value: '🔴 Offline', inline: true }
                                    ],
                                    timestamp: new Date().toISOString()
                                }]
                            });
                        }
                    }

                    // 3. Support with Button
                    if (supportChannel && (supportChannel as any).type === ChannelType.GuildText) {
                        const c = supportChannel as TextChannel;
                        if ((await c.messages.fetch({ limit: 1 })).size === 0) {

                            const ticketButton = new ButtonBuilder()
                                .setCustomId('open_ticket')
                                .setLabel('📩 Open Support Ticket')
                                .setStyle(ButtonStyle.Primary);

                            const row = new ActionRowBuilder<ButtonBuilder>()
                                .addComponents(ticketButton);

                            await c.send({
                                content: '⚠️ **Automated Fetching Blocked**: Forex Factory protects against bots.',
                                embeds: [{
                                    title: '🎫 MEDYSA SUPPORT CENTER',
                                    description: 'Need assistance? Facing an account issue?\n\n**Click the button below** to open a private support channel. Our team is ready to help.',
                                    color: 0xF59E0B,
                                    footer: { text: 'Tickets are private and secure.' }
                                }],
                                components: [row]
                            });
                        }
                    }

                    // 4. Economic Calendar
                    if (calendarChannel && (calendarChannel as any).type === ChannelType.GuildText) {
                        const c = calendarChannel as TextChannel;
                        if ((await c.messages.fetch({ limit: 1 })).size === 0) {

                            const calButton = new ButtonBuilder()
                                .setLabel('📅 View Full Forex Factory Calendar')
                                .setURL('https://www.forexfactory.com/calendar')
                                .setStyle(ButtonStyle.Link);

                            const row = new ActionRowBuilder<ButtonBuilder>()
                                .addComponents(calButton);

                            await c.send({
                                content: '⚠️ **Automated Fetching Blocked**: Forex Factory protects against bots.',
                                embeds: [{
                                    title: '📅 Economic Calendar Access',
                                    description: 'Click below to view the official live calendar.',
                                    color: 0x10B981,
                                    fields: [
                                        { name: 'Weekly Watchlist (Template)', value: '- **Tue:** CPI Data (USD)\n- **Wed:** FOMC Meeting\n- **Fri:** Non-Farm Payrolls' }
                                    ]
                                }],
                                components: [row]
                            });
                        }
                    }

                    // Post Announcement
                    if (announceChannel && (announceChannel as any).type === ChannelType.GuildText) {
                        const textAnnounce = announceChannel as TextChannel;
                        const messages = await textAnnounce.messages.fetch({ limit: 1 });
                        if (messages.size === 0) {
                            await textAnnounce.send({
                                content: '@everyone',
                                embeds: [{
                                    title: '🚀 MEDYSA PROTOCOL INITIATED',
                                    description: 'The gates to the new trading era are open.',
                                    color: 0x10B981,
                                    image: { url: 'https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExbmZ0aHJobzB6Z3Z4ZmE2emR5eXF6bmZ0aHJobzB6Z3Z4ZmE2emR5eSZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/L59zqh9qA5n7g8hF6b/giphy.gif' },
                                    fields: [
                                        { name: '🔥 What is Medysa?', value: 'The first AI-powered trading journal that actually fixes your psychology.' },
                                        { name: '🎯 Get Started', value: 'Check <#rules> and select your roles.' }
                                    ],
                                    footer: { text: 'Welcome to the elite.' }
                                }]
                            });
                        }
                    }

                    // Post Rules
                    if (rulesChannel && (rulesChannel as any).type === ChannelType.GuildText) {
                        const textRules = rulesChannel as TextChannel;
                        const messages = await textRules.messages.fetch({ limit: 1 });
                        if (messages.size === 0) {
                            await textRules.send({
                                embeds: [{
                                    title: '📜 MEDYSA LAW & ORDER',
                                    description: 'Welcome to the Medysa official community. By being here, you agree to the following code of honor.',
                                    color: 0xF59E0B,
                                    fields: [
                                        { name: '1. Respect the Discipline', value: 'Trading is a professional endeavor. No toxicity, harassment, or hate speech.' },
                                        { name: '2. No Signal Spam', value: 'Do not spam generic signals. Provide analysis.' },
                                        { name: '3. Privacy', value: 'Do not share personal financial information or wallet keys.' },
                                        { name: '4. No Self Promotion', value: 'Unauthorized links or ads will result in an immediate ban.' }
                                    ],
                                    footer: { text: 'Failure to comply leads to expulsion.' }
                                }]
                            });
                        }
                    }

                    // Trading Area
                    // BATTLEFIELD: Rookies CANNOT chat. Knight/Medysa/Whale/Sniper can.
                    let battleCat = guild.channels.cache.find(c => c.name === '⚔️ BATTLEFIELD' && c.type === 4) as unknown as CategoryChannel;
                    if (!battleCat) {
                        battleCat = await guild.channels.create({
                            name: '⚔️ BATTLEFIELD', type: 4,
                            permissionOverwrites: [
                                { id: guild.id, deny: ['SendMessages'] }, // Default deny all
                                { id: rookieRole.id, deny: ['SendMessages'] },
                                { id: knightRole.id, allow: ['SendMessages'] },
                                { id: aiRole.id, allow: ['SendMessages'] },
                                { id: whaleRole.id, allow: ['SendMessages'] },
                                { id: sniperRole.id, allow: ['SendMessages'] }
                            ]
                        }) as unknown as CategoryChannel;
                    } else {
                        // Update existing overrides
                        await battleCat.permissionOverwrites.edit(guild.id, { SendMessages: false });
                        await battleCat.permissionOverwrites.edit(rookieRole, { SendMessages: false });
                        await battleCat.permissionOverwrites.edit(knightRole, { SendMessages: true });
                        await battleCat.permissionOverwrites.edit(aiRole, { SendMessages: true });
                    }

                    await getOrCreateChannel('wins-and-profits', battleCat.id);

                    await getOrCreateChannel('loss-porn', battleCat.id);



                    // Voice Area
                    const voiceCat = await getOrCreateCategory('🔊 VOICE CHANNELS');
                    await getOrCreateChannel('The Pit (Trading)', voiceCat.id, '', 2); // Type 2 is Voice
                    await getOrCreateChannel('Lounge (Casual)', voiceCat.id, '', 2);

                    // VIP Area
                    let vipCat = guild.channels.cache.find(c => c.name === '🔮 ORACLE (VIP)' && c.type === 4) as unknown as CategoryChannel;
                    if (!vipCat) {
                        vipCat = await guild.channels.create({
                            name: '🔮 ORACLE (VIP)',
                            type: 4,
                            permissionOverwrites: [
                                { id: guild.id, deny: ['ViewChannel'] },
                                { id: aiRole.id, allow: ['ViewChannel', 'SendMessages'] },
                                { id: whaleRole.id, allow: ['ViewChannel', 'SendMessages'] },
                                { id: sniperRole.id, allow: ['ViewChannel', 'SendMessages'] },
                            ],
                        }) as unknown as CategoryChannel;
                    } else {
                        // Update existing
                        await vipCat.permissionOverwrites.edit(guild.id, { ViewChannel: false });
                        await vipCat.permissionOverwrites.edit(aiRole, { ViewChannel: true, SendMessages: true });
                        await vipCat.permissionOverwrites.edit(whaleRole, { ViewChannel: true, SendMessages: true });
                        await vipCat.permissionOverwrites.edit(sniperRole, { ViewChannel: true, SendMessages: true });
                    }
                    await getOrCreateChannel('ai-signals', vipCat.id);

                    await message.reply('✅ **Kingdom Established!**\n- Channels: Voice, Rules, Battlefield\n- Roles Updated');

                } catch (error) {
                    console.error(error);
                    await message.reply('❌ Error: ' + (error as any).message);
                }
            }
        });

        await discordClient.login(token);

    } catch (error) {
        console.error('❌ Failed to start Discord Bot:', error);
    }
};

export const notifyNewTrade = async (trade: any, userName: string) => {
    try {
        if (Number(trade.pnl) === 0 && trade.result === 'OPEN') return;

        const pnl = Number(trade.pnl || 0);
        const channelName = pnl >= 0 ? 'wins-and-profits' : 'loss-porn';

        const guild = discordClient.guilds.cache.first();
        if (!guild) return;

        const channel = guild.channels.cache.find(c => c.name === channelName && c.isTextBased()) as TextChannel;
        if (!channel) return;

        const isWin = pnl >= 0;
        const color = isWin ? 0x10B981 : 0xEF4444;
        const title = isWin ? `🚀 TRADE ALERT: ${userName} just banked!` : `💀 LOSS PORN: ${userName} got rekt!`;

        const embed: any = {
            title,
            color,
            fields: [
                { name: 'Instrument', value: trade.instrument || 'Unknown', inline: true },
                { name: 'PnL', value: `$${pnl.toFixed(2)}`, inline: true },
                { name: 'Result', value: trade.result || 'CLOSED', inline: true },
            ],
            timestamp: new Date().toISOString(),
            footer: { text: 'Medysa Trading Journal' }
        };

        if (trade.imageUrl && trade.imageUrl.startsWith('http')) {
            embed.image = { url: trade.imageUrl };
        }

        await channel.send({ embeds: [embed] });

    } catch (error) {
        console.error('Failed to send trade notification:', error);
    }
};

