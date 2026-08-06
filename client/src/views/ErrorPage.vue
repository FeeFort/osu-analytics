<script setup>
import { computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { ArrowLeft, RefreshCw } from '@lucide/vue';
import errorGirl from '../assets/error-girl.png';
import errorSmile from '../assets/error-smile.svg';
import { getErrorState } from '../error-config';

const route = useRoute();
const router = useRouter();

const code = computed(() => route.params.code);
const content = computed(() => getErrorState(code.value));

function goHome() {
  router.push('/');
}

function retry() {
  const target = typeof route.query.from === 'string' ? route.query.from : '/';
  router.replace(target === route.fullPath ? '/' : target);
}

function runAction() {
  if (content.value.action === 'retry') {
    retry();
    return;
  }

  goHome();
}
</script>

<template>
  <section class="error-page" :aria-labelledby="`error-${code}-title`">
    <div class="error-content">
      <div class="error-art" aria-hidden="true">
        <div class="error-number">{{ code }}</div>
        <img class="error-girl" :src="errorGirl" alt="" />
        <img class="error-smile" :src="errorSmile" alt="" />
      </div>

      <h1 :id="`error-${code}-title`">{{ content.title }}</h1>
      <p>{{ content.text }}</p>

      <button type="button" class="error-action" @click="runAction">
        <component :is="content.action === 'retry' ? RefreshCw : ArrowLeft" :size="16" />
        {{ content.actionLabel }}
      </button>
    </div>
  </section>
</template>

<style scoped>
.error-page {
  display: grid;
  min-height: 100svh;
  place-items: center;
  overflow: hidden;
  padding: 1.75rem;
  color: #f8f7fb;
  background: radial-gradient(ellipse 40% 26% at 50% 32%, rgba(236, 72, 153, 0.08), transparent 65%), #0c0b12;
}

.error-content {
  display: flex;
  width: min(100%, 38.75rem);
  flex-direction: column;
  align-items: center;
  text-align: center;
}

.error-art {
  position: relative;
  width: min(100%, 35rem);
  height: clamp(15.5rem, 29vw, 19.75rem);
  margin-bottom: 0.5rem;
}

.error-number {
  position: absolute;
  inset: 1.125rem 50% auto auto;
  width: 100%;
  transform: translateX(50%);
  color: #ed3f9e;
  font-size: clamp(9.25rem, 21vw, 14.75rem);
  font-weight: 900;
  letter-spacing: -0.12em;
  line-height: 0.8;
  text-shadow:
    0 0 12px rgba(236, 72, 153, 0.78),
    0 0 50px rgba(236, 72, 153, 0.3);
}

.error-girl {
  position: absolute;
  z-index: 1;
  bottom: -2.063rem;
  left: 50%;
  width: min(80%, 26.875rem);
  transform: translateX(-43%);
  filter: drop-shadow(0 14px 24px rgba(236, 72, 153, 0.2));
}

.error-smile {
  position: absolute;
  z-index: 2;
  top: -0.938rem;
  left: 90%;
  width: clamp(5.375rem, 9vw, 6.75rem);
  transform: translateX(-50%);
  filter: drop-shadow(0 0 12px rgba(255, 114, 204, 0.7));
}

h1 {
  margin: 0;
  font-size: clamp(1.75rem, 3vw, 2.125rem);
  line-height: 1.15;
}

p {
  max-width: 31.25rem;
  margin: 0.813rem auto 1.375rem;
  color: #b4b0bf;
  font-size: 0.938rem;
  line-height: 1.55;
}

.error-action {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  border: 0;
  border-radius: 0.375rem;
  padding: 0.688rem 1.063rem;
  background: #ec4899;
  box-shadow: 0 10px 24px rgba(236, 72, 153, 0.25);
  color: #fff;
  font-size: 0.813rem;
  font-weight: 600;
  cursor: pointer;
  transition:
    background-color 0.18s ease,
    transform 0.18s ease;
}

.error-action:hover {
  background: #db2777;
  transform: translateY(-0.125rem);
}
.error-action:focus-visible {
  outline: 0.188rem solid rgba(244, 114, 182, 0.7);
  outline-offset: 0.188rem;
}

@media (max-width: 560px) {
  .error-page {
    padding: 1.5rem 1rem;
  }
  .error-art {
    height: 13.938rem;
  }
  .error-number {
    top: 1.688rem;
    font-size: 9.25rem;
  }
  .error-girl {
    width: 88%;
    transform: translateX(-43%);
  }
  .error-smile {
    top: -0.625rem;
    left: 91%;
    width: 4.625rem;
  }
}
</style>
