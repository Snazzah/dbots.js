/**
 * Options for a poster.
 * @typedef {Object} PosterOptions
 * @property {Object} [apiKeys] An object that pairs a {@link Service} with their token.
 * @property {Object} [client] The client that a supported {@link Library} uses to manage the Discord application.
 * Requires {@link #clientLibrary} to be present.
 * @property {string} [clientID] The client ID used for posting to a {@link Service}.
 * Automatically filled in when {@link #client} is present.
 * @property {Library} [clientLibrary] The library that the client is based on.
 * @property {PromiseResolvable} [post] The function to use when posting to a server that uses the client ID,
 * the amount of servers, and a {@link Shard}. This will be used when the {@link Service} is `custom`.
 * @property {Shard} [shard] The shard data for using different methods of posting to services.
 * @property {PromiseResolvable} [serverCount] The function to use when retrieving the amount of servers a client/shard is in.
 ^ Uses the client as a parameter.
 * @property {PromiseResolvable} [userCount] The function to use when retrieving the amount of users a client/shard is connected with.
 ^ Uses the client as a parameter.
 * @property {PromiseResolvable} [voiceConnections] The function to use when retrieving the number of active voice connections.
 ^ Uses the client as a parameter.
 * @property {number} [useSharding=true] Whether or not to use a {@link Service}s sharding method when posting.
 */

/**
 * A shard that is used when posting to services.
 * @typedef {Object} Shard
 * @property {number} [count] The amount of shards the client uses
 * @property {number} [id] The shard ID that is being used by the poster
 */
exports.PostFormat = {
  topgg: (token, clientID, serverCount, shard) => {
    return {
      method: 'post',
      url: `https://top.gg/api/bots/${clientID}/stats`,
      headers: { Authorization: token },
      data: shard ? { server_count: serverCount, shard_id: shard.id, shard_count: shard.count } : { server_count: serverCount }
    };
  },
  discordbotsorg: (...a) => exports.PostFormat.topgg(...a), // deprecated
  discordbotsgg: (token, clientID, serverCount, shard) => {
    return {
      method: 'post',
      url: `https://discord.bots.gg/api/v1/bots/${clientID}/stats`,
      headers: { Authorization: token },
      data: shard ? { guildCount: serverCount, shardId: shard.id, shardCount: shard.count } : { guildCount: serverCount }
    };
  },
  discordappsdev: (token, clientID, serverCount) => {
    return {
      method: 'post',
      url: `https://api.discordapps.dev/api/v2/bots/${clientID}`,
      headers: { Authorization: token },
      data: { bot: { count: serverCount } }
    };
  },
  botsfordiscord: (token, clientID, serverCount) => {
    return {
      method: 'post',
      url: `https://botsfordiscord.com/api/bot/${clientID}`,
      headers: { Authorization: token },
      data: { server_count: serverCount }
    };
  },
  botsondiscord: (token, clientID, serverCount) => {
    return {
      method: 'post',
      url: `https://bots.ondiscord.xyz/bot-api/bots/${clientID}/guilds`,
      headers: { Authorization: token },
      data: { guildCount: serverCount }
    };
  },
  carbon: (token, _, serverCount) => {
    return {
      method: 'post',
      url: 'https://www.carbonitex.net/discord/data/botdata.php',
      data: { key: token, servercount: serverCount }
    };
  },
  discordbotlist: (token, clientID, serverCount, shard, usersCount, voiceConnections) => {
    const data = { guilds: serverCount };
    if (shard) data.shard_id = shard.id;
    if (usersCount) data.users = usersCount;
    if (voiceConnections) data.voice_connections = voiceConnections;

    return {
      method: 'post',
      url: `https://discordbotlist.com/api/bots/${clientID}/stats`,
      headers: { Authorization: `Bot ${token}` },
      data
    };
  },
  divinediscordbots: (token, clientID, serverCount) => {
    return {
      method: 'post',
      url: `https://divinediscordbots.com/bot/${clientID}/stats`,
      headers: { Authorization: token },
      data: { server_count: serverCount }
    };
  },
  discordboats: (token, clientID, serverCount) => {
    return {
      method: 'post',
      url: `https://discord.boats/api/v2/bot/${clientID}`,
      headers: { Authorization: token },
      data: { server_count: serverCount }
    };
  },
  botlistspace: (token, clientID, serverCount) => {
    return {
      method: 'post',
      url: `https://api.botlist.space/v1/bots/${clientID}`,
      headers: { Authorization: token, 'Content-Type': 'application/json' },
      data: { server_count: serverCount }
    };
  },
  discordbotworld: (token, clientID, serverCount) => {
    return {
      method: 'post',
      url: `https://discordbot.world/api/bot/${clientID}/stats`,
      headers: { Authorization: token },
      data: { guild_count: serverCount }
    };
  },
  glennbotlist: (token, clientID, serverCount) => {
    return {
      method: 'post',
      url: `https://glennbotlist.xyz/api/post/stats/bot/${clientID}`,
      data: { serverCount, authorization: token }
    };
  }
};

