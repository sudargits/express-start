/**
 * Created by rakhmatullahyoga on 06/07/17.
 */

'use strict';

module.exports = function (TOOLS, MODULES) {
    console.time('Loading express engine');
    // Initialize Express engine
    let APP = MODULES.EXPRESS();
    APP.use(MODULES.BODY_PARSER.urlencoded({ extended: false }));
    APP.use(MODULES.BODY_PARSER.json({ extended: true }));
    APP.use(MODULES.CORS());
    APP.use(MODULES.EXPRESS_LOGGER.create(TOOLS.LOG));
    APP.use(MODULES.METHOD_OVERRIDE());
    APP.use(TOOLS.MULTER.single());

    // Initialize express interface
    TOOLS.INTERFACES.EXPRESS = require(TOOLS.CONSTANTS.PATH.CLASS_LOADER)(TOOLS, MODULES, TOOLS.CONSTANTS.PATH.EXPRESS_INTERFACES_PATH);

    // Initialize routers
    require(TOOLS.CONSTANTS.PATH.ROUTERS_LOADER)(TOOLS, APP);

    // Not found route handler
    APP.use(function(req, res) {
        return res.status(404).json({ status: MODULES.HTTP.STATUS_CODES[404] });
    });

    // Starting the application server
    let SERVER = APP.listen(process.env.APP_PORT, function () {
        console.timeEnd('Loading express engine');
        console.timeEnd('Total application preparation time');
        TOOLS.LOG.info('Listening on port: ' + SERVER.address().port);
    });
};