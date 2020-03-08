'use strict';

// Taken from Discord.JS's way of making errors

const codeSymbol = Symbol('code');
const messages = new Map();

/**
 * Extend an error of some sort into a DiscordjsError.
 * @param {Error} Base Base error to extend
 * @returns {DBotsError}
 */
function makeDbotsError(Base) {
  return class DBotsError extends Base {
    constructor(key, ...args) {
      super(message(key, args));
      this[codeSymbol] = key;
      if (Error.captureStackTrace)
        Error.captureStackTrace(this, DBotsError);
    }

    get name() {
      return `${super.name} [${this[codeSymbol]}]`;
    }

    get code() {
      return this[codeSymbol];
    }
  };
}

/**
 * Format the message for an error.
 * @param {string} key Error key
 * @param {Array<*>} args Arguments to pass for util format or as function args
 * @returns {string} Formatted string
 */
function message(key, args) {
  if (typeof key !== 'string') throw new Error('Error message key must be a string');
  const msg = messages.get(key);
  if (!msg) throw new Error(`An invalid error message key was used: ${key}.`);
  if (typeof msg === 'function') return msg(...args);
  if (args === undefined || args.length === 0) return msg;
  args.unshift(msg);
  return String(...args);
}

/**
 * Register an error code and message.
 * @param {string} sym Unique name for the error
 * @param {*} val Value of the error
 */
function register(sym, val) {
  messages.set(sym, typeof val === 'function' ? val : String(val));
}

const messageObject = {
  INVALID_POSTER_OPTIONS: 'An object is required a parameter to construct a poster.',
  NO_CLIENT_OR_ID: 'clientID must be defined when client is non-existant.',

  UNKNOWN_CLIENT: count_name => `Can't retrieve ${count_name} count from non-existant client.`,
  NO_CLIENT: count_name => `Can't retrieve ${count_name} count from unknown client.`,

  NO_API_KEYS: 'Can\'t post with a poster that has no API keys.',
  SERVICE_NO_KEY: service => `Can't post to "${service}" without an API key.`,
  INVALID_SERVICE: service => `"${service}" is an invalid service.`,

  HANDLER_INVALID: 'Given handler is not a PromiseResolvable.',
  UNSUPPORTED_EVENT: action => `Can't ${action} handler for an unsupported event.`,

  POSTING_UNSUPPORTED: service => `The service ${service} does not support posting.`,
};

for (const [name, message] of Object.entries(messageObject)) register(name, message);

module.exports = {
  register, messages, codeSymbol,
  Error: makeDbotsError(Error),
  TypeError: makeDbotsError(TypeError),
};