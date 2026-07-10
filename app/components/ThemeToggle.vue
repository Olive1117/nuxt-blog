<template>
  <div class="flex items-center justify-center">
    <Popover.Root>
      <Popover.Trigger
        aria-label="Toggle color theme"
        class="flex items-center justify-center"
      >
        <Icon
          name="tabler:settings"
          size="24"
        />
      </Popover.Trigger>
      <Popover.Portal>
        <Popover.Content
          class="data-[state=open]:animate-fade-in p-2 bg-white border rounded-xl"
          side="bottom"
          :side-offset="5"
        >
          <ToggleGroup.Root
            class="flex shadow-sm"
            type="single"
            @update:model-value="
              (val) => {
                console.log('当前状态', colorMode.preference)
                if (val) {
                  colorMode.preference = val.toString()
                  console.log(val, colorMode.preference)
                }
              }
            "
          >
            <ToggleGroup.Item
              v-for="tc in theme_color"
              :key="tc.value"
              aria-label="Toggle italic"
              class="hover:bg-stone-50 data-[state=on]:bg-stone-100 flex h-8.75 w-8.75 items-center justify-center bg-white text-base leading-4 first:rounded-l-sm last:rounded-r-sm focus:z-10 focus:shadow-[0_0_0_2px] focus:shadow-black/30 focus:outline-none"
              :value="tc.value"
            >
              <Icon
                class="w-3.75 h-3.75"
                :name="tc.icon"
              />
            </ToggleGroup.Item>
          </ToggleGroup.Root>
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
  import { Popover, ToggleGroup } from 'reka-ui/namespaced'
  const colorMode = useColorMode()
  const theme_color = [
    { value: 'light', icon: 'tabler:sun-high' },
    { value: 'dark', icon: 'tabler:moon-stars' },
    { value: 'system', icon: 'tabler:device-desktop-analytics' },
  ]
</script>
