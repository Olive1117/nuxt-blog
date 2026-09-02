<template>
  <hr class="hr-solid-content" />
</template>

<script setup lang="ts"></script>

<style scoped>
  /* hr {
    border: none;
    border-top: 3px double var(--color-primary);
    color: var(--color-primary);
    overflow: visible;
    text-align: center;
    height: 5px;
  }

  hr::after {
    background: var(--color-background);
    content: '§';
    content: '我是分界线~';
    padding: 0 4px;
    position: relative;
    top: -1rem;
  } */
  .hr-solid-content {
    color: var(--color-primary);
    border: 0;
    font-size: 12px;
    padding: 1em 0;
    position: relative;
    -webkit-mask-image: linear-gradient(to right, transparent, var(--color-primary), transparent);
    mask-image: linear-gradient(to right, transparent, var(--color-primary), transparent);
  }
  .hr-solid-content::before {
    content: '我是分界线~';
    position: absolute;
    padding: 0 1ch;
    line-height: 1px;
    border: solid var(--color-primary);
    border-width: 0 45vw;
    width: fit-content;
    /* for 不支持fit-content浏览器 */
    white-space: nowrap;
    left: 50%;
    transform: translateX(-50%);
  }
</style>
