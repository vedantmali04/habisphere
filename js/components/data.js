/* ///////////////
    CONSTANTS DEFINITIONS
/////////////// */

// Database
export const STORAGE_KEY = {
    users: "users",
    taken_uids: "taken_UIDs",
    current_user: "current_user"
}

export const STATUS_HTTP_RESPONSE = {
    // Informational Responses (1xx)
    continue: 100,
    protocolSwitch: 101,
    processing: 102,
    // Successful Responses (2xx)
    ok: 200,
    created: 201,
    accepted: 202,
    noContent: 204,
    resetContent: 205,
    partialContent: 206,
    // Redirection Messages (3xx)
    multipleChoices: 300,
    movedPermanently: 301,
    found: 302,
    seeOther: 303,
    notModified: 304,
    temporaryRedirect: 307,
    permanentRedirect: 308, // Though not recommended, included for completeness
    // Client Error Responses (4xx)
    badRequest: 400,
    unauthorized: 401,
    forbidden: 403,
    notFound: 404,
    methodNotAllowed: 405,
    requestTimeout: 408,
    conflict: 409,
    gone: 410,
    lengthRequired: 411,
    preconditionFailed: 412,
    payloadTooLarge: 413,
    uriTooLong: 414,
    unsupportedMediaType: 415,
    rangeNotSatisfiable: 416,
    expectationFailed: 417,
    // Server Error Responses (5xx)
    internalServerError: 500,
    badGateway: 502,
    serviceUnavailable: 503,
    gatewayTimeout: 504,
    httpVersionNotSupported: 505,
}

// Input Status
export const UI_STATUS_FEEDBACK = {
    error: "error",
    info: "info",
    success: "success"
}

// User THEME
export const UI_THEME = {
    light: 1,
    dark: 2
}

// HTML UIs Classes
export const UI_CLASSES = {
    fieldset: "fieldset",
    error: "error",
    success: "success",
    info: "info"
}

// HTML UI Size
export const UI_SIZE = {
    xs: "extra-small",
    s: "small",
    m: "medium",
    l: "large",
    xl: "extra-large",
}

/* ///////////////
    OTHER DATA
/////////////// */

// DATE AND TIME
export const TIME_WEEK_DAYS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
export const TIME_MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

// QUOTES JSON

export const QUOTES =
    [
        {
            "quote": "The best way to predict the future is to create it.",
            "author": "Abraham Lincoln",
            "achievement": "16th US President"
        },
        {
            "quote": "The only person you are destined to become is the person you decide to be.",
            "author": "Ralph Waldo Emerson",
            "achievement": "Essayist, Poet"
        },
        {
            "quote": "Success is not final, failure is not fatal: it is the courage to continue that counts.",
            "author": "Winston Churchill",
            "achievement": "Prime Minister of UK"
        },
        {
            "quote": "The difference between ordinary and extraordinary is that little extra.",
            "author": "Jimmy Johnson",
            "achievement": "NFL Coach, 5x Super Bowls"
        },
        {
            "quote": "It is during our darkest moments that we must focus to see the light.",
            "author": "Aristotle Onassis",
            "achievement": "Greek Shipping Magnate"
        },
        {
            "quote": "Twenty years from now you will be more disappointed by the things that you didn't do than by the ones you did do. So throw off the bowlines, sail away from safe harbor, catch the trade winds in your sails. Explore, Dream, Discover.",
            "author": "Mark Twain",
            "achievement": "American Author"
        },
        {
            "quote": "Don't limit yourself. Many things that seem impossible are actually just a matter of not knowing how to do them yet.",
            "author": "Marie Curie",
            "achievement": "Physicist, Chemist, 2x Nobel Prizes"
        },
        {
            "quote": "The only way to do great work is to love what you do. If you haven't found it yet, keep looking. Don't settle.",
            "author": "Steve Jobs",
            "achievement": "Apple Co-founder"
        },
        {
            "quote": "The journey of a thousand miles begins with a single step.",
            "author": "Lao Tzu",
            "achievement": "Ancient Chinese Philosopher"
        },
        {
            "quote": "The man who moves a mountain begins by carrying away small stones.",
            "author": "Confucius",
            "achievement": "Ancient Chinese Philosopher"
        },
        {
            "quote": "You don't have to be great to start, but you have to start to be great.",
            "author": "Zig Ziglar",
            "achievement": "Motivational Speaker"
        },
        {
            "quote": "The mind is everything. What you think you become.",
            "author": "Buddha",
            "achievement": "Spiritual Teacher"
        },
        {
            "quote": "Our greatest glory is not in never falling, but in rising every time we fall.",
            "author": "Nelson Mandela",
            "achievement": "South African President"
        },
        {
            "quote": "The only way to do great work is to love what you do.",
            "author": "Steve Jobs",
            "achievement": "Apple Co-founder"
        },
        {
            "quote": "The difference between who you are and who you want to be is what you do.",
            "author": "Unknown",
        },
        {
            "quote": "It is never too late to be what you might have been.",
            "author": "George Eliot",
            "achievement": "English Novelist"
        },
        {
            "quote": "You are never too old to set another goal or to dream a new dream.",
            "author": "C.S. Lewis",
            "achievement": "British Writer"
        },
        {
            "quote": "Don't wait for the perfect moment; take moments and make them perfect.",
            "author": "Paxson Ching",
            "achievement": "Motivational Speaker"
        },
        {
            "quote": "Every day is a new opportunity. Make the most of it.",
            "author": "Hira Ratan Manekar",
            "achievement": "Indian Spiritual Leader"
        },
        {
            "quote": "Habit is a second nature.",
            "author": "Latin Proverb",
        },
        {
            "quote": "Procrastination is the thief of time.",
            "author": "Charles Dickens",
            "achievement": "English Novelist"
        },
        {
            "quote": "The only way to break a bad habit is to replace it with a good one.",
            "author": "James Clear",
            "achievement": "Author of Atomic Habits"
        },
        {
            "quote": "You miss 100% of the shots you don't take.",
            "author": "Wayne Gretzky",
            "achievement": "NHL Hockey Legend"
        },
        {
            "quote": "It's not what happens to you, but how you react that matters.",
            "author": "Epictetus",
            "achievement": "Stoic Philosopher"
        },
        {
            "quote": "Continuous improvement is better than delayed perfection.",
            "author": "Mark Twain",
            "achievement": "American Author"
        },
        {
            "quote": "Don't judge each day by the harvest you reap, but by the seeds that you plant.",
            "author": "Robert Louis Stevenson",
            "achievement": "Scottish Novelist"
        },
        {
            "quote": "The best time to plant a tree was 20 years ago. The second best time is now.",
            "author": "Chinese Proverb",
        },
        {
            "quote": "Small changes, repeated consistently, can produce enormous results.",
            "author": "Tom Rath",
            "achievement": "Author of StrengthsFinder"
        },
        {
            "quote": "You are never too far gone to start over.",
            "author": "Estée Lauder",
            "achievement": "Cosmetics Entrepreneur"
        }
    ];