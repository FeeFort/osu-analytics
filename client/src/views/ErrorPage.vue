<script setup>
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ArrowLeft, RefreshCw } from '@lucide/vue'
import errorGirl from '../assets/error-girl.png'
import errorSmile from '../assets/error-smile.svg'
import { getErrorState } from '../error-config'

const route = useRoute()
const router = useRouter()

const code = computed(() => route.params.code)
const content = computed(() => getErrorState(code.value))

function goHome() {
  router.push('/')
}

function retry() {
  const target = typeof route.query.from === 'string' ? route.query.from : '/'
  router.replace(target === route.fullPath ? '/' : target)
}

function runAction() {
  if (content.value.action === 'retry') {
    retry()
    return
  }

  goHome()
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
  padding: 28px;
  color: #f8f7fb;
  background:
    radial-gradient(ellipse 40% 26% at 50% 32%, rgba(236, 72, 153, .08), transparent 65%),
    #0c0b12;
}

.error-content {
  display: flex;
  width: min(100%, 620px);
  flex-direction: column;
  align-items: center;
  text-align: center;
}

.error-art {
  position: relative;
  width: min(100%, 560px);
  height: clamp(248px, 29vw, 316px);
  margin-bottom: 8px;
}

.error-number {
  position: absolute;
  inset: 18px 50% auto auto;
  width: 100%;
  transform: translateX(50%);
  color: #ed3f9e;
  font-size: clamp(148px, 21vw, 236px);
  font-weight: 900;
  letter-spacing: -.12em;
  line-height: .8;
  text-shadow: 0 0 12px rgba(236, 72, 153, .78), 0 0 50px rgba(236, 72, 153, .3);
}

.error-girl {
  position: absolute;
  z-index: 1;
  bottom: -33px;
  left: 50%;
  width: min(80%, 430px);
  transform: translateX(-43%);
  filter: drop-shadow(0 14px 24px rgba(236, 72, 153, .2));
}

.error-smile {
  position: absolute;
  z-index: 2;
  top: -15px;
  left: 90%;
  width: clamp(86px, 9vw, 108px);
  transform: translateX(-50%);
  filter: drop-shadow(0 0 12px rgba(255, 114, 204, .7));
}

h1 {
  margin: 0;
  font-size: clamp(28px, 3vw, 34px);
  line-height: 1.15;
}

p {
  max-width: 500px;
  margin: 13px auto 22px;
  color: #b4b0bf;
  font-size: 15px;
  line-height: 1.55;
}

.error-action {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  border: 0;
  border-radius: 6px;
  padding: 11px 17px;
  background: #ec4899;
  box-shadow: 0 10px 24px rgba(236, 72, 153, .25);
  color: #fff;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  transition: background-color .18s ease, transform .18s ease;
}

.error-action:hover { background: #db2777; transform: translateY(-2px); }
.error-action:focus-visible { outline: 3px solid rgba(244, 114, 182, .7); outline-offset: 3px; }

@media (max-width: 560px) {
  .error-page { padding: 24px 16px; }
  .error-art { height: 223px; }
  .error-number { top: 27px; font-size: 148px; }
  .error-girl { width: 88%; transform: translateX(-43%); }
  .error-smile { top: -10px; left: 91%; width: 74px; }
}
</style>
