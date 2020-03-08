// import TweetComponent from './components/TweetComponent.js';
// import SearchComponent from './components/SearchComponent.js';
// import NewTweetComponent from './components/NewTweetComponent.js';

const searchComponent = Vue.component('search-component', {
    data() {
        return {
            input: ''
        };
    },
    watch: {
        input(val) {
            this.$emit('on-input', val);
        },
    },
    template: `
        <div class="search-container mb-2">
            <div class="input-group">
                <label for="searchBar"
                <input type="text" id="searchBar" class="form-control" placeholder="Search in tweets" aria-label="Text input with checkbox" v-model="input">
            </div>
        </div>
    `
});

const tweetComponent = Vue.component('tweet-component', {
    props: {
        'tweetArray': Array,
        'myTweet': Boolean
    },
    data() {
        return {
            imgClasses: ['tweet-pic', 'rounded-circle']
        };
    },
    methods: {
        getFormattedTweetDate(date) {
            return moment(date).format('LLLL');
        },
        getErrorImg(event) {
            event.target.src = './img/no_photo.png';
        }
    },
    template: `
        <ul class="pl-0">
            <li class="middle-row" v-for="tweet in tweetArray" :key="tweet.id">
                <img :class="imgClasses" v-bind:src="tweet.user.profile_image_url" :alt="tweet.user.name + ' profile image'" @error="getErrorImg">
                <div :class="['tweet-container', (tweet.user.id === 1320) ? 'my-tweet' : '']">
                    <p>
                        <strong class="mr-1">{{ tweet.user.name }}</strong>
                        <span class="profile-tag">@{{ tweet.user.screen_name }}</span>
                    </p>
                    <p class="mb-2 tweet-datetime">
                        {{ getFormattedTweetDate(tweet.create_at) }}
                    </p>
                    <p>
                        {{ tweet.text }}
                    </p>
                </div>
            </li>
        </ul>
    `
});

const textComponent = Vue.component('text-component', {
    data() {
        return {
            myTweet: ''
        };
    },
    template: `
        <div class="text-container">
            <textarea class="form-control" row="10" v-model="myTweet"></textarea>
            <button class="btn btn-primary ml-1" v-on:click="$emit('submit-tweet', myTweet)">Send</button>
        </div>
    `
});

const gameTitle = Vue.component('game-title', {
    template: `
        <h1>
            <a href="https://en.wikipedia.org/wiki/Tic-tac-toe">Tic Tac Toe</a>
        </h1>
    `,
});

const welcomeMessage = Vue.component('welcome-message', {
    props: {
        'message': String,
        'playerNames': {
            type: Array,
            default: () => [],
        }
    },
    computed: {
        // a computed getter
        messageToPlayers() {
            // `this` points to the vm instance
            if (this.playerNames.length) {
                return `${this.message} ${this.playerNames.join(', ')}`;
            } else {
                return this.message;
            }
        }
    },
    template: `
        <p>
          {{ messageToPlayers }}
        </p>
    `,
});

const readCheckbox = Vue.component('ready-checkbox', {
    props: {
        'name': String,
    },
    data: function() {
        const id = `ready-switch-for-${this.name}`;
        return {
            checked: false,
            id
        };
    },
    methods: {
        onClick(event) {
            this.checked = event.target.checked;
            this.$emit('player-ready', this.name, this.checked);
        }
    },
    template: `
        <div class="custom-control custom-switch">
            <input type="checkbox" class="custom-control-input" :id="id" :checked="checked" @click="onClick">
            <label class="custom-control-label" :for="id">{{name}}, are you ready?</label>
        </div>
    `,
});

const gameBoard = Vue.component('game-board', {
    data: function() {
        return {
            classObject: ['container', 'm-auto', 'bg-light', 'd-flex', 'flex-column'],
            styleObject: {
                'width': '900px',
                'height': '900px'
            },
            boardRowClasses: ['board-row', 'row', 'flex-grow-1'],
            boardCellClasses: ['board-cell', 'col', 'p-4', 'border', 'border-primary', 'rounded-lg'],
        };
    },
    methods: {
        boardRowKey(r) {
            return `row-${r}`;
        },
        boardCellKey(r, c) {
            return `cell-${r}-${c}`;
        }
    },
    template: `
        <div id="board" :class="classObject" :style="styleObject">
            <div v-for="r of 3" :key="boardRowKey(r)" :class="boardRowClasses">
                <div
                    v-for="c of 3"
                    :key="boardCellKey(r, c)"
                    :id="(r - 1) * 3 + c"
                    :class="[{'bg-white': [2, 4, 6, 8].includes((r - 1) * 3 + c)} ,boardCellClasses]">
                </div>
            </div>
        </div>
    `
});

