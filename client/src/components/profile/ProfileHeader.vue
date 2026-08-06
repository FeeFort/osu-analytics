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
  gap: 32px;
  padding: 24px 32px;
}

.avatar-placeholder {
  width: 160px;
  height: 160px;
  border-radius: 50%;
  background: var(--p-content-hover-background);
  border: 3px solid var(--p-primary-color);
  flex: 0 0 auto;
}

.meta-block {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.player-name {
  margin: 0;
  font-size: 40px;
  font-weight: 800;
  color: var(--p-text-color);
}

.badges-row {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  align-items: center;
}

.country-row {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-top: -6px;
}

.country-flag {
  width: 26px;
  height: 18px;
  object-fit: cover;
  border-radius: 3px;
  display: block;
  flex: 0 0 auto;
}

.country-name {
  font-size: 18px;
  font-weight: 500;
  color: var(--p-text-color);
}

.stats-block {
  display: flex;
  gap: 32px;
  flex: 0 0 auto;
  padding-right: 24px;
}

.stat-item {
  display: flex;
  flex-direction: column;
  gap: 5px;
  align-items: flex-start;
  padding-left: 28px;
  border-left: 1px solid var(--p-content-border-color);
}

.stat-item:first-child {
  padding-left: 0;
  border-left: none;
}

.stat-value {
  font-size: 32px;
  font-weight: 700;
  color: var(--p-text-color);
}

.stat-label {
  font-size: 13px;
  color: var(--p-text-muted-color);
}

.stat-sub {
  font-size: 11px;
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
