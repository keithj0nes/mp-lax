const auth = {
    CREATE_USER: {
        method: 'POST',
        path: '/api/auth/signup',
        body: { email: 'string', password: 'string' },
    },
};


module.exports = auth;