const SubstitutionComponent = Vue.component({
    props: {
        substitution: String,
        input: String,
    },
    computed: {
        filled() {
            return !!this.input;
        },
        text() {
            return this.filled? this.input: this.substitution;
        },
        classes() {
            if (this.filled) {
                return ['font-weight-bold'];
            } else {
                return [
                    'border-bottom',
                    'px-2',
                    'text-muted'
                ];
            }

        }
    },
    template: `
        <span :class="classes">{{text}}</span>
    `,
});

const ResultComponent = Vue.component({
    props: {
        inputs: Array,
        substitutions: Array,
        madlibContent: String,
    },
    data() {
        return {
            classes: ['d-flex', 'bg-white', 'col', 'p-4'],
            styles: {
                'font-size': 'larger',
                'line-height': 2,
            }
        };
    },
    components: {
        'substitution-component': SubstitutionComponent
    },
    computed: {
        numInputs() {
            return this.substitutions.length;
        },
        contentTexts() {
            let rightBracketPos = 0;
            let leftBracketPos = 0;

            const texts = [];
            // eslint-disable-next-line no-constant-condition
            while (true) {
                leftBracketPos = this.madlibContent.indexOf('[', rightBracketPos);
                if (leftBracketPos === -1) {
                    // no further substitution exists
                    texts.push(this.madlibContent.slice(rightBracketPos));
                    break;
                } else {
                    texts.push(this.madlibContent.slice(rightBracketPos, leftBracketPos));
                    rightBracketPos = this.madlibContent.indexOf(']', leftBracketPos);
                }
            }

            return texts.map(text => text.replace(/[[\]]/g, ''));
        },
    },
    template: `
        <div :class="classes" :style="styles">
            <p>
                <span v-for="(text, idx) of contentTexts">
                    <span>{{text}}</span>
                    <substitution-component :key="idx" :input="inputs[idx]" :substitution="substitutions[idx]" v-if="idx < numInputs"></substitution-component>
                </span>
            </p>
        </div>
    `,
});

const InputComponent = Vue.component({
    props: {
        'sid': Number,
        'substitutionLabelName': String,
    },
    data() {
        return {
            classes: ['form-group', 'd-flex'],
            labelClasses: ['text-white', 'col-3'],
            inputClasses: ['col'],
            input: '',
        };
    },
    computed: {
        substitutionID() {
            return `input-${this.sid}`;
        },
    },
    watch: {
        input(val) {
            this.$emit('on-input', this.sid, val);
        },
    },
    template: `
        <div :class="classes">
            <label :class="labelClasses" :for="sid">{{substitutionLabelName}}</label>
            <input :style="inputClasses" type="text" class="form-control" :id="sid" v-model="input">
        </div>
    `,
});

const InputsComponent = Vue.component({
    props: {
        'substitutions': Array,
    },
    components: {
        'input-component': InputComponent,
    },
    methods: {
        onInput(sid, val) {
            this.$emit('on-input', sid, val);
        }
    },
    data() {
        return {
            classes: ['d-flex', 'flex-column', 'justify-content-around', 'bg-secondary', 'col', 'p-4'],
            inputs: [],
        };
    },
    template: `
        <div :class="classes">
            <input-component
                v-for="(substitution, index) of substitutions"
                @on-input="onInput"
                :key="index"
                :sid="index"
                :substitution-label-name="substitution"
            ></input-component>
        </div>
    `,
});

const gameComponent = Vue.component({
    data() {
        return {
            madlib: null,
            classes: ['container', 'w-100', 'bg-light', 'd-flex', 'flex-row', 'py-2'],
            style: {
            },
            inputs: [],
        };
    },
    created() {
    },
    components: {
        'inputs-component': InputsComponent,
        'result-component': ResultComponent
    },
    methods: {
        onInput(sid, val) {
            this.$set(this.inputs, sid, val);
        }
    },
    computed: {
        madlibContent() {
            return this.madlib.content;
        },

        madlibSubstitutions() {
            return this.madlibContent.match(/\[([^\])]*)\]/g).map(substitution => substitution.slice(1, -1));
        },
    },
});

