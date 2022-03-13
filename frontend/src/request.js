import axios from 'axios';

export const request = async ({ url, method, session, publicRoute }) => {
    // if (!session && method !== 'DELETE') return alert('no session, please include a session object');
    if (!method) return alert('no method, please include a method string');
    if (!url) return alert('no route, please include a route string');

    const rawResponse = await axios({
        method,
        url,
        data: session,
        // headers: {
        //     Authorization: publicRoute ? null : `Bearer ${access_token}`,
        // },
    }).catch(err => {
        console.error(err, 'error in request');
    });

    console.log(rawResponse, 'Raw Response');
    if (!rawResponse) return false;

    return rawResponse.data;
};
