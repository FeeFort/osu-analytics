<script setup>
import Badge from '../common/Badge.vue';

defineProps({
  country: { type: Object, required: true },
  badges: { type: Array, required: true },
  stats: { type: Array, required: true },
  playerName: { type: String, default: 'Player Name' }
});
</script>

<template>
  <section class="panel app-theme-surface profile-header">
    <div class="avatar-block">
      <div class="avatar-placeholder" />
    </div>
    <div class="meta-block">
      <div class="name-row">
        <h1 class="player-name">{{ playerName }}</h1>
      </div>
      <div class="country-row">
        <img class="country-flag" :src="`./src/assets/countries/${country.code}.png`" :alt="country.name" />
        <span class="country-name">{{ country.name }}</span>
      </div>
      <div class="badges-row">
        <Badge v-for="badge in badges" :key="badge.label" v-bind="badge" />
      </div>
    </div>
    <div class="stats-block">
      <div v-for="stat in stats" :key="stat.label" class="stat-item">
        <span class="stat-label">{{ stat.label }}</span>
        <span class="stat-value">{{ stat.value }}</span>
        <span class="stat-sub">{{ stat.sub }}</span>
      </div>
    </div>
  </section>
</template>

<style scoped>
.profile-header {
  display: flex;
  align-items: center;
  gap: 2rem;
  padding: 1.5rem 2rem;
}

.avatar-placeholder {
  width: 10rem;
  height: 10rem;
  border-radius: 50%;
  background: var(--p-content-hover-background);
  border: 0.188rem solid var(--p-primary-color);
  flex: 0 0 auto;
}

.meta-block {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 0.875rem;
}

.player-name {
  margin: 0;
  font-size: 2.5rem;
  font-weight: 800;
  color: var(--p-text-color);
}

.badges-row {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  align-items: center;
}

.country-row {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-top: -0.375rem;
}

.country-flag {
  width: 1.625rem;
  height: 1.125rem;
  object-fit: cover;
  border-radius: 0.188rem;
  display: block;
  flex: 0 0 auto;
}

.country-name {
  font-size: 1.125rem;
  font-weight: 500;
  color: var(--p-text-color);
}

.stats-block {
  display: flex;
  gap: 2rem;
  flex: 0 0 auto;
  padding-right: 1.5rem;
}

.stat-item {
  display: flex;
  flex-direction: column;
  gap: 0.313rem;
  align-items: flex-start;
  padding-left: 1.75rem;
  border-left: 1px solid var(--p-content-border-color);
}

.stat-item:first-child {
  padding-left: 0;
  border-left: none;
}

.stat-value {
  font-size: 2rem;
  font-weight: 700;
  color: var(--p-text-color);
}

.stat-label {
  font-size: 0.813rem;
  color: var(--p-text-muted-color);
}

.stat-sub {
  font-size: 0.688rem;
  color: var(--p-text-muted-color);
}

@media (max-width: 900px) {
  .profile-header {
    flex-direction: column;
    align-items: stretch;
  }

  .stats-block {
    flex-wrap: wrap;
    padding-right: 0;
  }
}
</style>
