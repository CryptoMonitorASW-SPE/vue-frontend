<template>
    <div class="ohlc-chart-container">
      <div class="time-span-buttons">
        <button
          v-for="span in timeSpans"
          :key="span"
          :class="['time-span-button', { active: selectedSpan === span }]"
          @click="setTimeSpan(span)"
        >
          {{ span }}
        </button>
      </div>
      <div v-if="store.isLoading" class="loading">Loading...</div>
      <div v-else-if="store.error" class="error">{{ store.error }}</div>
      <div v-else class="ohlc-chart">
        <apexcharts type="candlestick" :options="chartOptions" :series="currentSeries"></apexcharts>
      </div>
    </div>
  </template>
  
  <script>
  import { ref, watch, computed, onMounted } from 'vue'
  import { useCryptoChartDetailStore } from '@/store/cryptoChartDetailStore'
  import VueApexCharts from 'vue3-apexcharts'
  
  export default {
    name: 'CryptoOHLChart',
    components: {
      apexcharts: VueApexCharts,
    },
    setup() {
      const store = useCryptoChartDetailStore()
      const timeSpans = ['1D', '7D', '1M', '6M', '1Y']
      const selectedSpan = ref('1D')
      const currentSeries = ref([])
  
      const chartOptions = ref({
        chart: {
          type: 'candlestick',
          height: 350,
          toolbar: {
            show: true,
          },
        },
        title: {
          text: 'OHLC Chart',
          align: 'left',
        },
        xaxis: {
          type: 'datetime',
        },
        yaxis: {
          tooltip: {
            enabled: true,
          },
        },
      })
  
      // Function to set the selected time span and fetch data
      const setTimeSpan = (span) => {
        if (selectedSpan.value !== span) {
          selectedSpan.value = span
          fetchDataForSpan(span)
        }
      }
  
      // Fetch data for the selected time span
      const fetchDataForSpan = (span) => {
        // Check if data for the selected span is already available
        if (!store.chartData[span]) {
          store.fetchChartData(span)
        } else {
          updateCurrentSeries(store.chartData[span])
        }
      }
  
      // Update the chart series based on fetched data
      const updateCurrentSeries = (data) => {
        currentSeries.value = [
          {
            data: data.map((point) => ({
              x: new Date(point[0]),
              y: [point[1], point[2], point[3], point[4]],
            })),
          },
        ]
      }
  
      // Watch for changes in the store's chartData for the selected span
      watch(
        () => store.chartData[selectedSpan.value],
        (newData) => {
          if (newData) {
            updateCurrentSeries(newData)
          }
        }
      )
  
      // Initialize by fetching data for the default selected span
      onMounted(() => {
        fetchDataForSpan(selectedSpan.value)
      })
  
      return {
        store,
        timeSpans,
        selectedSpan,
        setTimeSpan,
        currentSeries,
        chartOptions,
      }
    },
  }
  </script>
  
  <style lang="scss" scoped>
  .ohlc-chart-container {
    display: flex;
    flex-direction: column;
    align-items: center;
  }
  
  .time-span-buttons {
    margin-bottom: 20px;
  }
  
  .time-span-button {
    margin: 0 5px;
    padding: 8px 16px;
    border: none;
    background-color: #f0f0f0;
    cursor: pointer;
    border-radius: 4px;
    transition: background-color 0.3s;
  }
  
  .time-span-button.active {
    background-color: #007bff;
    color: white;
  }
  
  .time-span-button:hover {
    background-color: #dcdcdc;
  }
  
  .loading,
  .error {
    font-size: 16px;
    margin-top: 20px;
  }
  
  .ohlc-chart {
    width: 100%;
    max-width: 800px;
  }
  </style>
  