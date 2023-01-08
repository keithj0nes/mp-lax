const { getAllMisc } = require('../controllers/misc');

const controller = (cb) => (process.argv[2] === 'showTable' ? cb.name : cb);

module.exports = {
    GET_MISC: {
        method: 'GET',
        path: '/api/misc',
        controller: controller(getAllMisc),
    },
};
