<template>
    <div class="crypto-table">
        <table>
            <thead>
              <tr>
                <th>Rank</th>
                <th>Name</th>
                <th>Market Cap</th>
                <th>Price</th>
                <th>Volume (24h)</th>
                <th>Change (24h)</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>1</td>
                <td>Bitcoin (BTC)</td>
                <td>$1 Trillion</td>
                <td>$50,000</td>
                <td>$50 Billion</td>
                <td class="positive">+2%</td>
              </tr>
              <tr>
                <td>2</td>
                <td>Ethereum (ETH)</td>
                <td>$500 Billion</td>
                <td>$4,000</td>
                <td>$30 Billion</td>
                <td class="positive">+5%</td>
              </tr>
              <tr>
                <td>3</td>
                <td>Binance Coin (BNB)</td>
                <td>$100 Billion</td>
                <td>$600</td>
                <td>$10 Billion</td>
                <td class="negative">-1%</td>
              </tr>
              <tr>
                <td>4</td>
                <td>Cardano (ADA)</td>
                <td>$80 Billion</td>
                <td>$2.50</td>
                <td>$8 Billion</td>
                <td class="positive">+3%</td>
              </tr>
              <tr>
                <td>5</td>
                <td>Solana (SOL)</td>
                <td>$70 Billion</td>
                <td>$150</td>
                <td>$5 Billion</td>
                <td class="positive">+4%</td>
              </tr>
            </tbody>
          </table>
    </div>
</template>

<script>
export default {
    name: "CryptoTable",
};
</script>