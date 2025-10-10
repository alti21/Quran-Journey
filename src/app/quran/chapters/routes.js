import axios from 'axios';

/**
* Fetches Surahs (chapters) using the Quran API.
*
* @param {string} accessToken - Valid OAuth access token.
* @param {string} clientId - Client ID for the API.
* @returns {Promise<Object[]>} List of chapters.
*/

export async function getChapters(accessToken, clientId) {
    try {
        const response = await axios({
            method: 'get',
            url: `${process.env.OAUTH_BASE_URL}/chapters`,

            headers: {
                'x-auth-token': accessToken,
                'x-client-id': clientId
            }
        });

        return response.data;
    } catch (error) {
    console.error('Error fetching chapters:', error);
  }
}