module.exports = {
    debug:          process.env.DEBUG,

    port:           process.env.PORT || 3000,

    redis_port:     process.env.REDIS_PORT || 6379,
    
    origin:         "http://localhost:3001",
};