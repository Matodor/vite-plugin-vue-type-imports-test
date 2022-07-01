<template>
  <entity-form
    v-bind:initial-model="initialModel"
    v-bind:submit="() => {}"
    v-bind:after-submit="() => {}"
  />
</template>

<script setup lang="ts">
import EntityForm, { Model } from "./Form.vue";

const initialModel: Readonly<Model> = {
  id: null,
  name: "",
  description: "",
};
</script>
