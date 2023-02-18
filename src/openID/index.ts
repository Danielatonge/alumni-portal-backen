import { Issuer } from 'openid-client';

import {
    CLIENT_ID,
    CLIENT_SECRET,
    REDIRECT_URI,
    OPEN_ID_CONFIG_URL,
} from '~/consts';

const innopolisIssuer = await Issuer.discover(OPEN_ID_CONFIG_URL);

export const client = new innopolisIssuer.Client({
    client_id: CLIENT_ID,
    client_secret: CLIENT_SECRET,
    redirect_uris: [REDIRECT_URI],
    response_types: ['code'],
});

export const nonce = '66v4HFX95P-1jlny5FPEIa-LMZL-ZSHs58eVL4PJrl';

export const openIdaAuthorizationUrl = client.authorizationUrl({
    scope: 'openid email',
    response_mode: 'form_post',
    nonce,
});
