const axios = require('axios');
const R = require('ramda');

const subReddits = [
    'shallowhouse',
    'deephouse',
    'nudisco'
];

const sort = R.sortWith([
    R.descend(R.prop('score')),
    R.descend(R.prop('numComments'))
]);

const populateItem = (item) => {
    const {
        score,
        url,
        title,
        num_comments,
        subreddit_name_prefixed,
        secure_media
    } = item;
    return {
        score,
        url,
        title,
        subreddit: subreddit_name_prefixed,
        numComments: num_comments,
        media: secure_media
    }
};

const redditUrl = (subReddit, count=1) => `https://www.reddit.com/r/${subReddit}.json?limit=${count}`;
const forCount = (count) => (subReddit) => redditUrl(subReddit, count);

const makeRequest = async () => {

    const urls = subReddits.map(forCount(50));

    const requests = R.flatten(urls).map((url) => axios.get(url));

    const results = await Promise.all(requests);

    const resultantData = results.map((result) => result.data.data.children);

    const combinedResults = resultantData.reduce((accum, item) => {
        return [...accum, ...item]
    }, []);

    return R.compose(
        sort,
        R.filter((c) => c['media']),
        R.map((c) => populateItem(c.data))
    )(combinedResults)

};

module.exports = {
    makeRequest
};
