<script setup>
defineProps({
  rows: { type: Array, required: true }
});
</script>

<template>
  <div class="skill-profile-table" role="table" aria-label="Skill profile">
    <div class="skill-profile-row skill-profile-header" role="row">
      <span role="columnheader" />
      <span role="columnheader">Min</span>
      <span role="columnheader">Avg</span>
      <span role="columnheader">Max</span>
    </div>
    <div v-for="skill in rows" :key="skill.label" class="skill-profile-row" role="row">
      <span class="skill-profile-name" role="rowheader">
        <component :is="skill.icon" :size="18" :stroke-width="2" :style="{ color: skill.color }" aria-hidden="true" />
        {{ skill.label }}
      </span>
      <span role="cell">{{ skill.min }}</span>
      <span role="cell">{{ skill.avg }}</span>
      <span role="cell">{{ skill.max }}</span>
    </div>
  </div>
</template>

<style scoped>
.skill-profile-table {
  display: flex;
  flex-direction: column;
  gap: 0;
  width: min(100%, 26.25rem);
  min-height: 0;
  color: var(--p-text-muted-color);
  font-size: 0.938rem;
}

.skill-profile-row {
  display: grid;
  grid-template-columns: minmax(0, 1.5fr) repeat(3, minmax(2.625rem, 0.7fr));
  align-items: center;
  min-height: 3rem;
  border-bottom: 1px solid color-mix(in srgb, var(--p-content-border-color) 45%, transparent);
}

.skill-profile-header {
  min-height: 2.125rem;
  border-bottom: 0;
  color: var(--p-text-muted-color);
  font-size: 0.813rem;
  text-align: right;
}

.skill-profile-row:not(.skill-profile-header) {
  color: var(--p-text-color);
}

.skill-profile-header span:first-child {
  text-align: left;
}

.skill-profile-row > span:not(:first-child) {
  text-align: right;
}

.skill-profile-name {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: var(--p-text-color);
  font-weight: 600;
  text-align: left !important;
}

.skill-profile-name svg {
  flex: 0 0 auto;
}
</style>
