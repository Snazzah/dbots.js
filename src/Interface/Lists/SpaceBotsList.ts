import { Service, ServicePostOptions } from '../Service'
import { Util, IDResolvable } from '../../Utils/Util'

/**
 * Represents the Space Bots List service.
 * @see https://spacebots.gitbook.io/tutorial-en/
 */
export default class SpaceBotsList extends Service {
  /** The values that can be used to select the service. */
  static get aliases() {
    return ['spacebotslist', 'space-bot-list.xyz']
  }

  /** The logo URL. */
  static get logoURL() {
    return 'https://cdn.discordapp.com/avatars/546742409409593354/123b9b0a54b45d99627215c7154580af.webp?size=256'
  }

  /** Service's name. */
  static get serviceName() {
    return 'Space Bots List'
  }

  /** The website URL. */
  static get websiteURL() {
    return 'https://space-bot-list.xyz/'
  }

  /** The base URL of the service's API. */
  static get baseURL() {
    return 'https://space-bot-list.xyz/api'
  }

  /**
   * Posts statistics to this service.
   * <warn>Shard data posting is not supported for this service.</warn>
   * @param options The options of the request
   */
  static post(options: ServicePostOptions) {
    const { token, clientID, serverCount, userCount } = options
    return super._post({
      method: 'post',
      url: `/bots/${Util.resolveID(clientID)}`,
      headers: { Authorization: token },
      data: {
        guilds: Util.resolveCount(serverCount),
        users: Util.resolveCount(userCount)
      }
    })
  }

  /**
   * Gets the bot listed on this service.
   * @param id The bot's ID
   */
  getBot(id: IDResolvable) {
    return this._request({ url: `/bots/${Util.resolveID(id)}` })
  }
}
