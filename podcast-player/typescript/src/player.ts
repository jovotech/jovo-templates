const episodesJSON = require('./episodes.json');

export class Player {
    static getLatestEpisode() {
        return episodesJSON[0];
    }

    static getFirstEpisode() {
        return episodesJSON[episodesJSON.length - 1];
    }

    static getNextEpisode(index: number) {
        return episodesJSON[index - 1];
    }

    static getPreviousEpisode(index: number) {
        return episodesJSON[index + 1];
    }

    static getEpisodeIndex(episode: string) {
        return episodesJSON.indexOf(episode);
    }

    static getEpisode(index: number) {
        return episodesJSON[index];
    }

    static getRandomIndices(number: number) {
        let arr = [];
        while (arr.length < number) {
            let randomNumber = Math.floor(Math.random() * episodesJSON.length);
            if (arr.indexOf(randomNumber) === -1) {
                arr.push(randomNumber);
            }
        }
        return arr;
    }
}
