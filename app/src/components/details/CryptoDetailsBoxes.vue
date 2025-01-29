<template>
  <div class="crypto-details-boxes">
    <!-- Links Section -->
    <div class="links-section mb-4">
      <h5>Useful Links</h5>
      <ul>
        <li v-if="linkHomepage">
          <a :href="linkHomepage" target="_blank" rel="noopener">Homepage</a>
        </li>
        <li v-if="linkWhitepaper">
          <a :href="linkWhitepaper" target="_blank" rel="noopener">Whitepaper</a>
        </li>
      </ul>
    </div>

    <!-- Sentiment Section -->
    <div class="sentiment-section">
      <h5>Community Sentiment</h5>
      <div class="sentiment-bars">
        <div class="sentiment-bar up">
          <span>👍 {{ sentimentVotesUp }}%</span>
          <div class="progress">
            <div
              class="progress-bar bg-success"
              role="progressbar"
              :style="{ width: sentimentVotesUp + '%' }"
              :aria-valuenow="sentimentVotesUp"
              aria-valuemin="0"
              aria-valuemax="100"
            ></div>
          </div>
        </div>
        <div class="sentiment-bar down mt-3">
          <span>👎 {{ sentimentVotesDown }}%</span>
          <div class="progress">
            <div
              class="progress-bar bg-danger"
              role="progressbar"
              :style="{ width: sentimentVotesDown + '%' }"
              :aria-valuenow="sentimentVotesDown"
              aria-valuemin="0"
              aria-valuemax="100"
            ></div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'CryptoDetailsBoxes',
  props: {
    cryptoDetails: {
      type: Object,
      required: true
    }
  },
  setup(props) {
    console.log(props.cryptoDetails)
    const linkHomepage = props.cryptoDetails.homepage
    const linkWhitepaper = props.cryptoDetails.whitepaper
    const sentimentVotesUp = props.cryptoDetails.sentiment_up_percentage
    const sentimentVotesDown = props.cryptoDetails.sentiment_down_percentage

    return {
      linkHomepage,
      linkWhitepaper,
      sentimentVotesUp,
      sentimentVotesDown
    }
  }
}
</script>

<style scoped>
.crypto-details-boxes {
  padding: 20px;
  background-color: #ffffff;
  border: 1px solid #e9ecef;
  border-radius: 8px;
}

.links-section h5,
.sentiment-section h5 {
  margin-bottom: 15px;
  font-size: 1.1rem;
  color: #343a40;
}

.links-section ul {
  list-style-type: none;
  padding: 0;
}

.links-section li {
  margin-bottom: 8px;
}

.links-section a {
  color: #0d6efd;
  text-decoration: none;
}

.links-section a:hover {
  text-decoration: underline;
}

.sentiment-bars {
  display: flex;
  flex-direction: column;
}

.sentiment-bar span {
  display: block;
  margin-bottom: 5px;
  font-weight: 600;
}

.progress {
  height: 20px;
}

.progress-bar {
  transition: width 0.6s ease;
}
</style>
