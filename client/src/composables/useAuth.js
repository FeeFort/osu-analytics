import { ref, computed } from 'vue'

//TODO: replace with backend calls when it will be created
const user = ref({
  id: 1,
  username: 'Player Name',
  badges: ['admin']
})

const isAdmin = computed(() => user.value?.badges?.includes('admin') ?? false)

function hasBadge(badgeKey) {
  return user.value?.badges?.includes(badgeKey) ?? false
}

export function useAuth() {
  return { user, isAdmin, hasBadge }
}
