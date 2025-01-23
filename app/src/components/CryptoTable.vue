<template>
    <div class="crypto-table">
        <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Symbol</th>
                <th>Price</th>
                <th>Market Cap</th>
                <th>Change (24h)</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="crypto in cryptocurrencies" :key="crypto.id">
                <td>{{ crypto.name }}</td>
                <td>{{ crypto.symbol.toUpperCase() }}</td>
                <td>{{ crypto.prices.values.usd }}</td>
                <td>{{ crypto.marketCap.values.usd }}</td>
                <td :class="{'positive': crypto.priceChangePercentage24h >= 0, 'negative': crypto.priceChangePercentage24h < 0}">
                  {{ crypto.priceChangePercentage24h }}
                </td>
              </tr>
            </tbody>
          </table>
    </div>
</template>

<script>
import { useCryptoStore } from "../stores/CryptoStore";
import { computed } from "vue";

export default {
    name: "CryptoTable",
    setup () {
        const cryptoStore = useCryptoStore();
        const cryptocurrencies = computed(() => cryptoStore.cryptocurrencies);

        return {
            cryptocurrencies,
        };
    },
};
</script>