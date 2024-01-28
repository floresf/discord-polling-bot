
module.exports = {
    ApplicationCommandType: {
        CHAT_INPUT: 1, // Slash commands; a text-based command that shows up when a user types / in chat
        USER: 2, // A UI-based command that shows up when you right click or tap on a user
        MESSAGE: 3 // A UI-based command that shows up when you right click or tap on a message
    },
    InteractionType: {
        PING: 1,
        APPLICATION_COMMAND: 2,
        MESSAGE_COMPONENT: 3,
        APPLICATION_COMMAND_AUTOCOMPLETE: 4,
        MODAL_SUBMIT: 5
    },
    InteractionResponseType: {
        PONG: 1, // ACK a Ping
        CHANNEL_MESSAGE_WITH_SOURCE: 4, // Respond to an interaction with a message
        DEFERRED_CHANNEL_MESSAGE_WITH_SOURCE: 5, // ACK an interaction and edit a response later, the user sees a loading state
        DEFERRED_UPDATE_MESSAGE: 6, // For components, ACK an interaction and edit the original message later; the user does not see a loading state
        UPDATE_MESSAGE: 7, // For components, edit the message the component was attached to
        APPLICATION_COMMAND_AUTOCOMPLETE_RESULT: 8, // Respond to an autocomplete interaction with suggested choices
        MODAL: 9, // Respond to an interaction with a popup modal
        PREMIUM_REQUIRED: 10 // Respond to an interaction with an upgrade button, only available for apps with monetization enabled
    },
    MessageComponentType: {
        ACTION_ROW: 1,
        BUTTON: 2,
        STRING_SELECT: 3,
        TEXT_INPUT: 4,
        USER_SELECT: 5,
        ROLE_SELECT: 6,
        MENTIONABLE_SELECT: 7,
        CHANNEL_SELECT: 8
    }
};