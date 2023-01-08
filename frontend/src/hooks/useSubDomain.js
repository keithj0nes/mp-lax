import { useEffect } from 'react';
import { useSelector } from 'react-redux';

const useSubDomain = () => {
    const { orgs } = useSelector(state => state.misc);
    // console.log(leagues, 'in subdaomnana ======');
    const { host } = window.location;

    const b = host.split('.').slice(0, host.includes('localhost') ? -1 : -2);

    const selectedSubDomain = orgs.find(item => item.slug === b[0])
    useEffect(() => {
        // console.log(b, 'bbbb');

        // if (b.length) {
        //     console.log('SUBDOMAIN EXISTS');
        //     console.log(window.location, 'WINDOW LOCAITON');
        //     // window.location.href = 'http://www.google.com';
        //     window.location.href = 'http://localhost:3000';
        // }
    }, []);

    // console.log(host, 'HOST');
    // console.log(selectedSubDomain, 'selectedSubDomain selectedSubDomain')

    return selectedSubDomain || orgs[0];
};

export default useSubDomain;
