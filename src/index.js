const cheerio = require('cheerio'),
pg = require('request-promise'),
_ = require('lodash'),
Promise = require('bluebird'),
write = require('fs-writefile-promise/lib/node7');

const playlistForMom = [];

Promise.try(() => {
    return _.range(1970, 2018);
}).map(year => {
    return pg(`http://www.chartsurfer.de/musik/single-charts-deutschland/jahrescharts/hits-${year}-2x1.html`);
}).map(response => {
    const $ = cheerio.load(response);
    return _.range(2, 52).map(e => {
        const selector = unescape($('div > table').children().children(`tr:nth-child(${e})`).children('td:nth-child(5)').children().children('a:nth-child(1)').attr('title'));
        return selector;
    });
}).map(song => {
    return playlistForMom.push(song.join('\n'));
}).then(() => {
    return write('./playlistForMom.text', playlistForMom);
}).then(() => {
    console.log('File  has been saved!');
}).catch(console.error);