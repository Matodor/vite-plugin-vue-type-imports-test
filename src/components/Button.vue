script lang="ts">
import { Props, CreateOrUpdateUserRequest } from "~/typings";

export interface Model extends CreateOrUpdateUserRequest {}
export interface LocalProps extends Omit<Props<Model>, "validationSchema"> {}
</script>

<script setup lang="ts">
defineProps<LocalProps>();
</script>

<template>
  <button py-2 px-4 font-medium rounded m-8>
    <slot />
  </button>

  <span>Fallthrough attributes: {{ $attrs }}</span>
</template>
