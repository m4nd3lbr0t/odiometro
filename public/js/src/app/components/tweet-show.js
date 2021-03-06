Vue.component('tweet-show', {

	template: `
		<div id="tweets">
			<a target="_blank" class="tweets" :href="'https://twitter.com/' + screen_name + '/status/' + id_str">
				<span v-html="tweet"></span>
			</a>
		</div>
  `,

	data() {
		return {
			tweet: '',
			id_str: '',
			screen_name: '',
			lastStabWasLeft: false
		}
	},

	created: function() {

		// Let's ask immediately for the last tweet
		socket.emit('retrieve_last_tweet', true);

		// Update tweet socket
		socket.on('tweet', function(tweet) {
			this.updateTweet(tweet);
			this.updateHeaderStabs();
		}.bind(this));

		// Retrieve the tracked queries (so we can highlight them in the tweets)
		axios.get('/track_' + this.$locale + '.json').then(function(response) {
			store.track = response.data;
		});
	},

	methods: {

		updateTweet: function(tweet) {
			this.tweet = lib.parseTweet(tweet.tweet, store.track);
			this.id_str = tweet.id_str;
			this.screen_name = tweet.screen_name;
		},

		updateHeaderStabs: function() {

			var selector = this.lastStabWasLeft ? document.getElementById('stab-right') : document.getElementById('stab-left');
			selector.classList.add('active');
			this.lastStabWasLeft = !this.lastStabWasLeft;
			setTimeout(function() {
				selector.classList.remove('active');
			}, 510);
		}
	}

});