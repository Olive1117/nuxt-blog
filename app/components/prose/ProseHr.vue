<template>
  <hr />
</template>

<script setup lang="ts"></script>

<style scoped>
  hr {
    border: none;
    border-top: 3px double var(--color-primary);
    color: var(--color-primary);
    overflow: visible;
    text-align: center;
    height: 5px;
  }

  hr::after {
    background: var(--color-background);
    /* content: '§'; */
    content: '我是分界线~';
    padding: 0 4px;
    position: relative;
    top: -1rem;
  }
</style>
