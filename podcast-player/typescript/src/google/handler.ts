import {Player} from '../player';
import {Handler} from 'jovo-core';


const GoogleHandler: Handler = {
    AUDIOPLAYER: {
        'GoogleAction.Finished'() {
            let index = this.$user.$data.currentIndex;
            let episode = Player.getNextEpisode(index);
            if (episode && this.$googleAction) {
                this.$user.$data.currentIndex -= 1;
                if (this.$googleAction.$mediaResponse) {
                    this.$googleAction.$mediaResponse.play(episode.url, episode.title);
                }
                this.$googleAction.showSuggestionChips(['pause', 'start over']);
                this.ask('Enjoy');
            } else {
                this.tell('');
            }
        },
    },
};

export {GoogleHandler};
