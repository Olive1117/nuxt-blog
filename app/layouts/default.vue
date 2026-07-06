<template>
  <div class="default relative">
    <AppHeader class="fixed top-0 w-full z-10"/>
    <div class="relative z-5">
      <slot  />
    </div>
    <AppFooter/>
    <LoginDialog />
  </div>
</template>

<script setup lang="ts">

</script>