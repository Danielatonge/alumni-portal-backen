import https from 'https';

export const HTTPSrequest = async (options: any) =>
    new Promise((resolve, reject) => {
        const request = https.request(options, response => {
            let data = '';
            response.on('data', chunk => {
                data = data + chunk.toString();
            });

            response.on('end', () => {
                try{
                    console.log(data)
                    resolve(JSON.parse(data));
                } catch (e) {
                    reject(e)
                }
            });
        });

        request.on('error', error => {
            reject(error);
        });

        request.end();
    });