/**
 * A service supported by the package. Here are the available services:
 * * discordbotsgg
 * * discordbotsorg (deprecated)
 * * topgg
 * * botsfordiscord
 * * botsondiscord
 * * discordappsdev
 * * carbon
 * * discordbotlist
 * * divinediscordbots
 * * discordboats
 * * botlistspace
 * * discordbotworld
 * * glennbotlist
 * @typedef {string} Service
 */

exports.AvailableServices = [
  'discordbotsgg',
  'discordbotsorg', // deprecated
  'topgg',
  'botsfordiscord',
  'botsondiscord',
  'discordappsdev',
  'carbon',
  'discordbotlist',
  'divinediscordbots',
  'discordboats',
  'botlistspace',
  'discordbotworld',
  'glennbotlist'
];

/**
 * A library supported by the package. Here are the available libraries:
 * * discord.js
 * * discord.io
 * * discordie
 * * eris
 * @typedef {string} Library
 */

exports.SupportingLibraries = [
  'discord.js',
  'discord.io',
  'discordie',
  'eris'
];

exports.ServerCountFunctions = {
  'discord.js': client => client.guilds.size,
  'discord.io': client => Object.keys(client.servers).length,
  'discordie': client => client.Guilds.size,
  'eris': client => client.guilds.size
};

/**
 * An event that can be added an handler for. These are the available events:
 * * autopost
 * @typedef {string} CustomEvent
 */
/**
 * Emitted when the interval has ran.
 * @event Poster#autopost
 * @param {Object|Array<Object>} result The result(s) of the post
 */
/**
 * Emitted when the interval failed to post.
 * @event Poster#autopostfail
 * @param {Object|Array<Object>} result The error(s) of the post
 */
/**
 * Emitted when a post succeeds.
 * @event Poster#post
 * @param {Object} result The result of the post
 */
/**
 * Emitted when a post fails.
 * @event Poster#postfail
 * @param {Object} result The error of the post
 */
exports.SupportedEvents = [
  'autopost',
  'autopostfail',
  'post',
  'postfail'
];

exports.UserCountFunctions = {
  'discord.js': client => client.users.size,
  'discord.io': client => Object.keys(client.users).length,
  'discordie': client => client.Users.size,
  'eris': client => client.users.size
};

exports.VoiceConnectionsFunctions = {
  'discord.js': client => client.broadcasts.size,
  'discord.io': client => Object.keys(client._vChannels).length,
  'discordie': client => client.VoiceConnections.length,
  'eris': client => Object.keys(client.voiceConnections.pendingGuilds).size
};

exports.AutoValueFunctions = {
  'discord.js': client => ({
    clientID: client.user.id,
    shard: client.shard ? { id: client.shard.id, count: client.shard.count } : undefined
  }),
  'discord.io': client => ({
    clientID: client.id,
    shard: client._shard ? { id: client._shard[0], count: client._shard[1] } : undefined
  }),
  'discordie': client => ({
    clientID: client.User.id,
    shard: client.options.shardId && client.options.shardCount ? { id: client.options.shardId, count: client.options.shardCount } : undefined
  }),
  'eris': client => ({
    clientID: client.user.id,
    shard: undefined
  })
};
