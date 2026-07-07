<template>
  <div class="flex items-center justify-center">
    <Popover.Root>
      <Popover.Trigger class="flex items-center justify-center" aria-label="Toggle color theme">
        <Icon size="24" name="tabler:settings" />
      </Popover.Trigger>
      <Popover.Portal>
        <Popover.Content class="data-[state=open]:animate-fade-in" side="bottom" :side-offset="5">
          <p>
            黑夜
            <Icon name="tabler:bulb" />
          </p>
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
    <!-- <Icon name="tabler:adjustments-horizontal"/>
    <Icon name="tabler:bulb"/>
    <Icon name="tabler:bulb-filled"/>
    <Icon name="tabler:bulb-off"/> -->
  </div>
</template>

<script setup lang="ts">
  import { Popover } from 'reka-ui/namespaced'
</script>
