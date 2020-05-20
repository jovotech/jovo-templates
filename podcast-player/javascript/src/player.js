const episodesJSON = require('./episodes.json');

module.exports = {
  getLatestEpisode: function () {
    return episodesJSON[0];
  },
  getFirstEpisode: function () {
    return episodesJSON[episodesJSON.length - 1];
  },
  getNextEpisode: function (index) {
    return episodesJSON[index - 1];
  },
  getPreviousEpisode: function (index) {
    return episodesJSON[index + 1];
  },
  getEpisodeIndex: function (episode) {
    return episodesJSON.indexOf(episode);
  },
  getEpisode: function (index) {
    return episodesJSON[index];
  },
  getRandomIndices: function (number) {
    let arr = [];
    while (arr.length < number) {
      let randomNumber = Math.floor(Math.random() * episodesJSON.length);
      if (arr.indexOf(randomNumber) === -1) {
        arr.push(randomNumber);
      }
    }
    return arr;
  },
};
