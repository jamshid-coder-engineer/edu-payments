// e2e testlar alohida bazada ishlaydi, asosiy dev.db ga tegilmaydi
process.env.DATABASE_URL = 'file:./test.db';
process.env.APP_TIMEZONE = 'Asia/Tashkent';
process.env.CORS_ORIGIN = 'http://localhost:5173';
// Testlar ko'p so'rov yuboradi, rate limit ularga xalaqit bermasin
process.env.RATE_LIMIT_PER_MINUTE = '10000';
