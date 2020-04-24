const userRoutes = require('./users');
const eventRoutes = require('./events');
const newsRoutes = require('./news');


const constructorMethod = app => {
    app.use("/", userRoutes);
    app.use("/", eventRoutes);
    app.use("/", newsRoutes);

    app.use("*", (req, res) => {
        res.status(404).json({error:'Not found'});
      });
};

module.exports = constructorMethod;