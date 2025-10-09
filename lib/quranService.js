import axios from 'axios';

/**
 * Retrieves a valid OAuth access token.
 * Example response:
 * {
 *   "access_token": "YOUR_ACCESS_TOKEN",
 *   "token_type": "bearer",
 *   "expires_in": 3600,
 *   "scope": "content"
 * }
 *
 * @returns {Promise<string>} A valid OAuth access token.
 */
export async function getAccessToken() {
    const { OAUTH_BASE_URL, CLIENT_ID, CLIENT_SECRET } = process.env;
    const auth = Buffer.from(`${CLIENT_ID}:${CLIENT_SECRET}`).toString('base64');

    try {
        const response = await axios({
        method: 'post',
        url: `${OAUTH_BASE_URL}/oauth2/token`,
        headers: {
            'Authorization': `Basic ${auth}`,
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        data: 'grant_type=client_credentials&scope=content'
        });

        return response.data.access_token;
    } catch (error) {
        console.error('Error getting access token:', error);
    }
}