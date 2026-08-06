<script setup>
import { Crosshair, Gauge, Star, Target, Zap } from '@lucide/vue';
import PerformanceChart from '../components/common/PerformanceChart.vue';
import Panel from '../components/common/Panel.vue';
import { DmtTeamIcon, FounderIcon } from '../components/icons';
import ProfileHeader from '../components/profile/ProfileHeader.vue';
import SkillProfileTable from '../components/profile/SkillProfileTable.vue';

const stats = [
  { label: 'TPI', value: '—', sub: 'Top 0.15%' },
  { label: 'Performance', value: '—', sub: '#124 Global' },
  { label: 'Accuracy', value: '—', sub: '#421 Global' },
  { label: 'Playcount', value: '—', sub: '#213 Global' }
];

const skillProfileRows = [
  {
    label: 'Aim',
    icon: Crosshair,
    color: '#FF4FA3',
    min: '88',
    max: '99',
    avg: '96.3'
  },
  {
    label: 'Speed',
    icon: Zap,
    color: '#A855F7',
    min: '86',
    max: '98',
    avg: '94.1'
  },
  {
    label: 'Accuracy',
    icon: Target,
    color: '#38BDF8',
    min: '90',
    max: '99',
    avg: '97.2'
  },
  { label: 'BPM', icon: Gauge, color: '#F97316', min: '—', max: '—', avg: '—' },
  {
    label: 'Stars',
    icon: Star,
    color: '#FBBF24',
    min: '—',
    max: '—',
    avg: '—'
  }
];

const country = { code: 'ru', name: 'Russia' };
const badges = [
  { label: 'Founder', color: '#f8894d', icon: FounderIcon },
  { label: 'DMT Team', color: '#ac8bde', icon: DmtTeamIcon }
];
</script>

<template>
  <div class="profile-page">
    <ProfileHeader :country="country" :badges="badges" :stats="stats" />
    <PerformanceChart />

    <div class="grid-row">
      <Panel title="Skill Profile">
        <SkillProfileTable :rows="skillProfileRows" />
      </Panel>
      <Panel title="Tournament Duel Rating">
        <div class="panel-placeholder" />
      </Panel>
    </div>

    <div class="grid-row">
      <Panel title="Skillset Profile">
        <div class="panel-placeholder" />
      </Panel>
      <Panel title="Top Plays">
        <div class="panel-placeholder" />
      </Panel>
    </div>

    <Panel title="Tournament Experience" class="panel-tournament-experience">
      <div class="experience-placeholders">
        <div class="panel-placeholder" />
        <div class="panel-placeholder" />
        <div class="panel-placeholder" />
      </div>
    </Panel>
  </div>
</template>

<style scoped>
.profile-page {
  display: flex;
  flex-direction: column;
  gap: 24px;
}
.grid-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 24px;
}
.panel-tournament-experience {
  min-height: 390px;
}
:global(.experience-placeholders) {
  display: grid;
  grid-template-columns: 0.8fr 1.4fr 1fr;
  gap: 16px;
}
:global(.experience-placeholders .panel-placeholder) {
  min-height: 250px;
}
@media (max-width: 900px) {
  .grid-row {
    grid-template-columns: 1fr;
  }
  :global(.experience-placeholders) {
    grid-template-columns: 1fr;
  }
}
</style>
