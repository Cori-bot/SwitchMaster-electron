const https = require('https');



const HEADERS = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:128.0) Gecko/20100101 Firefox/128.0',
    'Accept': 'application/json, text/plain, */*',
    'Accept-Language': 'en-US,en;q=0.5',
    'Origin': 'https://tracker.gg',
    'Referer': 'https://tracker.gg/',
};


function httpsGet(url, headers) {
    return new Promise((resolve, reject) => {
        https.get(url, { headers }, (res) => {
            let jsonResponse = '';

            res.on('data', (chunk) => {
                jsonResponse += chunk;
            });

            res.on('end', () => {
                if (res.statusCode !== 200) {
                    return reject(new Error(`HTTP ${res.statusCode}: ${jsonResponse}`));
                }

                try {
                    resolve(JSON.parse(jsonResponse));
                } catch (e) {
                    reject(new Error('Failed to parse JSON response'));
                }
            });
        }).on('error', (err) => {
            reject(err);
        });
    });
}


function parseRiotId(riotId) {
    const parts = riotId.split('#');
    if (parts.length !== 2) {
        throw new Error('Invalid Riot ID format. Expected: Username#TAG');
    }
    return {
        name: encodeURIComponent(parts[0]),
        tag: encodeURIComponent(parts[1])
    };
}



async function fetchValorantStats(riotId) {
    const { name, tag } = parseRiotId(riotId);
    const url = `https://api.tracker.gg/api/v2/valorant/standard/profile/riot/${name}%23${tag}?source=web`;

    try {
        const apiResponse = await httpsGet(url, HEADERS);
        if (!apiResponse.data || !apiResponse.data.segments) {
            throw new Error('Invalid response structure from API');
        }

        const segments = apiResponse.data.segments;
        // Find competitive segment or fallback
        const competitiveSegment = segments.find(s => s.attributes?.playlist === 'competitive') || segments[0];

        const stats = competitiveSegment.stats || {};
        const metadata = apiResponse.data.metadata || {};

        return {
            game: 'valorant',
            riotId: riotId,
            level: metadata.accountLevel || 0,
            rank: stats.rank?.metadata?.tierName || 'Unranked',
            rankIcon: stats.rank?.metadata?.iconUrl || 'https://trackercdn.com/cdn/tracker.gg/valorant/icons/tiersv2/0.png',
            peakRank: stats.peakRank?.metadata?.tierName || 'Unranked',
            peakRankIcon: stats.peakRank?.metadata?.iconUrl || 'https://trackercdn.com/cdn/tracker.gg/valorant/icons/tiersv2/0.png',
            playtime: segments[0]?.stats?.timePlayed?.displayValue || '0h',
            banner: apiResponse.data.platformInfo?.avatarUrl || null,
            shard: metadata.activeShard || 'unknown'
        };
    } catch (error) {
        console.error('Error fetching Valorant stats:', error);
        throw new Error(`Failed to fetch Valorant stats: ${error.message}`);
    }
}


async function fetchLeagueStats(riotId) {
    const { name, tag } = parseRiotId(riotId);
    const url = `https://api.tracker.gg/api/v2/lol/standard/profile/riot/${name}%23${tag}?source=web`;

    try {
        const apiResponse = await httpsGet(url, HEADERS);
        if (!apiResponse.data || !apiResponse.data.segments) {
            throw new Error('Invalid response structure from API');
        }

        const segments = apiResponse.data.segments;
        const metadata = apiResponse.data.metadata || {};

        // Find ranked segment with fallbacks
        let rankedSegment = segments.find(s =>
            s.type === 'playlist' && s.attributes?.queueType === 'RANKED_SOLO_5x5'
        );
        if (!rankedSegment) {
            rankedSegment = segments.find(s =>
                s.type === 'queue' && s.attributes?.queueType === 'RANKED_SOLO_5x5'
            );
        }
        if (!rankedSegment) rankedSegment = segments[0];

        const stats = rankedSegment?.stats || {};
        const tierMeta = stats.tier?.metadata || {};
        const currentRankName = tierMeta.rankName || stats.tier?.displayValue || 'Unranked';
        const currentRankIcon = tierMeta.iconUrl || tierMeta.imageUrl || '';
        const playtime = stats.timePlayed?.displayValue || stats.matchesPlayed?.displayValue || '0 games';

        return {
            game: 'league',
            riotId: riotId,
            level: metadata.accountLevel || 0,
            rank: currentRankName,
            rankIcon: currentRankIcon,
            peakRank: 'Unranked',
            peakRankIcon: '',
            playtime,
            banner: apiResponse.data.platformInfo?.avatarUrl || null,
            shard: metadata.platformSlug || 'unknown'
        };
    } catch (error) {
        console.error('Error fetching League stats:', error);
        throw new Error(`Failed to fetch League stats: ${error.message}`);
    }
}


async function fetchAccountStats(riotId, gameType) {
    if (!riotId || !riotId.includes('#')) {
        throw new Error('Invalid Riot ID format');
    }

    if (gameType === 'valorant') {
        return await fetchValorantStats(riotId);
    } else if (gameType === 'league') {
        return await fetchLeagueStats(riotId);
    } else {
        throw new Error('Invalid game type. Must be "valorant" or "league"');
    }
}

module.exports = {
    fetchAccountStats,
    fetchValorantStats,
    fetchLeagueStats
};
