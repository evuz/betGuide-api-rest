module.exports = {
    port: process.env.PORT || 3005,
    db: process.env.MONGODB || 'mongodb://localhost:27017/api',
    SECRET_TOKEN: process.env.SECRETTOKEN || 'mitokenpass'
}