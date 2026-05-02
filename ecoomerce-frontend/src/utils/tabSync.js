const CHANNEL_NAME = "astra-ecommerce-sync";

const isBroadcastChannelSupported = typeof BroadcastChannel !== "undefined";

const broadcastChannel = isBroadcastChannelSupported ? new BroadcastChannel(CHANNEL_NAME) : null;

const serialize = (event) => {
  try {
    return JSON.stringify({ ...event, timestamp: Date.now() });
  } catch {
    return "";
  }
};

const parse = (value) => {
  try {
    return JSON.parse(value);
  } catch {
    return null;
  }
};

export const broadcastTabEvent = (type, payload = {}) => {
  const message = { type, payload, timestamp: Date.now() };

  if (isBroadcastChannelSupported && broadcastChannel) {
    broadcastChannel.postMessage(message);
    return;
  }

  try {
    localStorage.setItem(CHANNEL_NAME, serialize(message));
  } catch (error) {
    console.warn("Tab sync broadcast failed:", error);
  }
};

export const subscribeTabEvents = (handler) => {
  const safeHandler = (message) => {
    if (!message || !message.type) return;
    handler(message);
  };

  const bcListener = (event) => {
    safeHandler(event.data);
  };

  const storageListener = (event) => {
    if (event.key !== CHANNEL_NAME || !event.newValue) return;
    safeHandler(parse(event.newValue));
  };

  if (isBroadcastChannelSupported && broadcastChannel) {
    broadcastChannel.addEventListener("message", bcListener);
  }

  window.addEventListener("storage", storageListener);

  return () => {
    if (isBroadcastChannelSupported && broadcastChannel) {
      broadcastChannel.removeEventListener("message", bcListener);
    }
    window.removeEventListener("storage", storageListener);
  };
};
