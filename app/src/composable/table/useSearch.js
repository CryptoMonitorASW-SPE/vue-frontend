import { computed } from 'vue'

export function useSearch(data, searchQuery) {
  const searchResults = computed(() => {
    const query = searchQuery.value.trim().toLowerCase()
    if (!query) return data.value
    return data.value.filter(item => item.name.toLowerCase().includes(query))
  })

  return { searchResults }
}