const ticApp = Vue.component({
    data() {
        return {
            message: 'Welcome to the game!',
            playerNames: [],
            appClasses: ['w-100', 'h-100', 'p-5', 'd-flex', 'flex-column', 'align-items-center'],
            playerReady: {}
        };
    },
    methods: {
        onPlayerReady(playerName, isReady) {
            this.$set(this.playerReady, playerName, isReady);
        }
    },
    created() {
        window.setTimeout(() => {
            this.message = 'Ready to get started?';
            this.playerNames.push('Alice', 'Bob');
        }, 1000);
    },
    components: {
        'game-title': gameTitle,
        'welcome-message': welcomeMessage,
        'ready-checkbox': readCheckbox,
        'game-board': gameBoard
    },
    computed: {
        bothPlayerReady() {
            return this.playerNames.length &&
                this.playerNames.map(playerName => this.playerReady[playerName])
                    .reduce((prevValue, currValue) => prevValue && currValue);
        }
    },
});

const ticTacToe = {
    template: `
        <game-title></game-title>
        <welcome-message :message="message" :player-names="playerNames"></welcome-message>
        <template v-if="playerNames.length">
            <ready-checkbox :name="playerNames[0]" @player-ready="onPlayerReady"></ready-checkbox>
            <ready-checkbox :name="playerNames[1]" @player-ready="onPlayerReady"></ready-checkbox>
        </template>
        <div v-else>
            <div class="spinner-grow text-primary" role="status">
                <span class="sr-only">Loading...</span>
            </div>
        </div>
        <game-board v-if="bothPlayerReady"></game-board>
    `
};

const madlibs = {
    template: `
       <div :class="classes" :style="style">
            <inputs-component :substitutions="madlibSubstitutions" @on-input="onInput"></inputs-component>
            <result-component :inputs="inputs" :substitutions="madlibSubstitutions" :madlib-content="madlibContent"></result-component>
        </div>
    `
};

const routes = [
    {
        path: '/tic-tac-toe',
        name: 'Tic-Tac-Toe',
        component: ticTacToe
    },
    {
        path: '/madlibs',
        name: 'Madlibs',
        component: madlibs
    }
];

const router = new VueRouter({ routes });
const app = new Vue({
    router,
    data: {
        currentPath: window.location.href,
        urlBase: 'http://ec2-54-172-96-100.compute-1.amazonaws.com/feed/random',
        searchString: '',
        searchUrl: '',
        tweetMap: new Map(),
        sortedTweets: []
    },
    created() {
        this.fetchData(this.urlBase + '?q=noodle');
        window.addEventListener('scroll', this.handleScroll);
        this.debouncedGetTweets = _.debounce(this.fetchData, 500);
    },
    components: {
        'text-component': textComponent,
        'search-component': searchComponent,
        'tweetComponent': tweetComponent,
    },
    watch: {
        searchString(input) {
            this.sortedTweets = [];
            this.searchUrl = this.urlBase + '?q=' + input.trim().toLowerCase();
            this.debouncedGetTweets(this.searchUrl);
        },
        sortedTweets(after, before) {
            if (after.length > before.length) {
                this.sortedResult();
            }
        }
    },
    methods: {
        onInput(val) {
            this.searchString = val;
        },
        submitTweet(text) {
            const newTweet = {
                text: text,
                create_at: moment().format('LLLL'),
                user: {
                    id: 1320,
                    name: 'ME',
                    screen_name: 'Me_in_1320',
                    profile_image_url: './img/me.jpg'
                }
            };
            console.log(new Date(newTweet.create_at));
            this.sortedTweets.unshift(newTweet);
            this.tweetMap.set(newTweet.id, newTweet);
        },
        fetchData(url) {
            console.log(url);
            axios.get(url)
                .then(res => {
                    const data = res.data;
                    let tweets = data.statuses;
                    if (tweets.length > 0) {
                        tweets.forEach(tweet => {
                            this.tweetMap.set(tweet.id, tweet);
                        });

                        this.sortedTweets = this.getFilteredResult();
                    }
                })
                .catch(error => {
                    console.error('Error: ', error);
                });
        },
        getFilteredResult() {
            return Array.from(this.tweetMap.values()).filter(tweet => tweet.text.includes(this.searchString));
        },
        sortedResult() {
            this.sortedTweets.sort((tweet1, tweet2) => new Date(tweet1.created_at) - new Date(tweet2.created_at));
        },
        handleScroll() {
            if ((window.innerHeight + window.scrollY) >= document.body.scrollHeight) {
                // you're at the bottom of the page
                let url = this.searchUrl === '' ? this.urlBase + '?q=noodle' : this.searchUrl;
                this.fetchData(url);
            }
        }
    },
}).$mount('#app');
