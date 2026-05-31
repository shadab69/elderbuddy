async function test() {
    try {
        const postRes = await fetch('http://localhost:3000/api/banners', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                imageSrc: 'assets/test_banner.png',
                link: '#/products',
                styleType: 'cover',
                position: 'center',
                bgColor: '#ffffff'
            })
        });
        const postData = await postRes.json();
        console.log('Post Response:', postData);

        const getRes = await fetch('http://localhost:3000/api/banners');
        const getData = await getRes.json();
        console.log('Get Response:', getData);
    } catch (e) {
        console.error('Error during test:', e.message);
    }
}

test();
