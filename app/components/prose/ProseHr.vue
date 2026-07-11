<template>
  <hr />
</template>

<script setup lang="ts"></script>

<style scoped>
  hr {
    border: none;
    border-top: 3px double #333333;
    color: #333333;
    overflow: visible;
    text-align: center;
    height: 5px;
  }

  hr::after {
    background: white;
    /* content: '§'; */
    content: '我是分界线~';
    padding: 0 4px;
    position: relative;
    top: -1rem;
  }
</style>
